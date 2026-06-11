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
        <div className="ph-aurora"><i className="ph-au1" /><i className="ph-au2" /><i className="ph-au3" /></div>
        <div className="ph-tex" />
        <div className="ph-status"><span>{hh}:{mm}</span><span className="ph-status-r">▰▰▰ &nbsp;&nbsp;⌃ &nbsp;&nbsp;▭</span></div>

        {view === 'lock' && (
          <div className="ph-lock" onClick={() => setView('home')}>
            <div className="ph-lock-time">{hh}:{mm}</div>
            <div className="ph-lock-date">{dateStr}</div>
            <div className="ph-lock-notifs">
              {APPS.slice(0, 3).map(a => (
                <div className="ph-chip" key={a.key} onClick={e => { e.stopPropagation(); openApp(a.key) }}>
                  <span className={`ph-chip-ic ph-tint-${a.key}`}><Icon k={a.key} /></span>
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
                    <span className={`ph-app-ic ph-tint-${a.key}`}><Icon k={a.key} /></span>
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
/* ═══ 达迪的手机 · Obsidian Aurora (2026-06-11 fable5) ═══ */
.ph-overlay{position:fixed;inset:0;z-index:1000;background:rgba(5,4,10,.72);backdrop-filter:blur(9px);display:flex;align-items:center;justify-content:center;}
.ph-phone{position:relative;width:min(412px,92vw);height:min(860px,90vh);border-radius:46px;overflow:hidden;
  background:linear-gradient(168deg,#0c0a14 0%,#07060c 55%,#0a0712 100%);
  box-shadow:0 40px 110px rgba(0,0,0,.72),0 0 0 1px rgba(255,255,255,.045),0 0 60px rgba(122,82,255,.10),inset 0 1px 0 rgba(255,255,255,.06);
  display:flex;flex-direction:column;color:#ece8f4;font-family:-apple-system,'PingFang SC',sans-serif;}
/* 极光: 三团缓慢漂移的光 */
.ph-aurora{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.ph-aurora i{position:absolute;border-radius:50%;filter:blur(58px);opacity:.5;will-change:transform;}
.ph-au1{width:340px;height:340px;left:-110px;top:-90px;background:radial-gradient(circle,rgba(122,82,255,.55),transparent 70%);animation:phDrift1 26s ease-in-out infinite alternate;}
.ph-au2{width:300px;height:300px;right:-120px;top:140px;background:radial-gradient(circle,rgba(224,85,106,.4),transparent 70%);animation:phDrift2 32s ease-in-out infinite alternate;}
.ph-au3{width:380px;height:300px;left:40px;bottom:-150px;background:radial-gradient(circle,rgba(255,176,112,.30),transparent 70%);animation:phDrift3 38s ease-in-out infinite alternate;}
@keyframes phDrift1{to{transform:translate(50px,40px) scale(1.12)}}
@keyframes phDrift2{to{transform:translate(-40px,60px) scale(.92)}}
@keyframes phDrift3{to{transform:translate(-50px,-40px) scale(1.08)}}
@media (prefers-reduced-motion: reduce){.ph-aurora i{animation:none}}
.ph-tex{position:absolute;inset:0;pointer-events:none;opacity:.6;
  background:repeating-linear-gradient(115deg,rgba(255,255,255,.014) 0 1px,transparent 1px 3px),
             radial-gradient(80% 36% at 50% 0%,rgba(255,255,255,.05),transparent 62%);}
.ph-status{position:relative;display:flex;justify-content:space-between;padding:16px 28px 6px;font-size:14px;font-weight:600;letter-spacing:.3px;flex-shrink:0;z-index:2;}
.ph-status-r{font-size:11px;opacity:.6;}
.ph-svg{width:24px;height:24px;}
.ph-svg-sm{width:18px;height:18px;}

/* 玻璃基底(公共) */
.ph-chip,.ph-search,.ph-panel,.ph-ncard,.ph-card,.ph-now,.ph-alb,.ph-photo,.ph-thread,.ph-cal-today,.ph-caught-card,.ph-hr-note{
  background:linear-gradient(165deg,rgba(255,255,255,.085),rgba(255,255,255,.028));
  border:1px solid rgba(255,255,255,.085);
  backdrop-filter:blur(16px) saturate(1.35);-webkit-backdrop-filter:blur(16px) saturate(1.35);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 6px 22px rgba(0,0,0,.28);}

/* 渐变身份色: 每个 app 一团光 */
.ph-tint-health{--tg:linear-gradient(135deg,#ff5e7a,#ff8a5c);--tglow:rgba(255,94,122,.5);}
.ph-tint-shop{--tg:linear-gradient(135deg,#ffb35c,#ff7a45);--tglow:rgba(255,179,92,.45);}
.ph-tint-browser{--tg:linear-gradient(135deg,#5ca8ff,#7a5cff);--tglow:rgba(92,168,255,.45);}
.ph-tint-notes{--tg:linear-gradient(135deg,#ffd56b,#e09a3e);--tglow:rgba(255,213,107,.4);}
.ph-tint-music{--tg:linear-gradient(135deg,#c45cff,#ff5cd0);--tglow:rgba(196,92,255,.45);}
.ph-tint-photos{--tg:linear-gradient(135deg,#4fd8c3,#3e8de0);--tglow:rgba(79,216,195,.4);}
.ph-tint-messages{--tg:linear-gradient(135deg,#6be08a,#3ec9a7);--tglow:rgba(107,224,138,.4);}
.ph-tint-calendar{--tg:linear-gradient(135deg,#ff6b6b,#c45cff);--tglow:rgba(255,107,107,.4);}

/* lock */
.ph-lock{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;padding:40px 24px 24px;cursor:pointer;min-height:0;z-index:2;}
.ph-lock-time{font-size:80px;font-weight:200;letter-spacing:1px;line-height:1;
  background:linear-gradient(160deg,#ffffff 18%,#cdbdf2 52%,#9a86d8 88%);
  -webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 4px 22px rgba(140,110,255,.25));}
.ph-lock-date{font-size:15px;opacity:.6;margin-top:6px;letter-spacing:.6px;}
.ph-lock-notifs{margin-top:36px;width:100%;display:flex;flex-direction:column;gap:10px;overflow-y:auto;}
.ph-chip{display:flex;gap:12px;align-items:center;border-radius:19px;padding:12px 14px;cursor:pointer;transition:transform .16s,box-shadow .16s;}
.ph-chip:active{transform:scale(.97);}
.ph-chip-ic{width:38px;height:38px;flex-shrink:0;border-radius:12px;display:grid;place-items:center;color:#fff;
  background:var(--tg,linear-gradient(135deg,#888,#555));box-shadow:0 4px 14px var(--tglow,rgba(0,0,0,.3)),inset 0 1px 0 rgba(255,255,255,.35);}
.ph-chip-ic .ph-svg{width:20px;height:20px;}
.ph-chip-t{font-size:13px;font-weight:600;}
.ph-chip-b{font-size:12px;opacity:.5;}
.ph-lock-hint{margin-top:auto;padding-top:14px;font-size:12px;opacity:.4;letter-spacing:2px;animation:phBreath 3.2s ease-in-out infinite;}
@keyframes phBreath{0%,100%{opacity:.25}50%{opacity:.6}}

/* home */
.ph-home{position:relative;flex:1;padding:6px 24px 18px;display:flex;flex-direction:column;min-height:0;overflow-y:auto;z-index:2;}
.ph-greet{padding:10px 2px 4px;}
.ph-greet-row{display:flex;justify-content:space-between;align-items:flex-start;}
.ph-greet-hi{font-size:15px;opacity:.65;}
.ph-greet-name{font-size:44px;font-weight:500;font-family:'Songti SC','Noto Serif SC',Georgia,serif;letter-spacing:1px;margin-top:2px;
  background:linear-gradient(135deg,#fff 25%,#e8c9b0 60%,#d9824e 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-logo{width:26px;height:26px;margin-top:6px;filter:drop-shadow(0 0 10px rgba(217,130,78,.55));}
.ph-greet-sub{font-size:13.5px;opacity:.58;margin-top:8px;}
.ph-greet-sign{font-family:'Caveat','Snell Roundhand',cursive;font-size:24px;margin-top:4px;
  background:linear-gradient(110deg,#ffb070,#e0556a 55%,#b07aff);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-search{display:flex;align-items:center;gap:10px;margin-top:18px;border-radius:17px;padding:13px 16px;}
.ph-search-ic{width:18px;height:18px;opacity:.45;}
.ph-search-ph{flex:1;font-size:14px;opacity:.4;}
.ph-search-scan{width:18px;height:18px;opacity:.45;}
.ph-panel{margin-top:16px;border-radius:24px;padding:18px 14px 12px;}
.ph-panel-h{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;margin:0 6px 14px;opacity:.92;}
.ph-panel-bar{width:4px;height:15px;border-radius:3px;background:linear-gradient(180deg,#ffb070,#e0556a);box-shadow:0 0 8px rgba(224,85,106,.5);}
.ph-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 4px;}
.ph-app{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:none;color:inherit;padding:10px 4px 12px;cursor:pointer;border-radius:16px;transition:transform .15s,background .2s;}
.ph-app:hover{background:rgba(255,255,255,.04);}
.ph-app:active{transform:scale(.92);}
.ph-app-ic{width:54px;height:54px;border-radius:17px;display:grid;place-items:center;color:#fff;position:relative;
  background:var(--tg,linear-gradient(165deg,rgba(255,255,255,.12),rgba(255,255,255,.04)));
  box-shadow:0 6px 18px var(--tglow,rgba(0,0,0,.35)),inset 0 1px 0 rgba(255,255,255,.4),inset 0 -6px 14px rgba(0,0,0,.18);}
.ph-app-ic::after{content:'';position:absolute;inset:0;border-radius:17px;background:linear-gradient(180deg,rgba(255,255,255,.28),transparent 45%);pointer-events:none;}
.ph-app-ic .ph-svg{width:26px;height:26px;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3));}
.ph-app-l{font-size:12.5px;font-weight:500;}
.ph-app-en{font-size:9.5px;opacity:.4;letter-spacing:.4px;}
.ph-ncard{margin-top:14px;display:flex;align-items:center;gap:12px;border-radius:18px;padding:13px 15px;}
.ph-ncard-dot{width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,#ffb070,#e0556a);box-shadow:0 0 10px rgba(224,85,106,.7);flex-shrink:0;animation:phBreath 2.6s infinite;}
.ph-ncard-mid{flex:1;}
.ph-ncard-h{font-size:12px;opacity:.55;}
.ph-ncard-s{font-size:13.5px;margin-top:2px;}
.ph-ncard-arrow{opacity:.4;font-size:18px;}
.ph-tabs{margin-top:auto;padding-top:14px;display:flex;justify-content:space-around;}
.ph-tab{display:flex;flex-direction:column;align-items:center;gap:3px;font-size:11px;opacity:.42;}
.ph-tab small{display:block;font-size:8.5px;opacity:.7;text-align:center;}
.ph-tab .ph-svg{width:21px;height:21px;}
.ph-tab-on{opacity:1;}
.ph-tab-on .ph-svg{color:#ffb070;filter:drop-shadow(0 0 8px rgba(255,176,112,.6));}

/* app 页 */
.ph-app-view{position:relative;flex:1;display:flex;flex-direction:column;min-height:0;z-index:2;}
.ph-appbar{display:flex;align-items:center;padding:8px 16px 10px;gap:6px;}
.ph-back{background:linear-gradient(165deg,rgba(255,255,255,.1),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.1);color:inherit;font-size:22px;width:36px;height:36px;border-radius:12px;cursor:pointer;line-height:1;backdrop-filter:blur(10px);transition:transform .14s;}
.ph-back:active{transform:scale(.9);}
.ph-appbar-t{flex:1;text-align:center;font-size:16px;font-weight:600;letter-spacing:2px;}
.ph-refresh{background:linear-gradient(165deg,rgba(255,255,255,.1),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.1);color:inherit;width:36px;height:36px;border-radius:12px;cursor:pointer;display:grid;place-items:center;backdrop-filter:blur(10px);transition:transform .14s;}
.ph-refresh:active{transform:rotate(180deg) scale(.9);}
.ph-appbody{flex:1;overflow-y:auto;padding:6px 18px 24px;}
.ph-loading{text-align:center;padding:70px 20px;font-size:14px;opacity:.65;line-height:2;}
.ph-err{text-align:center;padding:60px 20px;font-size:13px;opacity:.7;}
.ph-err button{margin-top:12px;background:linear-gradient(135deg,#ffb070,#e0556a);border:none;color:#fff;border-radius:12px;padding:8px 22px;cursor:pointer;font-weight:600;}

/* 卡片族 */
.ph-card{border-radius:17px;padding:13px 15px;margin-bottom:10px;transition:transform .14s;}
.ph-card:active{transform:scale(.985);}
.ph-sec{font-size:12px;font-weight:700;letter-spacing:2.5px;opacity:.5;margin:18px 4px 10px;text-transform:uppercase;
  background:linear-gradient(90deg,#cdbdf2,#9a86d8);-webkit-background-clip:text;background-clip:text;color:transparent;opacity:.85;}
.ph-row{display:flex;justify-content:space-between;align-items:baseline;gap:10px;}
.ph-row-n{font-size:14px;font-weight:500;}
.ph-row-p{font-size:13.5px;font-weight:700;background:linear-gradient(135deg,#ffb070,#e0556a);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-sub{font-size:12.5px;opacity:.62;margin-top:5px;line-height:1.65;}
.ph-meta{font-size:11px;opacity:.42;margin-top:4px;letter-spacing:.3px;}
.ph-tag{display:inline-block;margin-top:7px;font-size:10.5px;padding:2px 9px;border-radius:9px;background:rgba(224,85,106,.18);border:1px solid rgba(224,85,106,.3);color:#ff9eae;}
.ph-dim{opacity:.62;}

/* 健康 */
.ph-hr{text-align:center;padding:26px 0 14px;}
.ph-hr-num{font-size:64px;font-weight:200;line-height:1;
  background:linear-gradient(160deg,#ff8a9e 10%,#ff5e7a 55%,#e0556a);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 4px 26px rgba(255,94,122,.35));}
.ph-hr-num small{font-size:15px;font-weight:500;margin-left:6px;opacity:.9;}
.ph-hr-note{border-radius:17px;padding:13px 15px;margin-bottom:10px;font-size:13px;line-height:1.7;border-left:3px solid rgba(255,94,122,.55);}
.ph-hlog-top{display:flex;justify-content:space-between;}
.ph-hlog-l{font-size:13px;opacity:.75;}
.ph-hlog-v{font-size:13.5px;font-weight:700;}
.ph-hsum{margin-top:14px;font-size:13px;line-height:1.8;opacity:.75;padding:14px 16px;border-radius:17px;background:linear-gradient(150deg,rgba(122,82,255,.14),rgba(224,85,106,.08));border:1px solid rgba(160,120,255,.18);}

/* 浏览 */
.ph-hist-t{font-size:13.5px;font-weight:500;line-height:1.5;}
.ph-incog{background:linear-gradient(165deg,rgba(122,82,255,.16),rgba(20,16,34,.5));border-color:rgba(140,100,255,.3);}

/* 备忘录 */
.ph-note-t{font-size:14px;font-weight:600;}
.ph-note-b{font-size:13px;opacity:.74;margin-top:6px;line-height:1.7;white-space:pre-wrap;}
.ph-pinned{border-color:rgba(255,176,112,.4);box-shadow:inset 0 1px 0 rgba(255,255,255,.09),0 6px 22px rgba(0,0,0,.28),0 0 18px rgba(255,176,112,.12);}
.ph-pinned .ph-note-t{background:linear-gradient(110deg,#ffd56b,#ffb070);-webkit-background-clip:text;background-clip:text;color:transparent;}

/* 歌单 */
.ph-now{border-radius:20px;padding:18px;margin-bottom:6px;position:relative;overflow:hidden;}
.ph-now::before{content:'';position:absolute;inset:0;background:linear-gradient(140deg,rgba(196,92,255,.22),rgba(255,92,208,.10) 50%,transparent);pointer-events:none;}
.ph-now-label{font-size:10.5px;letter-spacing:3px;opacity:.6;text-transform:uppercase;}
.ph-now-t{font-size:19px;font-weight:700;margin-top:7px;}
.ph-now-a{font-size:13px;opacity:.6;margin-top:3px;}
.ph-now-note{font-size:12.5px;opacity:.72;margin-top:10px;line-height:1.65;border-top:1px dashed rgba(255,255,255,.14);padding-top:9px;}

/* 相册 */
.ph-alb-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px;}
.ph-alb{min-width:96px;border-radius:16px;padding:12px;text-align:center;}
.ph-alb-th{font-size:22px;opacity:.85;}
.ph-alb-n{font-size:12px;font-weight:600;margin-top:6px;}
.ph-alb-c{font-size:10.5px;opacity:.45;margin-top:2px;}
.ph-photo-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px;}
.ph-photo{border-radius:15px;padding:13px;min-height:86px;display:flex;flex-direction:column;justify-content:flex-end;position:relative;overflow:hidden;}
.ph-photo::before{content:'';position:absolute;inset:0;background:linear-gradient(155deg,rgba(79,216,195,.13),rgba(62,141,224,.07) 60%,transparent);pointer-events:none;}
.ph-photo-cap{font-size:12px;line-height:1.55;position:relative;}
.ph-photo-t{font-size:10px;opacity:.45;margin-top:5px;position:relative;}
.ph-blur{filter:blur(0);}
.ph-blur .ph-photo-cap{filter:blur(4px);user-select:none;}
.ph-blur::after{content:'🔒 私密';position:absolute;inset:auto 8px 8px auto;font-size:10px;opacity:.8;}

/* 信息 */
.ph-thread{border-radius:19px;padding:14px 15px;margin-bottom:12px;}
.ph-thread-h{font-size:12.5px;font-weight:700;opacity:.6;letter-spacing:1px;margin-bottom:10px;}
.ph-mrow{display:flex;flex-direction:column;margin-bottom:9px;}
.ph-mine{align-items:flex-end;}
.ph-other{align-items:flex-start;}
.ph-mbub{max-width:82%;font-size:13.5px;line-height:1.6;padding:9px 13px;border-radius:16px;}
.ph-mine .ph-mbub{background:linear-gradient(135deg,#d9824e,#c0564f);color:#fff;border-bottom-right-radius:5px;box-shadow:0 4px 14px rgba(217,130,78,.3);}
.ph-other .ph-mbub{background:linear-gradient(165deg,rgba(255,255,255,.12),rgba(255,255,255,.05));border:1px solid rgba(255,255,255,.09);border-bottom-left-radius:5px;}
.ph-mtime{font-size:10px;opacity:.38;margin-top:3px;}

/* 日历 */
.ph-cal-today{border-radius:18px;padding:15px 17px;margin-bottom:14px;font-size:13.5px;line-height:1.75;position:relative;overflow:hidden;}
.ph-cal-today::before{content:'';position:absolute;inset:0;background:linear-gradient(140deg,rgba(255,107,107,.14),rgba(196,92,255,.08) 60%,transparent);pointer-events:none;}
.ph-event{display:flex;gap:13px;align-items:flex-start;}
.ph-event-date{min-width:46px;font-size:11.5px;font-weight:700;text-align:center;padding:7px 4px;border-radius:11px;background:linear-gradient(160deg,rgba(255,107,107,.22),rgba(196,92,255,.16));border:1px solid rgba(255,130,150,.25);}
.ph-event-t{font-size:13.5px;font-weight:600;}
.ph-event-tag{margin-left:8px;font-size:10px;padding:2px 8px;border-radius:8px;background:rgba(122,82,255,.2);border:1px solid rgba(140,100,255,.3);color:#c9b8ff;}

/* 上锁 */
.ph-locked{text-align:center;padding:48px 26px;}
.ph-locked-ic{font-size:40px;filter:drop-shadow(0 0 18px rgba(255,176,112,.4));}
.ph-locked-t{font-size:16px;font-weight:600;margin-top:14px;}
.ph-locked-s{font-size:12.5px;opacity:.6;margin-top:7px;}
.ph-code{margin-top:20px;width:150px;text-align:center;font-size:26px;letter-spacing:12px;padding:10px 0;color:#fff;border-radius:14px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.06);backdrop-filter:blur(8px);outline:none;}
.ph-code:focus{border-color:rgba(255,176,112,.55);box-shadow:0 0 0 3px rgba(255,176,112,.14);}
.ph-code-err{margin-top:10px;font-size:12px;color:#ff9eae;}
.ph-code-btn{display:block;margin:16px auto 0;background:linear-gradient(135deg,#ffb070,#e0556a);border:none;color:#fff;font-size:14px;font-weight:700;border-radius:14px;padding:10px 38px;cursor:pointer;box-shadow:0 6px 20px rgba(224,85,106,.35);transition:transform .14s;}
.ph-code-btn:active{transform:scale(.95);}
.ph-code-btn:disabled{opacity:.4;}

/* 抓包 */
.ph-caught{position:absolute;inset:0;z-index:30;background:rgba(5,3,10,.66);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:30px;}
.ph-caught-card{border-radius:24px;padding:30px 26px;text-align:center;max-width:300px;
  background:linear-gradient(160deg,rgba(40,24,40,.92),rgba(16,10,22,.95));
  border:1px solid rgba(255,140,120,.22);box-shadow:0 24px 70px rgba(0,0,0,.6),0 0 50px rgba(224,85,106,.16);}
.ph-caught-mark{width:36px;height:36px;filter:drop-shadow(0 0 14px rgba(217,130,78,.7));}
.ph-caught-line{font-size:15px;line-height:1.8;margin-top:14px;}
.ph-caught-lock{font-size:12px;opacity:.65;margin-top:10px;}
.ph-caught-btn{margin-top:20px;background:linear-gradient(135deg,#ffb070,#e0556a);border:none;color:#fff;border-radius:13px;padding:9px 30px;cursor:pointer;font-weight:600;}

.ph-close{position:fixed;top:26px;right:26px;width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);color:#fff;font-size:17px;cursor:pointer;backdrop-filter:blur(10px);}
`
