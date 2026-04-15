import React, { useEffect, useState } from 'react'
import { api } from './api'
import Login from './components/Login'
import VoicePanel from './components/VoicePanel'
import WechatPanel from './components/WechatPanel'
import VPSPanel from './components/VPSPanel'
import DiaryPanel from './components/DiaryPanel'
import InnerWorldPanel from './components/InnerWorldPanel'
import TimelinePanel from './components/TimelinePanel'
import HealthPanel from './components/HealthPanel'
import TravelPanel from './components/TravelPanel'
import Sidebar from './components/Sidebar'

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
  {
    id: 'inner',
    name: "Echo's Inner World",
    accent: '#a07ab8',
    label: 'Crystal',
    detail: '内心世界',
    objectClass: 'object-inner',
  },
  {
    id: 'timeline',
    name: 'Memory Timeline',
    accent: '#6b8fa0',
    label: 'Timeline',
    detail: '时间轴',
    objectClass: 'object-memory',
  },
  {
    id: 'health',
    name: 'Weekly Health',
    accent: '#8ab388',
    label: 'Health Room',
    detail: '体检室',
    objectClass: 'object-diary',
  },
  {
    id: 'travel',
    name: "Echo's Travel Journal",
    accent: '#6b8fa0',
    label: 'Travel Log',
    detail: '旅行日记',
    objectClass: 'object-memory',
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
  vps: VPSPanel,
  diary: DiaryPanel,
  inner: InnerWorldPanel,
  timeline: TimelinePanel,
  health: HealthPanel,
  travel: TravelPanel,
}

function formatClockValue(value) {
  return String(value).padStart(2, '0')
}

function getClockState(now = new Date()) {
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()

  return {
    label: `${formatClockValue(hours)}:${formatClockValue(minutes)}:${formatClockValue(seconds)}`,
    hourAngle: ((hours % 12) + minutes / 60 + seconds / 3600) * 30,
    minuteAngle: (minutes + seconds / 60) * 6,
    secondAngle: seconds * 6,
  }
}

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [panel, setPanel] = useState(null)
  const [checking, setChecking] = useState(true)
  const [hint, setHint] = useState(null)
  const [revealedStation, setRevealedStation] = useState(null)
  const [clock, setClock] = useState(() => getClockState())

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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock(getClockState())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const handleStationClick = (stationId) => {
    const supportsHover = window.matchMedia('(hover: hover)').matches

    if (supportsHover || revealedStation === stationId) {
      setPanel(stationId)
      return
    }

    setRevealedStation(stationId)
  }

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
      <div className="studio-layout">
        <Sidebar panel={panel} setPanel={setPanel} />
        <div className="studio-content">
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
        </div>
      </div>
    )
  }

  return (
    <div className="studio-layout">
      <Sidebar panel={panel} setPanel={setPanel} />
      <div className="studio-content">
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

        <div className="wall-clock" role="img" aria-label={`Current time ${clock.label}`}>
          <span
            className="clock-hand hour"
            style={{ transform: `translateX(-50%) rotate(${clock.hourAngle}deg)` }}
          />
          <span
            className="clock-hand minute"
            style={{ transform: `translateX(-50%) rotate(${clock.minuteAngle}deg)` }}
          />
          <span
            className="clock-hand second"
            style={{ transform: `translateX(-50%) rotate(${clock.secondAngle}deg)` }}
          />
          <span className="clock-dot" />
          <span className="clock-time">{clock.label}</span>
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
            className={`room-object ${s.objectClass}${revealedStation === s.id ? ' is-revealed' : ''}`}
            style={{ '--accent': s.accent }}
            onClick={() => handleStationClick(s.id)}
            aria-label={s.name}
          >
            <span className="object-art" aria-hidden="true">
              <StationArtwork stationId={s.id} />
            </span>
            <span className="obj-label">{s.label}</span>
            <span className="obj-title">{s.name}</span>
            <span className="obj-detail">{s.detail}</span>
          </button>
        ))}

        <StudioPet />
      </main>

      <footer className="studio-footer">
        <span className="footer-pill">8 live stations</span>
        <span className="footer-dot" />
        <span>studio.echowjoy.uk</span>
      </footer>
    </div>
      </div>
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

