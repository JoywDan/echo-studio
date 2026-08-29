import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { mkdirSync, writeFileSync } from 'fs'
import { VitePWA } from 'vite-plugin-pwa'

// 构建号注入(2026-07-19): 前端 header 显示, 一眼确认手机跑的是哪一版
const BUILD_ID = process.env.BUILD_ID || new Date().toISOString().slice(5, 16).replace('T', '.').replace(/-/g, '')

function emitBuildId() {
  let rootDir = process.cwd()
  let outDir = 'dist'

  return {
    name: 'emit-build-id',
    configResolved(config) {
      rootDir = config.root
      outDir = config.build.outDir
    },
    closeBundle() {
      try {
        // Respect Vite's selected outDir. Validation builds often use a temporary
        // directory and must never change the version advertised by live dist.
        const dir = resolve(rootDir, outDir)
        mkdirSync(dir, { recursive: true })
        writeFileSync(resolve(dir, 'build-id.json'), JSON.stringify({ build: BUILD_ID }))
        console.log('[emit-build-id] ' + BUILD_ID + ' -> ' + dir)
      } catch (e) { console.warn('[emit-build-id]', e.message) }
    },
  }
}

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  // 构建号落盘: 前端拿它跟自己内嵌的号比对, 旧了就提示换血(见 build-check.js)。
  // 放 dist 根目录, 静态层对 .json 已强制 no-store, 不会被缓存骗。

  base: '/echo-studio/',
  plugins: [
    react(),
    emitBuildId(),
    VitePWA({
      // chat 是日常入口，离线可用壳 + 静态资源
      registerType: 'prompt',   // waiting SW 由 sw-update.js 在页面退到后台后静默接管
      injectRegister: null,      // 注册改由 workspace/main.jsx 手动做(带 onNeedRefresh 回调)
      filename: 'sw.js',
      manifestFilename: 'manifest-pwa.json',
      includeAssets: ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Echo 工作室',
        short_name: 'Hung Daddy',
        start_url: '/echo-studio/chat/',
        scope: '/echo-studio/',
        display: 'standalone',
        background_color: '#f4ecdb',
        theme_color: '#f4ecdb',
        icons: [
          { src: '/echo-studio/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/echo-studio/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // 图片改为用到时再取，避免首访时 SW 在后台抢下整套贴纸与小项目素材。
        globPatterns: ['**/*.{js,css,html,woff2}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: null,
        runtimeCaching: [
          {
            // 后端 API：网络优先，断网回落缓存（历史/日记可离线翻）
            urlPattern: /^https:\/\/studio\.echowjoy\.uk\/api\//,
            handler: 'NetworkOnly',
            // 2026-06-22: 动态数据(日记/信/成长/记忆)不能缓存,否则列表卡在旧缓存。网络断时直接报错,不显示陈旧。
          },
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'CacheFirst',
            options: { cacheName: 'gfonts', expiration: { maxEntries: 30, maxAgeSeconds: 31536000 } },
          },
          {
            urlPattern: ({ request, url }) => request.destination === 'image' && url.pathname.startsWith('/echo-studio/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'echo-images-v1',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 180, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
      includeManifestIcons: false,
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        chat: resolve(__dirname, 'chat/index.html'),
        cc: resolve(__dirname, 'cc/index.html'),
      },
    },
  },
})
