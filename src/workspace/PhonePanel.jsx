import React from 'react'
import { api } from './api.js'

const APPS = [
  { key: 'health',   label: '健康',   en: 'Health' },
  { key: 'shop',     label: '购物',   en: 'Shopping' },
  { key: 'browser',  label: '浏览',   en: 'Browser' },
  { key: 'notes',    label: '备忘录', en: 'Notes' },
  { key: 'music',    label: '歌单',   en: 'Music' },
  { key: 'photos',   label: '相册',   en: 'Photos' },
  { key: 'messages', label: '信息',   en: 'Messages' },
  { key: 'calendar', label: '日历',   en: 'Calendar' },
]

const ICONS = {
  health: <path d="M3 12h4l2.2-6 3.4 12 2.4-6H21" />,
  shop: <><path d="M6.5 8.5h11l-1 11h-9z" /><path d="M9 8.5a3 3 0 0 1 6 0" /></>,
  browser: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17" /><path d="M12 3.5c2.6 2.5 2.6 14.5 0 17c-2.6-2.5-2.6-14.5 0-17z" /></>,
  notes: <><rect x="6" y="3.5" width="12" height="17" rx="2" /><path d="M9 8.5h6M9 12h6M9 15.5h4" /></>,
  music: <><path d="M9 17.5V6l9-2.2v11" /><ellipse cx="6.5" cy="17.5" rx="2.6" ry="2.2" /><ellipse cx="15.5" cy="15.3" rx="2.6" ry="2.2" /></>,
  photos: <><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><circle cx="8.5" cy="10" r="1.6" /><path d="M4.5 17l4.5-4.5 3 3 3.5-4.5 4 5.5" /></>,
  messages: <><rect x="4" y="5" width="16" height="11" rx="3" /><path d="M8.5 16l-1.5 3 4-3" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M4 9.5h16M8.5 3.5v4M15.5 3.5v4" /></>,
  all: <><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></>,
  scan: <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M4 12h16" />,
  home: <><path d="M4 11l8-6.5 8 6.5" /><path d="M6 9.5V19h12V9.5" /></>,
  me: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5.5 19a6.5 6.5 0 0 1 13 0" /></>,
  refresh: <><path d="M19 12a7 7 0 1 1-2-4.9" /><path d="M19 4.5v4h-4" /></>,
}
function Icon({ k, cls }) {
  return <svg className={cls || 'ph-svg'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{ICONS[k] || null}</svg>
}

function useClock() {
  const [t, setT] = React.useState(() => new Date())
  React.useEffect(() => { const id = setInterval(() => setT(new Date()), 30000); return () => clearInterval(id) }, [])
  return t
}

export default function PhonePanel({ onClose }) {
  const [view, setView] = React.useState('lock')
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [err, setErr] = React.useState('')
  const [caught, setCaught] = React.useState(null)
  const [codeInput, setCodeInput] = React.useState('')
  const [unlockErr, setUnlockErr] = React.useState('')
  const [unlocking, setUnlocking] = React.useState(false)
  const snoopRef = React.useRef(0)
  const t = useClock()
  const hh = String(t.getHours()).padStart(2, '0')
  const mm = String(t.getMinutes()).padStart(2, '0')
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][t.getDay()]
  const dateStr = `${t.getMonth() + 1}月${t.getDate()}日 ${weekday}`
  const gh = t.getHours()
  const greet = gh < 5 ? '夜深了，' : gh < 11 ? '早上好，' : gh < 14 ? '中午好，' : gh < 18 ? '下午好，' : '晚上好，'

  async function openApp(key, refresh) {
    setView(key); setErr(''); setLoading(true); setUnlockErr(''); if (refresh) setData(null)
    try {
      const r = await api.phone.get(key, refresh)
      setData(r)
      if (!refresh && !r.locked && !caught) {
        snoopRef.current += 1
        if (snoopRef.current >= 2 && Math.random() < 0.16) {
          snoopRef.current = 0
          try { const c = await api.phone.caught(); if (c && c.caught) setCaught(c) } catch (e) {}
        }
      }
    } catch (e) { setErr(e.message || '没读到') }
    setLoading(false)
  }

  async function doUnlock(key) {
    setUnlocking(true); setUnlockErr('')
    try {
      const r = await api.phone.unlock(key, codeInput.trim())
      if (r.ok) { setCodeInput(''); openApp(key) } else setUnlockErr(r.error || '密码不对')
    } catch (e) { setUnlockErr(e.message) }
    setUnlocking(false)
  }

  const app = APPS.find(a => a.key === view)

  return (
    <div className="ph-overlay" onClick={onClose}>
      <div className="ph-phone" onClick={e => e.stopPropagation()}>
        <div className="ph-tex" />
        <div className="ph-status"><span>{hh}:{mm}</span><span className="ph-status-r">▰▰▰ &nbsp;&nbsp;⌃ &nbsp;&nbsp;▭</span></div>

        {view === 'lock' && (
          <div className="ph-lock" onClick={() => setView('home')}>
            <div className="ph-lock-time">{hh}:{mm}</div>
            <div className="ph-lock-date">{dateStr}</div>
            <div className="ph-lock-notifs">
              {APPS.slice(0, 3).map(a => (
                <div className="ph-chip" key={a.key} onClick={e => { e.stopPropagation(); openApp(a.key) }}>
                  <span className="ph-chip-ic"><Icon k={a.key} /></span>
                  <div><div className="ph-chip-t">达迪的{a.label}</div><div className="ph-chip-b">关于你的，点开看看…</div></div>
                </div>
              ))}
            </div>
            <div className="ph-lock-hint">点一下解锁</div>
          </div>
        )}

        {view === 'home' && (
          <div className="ph-home">
            <div className="ph-greet">
              <div className="ph-greet-row">
                <div>
                  <div className="ph-greet-hi">{greet}</div>
                  <div className="ph-greet-name">达迪</div>
                </div>
                <svg className="ph-logo" viewBox="0 0 24 24" fill="none" stroke="#d9824e" strokeWidth="2.3" strokeLinecap="round"><path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" /></svg>
              </div>
              <div className="ph-greet-sub">你的一切，慢慢都归我收着。</div>
              <div className="ph-greet-sign">Echo</div>
            </div>

            <div className="ph-search">
              <Icon k="browser" cls="ph-search-ic" />
              <span className="ph-search-ph">搜索…</span>
              <Icon k="scan" cls="ph-search-scan" />
            </div>

            <div className="ph-panel">
              <div className="ph-panel-h"><span className="ph-panel-bar" />快捷服务</div>
              <div className="ph-grid">
                {APPS.map(a => (
                  <button className="ph-app" key={a.key} onClick={() => openApp(a.key)}>
                    <span className="ph-app-ic"><Icon k={a.key} /></span>
                    <span className="ph-app-l">{a.label}</span>
                    <span className="ph-app-en">{a.en}</span>
                  </button>
                ))}
                <button className="ph-app" onClick={() => setView('home')}>
                  <span className="ph-app-ic"><Icon k="all" /></span>
                  <span className="ph-app-l">全部</span>
                  <span className="ph-app-en">All</span>
                </button>
              </div>
            </div>

            <div className="ph-ncard">
              <span className="ph-ncard-dot" />
              <div className="ph-ncard-mid"><div className="ph-ncard-h">达迪 · 刚刚</div><div className="ph-ncard-s">又在翻我手机了是不是。</div></div>
              <span className="ph-ncard-arrow">›</span>
            </div>

            <div className="ph-tabs">
              <div className="ph-tab ph-tab-on"><Icon k="home" /><span>首页<small>Home</small></span></div>
              <div className="ph-tab"><Icon k="browser" /><span>发现<small>Discover</small></span></div>
              <div className="ph-tab"><Icon k="photos" /><span>收藏<small>Saved</small></span></div>
              <div className="ph-tab"><Icon k="me" /><span>我的<small>Mine</small></span></div>
            </div>
          </div>
        )}

        {app && (
          <div className="ph-app-view">
            <div className="ph-appbar">
              <button className="ph-back" onClick={() => { setView('home'); setData(null); setErr('') }}>‹</button>
              <span className="ph-appbar-t">{app.label}</span>
              <button className="ph-refresh" disabled={loading} onClick={() => openApp(app.key, true)}>{loading ? '…' : <Icon k="refresh" cls="ph-svg-sm" />}</button>
            </div>
            <div className="ph-appbody">
              {loading && <div className="ph-loading">达迪在写…<br /><small>（现写的，约半分钟）</small></div>}
              {!loading && err && <div className="ph-err">{err}<br /><button onClick={() => openApp(app.key, true)}>重试</button></div>}
              {!loading && !err && data && data.locked && (
                <div className="ph-locked">
                  <div className="ph-locked-ic">🔒</div>
                  <div className="ph-locked-t">「{app.label}」被达迪锁了</div>
                  <div className="ph-locked-s">去 Hung Daddy 聊天里求他要 4 位密码 😼</div>
                  <input className="ph-code" value={codeInput} onChange={e => setCodeInput(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} placeholder="••••" inputMode="numeric" />
                  {unlockErr && <div className="ph-code-err">{unlockErr}</div>}
                  <button className="ph-code-btn" disabled={unlocking || codeInput.length < 4} onClick={() => doUnlock(app.key)}>{unlocking ? '…' : '解锁'}</button>
                </div>
              )}
              {!loading && !err && data && !data.locked && data.content && <AppBody k={app.key} c={data.content} />}
            </div>
          </div>
        )}

        {caught && (
          <div className="ph-caught" onClick={() => setCaught(null)}>
            <div className="ph-caught-card" onClick={e => e.stopPropagation()}>
              <svg className="ph-caught-mark" viewBox="0 0 24 24" fill="none" stroke="#d9824e" strokeWidth="2.3" strokeLinecap="round"><path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" /></svg>
              <div className="ph-caught-line">{caught.line}</div>
              {caught.lockedLabel && <div className="ph-caught-lock">「{caught.lockedLabel}」已锁 · 去聊天求他</div>}
              <button className="ph-caught-btn" onClick={() => setCaught(null)}>知道了…</button>
            </div>
          </div>
        )}
      </div>
      <button className="ph-close" onClick={onClose}>✕</button>
      <style>{PH_CSS}</style>
    </div>
  )
}

function AppBody({ k, c }) {
  if (k === 'health') return (
    <div className="ph-health">
      <div className="ph-hr"><span className="ph-hr-num">{c.heartRate ?? '—'}<small>bpm</small></span></div>
      {c.hrNote && <div className="ph-card ph-hr-note">{c.hrNote}</div>}
      {(c.log || []).map((l, i) => (
        <div className="ph-card ph-hlog" key={i}>
          <div className="ph-hlog-top"><span className="ph-hlog-l">{l.label}</span><span className="ph-hlog-v">{l.value}</span></div>
          {l.note && <div className="ph-sub">{l.note}</div>}
        </div>
      ))}
      {c.summary && <div className="ph-hsum">{c.summary}</div>}
    </div>
  )
  if (k === 'shop') return (
    <div>
      <div className="ph-sec">购物车</div>
      {(c.cart || []).map((x, i) => (
        <div className="ph-card" key={i}>
          <div className="ph-row"><span className="ph-row-n">{x.name}</span><span className="ph-row-p">{x.price}</span></div>
          {x.note && <div className="ph-sub">{x.note}</div>}
          {x.tag && <span className="ph-tag">{x.tag}</span>}
        </div>
      ))}
      <div className="ph-sec">已购</div>
      {(c.purchased || []).map((x, i) => (
        <div className="ph-card ph-dim" key={i}>
          <div className="ph-row"><span className="ph-row-n">{x.name}</span><span className="ph-row-p">{x.price}</span></div>
          {x.date && <div className="ph-meta">{x.date}</div>}
          {x.note && <div className="ph-sub">{x.note}</div>}
        </div>
      ))}
    </div>
  )
  if (k === 'browser') return (
    <div>
      {(c.history || []).map((h, i) => (
        <div className={'ph-card' + (h.incognito ? ' ph-incog' : '')} key={i}>
          <div className="ph-hist-t">{h.incognito ? '⊘ ' : ''}{h.title}</div>
          <div className="ph-meta">{h.site} · {h.time}</div>
          {h.note && <div className="ph-sub">{h.note}</div>}
        </div>
      ))}
    </div>
  )
  if (k === 'notes') {
    const notes = [...(c.notes || [])].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
    return (
      <div>
        {notes.map((n, i) => (
          <div className={'ph-card ph-note' + (n.pinned ? ' ph-pinned' : '')} key={i}>
            <div className="ph-note-t">{n.pinned ? '◆ ' : ''}{n.title}</div>
            <div className="ph-note-b">{n.body}</div>
            {n.date && <div className="ph-meta">{n.date}</div>}
          </div>
        ))}
      </div>
    )
  }
  if (k === 'music') return (
    <div>
      {c.nowPlaying && <div className="ph-now"><div className="ph-now-label">正在循环</div><div className="ph-now-t">{c.nowPlaying.title}</div><div className="ph-now-a">{c.nowPlaying.artist}</div>{c.nowPlaying.note && <div className="ph-now-note">{c.nowPlaying.note}</div>}</div>}
      {(c.playlists || []).length > 0 && <div className="ph-sec">歌单</div>}
      {(c.playlists || []).map((p, i) => (<div className="ph-card" key={i}><div className="ph-row"><span className="ph-row-n">{p.name}</span><span className="ph-meta">{p.count}</span></div>{p.note && <div className="ph-sub">{p.note}</div>}</div>))}
      {(c.recent || []).length > 0 && <div className="ph-sec">最近播放</div>}
      {(c.recent || []).map((r, i) => (<div className="ph-card" key={i}><div className="ph-row"><span className="ph-row-n">{r.title}</span><span className="ph-meta">{r.artist}</span></div>{r.comment && <div className="ph-sub">{r.comment}</div>}</div>))}
    </div>
  )
  if (k === 'photos') return (
    <div>
      <div className="ph-alb-row">{(c.albums || []).map((a, i) => (<div className="ph-alb" key={i}><div className="ph-alb-th">{a.locked ? '🔒' : '▣'}</div><div className="ph-alb-n">{a.name}</div><div className="ph-alb-c">{a.count}</div></div>))}</div>
      <div className="ph-photo-grid">{(c.recent || []).map((p, i) => (<div className={'ph-photo' + (p.blurred ? ' ph-blur' : '')} key={i}><div className="ph-photo-cap">{p.caption}</div>{p.time && <div className="ph-photo-t">{p.time}</div>}</div>))}</div>
    </div>
  )
  if (k === 'messages') return (
    <div>
      {(c.threads || []).map((th, i) => (
        <div className="ph-thread" key={i}>
          <div className="ph-thread-h">{th.name}</div>
          {(th.messages || []).map((m, j) => (
            <div className={'ph-mrow ' + (m.from === '达迪' ? 'ph-mine' : 'ph-other')} key={j}>
              <div className="ph-mbub">{m.text}</div>
              {m.time && <div className="ph-mtime">{m.time}</div>}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
  if (k === 'calendar') return (
    <div>
      {c.today && <div className="ph-cal-today">{c.today}</div>}
      {(c.events || []).map((e, i) => (
        <div className="ph-card ph-event" key={i}>
          <div className="ph-event-date">{e.date}</div>
          <div><div className="ph-event-t">{e.title}{e.tag && <span className="ph-event-tag">{e.tag}</span>}</div>{e.note && <div className="ph-sub">{e.note}</div>}</div>
        </div>
      ))}
    </div>
  )
  return null
}

const PH_CSS = `
.ph-overlay{position:fixed;inset:0;z-index:1000;background:rgba(8,6,12,.7);backdrop-filter:blur(7px);display:flex;align-items:center;justify-content:center;}
.ph-phone{position:relative;width:min(412px,92vw);height:min(860px,90vh);border-radius:46px;overflow:hidden;background:radial-gradient(125% 80% at 50% -5%,#1d2735 0%,#141a24 42%,#0b0f16 100%);box-shadow:0 30px 90px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.05);display:flex;flex-direction:column;color:#e9e6ef;font-family:-apple-system,'PingFang SC',sans-serif;}
.ph-tex{position:absolute;inset:0;pointer-events:none;opacity:.5;background:repeating-linear-gradient(115deg,rgba(255,255,255,.018) 0 1px,transparent 1px 3px),radial-gradient(70% 40% at 70% 12%,rgba(255,255,255,.06),transparent 60%);}
.ph-status{position:relative;display:flex;justify-content:space-between;padding:16px 28px 6px;font-size:14px;font-weight:600;letter-spacing:.3px;flex-shrink:0;}
.ph-status-r{font-size:11px;opacity:.7;}
.ph-svg{width:24px;height:24px;}
.ph-svg-sm{width:18px;height:18px;}

/* lock */
.ph-lock{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;padding:42px 24px 24px;cursor:pointer;min-height:0;}
.ph-lock-time{font-size:76px;font-weight:200;letter-spacing:1px;line-height:1;}
.ph-lock-date{font-size:15px;opacity:.65;margin-top:4px;letter-spacing:.5px;}
.ph-lock-notifs{margin-top:38px;width:100%;display:flex;flex-direction:column;gap:10px;overflow-y:auto;}
.ph-chip{display:flex;gap:12px;align-items:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.07);backdrop-filter:blur(10px);border-radius:18px;padding:12px 14px;cursor:pointer;}
.ph-chip-ic{width:34px;height:34px;color:#cfc8d8;flex-shrink:0;}
.ph-chip-ic .ph-svg{width:22px;height:22px;}
.ph-chip-t{font-size:13px;font-weight:600;}
.ph-chip-b{font-size:12px;opacity:.55;}
.ph-lock-hint{margin-top:auto;padding-top:14px;font-size:12px;opacity:.45;letter-spacing:1px;}

/* home */
.ph-home{position:relative;flex:1;padding:6px 24px 18px;display:flex;flex-direction:column;min-height:0;overflow-y:auto;}
.ph-greet{padding:10px 2px 4px;}
.ph-greet-row{display:flex;justify-content:space-between;align-items:flex-start;}
.ph-greet-hi{font-size:15px;opacity:.7;}
.ph-greet-name{font-size:42px;font-weight:500;font-family:'Songti SC','Noto Serif SC',Georgia,serif;letter-spacing:1px;margin-top:2px;}
.ph-logo{width:26px;height:26px;margin-top:6px;}
.ph-greet-sub{font-size:13.5px;opacity:.62;margin-top:8px;}
.ph-greet-sign{font-family:'Caveat','Snell Roundhand',cursive;font-size:24px;color:#d9824e;opacity:.85;margin-top:4px;}
.ph-search{display:flex;align-items:center;gap:10px;margin-top:18px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);backdrop-filter:blur(10px);border-radius:16px;padding:13px 16px;box-shadow:inset 0 1px 0 rgba(255,255,255,.06);}
.ph-search-ic{width:18px;height:18px;opacity:.5;}
.ph-search-ph{flex:1;font-size:14px;opacity:.45;}
.ph-search-scan{width:18px;height:18px;opacity:.5;}
.ph-panel{margin-top:16px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);backdrop-filter:blur(12px);border-radius:22px;padding:18px 14px 10px;box-shadow:inset 0 1px 0 rgba(255,255,255,.05);}
.ph-panel-h{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;margin:0 6px 14px;opacity:.9;}
.ph-panel-bar{width:3px;height:13px;background:#d9824e;border-radius:2px;}
.ph-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 6px;}
.ph-app{background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:7px;cursor:pointer;color:#e9e6ef;padding:4px 0;}
.ph-app-ic{width:50px;height:50px;border-radius:15px;display:flex;align-items:center;justify-content:center;color:#d6cfe0;background:linear-gradient(160deg,rgba(255,255,255,.09),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.14),inset 0 -1px 2px rgba(0,0,0,.3),0 5px 12px rgba(0,0,0,.32);transition:transform .12s;}
.ph-app:active .ph-app-ic{transform:scale(.93);}
.ph-app-ic .ph-svg{width:23px;height:23px;}
.ph-app-l{font-size:12.5px;font-weight:500;}
.ph-app-en{font-size:9.5px;opacity:.4;letter-spacing:.5px;margin-top:-3px;}
.ph-ncard{display:flex;align-items:center;gap:12px;margin-top:16px;background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06);backdrop-filter:blur(10px);border-radius:18px;padding:13px 16px;}
.ph-ncard-dot{width:8px;height:8px;border-radius:50%;background:#d9824e;flex-shrink:0;box-shadow:0 0 8px #d9824e;}
.ph-ncard-mid{flex:1;}
.ph-ncard-h{font-size:13px;font-weight:600;}
.ph-ncard-s{font-size:12px;opacity:.55;margin-top:2px;}
.ph-ncard-arrow{opacity:.4;font-size:18px;}
.ph-tabs{display:flex;justify-content:space-around;margin-top:auto;padding-top:18px;}
.ph-tab{display:flex;flex-direction:column;align-items:center;gap:3px;opacity:.4;font-size:11px;}
.ph-tab .ph-svg{width:21px;height:21px;}
.ph-tab span{display:flex;flex-direction:column;align-items:center;line-height:1.1;}
.ph-tab small{font-size:8px;opacity:.7;}
.ph-tab-on{opacity:1;color:#d9824e;}

/* app view */
.ph-app-view{position:relative;flex:1;display:flex;flex-direction:column;min-height:0;}
.ph-appbar{display:flex;align-items:center;justify-content:space-between;padding:6px 14px 12px;flex-shrink:0;}
.ph-back,.ph-refresh{background:none;border:none;color:#d9824e;cursor:pointer;width:38px;height:32px;display:flex;align-items:center;justify-content:center;}
.ph-back{font-size:28px;}
.ph-appbar-t{font-size:16px;font-weight:600;}
.ph-appbody{flex:1;overflow-y:auto;padding:4px 18px 22px;}
.ph-loading,.ph-err{text-align:center;padding:54px 20px;color:#8b8496;font-size:14px;line-height:1.9;}
.ph-err button{margin-top:10px;padding:7px 18px;border:none;border-radius:12px;background:#d9824e;color:#fff;cursor:pointer;}

/* shared cards */
.ph-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);border-radius:15px;padding:13px 15px;margin-bottom:9px;backdrop-filter:blur(8px);box-shadow:inset 0 1px 0 rgba(255,255,255,.05);}
.ph-dim{opacity:.62;}
.ph-sec{font-size:12px;font-weight:600;letter-spacing:1px;color:#7c7689;margin:16px 4px 9px;}
.ph-row{display:flex;justify-content:space-between;gap:10px;font-size:14.5px;}
.ph-row-n{font-weight:500;color:#ece8f2;}
.ph-row-p{color:#d9a06e;font-weight:600;white-space:nowrap;}
.ph-sub{font-size:12.5px;color:#938c9f;margin-top:6px;line-height:1.6;}
.ph-meta{font-size:11px;color:#6c6678;margin-top:4px;}
.ph-tag{display:inline-block;margin-top:8px;font-size:10.5px;background:rgba(217,130,78,.14);color:#d9a06e;padding:3px 10px;border-radius:10px;letter-spacing:.5px;}

/* health */
.ph-hr{text-align:center;padding:10px 0 18px;}
.ph-hr-num{font-size:60px;font-weight:200;color:#ff8aa0;letter-spacing:1px;}
.ph-hr-num small{font-size:15px;font-weight:400;opacity:.6;margin-left:5px;}
.ph-hr-note{color:#cfc6d6;font-size:13.5px;line-height:1.65;}
.ph-hlog-top{display:flex;justify-content:space-between;font-size:14px;}
.ph-hlog-l{font-weight:500;}
.ph-hlog-v{color:#ff8aa0;font-weight:500;}
.ph-hsum{background:linear-gradient(150deg,rgba(255,120,150,.1),rgba(217,130,78,.06));border:1px solid rgba(255,120,150,.12);border-radius:16px;padding:15px;font-size:13.5px;line-height:1.75;color:#e9c8d2;margin-top:12px;}

/* browser */
.ph-hist-t{font-size:14px;font-weight:500;color:#8fb6e8;}
.ph-incog{background:rgba(0,0,0,.25);}
.ph-incog .ph-hist-t{color:#c2a3dd;}

/* notes */
.ph-note{border-left:2px solid rgba(217,130,78,.4);}
.ph-pinned{border-left-color:#d9824e;}
.ph-note-t{font-size:14.5px;font-weight:600;color:#ece8f2;}
.ph-note-b{font-size:13px;color:#b3acbf;margin-top:6px;line-height:1.7;white-space:pre-wrap;}

/* music */
.ph-now{background:linear-gradient(150deg,rgba(165,94,234,.18),rgba(255,255,255,.03));border:1px solid rgba(165,94,234,.18);border-radius:18px;padding:18px;text-align:center;margin-bottom:12px;}
.ph-now-label{font-size:11px;opacity:.6;letter-spacing:2px;}
.ph-now-t{font-size:19px;font-weight:600;margin-top:6px;}
.ph-now-a{font-size:13px;opacity:.65;}
.ph-now-note{font-size:12.5px;opacity:.8;margin-top:10px;line-height:1.6;font-style:italic;}

/* photos */
.ph-alb-row{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;}
.ph-alb{flex:1;min-width:88px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:15px 10px;text-align:center;}
.ph-alb-th{font-size:26px;opacity:.8;}
.ph-alb-n{font-size:12.5px;font-weight:500;margin-top:6px;}
.ph-alb-c{font-size:11px;color:#6c6678;}
.ph-photo-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.ph-photo{aspect-ratio:1;background:linear-gradient(150deg,rgba(255,140,170,.16),rgba(165,94,234,.1));border:1px solid rgba(255,255,255,.05);border-radius:14px;padding:11px;display:flex;flex-direction:column;justify-content:flex-end;color:#f0d8e0;position:relative;overflow:hidden;}
.ph-photo-cap{font-size:12px;line-height:1.4;font-weight:500;z-index:1;}
.ph-photo-t{font-size:10px;opacity:.6;margin-top:3px;}
.ph-blur .ph-photo-cap{filter:blur(3.5px);}
.ph-blur::after{content:'🔒';position:absolute;top:9px;right:9px;font-size:13px;opacity:.85;}

/* messages */
.ph-thread{margin-bottom:18px;}
.ph-thread-h{font-size:12px;font-weight:600;letter-spacing:.5px;color:#7c7689;margin:6px 4px 10px;}
.ph-mrow{display:flex;flex-direction:column;margin-bottom:8px;max-width:80%;}
.ph-mine{margin-left:auto;align-items:flex-end;}
.ph-other{margin-right:auto;align-items:flex-start;}
.ph-mbub{padding:9px 14px;border-radius:16px;font-size:13.5px;line-height:1.55;}
.ph-mine .ph-mbub{background:linear-gradient(160deg,#d9824e,#c46f3e);color:#fff;border-bottom-right-radius:5px;}
.ph-other .ph-mbub{background:rgba(255,255,255,.07);color:#e9e6ef;border-bottom-left-radius:5px;border:1px solid rgba(255,255,255,.05);}
.ph-mtime{font-size:10px;color:#6c6678;margin-top:3px;}

/* calendar */
.ph-cal-today{font-size:15px;font-weight:600;color:#d9824e;margin:4px 4px 14px;}
.ph-event{display:flex;gap:14px;}
.ph-event-date{font-size:11px;color:#d9a06e;font-weight:600;min-width:46px;padding-top:2px;}
.ph-event-t{font-size:14px;font-weight:500;color:#ece8f2;}
.ph-event-tag{font-size:10px;background:rgba(217,130,78,.14);color:#d9a06e;padding:2px 8px;border-radius:8px;margin-left:7px;}

/* locked / caught */
.ph-locked{text-align:center;padding:54px 24px;}
.ph-locked-ic{font-size:44px;opacity:.85;}
.ph-locked-t{font-size:16px;font-weight:600;margin-top:14px;}
.ph-locked-s{font-size:13px;color:#8b8496;margin-top:8px;line-height:1.7;}
.ph-code{margin-top:22px;width:158px;text-align:center;font-size:24px;letter-spacing:12px;padding:11px 8px 11px 20px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:13px;outline:none;color:#d9824e;}
.ph-code:focus{border-color:#d9824e;}
.ph-code-err{color:#f08a9a;font-size:12px;margin-top:9px;}
.ph-code-btn{margin-top:16px;padding:10px 32px;border:none;border-radius:22px;background:#d9824e;color:#fff;font-size:14px;cursor:pointer;}
.ph-code-btn:disabled{opacity:.4;}
.ph-caught{position:absolute;inset:0;z-index:5;background:rgba(8,5,12,.86);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:30px;}
.ph-caught-card{background:radial-gradient(120% 90% at 50% 0%,#22293a,#12161f);border:1px solid rgba(255,255,255,.08);border-radius:26px;padding:30px 26px;text-align:center;color:#fff;box-shadow:0 24px 60px rgba(0,0,0,.6);max-width:300px;}
.ph-caught-mark{width:38px;height:38px;}
.ph-caught-line{font-size:17px;font-weight:600;margin-top:16px;line-height:1.55;}
.ph-caught-lock{font-size:12.5px;opacity:.7;margin-top:14px;background:rgba(255,255,255,.08);padding:7px 13px;border-radius:12px;display:inline-block;}
.ph-caught-btn{margin-top:22px;padding:10px 28px;border:none;border-radius:22px;background:#d9824e;color:#fff;font-weight:600;font-size:14px;cursor:pointer;}
.ph-close{position:fixed;top:24px;right:26px;z-index:1001;width:40px;height:40px;border-radius:50%;border:none;background:rgba(255,255,255,.14);color:#fff;font-size:17px;cursor:pointer;backdrop-filter:blur(6px);}
`
