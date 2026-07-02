import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './app.css'

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

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
