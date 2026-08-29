// Build Echo Studio into a staging directory, validate it, then swap dist atomically.
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const distDir = resolve(rootDir, 'dist')
const nextDir = resolve(rootDir, `.dist-next-${process.pid}`)
const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, 'Z')
const backupRootDir = resolve(rootDir, process.env.ECHO_STUDIO_BACKUP_DIR || '../echo-studio-frontend-backups')
const backupDir = resolve(backupRootDir, `dist.prev.build-${stamp}`)
const buildId = process.env.BUILD_ID || `update-${stamp}`
const previousAssetsManifest = 'previous-assets.json'

function fail(message) {
  if (existsSync(nextDir)) rmSync(nextDir, { recursive: true, force: true })
  throw new Error(message)
}

if (existsSync(nextDir)) rmSync(nextDir, { recursive: true, force: true })

const viteBin = resolve(rootDir, 'node_modules', 'vite', 'bin', 'vite.js')
const result = spawnSync(
  process.execPath,
  [viteBin, 'build', '--outDir', nextDir, '--emptyOutDir'],
  {
    cwd: rootDir,
    env: { ...process.env, BUILD_ID: buildId },
    stdio: 'inherit',
  },
)

if (result.error) fail(`Vite failed to start: ${result.error.message}`)
if (result.status !== 0) fail(`Vite exited with status ${result.status}`)

const idPath = resolve(nextDir, 'build-id.json')
const chatHtmlPath = resolve(nextDir, 'chat', 'index.html')
const swPath = resolve(nextDir, 'sw.js')
if (!existsSync(idPath) || !existsSync(chatHtmlPath) || !existsSync(swPath)) {
  fail('staged build is missing build-id.json, chat/index.html, or sw.js')
}

const advertisedId = JSON.parse(readFileSync(idPath, 'utf8')).build
if (advertisedId !== buildId) fail(`build id mismatch: ${advertisedId} != ${buildId}`)

const chatHtml = readFileSync(chatHtmlPath, 'utf8')
const assetMatch = chatHtml.match(/assets\/(chat-[A-Za-z0-9_-]+\.js)/)
if (!assetMatch) fail('chat bundle was not referenced by chat/index.html')

const chatAsset = resolve(nextDir, 'assets', assetMatch[1])
if (!existsSync(chatAsset)) fail(`chat bundle is missing: ${assetMatch[1]}`)
const chatBundle = readFileSync(chatAsset, 'utf8')
if (!chatBundle.includes(buildId)) fail('chat bundle does not contain the advertised build id')
if (!chatBundle.includes('有新版本')) fail('the single build update prompt is missing')
if (chatBundle.includes('🎁 新版本已就绪') || chatBundle.includes('点我刷新')) {
  fail('the duplicate service-worker update prompt is still present')
}

// Keep one prior asset generation so an already-open tab can still finish
// loading after the atomic swap. Files carried from an even older generation
// are listed in the current manifest and intentionally not carried again.
function preservePreviousAssets() {
  const currentAssetsDir = resolve(distDir, 'assets')
  const nextAssetsDir = resolve(nextDir, 'assets')
  if (!existsSync(currentAssetsDir) || !existsSync(nextAssetsDir)) return []

  let alreadyPreserved = new Set()
  const currentManifest = resolve(distDir, previousAssetsManifest)
  if (existsSync(currentManifest)) {
    try {
      const parsed = JSON.parse(readFileSync(currentManifest, 'utf8'))
      if (Array.isArray(parsed.assets)) alreadyPreserved = new Set(parsed.assets)
    } catch {}
  }

  const preserved = []
  for (const entry of readdirSync(currentAssetsDir, { withFileTypes: true })) {
    if (!entry.isFile() || alreadyPreserved.has(entry.name)) continue
    const target = resolve(nextAssetsDir, entry.name)
    if (existsSync(target)) continue
    copyFileSync(resolve(currentAssetsDir, entry.name), target)
    preserved.push(entry.name)
  }

  writeFileSync(
    resolve(nextDir, previousAssetsManifest),
    JSON.stringify({ assets: preserved }, null, 2),
  )
  return preserved
}

const preservedPreviousAssets = preservePreviousAssets()

let movedOldDist = false
try {
  if (existsSync(distDir)) {
    mkdirSync(backupRootDir, { recursive: true })
    renameSync(distDir, backupDir)
    movedOldDist = true
  }
  renameSync(nextDir, distDir)
} catch (error) {
  if (movedOldDist && !existsSync(distDir) && existsSync(backupDir)) {
    renameSync(backupDir, distDir)
  }
  fail(`atomic dist swap failed: ${error.message}`)
}

console.log(JSON.stringify({
  ok: true,
  buildId,
  chatAsset: assetMatch[1],
  preservedPreviousAssets: preservedPreviousAssets.length,
  backupDir: movedOldDist ? backupDir : null,
}))
