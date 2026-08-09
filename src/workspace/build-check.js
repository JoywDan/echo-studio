// 版本心跳(2026-08-03): app 自己判断"我是不是旧版", 不依赖 Service Worker。
// iOS 的 SW 更新链路反复失灵(旧壳卡 waiting 数周), 导致修好的东西到不了 Joy 手上。
// 这一层绕过 SW: 直接问服务端当前构建号, 不一致就给一个明确的「换血」按钮 ——
// 点了会注销 SW + 清空所有缓存 + 硬刷新, 是最彻底的一条路。
const ENDPOINT = '/echo-studio/build-id.json'
let barShown = false
let lastCheck = 0

async function currentServerBuild() {
  const r = await fetch(ENDPOINT + '?t=' + Date.now(), { cache: 'no-store' })
  if (!r.ok) throw new Error('http ' + r.status)
  const j = await r.json()
  return j && j.build
}

async function hardSwap() {
  try {
    if ('serviceWorker' in navigator) {
      const rs = await navigator.serviceWorker.getRegistrations()
      await Promise.all(rs.map(r => r.unregister()))
    }
  } catch (e) {}
  try {
    if (window.caches && caches.keys) {
      const keys = await caches.keys()
      await Promise.all(keys.map(k => caches.delete(k)))
    }
  } catch (e) {}
  const u = new URL(window.location.href)
  u.searchParams.set('fresh', String(Date.now()))
  window.location.replace(u.toString())
}

function showBar(serverBuild) {
  if (barShown) return
  barShown = true
  const bar = document.createElement('div')
  bar.setAttribute('role', 'status')
  bar.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);z-index:9999;' +
    'top:max(12px, env(safe-area-inset-top));display:flex;align-items:center;gap:10px;' +
    'padding:9px 14px;background:#f7f1e3;border:1.6px dashed rgba(177,73,47,0.5);' +
    'border-radius:14px;font-size:13px;color:#3a3027;box-shadow:0 4px 18px rgba(58,48,39,0.15);' +
    'max-width:calc(100vw - 28px);font-family:inherit;'
  const txt = document.createElement('span')
  txt.textContent = '有新版本 ' + serverBuild
  const btn = document.createElement('button')
  btn.textContent = '换上'
  btn.style.cssText = 'border:none;border-radius:999px;padding:5px 13px;background:#b1492f;' +
    'color:#f6e6df;font-size:12.5px;cursor:pointer;font-family:inherit;'
  btn.onclick = () => { btn.textContent = '换血中…'; btn.disabled = true; hardSwap() }
  const close = document.createElement('button')
  close.textContent = '\u2715'
  close.setAttribute('aria-label', '本次忽略')
  close.style.cssText = 'border:none;background:none;color:#9d9081;cursor:pointer;font-size:13px;padding:2px 4px;'
  close.onclick = () => { bar.remove(); barShown = false }
  bar.append(txt, btn, close)
  document.body.appendChild(bar)
}

async function check() {
  const now = Date.now()
  if (now - lastCheck < 60000) return
  lastCheck = now
  try {
    const server = await currentServerBuild()
    const mine = typeof __BUILD_ID__ === 'string' ? __BUILD_ID__ : ''
    if (server && mine && server !== mine) showBar(server)
  } catch (e) {}
}

export function setupBuildCheck() {
  setTimeout(check, 2500)
  document.addEventListener('visibilitychange', () => { if (!document.hidden) check() })
  window.addEventListener('focus', check)
  setInterval(check, 5 * 60 * 1000)
}
