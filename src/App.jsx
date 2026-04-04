import React, { useState, useEffect } from 'react'
import { api } from './api'
import Login from './components/Login'
import VoicePanel from './components/VoicePanel'
import WechatPanel from './components/WechatPanel'
import MemoryPanel from './components/MemoryPanel'
import VPSPanel from './components/VPSPanel'
import DiaryPanel from './components/DiaryPanel'

const STATIONS = [
  { id: 'voice',  name: 'Voice Studio',  icon: '🎙️', color: 'pink',   desc: 'Twitter · 自动发推回复' },
  { id: 'wechat', name: 'Chat Terminal', icon: '💬', color: 'cyan',   desc: '微信 Echo · System Prompt' },
  { id: 'memory', name: 'Memory Core',   icon: '🧠', color: 'orange', desc: '记忆网关 · 搜索写入' },
  { id: 'vps',    name: 'Server Hub',    icon: '🖥️', color: 'cyan',   desc: 'VPS · PM2 · 系统状态' },
  { id: 'diary',  name: "Echo's Diary",  icon: '📓', color: 'pink',   desc: '工作日记 · 碎碎念' },
]

const PANELS = { voice: VoicePanel, wechat: WechatPanel, memory: MemoryPanel, vps: VPSPanel, diary: DiaryPanel }

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [panel, setPanel] = useState(null)
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
      <span className="neon-cyan text-sm">initializing…</span>
    </div>
  )

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  if (panel) {
    const PanelComp = PANELS[panel]
    const station = STATIONS.find(s => s.id === panel)
    return (
      <div className="panel max-w-lg mx-auto">
        <div className="panel-header">
          <button onClick={() => setPanel(null)} className="btn btn-ghost text-xs px-3 py-1.5">← 返回</button>
          <span className="text-sm font-medium" style={{ color: `var(--${station.color})` }}>
            {station.icon} {station.name}
          </span>
        </div>
        <div className="p-4">
          <PanelComp />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="pt-8 pb-2 text-center">
        <div className="text-xs tracking-[0.3em] text-muted uppercase mb-1">Joy's Private</div>
        <h1 className="text-2xl font-bold tracking-wider neon-cyan">ECHO STUDIO</h1>
        <div className="text-xs text-muted mt-1 tracking-widest">— control panel v0.1 —</div>
      </div>

      {/* Room grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {/* Voice - top left */}
        <Station s={STATIONS[0]} onClick={() => setPanel('voice')} />
        {/* WeChat - top right */}
        <Station s={STATIONS[1]} onClick={() => setPanel('wechat')} />
        {/* Memory - full width middle */}
        <div className="col-span-2">
          <Station s={STATIONS[2]} onClick={() => setPanel('memory')} wide />
        </div>
        {/* VPS - bottom left */}
        <Station s={STATIONS[3]} onClick={() => setPanel('vps')} />
        {/* Diary - bottom right */}
        <Station s={STATIONS[4]} onClick={() => setPanel('diary')} />
      </div>

      <div className="text-center text-xs text-muted pb-4 tracking-widest">
        studio.echowjoy.uk
      </div>
    </div>
  )
}

function Station({ s, onClick, wide }) {
  return (
    <div className={`station station-${s.color} ${wide ? 'flex-row items-center' : ''}`} onClick={onClick}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">{s.icon}</span>
        {wide && <div>
          <div className={`text-sm font-semibold neon-${s.color}`}>{s.name}</div>
          <div className="text-xs text-muted">{s.desc}</div>
        </div>}
      </div>
      {!wide && <>
        <div className={`text-sm font-semibold neon-${s.color}`}>{s.name}</div>
        <div className="text-xs text-muted leading-snug">{s.desc}</div>
      </>}
      <div className={`text-xs mt-auto text-right neon-${s.color} opacity-40`}>[ enter ]</div>
    </div>
  )
}
