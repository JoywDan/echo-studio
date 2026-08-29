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

  // Keep SW updates silent on other browsers too. build-check.js is the single
  // user-facing update prompt; showing a second SW banner made one release look
  // like two different updates. A waiting worker activates when the app is sent
  // to the background, so an active chat is never refreshed underneath Joy.
  const updateSW = registerSW({
    onRegisteredSW(swUrl, registration) {
      if (!registration) return
      // 主动催更: 每 60s + 每次切回前台，都问一次有没有新版(治手机把检查掐到一天一次)
      const check = () => { try { const p = registration.update(); if (p && p.catch) p.catch(() => {}) } catch {} }
      setInterval(check, 60 * 1000)
      document.addEventListener('visibilitychange', () => { if (!document.hidden) check() })
      window.addEventListener('focus', check)
      check()
    },
    onNeedRefresh() {
      const swap = () => {
        if (!document.hidden) return
        try { const p = updateSW(true); if (p && p.catch) p.catch(() => {}) } catch {}
      }
      document.addEventListener('visibilitychange', swap, { once: true })
      swap()
    },
    onOfflineReady() {},
  })
}