function StationArtwork({ stationId }) {
  switch (stationId) {
    case 'wechat':
      return (
        <svg className="station-art station-art-monitor" viewBox="0 0 220 170" focusable="false">
          <rect x="28" y="22" width="164" height="96" rx="16" fill="#2d3336" />
          <rect x="36" y="30" width="148" height="80" rx="12" fill="#4b575b" />
          <rect x="44" y="38" width="132" height="64" rx="10" fill="#9fb4bc" opacity=".28" />
          <circle cx="110" cy="28" r="3.5" fill="#ddd1c4" />
          <rect x="101" y="118" width="18" height="24" rx="6" fill="#d6c4b4" />
          <rect x="70" y="142" width="80" height="12" rx="6" fill="#c4ad9b" />
          <rect x="58" y="130" width="104" height="10" rx="5" fill="#f5efe8" opacity=".9" />
        </svg>
      )
    case 'voice':
      return (
        <svg className="station-art station-art-mic" viewBox="0 0 160 180" focusable="false">
          <rect x="58" y="18" width="44" height="74" rx="22" fill="#f0e6db" />
          <rect x="65" y="26" width="30" height="42" rx="15" fill="#d8baa4" />
          <rect x="76" y="92" width="8" height="42" rx="4" fill="#af836c" />
          <path d="M52 104c0 15 12 28 28 28s28-13 28-28" fill="none" stroke="#b78a72" strokeWidth="8" strokeLinecap="round" />
          <rect x="44" y="134" width="72" height="8" rx="4" fill="#b47a5a" />
          <ellipse cx="80" cy="152" rx="42" ry="12" fill="#cb916f" />
        </svg>
      )
    case 'memory':
      return (
        <svg className="station-art station-art-folder" viewBox="0 0 220 150" focusable="false">
          <path d="M24 46h62l16 16h94v58c0 10-8 18-18 18H42c-10 0-18-8-18-18V46z" fill="#e8b899" />
          <path d="M24 46c0-10 8-18 18-18h42l14 14h42c10 0 18 8 18 18v6H24v-20z" fill="#d68f6b" />
          <rect x="48" y="74" width="118" height="42" rx="10" fill="#f5e6d8" opacity=".9" />
          <path d="M62 88h90M62 100h76" stroke="#cba185" strokeWidth="8" strokeLinecap="round" opacity=".65" />
        </svg>
      )
    case 'vps':
      return (
        <svg className="station-art station-art-server" viewBox="0 0 180 170" focusable="false">
          <rect x="28" y="18" width="90" height="134" rx="18" fill="#dfe4e5" />
          <rect x="40" y="34" width="66" height="24" rx="8" fill="#91a3aa" />
          <rect x="40" y="68" width="66" height="24" rx="8" fill="#9db0b7" />
          <rect x="40" y="102" width="66" height="24" rx="8" fill="#a8b9be" />
          <circle cx="54" cy="46" r="4" fill="#99d2b5" />
          <circle cx="68" cy="46" r="4" fill="#d97757" />
          <circle cx="54" cy="80" r="4" fill="#b9d8df" />
          <circle cx="68" cy="80" r="4" fill="#99d2b5" />
          <circle cx="54" cy="114" r="4" fill="#99d2b5" />
          <circle cx="68" cy="114" r="4" fill="#d97757" />
          <path d="M126 34c10 0 18 8 18 18v66" fill="none" stroke="#bcc9ce" strokeWidth="12" strokeLinecap="round" />
          <circle cx="144" cy="122" r="20" fill="#c6d3d7" />
          <path d="M144 108v28M130 122h28" stroke="#82979f" strokeWidth="8" strokeLinecap="round" />
        </svg>
      )
    case 'diary':
      return (
        <svg className="station-art station-art-diary" viewBox="0 0 190 160" focusable="false">
          <rect x="32" y="18" width="112" height="120" rx="18" fill="#f8eee5" />
          <rect x="32" y="18" width="22" height="120" rx="12" fill="#d89b79" />
          <rect x="58" y="36" width="64" height="8" rx="4" fill="#dfc5b3" />
          <path d="M60 58h58M60 76h50M60 94h54" stroke="#d4b7a3" strokeWidth="6" strokeLinecap="round" />
          <path d="M118 18h12v46l-6-8-6 8V18z" fill="#b9785f" />
        </svg>
      )
    case 'inner':
      return (
        <svg className="station-art station-art-inner" viewBox="0 0 180 180" focusable="false">
          <defs>
            <radialGradient id="orbGlow" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#f3e7fb" />
              <stop offset="55%" stopColor="#b991cf" />
              <stop offset="100%" stopColor="#7d5d99" />
            </radialGradient>
          </defs>
          <circle cx="90" cy="72" r="42" fill="url(#orbGlow)" />
          <circle cx="74" cy="56" r="10" fill="#ffffff" opacity=".35" />
          <ellipse cx="90" cy="132" rx="42" ry="12" fill="#ae8cc4" />
          <path d="M52 34l4 10 10 4-10 4-4 10-4-10-10-4 10-4 4-10z" fill="#ead7f7" opacity=".8" />
          <path d="M132 42l3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7z" fill="#f5eafc" opacity=".7" />
        </svg>
      )
    default:
      return null
  }
}
