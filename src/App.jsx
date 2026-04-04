import React, { useState, useEffect } from 'react'
import { api } from './api'
import Login from './components/Login'
import Nav from './components/Nav'
import VoicePanel from './components/VoicePanel'
import WechatPanel from './components/WechatPanel'
import MemoryPanel from './components/MemoryPanel'
import VPSPanel from './components/VPSPanel'
import DiaryPanel from './components/DiaryPanel'

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState('voice')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('studio_token')
    if (!saved) { setChecking(false); return }
    api.ping()
      .then(() => setAuthed(true))
      .catch(() => localStorage.removeItem('studio_token'))
      .finally(() => setChecking(false))
  }, [])

  if (checking) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-muted text-sm">连接中…</div>
    </div>
  )

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto">
      <div className="flex-1 overflow-y-auto pb-20">
        {tab === 'voice'   && <VoicePanel />}
        {tab === 'wechat'  && <WechatPanel />}
        {tab === 'memory'  && <MemoryPanel />}
        {tab === 'vps'     && <VPSPanel />}
        {tab === 'diary'   && <DiaryPanel />}
      </div>
      <Nav tab={tab} setTab={setTab} />
    </div>
  )
}
