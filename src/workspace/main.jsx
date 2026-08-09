import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './app.css'
import { setupSWUpdatePrompt } from './sw-update.js'
import { setupBuildCheck } from './build-check.js'

try {
  const params = new URLSearchParams(window.location.search)
  if (params.get('reset-local') === '1') {
    const keepToken = localStorage.getItem('studio_token') || ''
    for (const key of ['ws_theme', 'ws_fontname']) localStorage.removeItem(key)
    try {
      const del = indexedDB.deleteDatabase('echo_ws')
      del.onsuccess = del.onerror = del.onblocked = () => {
        if (keepToken) localStorage.setItem('studio_token', keepToken)
      }
    } catch {}
    if (keepToken) localStorage.setItem('studio_token', keepToken)
  }
} catch {}

// 视觉视口 → --app-h: iOS 键盘弹出/工具栏收放时, app 高度跟着*看得见的*那块走,
// 并把被系统顶偏的窗口滚动归零 —— 这是「聊天页自己往上滑」的根治层。
function syncViewportHeight() {
  try {
    const vv = window.visualViewport
    const h = Math.round(vv ? vv.height : window.innerHeight)
    if (h > 0) document.documentElement.style.setProperty('--app-h', h + 'px')
    if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0)
  } catch (e) {}
}
syncViewportHeight()
try {
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', syncViewportHeight)
    window.visualViewport.addEventListener('scroll', syncViewportHeight)
  }
  window.addEventListener('orientationchange', () => setTimeout(syncViewportHeight, 250))
  window.addEventListener('focusin', () => setTimeout(syncViewportHeight, 60))
  window.addEventListener('focusout', () => setTimeout(syncViewportHeight, 60))
} catch (e) {}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
// SW 更新提示放在渲染之后+防爆: 它在 iOS Safari 上闹脾气也绝不能挡住界面(2026-07-02 手机白屏根因)
setTimeout(() => { try { setupSWUpdatePrompt() } catch (e) {} }, 800)
// 版本心跳: SW 链路失灵时的兜底真相源(2026-08-03)
setTimeout(() => { try { setupBuildCheck() } catch (e) {} }, 1200)
