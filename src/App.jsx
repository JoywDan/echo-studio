import React, { useEffect, useState } from 'react'
import { api } from './api'
import Login from './components/Login'
import VoicePanel from './components/VoicePanel'
import WechatPanel from './components/WechatPanel'
import MemoryPanel from './components/MemoryPanel'
import VPSPanel from './components/VPSPanel'
import DiaryPanel from './components/DiaryPanel'

const STATIONS = [
  {
    id: 'voice',
    name: 'Voice Studio',
    accent: '#D97757',
    label: 'Mic Corner',
    detail: '录音角',
    objectClass: 'object-mic',
  },
  {
    id: 'wechat',
    name: 'Chat Terminal',
    accent: '#8C9AA3',
    label: 'Main Monitor',
    detail: '主屏幕',
    objectClass: 'object-monitor',
  },
  {
    id: 'memory',
    name: 'Memory Core',
    accent: '#C79276',
    label: 'Archive',
    detail: '资料夹',
    objectClass: 'object-memory',
  },
  {
    id: 'vps',
    name: 'Server Hub',
    accent: '#7A8E96',
    label: 'Machine Rack',
    detail: '设备柜',
    objectClass: 'object-server',
  },
  {
    id: 'diary',
    name: "Echo's Diary",
    accent: '#B87B68',
    label: 'Notebook',
    detail: '桌边日记',
    objectClass: 'object-diary',
  },
]

// Placeholder items — not yet functional, reserved for future features
const PLACEHOLDERS = [
  { className: 'ph-cup',    title: '咖啡杯',  hint: '快捷操作（敬请期待）' },
  { className: 'ph-sticky', title: '便利贴',  hint: '快速笔记（敬请期待）' },
  { className: 'ph-phone',  title: '手机',    hint: '通知推送（敬请期待）' },
]

const PANELS = {
  voice: VoicePanel,
  wechat: WechatPanel,
  memory: MemoryPanel,
  vps: VPSPanel,
  diary: DiaryPanel,
}

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [panel, setPanel] = useState(null)
  const [checking, setChecking] = useState(true)
  const [hint, setHint] = useState(null)

  useEffect(() => {
    const isLocal = ['127.0.0.1', 'localhost'].includes(window.location.hostname)
    if (isLocal) { setAuthed(true); setChecking(false); return }
    const saved = localStorage.getItem('studio_token')
    if (!saved) { setChecking(false); return }
    api.ping()
      .then(() => setAuthed(true))
      .catch(() => localStorage.removeItem('studio_token'))
      .finally(() => setChecking(false))
  }, [])

  if (checking) return (
    <div className="loading-screen">
      <div className="loading-glow" />
      <div className="loading-card">
        <div className="loading-pet">
          <span className="pet-cheek left" /><span className="pet-cheek right" />
          <span className="pet-eye left" /><span className="pet-eye right" />
        </div>
        <p className="loading-label">warming up Joy's studio…</p>
      </div>
    </div>
  )

  if (!authed) return <Login onLogin={() => setAuthed(true)} />

  if (panel) {
    const PanelComp = PANELS[panel]
    const station = STATIONS.find(s => s.id === panel)
    return (
      <div className="panel-shell">
        <div className="panel max-w-3xl mx-auto">
          <div className="panel-header">
            <button onClick={() => setPanel(null)} className="btn btn-ghost text-xs px-3 py-1.5">
              ← Back to studio
            </button>
            <span className="panel-badge" style={{ color: station.accent }}>{station.name}</span>
          </div>
          <div className="p-4 md:p-6"><PanelComp /></div>
        </div>
      </div>
    )
  }

  return (
    <div className="studio-shell">
      <header className="studio-header">
        <p className="studio-kicker">Joy's private room</p>
        <h1>Echo Studio</h1>
      </header>

      <main className="studio-room" aria-label="Echo Studio">

        {/* — Background layers — */}
        <div className="room-sunwash" aria-hidden="true" />
        <div className="room-wall" aria-hidden="true" />
        <div className="room-floor" aria-hidden="true" />

        {/* — Wall decorations — */}
        <div className="window-frame" aria-hidden="true">
          <div className="window-sky" />
          <div className="window-bar v" /><div className="window-bar h" />
          <div className="window-sill" />
        </div>

        <div className="wall-clock" aria-hidden="true">
          <span className="clock-hand hour" />
          <span className="clock-hand minute" />
          <span className="clock-dot" />
        </div>

        <div className="room-shelf" aria-hidden="true">
          <span className="shelf-book b1" />
          <span className="shelf-book b2" />
          <span className="shelf-book b3" />
          <span className="shelf-plant" />
        </div>

        {/* — Desk — */}
        <div className="desk-surface" aria-hidden="true" />
        <div className="desk-shadow" aria-hidden="true" />
        <div className="desk-lamp" aria-hidden="true"><span className="lamp-glow" /></div>
        <div className="chair" aria-hidden="true" />
        <div className="paper-stack paper-one" aria-hidden="true" />
        <div className="paper-stack paper-two" aria-hidden="true" />
        <div className="desk-cup" aria-hidden="true" />

        {/* — Placeholder items (future features) — */}
        {PLACEHOLDERS.map(p => (
          <button
            key={p.className}
            className={`room-decor ${p.className}`}
            onClick={() => setHint(hint === p.className ? null : p.className)}
            aria-label={p.title}
          >
            {hint === p.className && <span className="decor-hint">{p.hint}</span>}
          </button>
        ))}

        {/* — 5 Functional stations — */}
        {STATIONS.map(s => (
          <button
            key={s.id}
            className={`room-object ${s.objectClass}`}
            style={{ '--accent': s.accent }}
            onClick={() => setPanel(s.id)}
            aria-label={s.name}
          >
            <span className="obj-label">{s.label}</span>
            <span className="obj-title">{s.name}</span>
            <span className="obj-detail">{s.detail}</span>
          </button>
        ))}

        <StudioPet />
      </main>

      <footer className="studio-footer">
        <span className="footer-pill">5 live stations</span>
        <span className="footer-dot" />
        <span>studio.echowjoy.uk</span>
      </footer>
    </div>
  )
}

function StudioPet() {
  return (
    <div className="studio-pet" aria-hidden="true">
      <div className="pet-shadow" />
      <div className="pet-bubble" />
      <div className="pet-body">
        <span className="pet-blob pet-ear left" />
        <span className="pet-blob pet-ear right" />
        <span className="pet-cheek left" /><span className="pet-cheek right" />
        <span className="pet-eye left" /><span className="pet-eye right" />
        <span className="pet-mouth" />
        <span className="pet-feet" />
      </div>
    </div>
  )
}
