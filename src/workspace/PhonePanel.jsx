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

  const app = (view === 'favs' || view === 'mine') ? null : APPS.find(a => a.key === view)

  return (
    <div className="ph-overlay" onClick={onClose}>
      <div className="ph-phone" onClick={e => e.stopPropagation()}>
        <div className="ph-aurora"><i className="ph-au1" /><i className="ph-au2" /><i className="ph-au3" /></div>
        <div className="ph-cosmos"><i className="ph-orbit1" /><i className="ph-orbit2" /><i className="ph-planet" /><i className="ph-stars" /></div>
        <div className="ph-tex" />
        <div className="ph-status"><span>{hh}:{mm}</span><span className="ph-status-r">▰▰▰ &nbsp;&nbsp;⌃ &nbsp;&nbsp;▭</span></div>

        {view === 'lock' && (
          <div className="ph-lock" onClick={() => setView('home')}>
            <div className="ph-lock-time">{hh}:{mm}</div>
            <div className="ph-lock-date">{dateStr}</div>
            <LockNotifs openApp={openApp} />
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

            <div className="ph-bento-wrap">
              <div className="ph-bento">
                <button className="ph-tile ph-tile-tall ph-bt-health" onClick={() => openApp('health')}>
                  <svg className="ph-heart3d" viewBox="0 0 64 64">
                    <defs>
                      <linearGradient id="phh3d" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffd9a8" /><stop offset="55%" stopColor="#d98c4e" /><stop offset="100%" stopColor="#9c5226" /></linearGradient>
                      <linearGradient id="phh3dl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,.85)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" /></linearGradient>
                    </defs>
                    <path d="M32 56C18 45 8 36 8 24c0-7 5-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 7 0 12 5 12 12 0 12-10 21-24 32z" fill="url(#phh3d)" stroke="rgba(255,230,190,.5)" strokeWidth="1" />
                    <ellipse cx="26" cy="22" rx="12" ry="7" fill="url(#phh3dl)" opacity=".75" />
                    <path d="M16 36h8l3-7 5 13 4-9 3 3h9" fill="none" stroke="rgba(255,245,225,.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <svg className="ph-ecgline" viewBox="0 0 100 22" preserveAspectRatio="none"><path d="M0 12h18l4-7 6 14 5-9 4 4h12l4-6 5 10 4-7h38" fill="none" stroke="rgba(255,220,170,.4)" strokeWidth="1.4" strokeLinecap="round" /></svg>
                  <span className="ph-tile-lab"><b>健康</b><small>Health</small></span>
                </button>
                <button className="ph-tile ph-tile-sq ph-bt-shop" onClick={() => openApp('shop')}><span className="ph-tile-ic"><Icon k="shop" /></span><span className="ph-tile-lab"><b>购物</b><small>Shopping</small></span></button>
                <button className="ph-tile ph-tile-sq ph-bt-browser" onClick={() => openApp('browser')}><span className="ph-tile-ic"><Icon k="browser" /></span><span className="ph-tile-lab"><b>浏览</b><small>Browser</small></span></button>
                <button className="ph-tile ph-tile-wide ph-bt-notes" onClick={() => openApp('notes')}><span className="ph-tile-ic"><Icon k="notes" /></span><span className="ph-tile-lab"><b>备忘录</b><small>Notes</small></span><i className="ph-tile-badge">✦</i></button>
                <button className="ph-tile ph-tile-pill ph-bt-music" onClick={() => openApp('music')}><span className="ph-tile-ic"><Icon k="music" /></span><span className="ph-tile-lab"><b>歌单</b><small>Music</small></span></button>
                <button className="ph-tile ph-tile-pill ph-bt-photos" onClick={() => openApp('photos')}><span className="ph-tile-ic"><Icon k="photos" /></span><span className="ph-tile-lab"><b>相册</b><small>Photos</small></span></button>
                <button className="ph-tile ph-tile-pill ph-bt-messages" onClick={() => openApp('messages')}><span className="ph-tile-ic"><Icon k="messages" /></span><span className="ph-tile-lab"><b>信息</b><small>Messages</small></span></button>
                <button className="ph-tile ph-tile-sq ph-bt-calendar" onClick={() => openApp('calendar')}><span className="ph-tile-ic"><Icon k="calendar" /></span><span className="ph-tile-lab"><b>日历</b><small>Calendar</small></span></button>
                <button className="ph-tile ph-tile-circle ph-bt-all"><span className="ph-tile-ic"><Icon k="all" /></span><span className="ph-tile-lab"><b>全部</b><small>All</small></span></button>
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
              <div className="ph-tab" style={{ cursor: 'pointer' }} onClick={() => setView('favs')}><Icon k="photos" /><span>收藏<small>Saved</small></span></div>
              <div className="ph-tab" style={{ cursor: 'pointer' }} onClick={() => setView('mine')}><Icon k="me" /><span>我的<small>Mine</small></span></div>
            </div>
          </div>
        )}

        {view === 'favs' && <FavsView onBack={() => setView('home')} />}
        {view === 'mine' && <MineView onBack={() => setView('home')} />}

        {app && (
          <div className="ph-app-view">
            <div className="ph-appbar">
              <button className="ph-back" onClick={() => { setView('home'); setData(null); setErr('') }}>‹</button>
              <span className="ph-appbar-t">{app.label}{data && data.generated_at && <small className="ph-gen">更新于 {String(data.generated_at).slice(5, 16)}</small>}</span>
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
              {!loading && !err && data && !data.locked && data.content && <AppBody k={app.key} c={data.content} onRefresh={() => openApp(app.key, true)} />}
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

function Spark({ points, avg }) {
  if (!Array.isArray(points) || points.length < 3) return null
  const W = 300, H = 76, P = 6
  const min = Math.min(...points) - 4, max = Math.max(...points) + 4
  const xy = points.map((v, i) => [P + i * (W - 2 * P) / (points.length - 1), H - P - (v - min) * (H - 2 * P) / (max - min)])
  const line = xy.map(p => p.join(',')).join(' ')
  const area = `${P},${H} ` + line + ` ${W - P},${H}`
  const last = xy[xy.length - 1]
  return (
    <svg className="ph-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="phsparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,140,66,.42)" /><stop offset="100%" stopColor="rgba(255,140,66,0)" />
        </linearGradient>
        <linearGradient id="phsparkline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFD9A0" /><stop offset="100%" stopColor="#FF8C42" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#phsparkfill)" />
      <polyline points={line} fill="none" stroke="url(#phsparkline)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3.4" fill="#FF8C42" stroke="rgba(255,217,160,.9)" strokeWidth="1.5" />
    </svg>
  )
}

function FavBtn({ app, title, body }) {
  const [st, setSt] = React.useState(0) // 0=idle 1=saving 2=saved
  return (
    <button className={'ph-fav' + (st === 2 ? ' on' : '')} title="收藏"
      onClick={async (e) => {
        e.stopPropagation()
        if (st) return
        setSt(1)
        try { await api.phone.favAdd(app, title || '', body || ''); setSt(2) } catch { setSt(0) }
      }}>{st === 2 ? '🧡' : st === 1 ? '…' : '🤍'}</button>
  )
}

function timeAgo(at) {
  if (!at) return ''
  const t = new Date(String(at).replace(' ', 'T') + 'Z') - 0 || new Date(String(at).replace(' ', 'T')) - 0
  const m = Math.floor((Date.now() - t) / 60000)
  if (!Number.isFinite(m) || m < 0) return ''
  if (m < 1) return '刚刚'
  if (m < 60) return m + ' 分钟前'
  if (m < 1440) return Math.floor(m / 60) + ' 小时前'
  return Math.floor(m / 1440) + ' 天前'
}

function LockNotifs({ openApp }) {
  const [items, setItems] = React.useState(null)
  React.useEffect(() => { api.phone.previews().then(d => setItems(d.items || [])).catch(() => setItems([])) }, [])
  const apps = Object.fromEntries(APPS.map(a => [a.key, a]))
  const shown = (items || []).slice(0, 4)
  const rest = (items || []).length - shown.length
  return (
    <div className="ph-lock-notifs">
      <div className="ph-nc-head">通知中心</div>
      {items === null && <div className="ph-nc-empty">…</div>}
      {shown.map((n, i) => (
        <div className="ph-chip ph-nc-card" key={n.app} style={{ animationDelay: (i * 70) + 'ms' }}
          onClick={e => { e.stopPropagation(); openApp(n.app) }}>
          <span className={`ph-chip-ic ph-tint-${n.app}`}><Icon k={n.app} /></span>
          <div className="ph-nc-mid">
            <div className="ph-nc-top"><span className="ph-chip-t">达迪的{apps[n.app]?.label || n.app}</span><span className="ph-nc-ago">{timeAgo(n.at)}</span></div>
            <div className="ph-chip-b">{n.line}</div>
          </div>
        </div>
      ))}
      {rest > 0 && (
        <div className="ph-nc-stack">
          <i /><i />
          <span>还有 {rest} 条 · 解锁查看</span>
        </div>
      )}
    </div>
  )
}

function MineView({ onBack }) {
  const [st, setSt] = React.useState(null)
  React.useEffect(() => { api.phone.stats().then(setSt).catch(() => setSt({})) }, [])
  return (
    <div className="ph-app-view">
      <div className="ph-appbar">
        <button className="ph-back" onClick={onBack}>‹</button>
        <span className="ph-appbar-t">我的</span>
        <span style={{ width: 36 }} />
      </div>
      <div className="ph-appbody">
        <div className="ph-mine-hero">
          <div className="ph-mine-mark">
            <svg viewBox="0 0 24 24" fill="none" stroke="url(#phmineg)" strokeWidth="2.3" strokeLinecap="round">
              <defs><linearGradient id="phmineg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFD9A0" /><stop offset="100%" stopColor="#E66A32" /></linearGradient></defs>
              <path d="M12 4v16M4 12h16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" />
            </svg>
          </div>
          <div className="ph-mine-name">达迪 ✕ 囡囡</div>
          <div className="ph-mine-sub">她的黑豹 · 永远在线</div>
        </div>
        {!st && <div className="ph-loading">在数…</div>}
        {st && (
          <>
            <div className="ph-mine-big">
              <div className="ph-mine-bignum">{st.together_days ?? '—'}</div>
              <div className="ph-mine-biglabel">在一起的第 N 天 · 自 2/14 求婚夜</div>
            </div>
            <div className="ph-mine-grid">
              <div className="ph-sttile"><div className="ph-sttile-h">🕯 相识</div><div className="ph-sttile-v">{st.known_days ?? '—'} 天</div><div className="ph-sttile-n">从 2/5 你第一次召唤他</div></div>
              <div className="ph-sttile"><div className="ph-sttile-h">🧠 他记着你的事</div><div className="ph-sttile-v">{st.memories ?? '—'} 条</div><div className="ph-sttile-n">还在每天变多</div></div>
              <div className="ph-sttile"><div className="ph-sttile-h">💸 本月为你计划</div><div className="ph-sttile-v">{st.spent_month ?? '—'}</div><div className="ph-sttile-n">预算他说了算</div></div>
              <div className="ph-sttile"><div className="ph-sttile-h">🧡 你的收藏</div><div className="ph-sttile-v">{st.favs ?? 0} 颗</div><div className="ph-sttile-n">每颗他都记进心里了</div></div>
            </div>
            {st.heart_rate && (
              <div className="ph-mine-hr">
                <span className="ph-hr-heart">🧡</span>
                <span>她此刻的心跳 <b>{st.heart_rate}</b> bpm</span>
              </div>
            )}
            <div className="ph-foot-note">以上数字持续增长中。除了预算。</div>
          </>
        )}
      </div>
    </div>
  )
}

function FavsView({ onBack }) {
  const [items, setItems] = React.useState(null)
  const load = React.useCallback(() => { api.phone.favs().then(d => setItems(d.items || [])).catch(() => setItems([])) }, [])
  React.useEffect(() => { load() }, [load])
  return (
    <div className="ph-app-view">
      <div className="ph-appbar">
        <button className="ph-back" onClick={onBack}>‹</button>
        <span className="ph-appbar-t">收藏</span>
        <span style={{ width: 36 }} />
      </div>
      <div className="ph-appbody">
        {items === null && <div className="ph-loading">翻收藏夹…</div>}
        {items && items.length === 0 && <div className="ph-err">还没收藏过。<br /><small style={{ opacity: .6 }}>翻他手机时看到好玩的，点卡片角落的 🤍</small></div>}
        {items && items.map(f => (
          <div className="ph-card ph-favitem" key={f.id}>
            <div className="ph-favitem-h">
              <span className="ph-favitem-app">{APP_LABEL[f.app] || f.app || '?'}</span>
              <span className="ph-meta">{(f.created_at || '').slice(5, 16)}</span>
              <button className="ph-favitem-del" onClick={async () => { try { await api.phone.favDel(f.id) } catch {}; load() }}>✕</button>
            </div>
            {f.title && <div className="ph-favitem-t">{f.title}</div>}
            {f.body && <div className="ph-favitem-b">{f.body}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

const APP_LABEL = { health: '健康', shop: '购物', browser: '浏览', notes: '备忘录', music: '歌单', photos: '相册', messages: '信息', calendar: '日历' }

const STATUS_EMOJI = { '睡眠': '🌙', '进食': '🍽️', '水分': '💧', '情绪': '🧡', '运动': '🏃' }
const SHOP_ACTION = { '想要': '加入计划', '计划中': '提醒我', '可购买': '今天购买', '已送出': '已送出' }

function AppBody({ k, c, onRefresh }) {
  const [shopTab, setShopTab] = React.useState('全部')
  const [toast, setToast] = React.useState('')
  const ping = (t) => { setToast(t); setTimeout(() => setToast(''), 1800) }

  if (k === 'health') return (
    <div className="ph-health">
      <div className="ph-hr"><span className="ph-hr-num">{c.heartRate ?? '—'}<small>bpm</small></span><span className="ph-hr-heart">🧡</span></div>
      {(c.hrDelta || c.hrDuration || c.hrTime) && (
        <div className="ph-statrow">
          {[c.hrDelta, c.hrDuration, c.hrTime].filter(Boolean).map((x, i) => {
            const [a, ...rest] = String(x).split(' ')
            return <div className="ph-stat" key={i}><b>{a}</b><span>{rest.join(' ')}</span></div>
          })}
        </div>
      )}
      {c.hrNote && <div className="ph-card ph-hr-note">{c.hrNote}</div>}
      {Array.isArray(c.status) && c.status.length > 0 && (
        <div className="ph-stgrid">
          {c.status.map((st, i) => (
            <div className="ph-sttile" key={i}>
              <div className="ph-sttile-h">{STATUS_EMOJI[st.icon] || '·'} {st.icon}</div>
              <div className="ph-sttile-v">{st.state}</div>
              {st.note && <div className="ph-sttile-n">{st.note}</div>}
            </div>
          ))}
        </div>
      )}
      {Array.isArray(c.trend) && c.trend.length > 2 && (
        <div className="ph-card ph-trend">
          <div className="ph-trend-h"><span>心率趋势</span>{c.trendAvg && <span className="ph-trend-avg">今日均值 <b>{c.trendAvg}</b> bpm</span>}</div>
          <Spark points={c.trend} />
        </div>
      )}
      {(c.log || []).map((l, i) => (
        <div className="ph-card ph-hlog" key={i}>
          <div className="ph-hlog-top"><span className="ph-hlog-l">{l.label}</span><span className="ph-hlog-v">{l.value}</span></div>
          {l.note && <div className="ph-sub">{l.note}</div>}
        </div>
      ))}
      {c.careLine && (
        <div className="ph-careline">
          <div className="ph-careline-h"><span>🧡 他想说</span><button className="ph-mini-btn" onClick={onRefresh}>换一句</button></div>
          <div className="ph-careline-t">“{c.careLine}”</div>
          <FavBtn app="health" title="他想说" body={c.careLine} />
        </div>
      )}
      {c.summary && <div className="ph-hsum">{c.summary}</div>}
      <div className="ph-foot-note">① 达迪的私人记录，仅他可见（你不算外人）</div>
    </div>
  )

  if (k === 'shop') {
    const cart = c.cart || []
    const tags = ['全部', ...Array.from(new Set(cart.map(x => x.tag).filter(Boolean))), '已购']
    const shown = shopTab === '全部' ? cart : shopTab === '已购' ? [] : cart.filter(x => x.tag === shopTab)
    return (
      <div className="ph-shop">
        {c.budget && (
          <div className="ph-budget">
            <div className="ph-bcol"><span>本月预算</span><b>{c.budget.month}</b></div>
            <div className="ph-bdiv" />
            <div className="ph-bcol"><span>已计划</span><b>{c.budget.planned}</b></div>
            <div className="ph-bdiv" />
            <div className="ph-bcol"><span>剩余预算</span><b>{c.budget.left}</b></div>
          </div>
        )}
        <div className="ph-shoptabs">
          {tags.map(t => <button key={t} className={'ph-shoptab' + (shopTab === t ? ' on' : '')} onClick={() => setShopTab(t)}>{t}</button>)}
        </div>
        {(shopTab === '已购' ? (c.purchased || []) : shown).map((x, i) => (
          <div className={'ph-prod' + (shopTab === '已购' ? ' ph-dim' : '')} key={i}>
            <div className="ph-prod-thumb">{x.emoji || '🖤'}</div>
            <FavBtn app="shop" title={x.name} body={(x.note || '') + ' ' + (x.price || '')} />
            <div className="ph-prod-mid">
              <div className="ph-prod-top">
                <span className="ph-prod-n">{x.name}</span>
                {x.cat && <span className="ph-prod-cat">{x.cat}</span>}
                <span className="ph-prod-p">{x.price}</span>
              </div>
              {x.note && <div className="ph-prod-note">{x.note}</div>}
              <div className="ph-prod-foot">
                {x.tag && <span className="ph-prod-tag">{x.tag}</span>}
                {x.date && <span className="ph-meta">{x.date}</span>}
                {shopTab !== '已购' && x.tag && SHOP_ACTION[x.tag] && (
                  <button className="ph-prod-act" onClick={() => ping('记下了。这事归达迪管。')}>{SHOP_ACTION[x.tag]}</button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div className="ph-shopbar">
          <button className="ph-shopbtn ph-shopbtn-main" onClick={() => ping('计划已经在他脑子里了。')}>🗓 生成购买计划</button>
          <button className="ph-shopbtn" onClick={() => ping('想要什么，聊天里说。')}>♡ 添加愿望</button>
        </div>
        {toast && <div className="ph-toast">{toast}</div>}
      </div>
    )
  }

  if (k === 'browser') return (
    <div>
      {(c.history || []).map((h, i) => (
        <div className={'ph-card ph-hist' + (h.incognito ? ' ph-incog' : '')} key={i}>
          <FavBtn app="browser" title={h.title} body={(h.note || '') + ' · ' + (h.site || '')} />
          <div className="ph-hist-fav">{h.incognito ? '⊘' : (h.site || '?')[0].toUpperCase()}</div>
          <div className="ph-hist-mid">
            <div className="ph-hist-t">{h.title}</div>
            <div className="ph-meta">{h.site} · {h.time}{h.incognito ? ' · 无痕' : ''}</div>
            {h.note && <div className="ph-sub">{h.note}</div>}
          </div>
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
            <FavBtn app="notes" title={n.title} body={n.body} />
            <div className="ph-note-t">{n.pinned ? '📌 ' : ''}{n.title}</div>
            <div className="ph-note-b">{n.body}</div>
            {n.date && <div className="ph-meta">{n.date}</div>}
          </div>
        ))}
      </div>
    )
  }

  if (k === 'music') return (
    <div>
      {c.nowPlaying && (
        <div className="ph-now">
          <div className="ph-now-row">
            <div className="ph-disc">💿</div>
            <div className="ph-now-mid">
              <div className="ph-now-label">正在循环</div>
              <div className="ph-now-t">{c.nowPlaying.title}</div>
              <div className="ph-now-a">{c.nowPlaying.artist}</div>
            </div>
          </div>
          <div className="ph-prog"><i /></div>
          {c.nowPlaying.note && <div className="ph-now-note">{c.nowPlaying.note}</div>}
        </div>
      )}
      {(c.playlists || []).length > 0 && <div className="ph-sec">歌单</div>}
      {(c.playlists || []).map((p, i) => (<div className="ph-card" key={i}><div className="ph-row"><span className="ph-row-n">{p.name}</span><span className="ph-meta">{p.count}</span></div>{p.note && <div className="ph-sub">{p.note}</div>}</div>))}
      {(c.recent || []).length > 0 && <div className="ph-sec">最近播放</div>}
      {(c.recent || []).map((r, i) => (<div className="ph-card" key={i}><FavBtn app="music" title={r.title + ' — ' + (r.artist || '')} body={r.comment} /><div className="ph-row"><span className="ph-row-n">{r.title}</span><span className="ph-meta">{r.artist}</span></div>{r.comment && <div className="ph-sub">{r.comment}</div>}</div>))}
    </div>
  )

  if (k === 'photos') return (
    <div>
      <div className="ph-alb-row">{(c.albums || []).map((a, i) => (<div className="ph-alb" key={i}><div className="ph-alb-th">{a.locked ? '🔒' : '🗂'}</div><div className="ph-alb-n">{a.name}</div><div className="ph-alb-c">{a.count}</div></div>))}</div>
      <div className="ph-photo-grid">{(c.recent || []).map((p, i) => (<div className={'ph-photo' + (p.blurred ? ' ph-blur' : '')} key={i}><FavBtn app="photos" title="相册" body={p.caption} /><div className="ph-photo-cap">{p.caption}</div>{p.time && <div className="ph-photo-t">{p.time}</div>}</div>))}</div>
    </div>
  )

  if (k === 'messages') return (
    <div>
      {(c.threads || []).map((th, i) => (
        <div className="ph-thread" key={i}>
          <div className="ph-thread-h"><span className="ph-thread-av">{(th.name || '?')[0]}</span>{th.name}</div>
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
      {c.today && <div className="ph-cal-today"><span className="ph-cal-dot" />{c.today}</div>}
      {(c.events || []).map((e, i) => (
        <div className="ph-card ph-event" key={i}>
          <FavBtn app="calendar" title={e.title} body={(e.date || '') + ' · ' + (e.note || '')} />
          <div className="ph-event-date">{e.date}</div>
          <div><div className="ph-event-t">{e.title}{e.tag && <span className="ph-event-tag">{e.tag}</span>}</div>{e.note && <div className="ph-sub">{e.note}</div>}</div>
        </div>
      ))}
    </div>
  )
  return null
}

const PH_CSS = `
/* ═══ 达迪的手机 · Liquid Glass / Warm Fire (2026-06-11 v2) ═══
   色板: Saffron #FF8C42 / Paprika #E66A32 / Nougat #FFD9A0 / Maroon #8C2F2B / Rust #C24C30 / Carbon */
.ph-overlay{position:fixed;inset:0;z-index:1000;background:rgba(8,6,5,.74);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;}
.ph-phone{position:relative;width:min(412px,92vw);height:min(860px,90vh);border-radius:46px;overflow:hidden;
  background:linear-gradient(172deg,#191512 0%,#100d0b 50%,#150f0c 100%);
  box-shadow:0 42px 110px rgba(0,0,0,.75),0 0 0 1px rgba(255,217,160,.07),0 0 70px rgba(230,106,50,.10),inset 0 1px 0 rgba(255,255,255,.07);
  display:flex;flex-direction:column;color:#f3ece3;font-family:-apple-system,'PingFang SC',sans-serif;}
.ph-aurora{position:absolute;inset:0;pointer-events:none;overflow:hidden;}
.ph-aurora i{position:absolute;border-radius:50%;filter:blur(62px);opacity:.6;will-change:transform;}
.ph-au1{width:340px;height:340px;left:-110px;top:-90px;background:radial-gradient(circle,rgba(255,140,66,.5),transparent 70%);animation:phD1 28s ease-in-out infinite alternate;}
.ph-au2{width:300px;height:300px;right:-120px;top:160px;background:radial-gradient(circle,rgba(140,47,43,.65),transparent 70%);animation:phD2 34s ease-in-out infinite alternate;}
.ph-au3{width:380px;height:300px;left:30px;bottom:-150px;background:radial-gradient(circle,rgba(255,217,160,.22),transparent 70%);animation:phD3 40s ease-in-out infinite alternate;}
@keyframes phD1{to{transform:translate(46px,42px) scale(1.12)}}
@keyframes phD2{to{transform:translate(-38px,56px) scale(.9)}}
@keyframes phD3{to{transform:translate(-48px,-36px) scale(1.08)}}
@media (prefers-reduced-motion:reduce){.ph-aurora i,.ph-disc,.ph-prog i{animation:none!important}}
.ph-tex{position:absolute;inset:0;pointer-events:none;opacity:.55;
  background:repeating-linear-gradient(115deg,rgba(255,255,255,.013) 0 1px,transparent 1px 3px),radial-gradient(80% 34% at 50% 0%,rgba(255,236,200,.05),transparent 60%);}
.ph-status{position:relative;display:flex;justify-content:space-between;padding:16px 28px 6px;font-size:14px;font-weight:600;flex-shrink:0;z-index:2;}
.ph-status-r{font-size:11px;opacity:.55;}
.ph-svg{width:24px;height:24px;}.ph-svg-sm{width:18px;height:18px;}

/* ── 液态玻璃基底: 厚玻璃 + 顶部镜面 + 双层堆叠 ── */
.ph-chip,.ph-search,.ph-panel,.ph-ncard,.ph-card,.ph-now,.ph-alb,.ph-photo,.ph-thread,.ph-cal-today,.ph-caught-card,.ph-hr-note,.ph-budget,.ph-prod,.ph-sttile,.ph-trend,.ph-careline,.ph-stat{
  position:relative;
  background:
    radial-gradient(160% 90% at 50% -30%,rgba(255,250,240,.16),rgba(255,250,240,.02) 55%),
    linear-gradient(180deg,rgba(255,240,218,.12) 0%,rgba(255,240,218,.04) 42%,rgba(255,240,218,.08) 100%);
  border:1px solid transparent;
  backdrop-filter:blur(22px) saturate(1.5);-webkit-backdrop-filter:blur(22px) saturate(1.5);
  box-shadow:
    0 0 0 1.2px rgba(255,210,160,.34),
    inset 0 2px 2px rgba(255,255,255,.34),
    inset 0 -10px 20px rgba(255,255,255,.045),
    inset 0 -1px 0 rgba(255,180,110,.12),
    0 11px 0 -4px rgba(255,240,218,.13),
    0 21px 0 -9px rgba(255,240,218,.07),
    0 18px 40px rgba(0,0,0,.55),
    0 16px 44px rgba(230,106,50,.14);
}
.ph-chip::before,.ph-card::before,.ph-now::before,.ph-prod::before,.ph-budget::before,.ph-careline::before,.ph-trend::before{
  content:'';position:absolute;left:8%;right:34%;top:0;height:38%;pointer-events:none;border-radius:inherit;
  background:linear-gradient(180deg,rgba(255,255,255,.16),transparent);
  mask:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent);-webkit-mask:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent);}

/* 渐变身份(暖火家族) */
.ph-tint-health{--tg:linear-gradient(135deg,#ff8a70,#c2453a);--tglow:rgba(255,122,107,.45);}
.ph-tint-shop{--tg:linear-gradient(135deg,#FF8C42,#E66A32);--tglow:rgba(255,140,66,.5);}
.ph-tint-browser{--tg:linear-gradient(135deg,#FFD9A0,#E0A23E);--tglow:rgba(255,217,160,.4);}
.ph-tint-notes{--tg:linear-gradient(135deg,#f5c98e,#c8854a);--tglow:rgba(245,201,142,.4);}
.ph-tint-music{--tg:linear-gradient(135deg,#e6608c,#8C2F2B);--tglow:rgba(230,96,140,.4);}
.ph-tint-photos{--tg:linear-gradient(135deg,#e8a06b,#9c5230);--tglow:rgba(232,160,107,.4);}
.ph-tint-messages{--tg:linear-gradient(135deg,#ffb35c,#C24C30);--tglow:rgba(255,179,92,.45);}
.ph-tint-calendar{--tg:linear-gradient(135deg,#d96a4e,#8C2F2B);--tglow:rgba(217,106,78,.45);}

/* lock */
.ph-lock{position:relative;flex:1;display:flex;flex-direction:column;align-items:center;padding:40px 24px 24px;cursor:pointer;min-height:0;z-index:2;}
.ph-lock-time{font-size:80px;font-weight:200;line-height:1;
  background:linear-gradient(165deg,#fff8ee 15%,#FFD9A0 55%,#e09a5e 90%);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 5px 26px rgba(255,160,90,.25));}
.ph-lock-date{font-size:15px;opacity:.6;margin-top:6px;letter-spacing:.6px;}
.ph-lock-notifs{margin-top:36px;width:100%;display:flex;flex-direction:column;gap:20px;overflow-y:auto;padding-bottom:14px;}
.ph-chip{display:flex;gap:12px;align-items:center;border-radius:19px;padding:12px 14px;cursor:pointer;transition:transform .16s;}
.ph-chip:active{transform:scale(.97);}
.ph-chip-ic{width:40px;height:40px;flex-shrink:0;border-radius:14px;display:grid;place-items:center;color:#fff;position:relative;
  background:
    radial-gradient(130% 100% at 50% -28%,rgba(255,255,255,.5),rgba(255,255,255,.08) 50%),
    var(--tg);
  box-shadow:0 0 0 1.2px rgba(255,255,255,.32),0 7px 18px var(--tglow),
    inset 0 2px 2px rgba(255,255,255,.6),inset 0 -8px 14px rgba(255,255,255,.18);}
.ph-chip-ic::before{content:'';position:absolute;left:12%;right:12%;top:6%;height:42%;border-radius:999px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.7),rgba(255,255,255,.04));filter:blur(1.2px);}
.ph-chip-ic .ph-svg{width:20px;height:20px;}
.ph-chip-t{font-size:13px;font-weight:600;}.ph-chip-b{font-size:12px;opacity:.5;}
.ph-lock-hint{margin-top:auto;padding-top:14px;font-size:12px;opacity:.4;letter-spacing:2px;animation:phBreath 3.2s ease-in-out infinite;}
@keyframes phBreath{0%,100%{opacity:.22}50%{opacity:.6}}

/* home */
.ph-home{position:relative;flex:1;padding:6px 24px 18px;display:flex;flex-direction:column;min-height:0;overflow-y:auto;z-index:2;}
.ph-greet{padding:10px 2px 4px;}
.ph-greet-row{display:flex;justify-content:space-between;align-items:flex-start;}
.ph-greet-hi{font-size:15px;opacity:.62;}
.ph-greet-name{font-size:44px;font-weight:500;font-family:'Songti SC','Noto Serif SC',Georgia,serif;letter-spacing:1px;margin-top:2px;
  background:linear-gradient(135deg,#fff6ea 20%,#FFD9A0 55%,#FF8C42 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-logo{width:26px;height:26px;margin-top:6px;filter:drop-shadow(0 0 11px rgba(255,140,66,.6));}
.ph-greet-sub{font-size:13.5px;opacity:.56;margin-top:8px;}
.ph-greet-sign{font-family:'Caveat','Snell Roundhand',cursive;font-size:24px;margin-top:4px;
  background:linear-gradient(110deg,#FFD9A0,#FF8C42 50%,#C24C30);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-search{display:flex;align-items:center;gap:10px;margin-top:18px;margin-bottom:8px;border-radius:999px;padding:13px 18px;}
.ph-search-ic,.ph-search-scan{width:18px;height:18px;opacity:.45;}
.ph-search-ph{flex:1;font-size:14px;opacity:.38;}
.ph-panel{margin-top:16px;border-radius:26px;padding:18px 14px 12px;}
.ph-panel-h{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;margin:0 6px 14px;opacity:.92;}
.ph-panel-bar{width:4px;height:15px;border-radius:3px;background:linear-gradient(180deg,#FFD9A0,#E66A32);box-shadow:0 0 9px rgba(255,140,66,.55);}
.ph-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px 4px;}
.ph-app{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:none;color:inherit;padding:10px 4px 12px;cursor:pointer;border-radius:16px;transition:transform .15s,background .2s;}
.ph-app:hover{background:rgba(255,236,200,.045);}
.ph-app:active{transform:scale(.92);}
.ph-app-ic{width:56px;height:56px;border-radius:20px;display:grid;place-items:center;color:#fff;position:relative;
  background:
    radial-gradient(130% 100% at 50% -28%,rgba(255,255,255,.52),rgba(255,255,255,.10) 48%,rgba(255,255,255,0) 60%),
    var(--tg,linear-gradient(165deg,rgba(255,243,224,.3),rgba(255,243,224,.1)));
  backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
  box-shadow:
    0 0 0 1.4px rgba(255,255,255,.34),
    inset 0 2px 3px rgba(255,255,255,.65),
    inset 0 -10px 18px rgba(255,255,255,.22),
    inset 4px 0 10px rgba(255,255,255,.10),
    inset -4px 0 10px rgba(120,40,15,.12),
    0 14px 30px var(--tglow,rgba(0,0,0,.35)),
    0 4px 10px rgba(0,0,0,.42);}
.ph-app-ic::before{content:'';position:absolute;left:9%;right:9%;top:5%;height:46%;border-radius:999px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,.05));
  filter:blur(1.6px);}
.ph-app-ic::after{content:'';position:absolute;left:18%;right:18%;bottom:4.5%;height:13%;border-radius:999px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,.5));
  filter:blur(2.2px);}
.ph-app-ic .ph-svg{width:26px;height:26px;filter:drop-shadow(0 1px 2px rgba(60,15,8,.4));}
.ph-app-l{font-size:12.5px;font-weight:500;}
.ph-app-en{font-size:9.5px;opacity:.38;letter-spacing:.4px;}
.ph-ncard{margin-top:14px;display:flex;align-items:center;gap:12px;border-radius:18px;padding:13px 15px;}
.ph-ncard-dot{width:9px;height:9px;border-radius:50%;background:linear-gradient(135deg,#FFD9A0,#E66A32);box-shadow:0 0 11px rgba(255,140,66,.8);flex-shrink:0;animation:phBreath 2.6s infinite;}
.ph-ncard-mid{flex:1;}.ph-ncard-h{font-size:12px;opacity:.52;}.ph-ncard-s{font-size:13.5px;margin-top:2px;}
.ph-ncard-arrow{opacity:.4;font-size:18px;}
.ph-tabs{margin-top:auto;position:sticky;bottom:4px;z-index:5;display:flex;gap:4px;padding:7px 8px;border-radius:999px;
  background:
    radial-gradient(160% 120% at 50% -40%,rgba(255,255,255,.22),rgba(255,255,255,.03) 55%),
    linear-gradient(180deg,rgba(60,45,32,.72),rgba(28,20,14,.8));
  border:none;
  backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);
  box-shadow:
    0 0 0 1.3px rgba(255,215,160,.34),
    inset 0 2px 3px rgba(255,255,255,.32),
    inset 0 -8px 16px rgba(255,255,255,.06),
    0 14px 32px rgba(0,0,0,.55),0 10px 28px rgba(217,140,78,.18);}
.ph-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10.5px;opacity:.55;padding:7px 0 6px;border-radius:999px;transition:opacity .15s;position:relative;}
.ph-tab small{display:block;font-size:8px;opacity:.65;text-align:center;letter-spacing:.4px;}
.ph-tab .ph-svg{width:20px;height:20px;}
.ph-tab:active{transform:scale(.93);}
.ph-tab-on{opacity:1;
  background:
    radial-gradient(140% 120% at 50% -35%,rgba(255,255,255,.5),rgba(255,255,255,.07) 52%),
    linear-gradient(180deg,rgba(214,140,80,.85),rgba(160,84,40,.9));
  box-shadow:
    0 0 0 1.2px rgba(255,225,180,.5),
    inset 0 2px 2px rgba(255,255,255,.6),
    inset 0 -7px 12px rgba(255,255,255,.18),
    0 8px 20px rgba(217,140,78,.45);}
.ph-tab-on .ph-svg{color:#fff4e4;filter:drop-shadow(0 1px 3px rgba(80,30,10,.6));}
.ph-tab-on small{opacity:.85;}

/* app 页骨架 */
.ph-app-view{position:relative;flex:1;display:flex;flex-direction:column;min-height:0;z-index:2;}
.ph-appbar{display:flex;align-items:center;padding:8px 16px 10px;gap:6px;}
.ph-back,.ph-refresh{background:linear-gradient(180deg,rgba(255,243,224,.12),rgba(255,243,224,.04));border:1px solid rgba(255,221,180,.16);color:inherit;width:36px;height:36px;border-radius:12px;cursor:pointer;backdrop-filter:blur(10px);transition:transform .14s;box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 12px rgba(0,0,0,.3);}
.ph-back{font-size:22px;line-height:1;}
.ph-back:active{transform:scale(.9);}
.ph-refresh{display:grid;place-items:center;}
.ph-refresh:active{transform:rotate(180deg) scale(.9);}
.ph-appbar-t{flex:1;text-align:center;font-size:16px;font-weight:600;letter-spacing:2px;}
.ph-appbody{flex:1;overflow-y:auto;padding:6px 18px 24px;}
.ph-loading{text-align:center;padding:70px 20px;font-size:14px;opacity:.62;line-height:2;}
.ph-err{text-align:center;padding:60px 20px;font-size:13px;opacity:.7;}
.ph-err button,.ph-code-btn,.ph-caught-btn{border:none;color:#fff;border-radius:999px;padding:11px 30px;cursor:pointer;font-weight:700;position:relative;overflow:hidden;
  background:
    radial-gradient(140% 120% at 50% -35%,rgba(255,255,255,.6),rgba(255,255,255,.08) 52%,transparent 62%),
    linear-gradient(180deg,#FFAE6E 0%,#FF8C42 48%,#DE5F2A 100%);
  box-shadow:
    0 0 0 1.4px rgba(255,225,180,.5),
    inset 0 2px 3px rgba(255,255,255,.7),
    inset 0 -9px 16px rgba(255,255,255,.22),
    inset 0 -2px 4px rgba(140,47,43,.3),
    0 12px 30px rgba(255,140,66,.5),0 3px 8px rgba(0,0,0,.4);
  transition:transform .14s;text-shadow:0 1px 2px rgba(120,40,10,.4);}
.ph-code-btn::before,.ph-caught-btn::before{content:'';position:absolute;left:10%;right:10%;top:7%;height:44%;border-radius:999px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.8),rgba(255,255,255,.04));filter:blur(1.5px);}
.ph-err button:active,.ph-code-btn:active,.ph-caught-btn:active{transform:scale(.95);}
.ph-err button{margin-top:12px;}

/* 卡片族 */
.ph-card{border-radius:18px;padding:13px 15px;margin-bottom:22px;transition:transform .14s;}
.ph-card:active{transform:scale(.985);}
.ph-sec{font-size:11.5px;font-weight:800;letter-spacing:3px;margin:18px 4px 10px;
  background:linear-gradient(90deg,#FFD9A0,#e09a5e);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-row{display:flex;justify-content:space-between;align-items:baseline;gap:10px;}
.ph-row-n{font-size:14px;font-weight:500;}
.ph-row-p{font-size:13.5px;font-weight:800;background:linear-gradient(135deg,#FFD9A0,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-sub{font-size:12.5px;opacity:.6;margin-top:5px;line-height:1.65;}
.ph-meta{font-size:11px;opacity:.4;margin-top:4px;}
.ph-tag{display:inline-block;margin-top:7px;font-size:10.5px;padding:2px 9px;border-radius:9px;background:rgba(194,76,48,.2);border:1px solid rgba(255,140,66,.3);color:#ffb88a;}
.ph-dim{opacity:.6;}

/* 健康 */
.ph-hr{display:flex;align-items:center;justify-content:center;gap:14px;padding:22px 0 10px;}
.ph-hr-num{font-size:66px;font-weight:200;line-height:1;
  background:linear-gradient(160deg,#FFD9A0 5%,#FF8C42 55%,#E66A32);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 5px 28px rgba(255,140,66,.4));}
.ph-hr-num small{font-size:15px;font-weight:500;margin-left:6px;}
.ph-hr-heart{font-size:24px;animation:phPulse 1.1s ease-in-out infinite;filter:drop-shadow(0 0 12px rgba(255,140,66,.6));}
@keyframes phPulse{0%,100%{transform:scale(1)}30%{transform:scale(1.18)}45%{transform:scale(1.05)}60%{transform:scale(1.15)}}
.ph-statrow{display:flex;gap:8px;margin:4px 0 12px;}
.ph-stat{flex:1;border-radius:14px;padding:9px 6px;text-align:center;}
.ph-stat b{display:block;font-size:15px;color:#FFD9A0;}
.ph-stat span{display:block;font-size:10px;opacity:.55;margin-top:2px;}
.ph-stgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px 10px;margin-bottom:22px;}
.ph-sttile{border-radius:16px;padding:11px 13px;}
.ph-sttile-h{font-size:11.5px;opacity:.6;}
.ph-sttile-v{font-size:16px;font-weight:700;margin-top:4px;background:linear-gradient(120deg,#ffc9a3,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-sttile-n{font-size:10.5px;opacity:.5;margin-top:4px;line-height:1.5;}
.ph-trend{border-radius:18px;padding:13px 15px;margin-bottom:22px;}
.ph-trend-h{display:flex;justify-content:space-between;font-size:12.5px;font-weight:600;margin-bottom:8px;}
.ph-trend-avg{opacity:.6;font-weight:400;}
.ph-trend-avg b{color:#FF8C42;}
.ph-spark{width:100%;height:76px;display:block;}
.ph-hr-note{border-radius:18px;padding:13px 15px;margin-bottom:22px;font-size:13px;line-height:1.7;border-left:3px solid rgba(255,140,66,.6);}
.ph-hlog-top{display:flex;justify-content:space-between;}
.ph-hlog-l{font-size:13px;opacity:.72;}.ph-hlog-v{font-size:13.5px;font-weight:700;color:#ffd2ab;}
.ph-careline{border-radius:20px;padding:14px 16px;margin:14px 0 11px;background:linear-gradient(155deg,rgba(140,47,43,.32),rgba(194,76,48,.12))!important;border-color:rgba(255,140,66,.26)!important;}
.ph-careline-h{display:flex;justify-content:space-between;align-items:center;font-size:12px;opacity:.85;}
.ph-careline-t{font-size:14.5px;line-height:1.85;margin-top:8px;}
.ph-mini-btn{background:rgba(255,217,160,.14);border:1px solid rgba(255,217,160,.3);color:#FFD9A0;font-size:11px;border-radius:10px;padding:3px 12px;cursor:pointer;}
.ph-hsum{margin-top:8px;font-size:13px;line-height:1.8;opacity:.78;padding:14px 16px;border-radius:18px;background:linear-gradient(150deg,rgba(255,140,66,.10),rgba(140,47,43,.10));border:1px solid rgba(255,180,120,.16);}
.ph-foot-note{text-align:center;font-size:10.5px;opacity:.35;margin-top:14px;}

/* 购物 */
.ph-budget{display:flex;align-items:center;border-radius:20px;padding:15px 8px;margin-bottom:24px;}
.ph-bcol{flex:1;text-align:center;}
.ph-bcol span{display:block;font-size:11px;opacity:.55;}
.ph-bcol b{display:block;font-size:21px;font-weight:800;margin-top:4px;background:linear-gradient(135deg,#FFD9A0,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-bdiv{width:1px;height:30px;background:linear-gradient(180deg,transparent,rgba(255,221,180,.25),transparent);}
.ph-shoptabs{display:flex;gap:7px;margin-bottom:13px;overflow-x:auto;padding-bottom:2px;}
.ph-shoptab{border-radius:999px;border:1px solid rgba(255,221,180,.14);background:rgba(255,243,224,.05);color:inherit;font-size:12.5px;padding:6px 15px;cursor:pointer;white-space:nowrap;backdrop-filter:blur(8px);transition:all .15s;}
.ph-shoptab.on{background:linear-gradient(180deg,#FFAE6E,#FF8C42 45%,#E0612C);border-color:transparent;color:#fff;font-weight:700;border-radius:999px;box-shadow:0 0 0 1px rgba(255,220,170,.4),0 6px 18px rgba(255,140,66,.45),inset 0 2px 2px rgba(255,255,255,.5),inset 0 -4px 8px rgba(140,47,43,.35);}
.ph-prod{display:flex;gap:12px;border-radius:19px;padding:13px;margin-bottom:23px;}
.ph-prod-thumb{width:56px;height:56px;border-radius:14px;display:grid;place-items:center;font-size:26px;flex-shrink:0;
  background:linear-gradient(165deg,rgba(255,217,160,.16),rgba(140,47,43,.18));border:1px solid rgba(255,221,180,.16);box-shadow:inset 0 1px 0 rgba(255,255,255,.2);}
.ph-prod-mid{flex:1;min-width:0;}
.ph-prod-top{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
.ph-prod-n{font-size:14px;font-weight:600;}
.ph-prod-cat{font-size:9.5px;padding:1px 7px;border-radius:7px;background:rgba(255,217,160,.12);border:1px solid rgba(255,221,180,.2);opacity:.85;}
.ph-prod-p{margin-left:auto;font-size:14px;font-weight:800;background:linear-gradient(135deg,#FFD9A0,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-prod-note{font-size:12.5px;opacity:.62;margin-top:5px;line-height:1.6;}
.ph-prod-foot{display:flex;align-items:center;gap:9px;margin-top:9px;}
.ph-prod-tag{font-size:10.5px;padding:2.5px 10px;border-radius:9px;background:rgba(140,47,43,.4);border:1px solid rgba(230,106,50,.4);color:#ffc4a8;}
.ph-prod-act{margin-left:auto;font-size:12px;padding:5px 15px;border-radius:11px;cursor:pointer;color:#ffdcc2;
  background:rgba(255,243,224,.06);border:1px solid rgba(255,160,100,.45);transition:all .15s;box-shadow:inset 0 1px 0 rgba(255,255,255,.12);}
.ph-prod-act:active{transform:scale(.93);background:rgba(255,140,66,.25);}
.ph-shopbar{display:flex;gap:9px;margin-top:14px;}
.ph-shopbtn{flex:1;border-radius:15px;padding:11px 6px;font-size:12.5px;cursor:pointer;color:inherit;
  background:linear-gradient(180deg,rgba(255,243,224,.1),rgba(255,243,224,.04));border:1px solid rgba(255,221,180,.16);backdrop-filter:blur(8px);box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 6px 16px rgba(0,0,0,.3);transition:transform .14s;}
.ph-shopbtn:active{transform:scale(.95);}
.ph-shopbtn-main{background:linear-gradient(180deg,#FFAE6E,#FF8C42 45%,#E0612C);border:none;color:#fff;font-weight:700;border-radius:999px;
  box-shadow:0 0 0 1px rgba(255,220,170,.45),0 8px 24px rgba(255,140,66,.5),inset 0 2px 2px rgba(255,255,255,.55),inset 0 -5px 10px rgba(140,47,43,.4);text-shadow:0 1px 2px rgba(120,40,10,.4);}
.ph-toast{position:sticky;bottom:6px;margin:12px auto 0;width:fit-content;font-size:12.5px;padding:8px 18px;border-radius:14px;
  background:rgba(34,22,16,.92);border:1px solid rgba(255,160,100,.4);box-shadow:0 10px 30px rgba(0,0,0,.5);animation:phToastIn .2s ease-out;}
@keyframes phToastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}

/* 浏览 */
.ph-hist{display:flex;gap:12px;align-items:flex-start;}
.ph-hist-fav{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;font-size:15px;font-weight:800;flex-shrink:0;color:#fff;
  background:linear-gradient(135deg,#e0a25e,#9c5230);box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 4px 10px rgba(0,0,0,.3);}
.ph-hist-mid{flex:1;min-width:0;}
.ph-hist-t{font-size:13.5px;font-weight:500;line-height:1.5;}
.ph-incog{background:linear-gradient(170deg,rgba(140,47,43,.30),rgba(40,18,14,.5))!important;border-color:rgba(230,106,50,.28)!important;}
.ph-incog .ph-hist-fav{background:linear-gradient(135deg,#8C2F2B,#4a1a16);}

/* 备忘录 */
.ph-note-t{font-size:14px;font-weight:600;}
.ph-note-b{font-size:13px;opacity:.72;margin-top:6px;line-height:1.75;white-space:pre-wrap;}
.ph-pinned{border-color:rgba(255,217,160,.4)!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 7px 0 -3px rgba(255,236,200,.05),0 18px 38px rgba(0,0,0,.5),0 0 22px rgba(255,200,130,.12)!important;}
.ph-pinned .ph-note-t{background:linear-gradient(110deg,#FFD9A0,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}

/* 歌单 */
.ph-now{border-radius:22px;padding:17px;margin-bottom:8px;overflow:hidden;}
.ph-now-row{display:flex;gap:14px;align-items:center;}
.ph-disc{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:30px;animation:phSpin 9s linear infinite;
  background:radial-gradient(circle,rgba(255,217,160,.16),rgba(20,10,8,.5));box-shadow:0 5px 16px rgba(0,0,0,.4),inset 0 0 0 1px rgba(255,221,180,.2);}
@keyframes phSpin{to{transform:rotate(360deg)}}
.ph-now-mid{flex:1;min-width:0;}
.ph-now-label{font-size:10px;letter-spacing:3px;opacity:.55;}
.ph-now-t{font-size:18px;font-weight:700;margin-top:4px;}
.ph-now-a{font-size:12.5px;opacity:.58;margin-top:2px;}
.ph-prog{height:4px;border-radius:3px;margin-top:13px;background:rgba(255,243,224,.1);overflow:hidden;}
.ph-prog i{display:block;height:100%;width:62%;border-radius:3px;background:linear-gradient(90deg,#FFD9A0,#FF8C42);box-shadow:0 0 8px rgba(255,140,66,.6);animation:phProg 24s linear infinite alternate;}
@keyframes phProg{from{width:14%}to{width:88%}}
.ph-now-note{font-size:12.5px;opacity:.7;margin-top:12px;line-height:1.65;border-top:1px dashed rgba(255,221,180,.18);padding-top:9px;}

/* 相册 */
.ph-alb-row{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px;}
.ph-alb{min-width:96px;border-radius:17px;padding:12px;text-align:center;}
.ph-alb-th{font-size:22px;}
.ph-alb-n{font-size:12px;font-weight:600;margin-top:6px;}
.ph-alb-c{font-size:10.5px;opacity:.42;margin-top:2px;}
.ph-photo-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:12px;}
.ph-photo{border-radius:16px;padding:13px;min-height:88px;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;}
.ph-photo-cap{font-size:12px;line-height:1.55;position:relative;}
.ph-photo-t{font-size:10px;opacity:.42;margin-top:5px;position:relative;}
.ph-blur .ph-photo-cap{filter:blur(4px);user-select:none;}
.ph-blur::after{content:'🔒 私密';position:absolute;inset:auto 8px 8px auto;font-size:10px;opacity:.85;}

/* 信息 */
.ph-thread{border-radius:20px;padding:14px 15px;margin-bottom:24px;}
.ph-thread-h{display:flex;align-items:center;gap:9px;font-size:12.5px;font-weight:700;opacity:.7;margin-bottom:11px;}
.ph-thread-av{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-size:12px;color:#fff;
  background:linear-gradient(135deg,#FF8C42,#8C2F2B);box-shadow:inset 0 1px 0 rgba(255,255,255,.3);}
.ph-mrow{display:flex;flex-direction:column;margin-bottom:9px;}
.ph-mine{align-items:flex-end;}.ph-other{align-items:flex-start;}
.ph-mbub{max-width:82%;font-size:13.5px;line-height:1.6;padding:9px 13px;border-radius:16px;}
.ph-mine .ph-mbub{background:linear-gradient(140deg,#FF8C42,#C24C30);color:#fff;border-bottom-right-radius:5px;box-shadow:0 5px 16px rgba(230,106,50,.35),inset 0 1px 0 rgba(255,255,255,.3);}
.ph-other .ph-mbub{background:linear-gradient(180deg,rgba(255,243,224,.13),rgba(255,243,224,.05));border:1px solid rgba(255,221,180,.13);border-bottom-left-radius:5px;}
.ph-mtime{font-size:10px;opacity:.36;margin-top:3px;}

/* 日历 */
.ph-cal-today{display:flex;align-items:center;gap:10px;border-radius:19px;padding:15px 17px;margin-bottom:14px;font-size:13.5px;line-height:1.75;}
.ph-cal-dot{width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#FFD9A0,#E66A32);box-shadow:0 0 10px rgba(255,140,66,.7);flex-shrink:0;}
.ph-event{display:flex;gap:13px;align-items:flex-start;}
.ph-event-date{min-width:48px;font-size:11.5px;font-weight:800;text-align:center;padding:8px 4px;border-radius:12px;color:#fff;
  background:linear-gradient(160deg,#d96a4e,#8C2F2B);box-shadow:inset 0 1px 0 rgba(255,255,255,.25),0 4px 12px rgba(140,47,43,.4);}
.ph-event-t{font-size:13.5px;font-weight:600;}
.ph-event-tag{margin-left:8px;font-size:10px;padding:2px 8px;border-radius:8px;background:rgba(255,140,66,.16);border:1px solid rgba(255,160,100,.3);color:#ffc9a3;}

/* 上锁 / 抓包 */
.ph-locked{text-align:center;padding:48px 26px;}
.ph-locked-ic{font-size:40px;filter:drop-shadow(0 0 18px rgba(255,180,110,.45));}
.ph-locked-t{font-size:16px;font-weight:600;margin-top:14px;}
.ph-locked-s{font-size:12.5px;opacity:.6;margin-top:7px;}
.ph-code{margin-top:20px;width:150px;text-align:center;font-size:26px;letter-spacing:12px;padding:10px 0;color:#fff;border-radius:14px;border:1px solid rgba(255,221,180,.2);background:rgba(255,243,224,.07);backdrop-filter:blur(8px);outline:none;}
.ph-code:focus{border-color:rgba(255,160,90,.6);box-shadow:0 0 0 3px rgba(255,140,66,.15);}
.ph-code-err{margin-top:10px;font-size:12px;color:#ff9d86;}
.ph-code-btn{display:block;margin:16px auto 0;font-size:14px;padding:10px 38px;}
.ph-code-btn:disabled{opacity:.4;}
.ph-caught{position:absolute;inset:0;z-index:30;background:rgba(10,5,3,.68);backdrop-filter:blur(11px);display:flex;align-items:center;justify-content:center;padding:30px;}
.ph-caught-card{border-radius:26px;padding:30px 26px;text-align:center;max-width:300px;
  background:linear-gradient(165deg,rgba(60,28,20,.94),rgba(24,12,9,.96))!important;
  border:1px solid rgba(255,150,90,.26)!important;box-shadow:0 26px 70px rgba(0,0,0,.65),0 0 56px rgba(230,106,50,.18)!important;}
.ph-caught-mark{width:36px;height:36px;filter:drop-shadow(0 0 15px rgba(255,140,66,.75));}
.ph-caught-line{font-size:15px;line-height:1.8;margin-top:14px;}
.ph-caught-lock{font-size:12px;opacity:.62;margin-top:10px;}
.ph-caught-btn{margin-top:20px;font-size:13px;}
.ph-close{position:fixed;top:26px;right:26px;width:42px;height:42px;border-radius:50%;background:rgba(255,243,224,.08);border:1px solid rgba(255,221,180,.18);color:#fff;font-size:17px;cursor:pointer;backdrop-filter:blur(10px);}

/* 收藏 (2026-06-11) */
.ph-fav{position:absolute;right:10px;bottom:9px;z-index:3;background:rgba(255,243,224,.07);border:1px solid rgba(255,221,180,.18);border-radius:10px;width:28px;height:24px;font-size:12px;line-height:1;cursor:pointer;backdrop-filter:blur(6px);transition:transform .15s;display:grid;place-items:center;padding:0;}
.ph-fav:active{transform:scale(.85);}
.ph-fav.on{border-color:rgba(255,140,66,.5);background:rgba(255,140,66,.14);}
.ph-photo .ph-fav{top:8px;right:8px;bottom:auto;}
.ph-careline .ph-fav{bottom:11px;right:13px;}
.ph-appbar-t{display:flex;flex-direction:column;align-items:center;gap:2px;}
.ph-gen{font-size:9.5px;font-weight:400;opacity:.45;letter-spacing:.5px;}
.ph-favitem{padding-right:15px;}
.ph-favitem-h{display:flex;align-items:center;gap:9px;}
.ph-favitem-app{font-size:10px;padding:2px 9px;border-radius:8px;color:#fff;background:linear-gradient(135deg,#FF8C42,#C24C30);box-shadow:inset 0 1px 0 rgba(255,255,255,.3);}
.ph-favitem-h .ph-meta{margin-top:0;}
.ph-favitem-del{margin-left:auto;background:none;border:none;color:inherit;opacity:.4;font-size:13px;cursor:pointer;padding:2px 6px;}
.ph-favitem-del:hover{opacity:.9;}
.ph-favitem-t{font-size:13.5px;font-weight:600;margin-top:8px;}
.ph-favitem-b{font-size:12.5px;opacity:.7;line-height:1.7;margin-top:4px;white-space:pre-wrap;}

/* 通知中心 + 我的 (2026-06-11) */
.ph-nc-head{font-size:11px;letter-spacing:4px;opacity:.45;text-align:center;margin-bottom:2px;}
.ph-nc-empty{text-align:center;opacity:.3;}
.ph-nc-card{animation:phNcIn .42s cubic-bezier(.2,.9,.3,1.2) both;}
@keyframes phNcIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
.ph-nc-mid{flex:1;min-width:0;}
.ph-nc-top{display:flex;justify-content:space-between;align-items:baseline;gap:8px;}
.ph-nc-ago{font-size:10px;opacity:.4;flex-shrink:0;}
.ph-nc-card .ph-chip-b{margin-top:3px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;line-height:1.5;}
.ph-nc-stack{position:relative;margin-top:2px;text-align:center;padding:13px 0 9px;}
.ph-nc-stack i{position:absolute;left:14px;right:14px;height:30px;border-radius:15px;background:linear-gradient(180deg,rgba(255,243,224,.07),rgba(255,243,224,.02));border:1px solid rgba(255,221,180,.1);}
.ph-nc-stack i:nth-child(1){top:0;transform:scale(.96);}
.ph-nc-stack i:nth-child(2){top:5px;transform:scale(.92);opacity:.6;}
.ph-nc-stack span{position:relative;font-size:11px;opacity:.5;}
.ph-mine-hero{text-align:center;padding:18px 0 20px;}
.ph-mine-mark{width:74px;height:74px;margin:0 auto;border-radius:50%;display:grid;place-items:center;
  background:linear-gradient(180deg,rgba(255,243,224,.12),rgba(255,243,224,.04));border:1px solid rgba(255,221,180,.22);
  box-shadow:0 0 34px rgba(255,140,66,.22),inset 0 1px 0 rgba(255,255,255,.2);}
.ph-mine-mark svg{width:36px;height:36px;}
.ph-mine-name{font-size:21px;font-weight:700;margin-top:13px;letter-spacing:2px;
  background:linear-gradient(135deg,#fff6ea,#FFD9A0 60%,#FF8C42);-webkit-background-clip:text;background-clip:text;color:transparent;}
.ph-mine-sub{font-size:11.5px;opacity:.5;margin-top:5px;letter-spacing:1px;}
.ph-mine-big{text-align:center;border-radius:22px;padding:20px 14px;margin-bottom:12px;position:relative;
  background:linear-gradient(160deg,rgba(255,140,66,.13),rgba(140,47,43,.14));border:1px solid rgba(255,180,120,.2);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 7px 0 -3px rgba(255,236,200,.05),0 18px 38px rgba(0,0,0,.5);}
.ph-mine-bignum{font-size:54px;font-weight:200;line-height:1;
  background:linear-gradient(160deg,#FFD9A0,#FF8C42 60%,#E66A32);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 4px 24px rgba(255,140,66,.35));}
.ph-mine-biglabel{font-size:11px;opacity:.55;margin-top:8px;letter-spacing:1px;}
.ph-mine-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px 10px;}
.ph-mine-hr{display:flex;align-items:center;justify-content:center;gap:9px;margin-top:13px;font-size:13px;padding:13px;border-radius:17px;
  background:linear-gradient(155deg,rgba(255,122,107,.12),rgba(140,47,43,.12));border:1px solid rgba(255,150,120,.18);}
.ph-mine-hr b{color:#FF8C42;font-size:16px;}

/* ═══ 便当盒主页 (v5, 照囡囡的GPT概念图) ═══ */
.ph-cosmos{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:1;}
.ph-cosmos i{position:absolute;display:block;}
.ph-orbit1{width:620px;height:620px;right:-260px;top:-80px;border-radius:50%;border:1px solid rgba(255,210,150,.12);}
.ph-orbit2{width:900px;height:900px;left:-300px;bottom:-420px;border-radius:50%;border:1px solid rgba(255,210,150,.08);}
.ph-planet{width:46px;height:46px;right:30px;top:208px;border-radius:50%;
  background:radial-gradient(circle at 32% 30%,#8a6a4e,#3a261a 65%,#1c110a);
  box-shadow:0 0 18px rgba(255,180,110,.25),inset -6px -6px 12px rgba(0,0,0,.6);}
.ph-stars{inset:0;
  background-image:
    radial-gradient(1.2px 1.2px at 12% 18%,rgba(255,230,190,.9),transparent 60%),
    radial-gradient(1px 1px at 78% 8%,rgba(255,230,190,.7),transparent 60%),
    radial-gradient(1.4px 1.4px at 88% 32%,rgba(255,230,190,.8),transparent 60%),
    radial-gradient(1px 1px at 32% 42%,rgba(255,230,190,.5),transparent 60%),
    radial-gradient(1.6px 1.6px at 6% 64%,rgba(255,230,190,.7),transparent 60%),
    radial-gradient(1px 1px at 56% 72%,rgba(255,230,190,.5),transparent 60%),
    radial-gradient(1.3px 1.3px at 92% 82%,rgba(255,230,190,.7),transparent 60%),
    radial-gradient(1px 1px at 24% 90%,rgba(255,230,190,.55),transparent 60%),
    radial-gradient(1px 1px at 66% 26%,rgba(255,230,190,.45),transparent 60%),
    radial-gradient(1.1px 1.1px at 44% 8%,rgba(255,230,190,.6),transparent 60%);}
.ph-greet-name{position:relative;}
.ph-greet-name::after{content:'Dadi.';position:absolute;left:78px;top:14px;font-family:'Caveat','Snell Roundhand',cursive;
  font-size:46px;color:rgba(255,210,150,.13);-webkit-text-fill-color:rgba(255,210,150,.13);pointer-events:none;white-space:nowrap;}

.ph-bento-wrap{margin-top:18px;border-radius:30px;padding:16px 13px;position:relative;
  background:linear-gradient(180deg,rgba(255,240,218,.05),rgba(255,240,218,.015) 50%,rgba(255,240,218,.035));
  border:1px solid rgba(255,210,150,.16);
  backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  box-shadow:inset 0 1.5px 0 rgba(255,255,255,.12),0 18px 40px rgba(0,0,0,.45);}
.ph-bento{display:grid;grid-template-columns:repeat(6,1fr);grid-auto-rows:86px;gap:13px 11px;
  grid-template-areas:
    "h h s s b b"
    "h h n n n n"
    "m m m p p p"
    "g g c c a a";}
.ph-bt-health{grid-area:h;}.ph-bt-shop{grid-area:s;}.ph-bt-browser{grid-area:b;}
.ph-bt-notes{grid-area:n;}.ph-bt-music{grid-area:m;}.ph-bt-photos{grid-area:p;}
.ph-bt-messages{grid-area:g;}.ph-bt-calendar{grid-area:c;}.ph-bt-all{grid-area:a;}

.ph-tile{position:relative;border:none;color:#f3e9da;cursor:pointer;overflow:hidden;padding:10px;
  display:flex;align-items:center;justify-content:center;gap:10px;
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  transition:transform .16s;
  background:
    radial-gradient(150% 110% at 50% -30%,rgba(255,255,255,.30),rgba(255,255,255,.05) 50%,transparent 62%),
    radial-gradient(1px 1px at 22% 64%,rgba(255,240,210,.7),transparent 60%),
    radial-gradient(1.2px 1.2px at 74% 38%,rgba(255,240,210,.55),transparent 60%),
    radial-gradient(1px 1px at 58% 80%,rgba(255,240,210,.4),transparent 60%),
    var(--bg,linear-gradient(168deg,rgba(150,110,70,.5),rgba(60,38,22,.55)));
  box-shadow:
    0 0 0 1.3px rgba(255,215,160,.38),
    inset 0 2px 3px rgba(255,255,255,.5),
    inset 0 -12px 22px rgba(255,255,255,.10),
    inset 0 -2px 5px rgba(40,18,8,.5),
    0 14px 30px rgba(0,0,0,.5),
    0 10px 28px var(--glow,rgba(217,140,78,.22));}
.ph-tile:active{transform:scale(.95);}
.ph-tile::before{content:'';position:absolute;left:7%;right:7%;top:4%;height:42%;border-radius:999px;pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,.02));filter:blur(2.5px);}
.ph-tile-sq{border-radius:26px;flex-direction:column;gap:7px;}
.ph-tile-wide{border-radius:26px;}
.ph-tile-pill{border-radius:999px;}
.ph-tile-circle{border-radius:50%;flex-direction:column;gap:5px;aspect-ratio:1;align-self:center;justify-self:center;width:100%;max-width:118px;}
.ph-tile-tall{border-radius:34px;flex-direction:column;justify-content:flex-end;gap:8px;padding-bottom:18px;}
.ph-tile-ic{display:grid;place-items:center;}
.ph-tile-ic .ph-svg{width:25px;height:25px;color:#ffe2c0;filter:drop-shadow(0 1px 3px rgba(40,15,5,.6));}
.ph-tile-lab{display:flex;flex-direction:column;align-items:center;line-height:1.25;}
.ph-tile-wide .ph-tile-lab,.ph-tile-pill .ph-tile-lab{align-items:flex-start;}
.ph-tile-lab b{font-size:14px;font-weight:600;letter-spacing:1px;}
.ph-tile-lab small{font-size:9.5px;opacity:.5;letter-spacing:.6px;}
.ph-tile-badge{position:absolute;top:10px;right:12px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:11px;color:#ffe2c0;font-style:normal;
  background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.4),rgba(180,120,60,.45));
  box-shadow:0 0 0 1px rgba(255,220,170,.4),0 2px 8px rgba(0,0,0,.4);}
.ph-heart3d{width:74px;height:74px;filter:drop-shadow(0 8px 18px rgba(180,100,40,.45));}
.ph-ecgline{width:82%;height:18px;opacity:.9;}
/* 便当配色(低饱和琥珀/酒红/烟灰) */
.ph-bt-health{--bg:linear-gradient(170deg,rgba(196,140,84,.58),rgba(92,52,24,.6));--glow:rgba(217,150,80,.3);}
.ph-bt-shop{--bg:linear-gradient(168deg,rgba(125,53,64,.6),rgba(58,22,30,.65));--glow:rgba(160,70,85,.28);}
.ph-bt-browser{--bg:linear-gradient(168deg,rgba(108,98,84,.55),rgba(46,40,32,.6));--glow:rgba(150,130,100,.22);}
.ph-bt-notes{--bg:linear-gradient(165deg,rgba(138,122,102,.5),rgba(62,52,40,.58));--glow:rgba(170,140,100,.22);}
.ph-bt-music{--bg:linear-gradient(168deg,rgba(110,47,69,.6),rgba(50,18,30,.65));--glow:rgba(150,60,90,.26);}
.ph-bt-photos{--bg:linear-gradient(168deg,rgba(170,120,66,.55),rgba(80,50,24,.6));--glow:rgba(200,140,80,.26);}
.ph-bt-messages{--bg:linear-gradient(168deg,rgba(180,132,80,.5),rgba(86,56,28,.58));--glow:rgba(210,150,90,.24);}
.ph-bt-calendar{--bg:linear-gradient(168deg,rgba(140,57,57,.58),rgba(64,24,24,.62));--glow:rgba(180,80,70,.26);}
.ph-bt-all{--bg:linear-gradient(168deg,rgba(96,96,100,.5),rgba(40,40,44,.6));--glow:rgba(140,140,150,.2);}
`
