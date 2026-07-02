import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './app.css'
import { setupSWUpdatePrompt } from './sw-update.js'
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
// SW 更新提示放在渲染之后+防爆: 它在 iOS Safari 上闹脾气也绝不能挡住界面(2026-07-02 手机白屏根因)
setTimeout(() => { try { setupSWUpdatePrompt() } catch (e) {} }, 800)
