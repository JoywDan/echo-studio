// 新版本提示条: 只在"新 SW 已下载、等待接管"时出现; 点刷新即换血并随之消失; ✕ 本次忽略。
import { registerSW } from 'virtual:pwa-register'

export function setupSWUpdatePrompt() {
  const ua = navigator.userAgent || ''
  const isIOSWebKit = /iP(hone|ad|od)/.test(ua) && /AppleWebKit/.test(ua)
  if (isIOSWebKit) {
    // 2026-07-18: iOS 不再整个退出(旧守卫让 Joy 的 PWA 永远收不到更新——新 SW 卡 waiting 至死)。
    // iOS 路径 = 永不打扰的后台换血: 不弹条、不 60s 轮询; 回前台时查一次更新,
    // 新版就绪后等 app 退到后台的瞬间接管, 下次打开即新版。绝不在她用着的时候刷新页面。
    const updateSW = registerSW({
      onRegisteredSW(swUrl, registration) {
        if (!registration) return
        const check = () => { try { const p = registration.update(); if (p && p.catch) p.catch(() => {}) } catch {} }
        document.addEventListener('visibilitychange', () => { if (!document.hidden) check() })
        check()
      },
      onNeedRefresh() {
        const swap = () => {
          if (!document.hidden) return
          try { const p = updateSW(true); if (p && p.catch) p.catch(() => {}) } catch {}
        }
        document.addEventListener('visibilitychange', swap)
        swap()
      },
      onOfflineReady() {},
    })
    return
  }

  let bar = null
  let swReg = null
  const updateSW = registerSW({
    onRegisteredSW(swUrl, registration) {
      swReg = registration
      if (!registration) return
      // 主动催更: 每 60s + 每次切回前台，都问一次有没有新版(治手机把检查掐到一天一次)
      const check = () => { try { const p = registration.update(); if (p && p.catch) p.catch(() => {}) } catch {} }
      setInterval(check, 60 * 1000)
      document.addEventListener('visibilitychange', () => { if (!document.hidden) check() })
      window.addEventListener('focus', check)
      check()
    },
    onNeedRefresh() {
      if (bar) return
      bar = document.createElement('div')
      bar.setAttribute('role', 'status')
      bar.style.cssText = 'position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:12px;padding:10px 16px;background:#f7f1e3;border:1.6px dashed rgba(177,73,47,0.5);border-radius:14px;font-size:13.5px;color:#3a3027;box-shadow:0 4px 18px rgba(58,48,39,0.15);max-width:calc(100vw - 32px);'
      const txt = document.createElement('span')
      txt.textContent = '🎁 新版本已就绪'
      const btn = document.createElement('button')
      btn.textContent = '点我刷新'
      btn.style.cssText = 'border:none;border-radius:999px;padding:6px 14px;background:#b1492f;color:#f6e6df;font-size:13px;cursor:pointer;'
      btn.onclick = () => {
        btn.textContent = '换血中…'; btn.disabled = true
        try {
          const p = updateSW(true)
          if (p && p.catch) p.catch(() => { location.reload() })
        } catch {
          location.reload()
        }
      }
      const close = document.createElement('button')
      close.textContent = '✕'
      close.setAttribute('aria-label', '本次忽略')
      close.style.cssText = 'border:none;background:none;color:#9d9081;cursor:pointer;font-size:13px;padding:2px 4px;'
      close.onclick = () => { bar.remove(); bar = null }
      bar.append(txt, btn, close)
      document.body.appendChild(bar)
    },
    onOfflineReady() {},
  })
}
