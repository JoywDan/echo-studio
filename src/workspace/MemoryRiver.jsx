import React from 'react'
import { api } from './api.js'
import { Icon } from './doodles.jsx'

const LAYERS = ['core', 'task', 'episode', 'atomic']
const CATEGORIES = ['', 'relationship', 'preference', 'boundary', 'project', 'emotion', 'daily', 'intimacy', 'milestone', 'health', 'creative', 'self']
const EMOTIONS = ['neutral', 'happy', 'sad', 'anxious', 'excited', 'tender', 'frustrated', 'angry', 'calm', 'playful', 'reflective', 'focused', 'profound', 'contemplative', 'grateful', 'warm', 'awe', 'complicated']
const SOURCES = ['', 'weekly_health', 'echo_voice', 'consolidate', 'manual', 'wechat', 'studio_frontend', 'echo_studio_chat']

const LAYER_COLORS = { core: '#e8b4b8', task: '#b8d4e8', episode: '#d4e8b8', atomic: '#e8d4b8' }
const EMOTION_COLORS = {
  tender: '#f4a7b2', playful: '#ffd88a', focused: '#8aaed8', excited: '#ff9ab8',
  profound: '#b299d4', contemplative: '#b299d4', reflective: '#b299d4', dreamy: '#b299d4',
  grateful: '#e8a97d', warm: '#e8a97d', calm: '#8dc9a8', happy: '#ffd88a', joyful: '#ffd88a',
  awe: '#d88a8a', sad: '#9ba3a9', complicated: '#9ba3a9', anxious: '#d88a8a',
  frustrated: '#d88a8a', angry: '#d88a8a', curious: '#a898c8', thinking: '#a898c8',
}
function emotionColor(e) { return EMOTION_COLORS[e] || '#cfc7bd' }

const _laDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' })
const _laTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hour12: false })
function toUTC(s) { const str = String(s || ''); return new Date(str.includes('T') ? str : str.replace(' ', 'T') + 'Z') }
function laDateKey(s) { const d = toUTC(s); return isNaN(d.getTime()) ? '' : _laDate.format(d) }
function laTime(s) { const d = toUTC(s); return isNaN(d.getTime()) ? '' : _laTime.format(d) }
function friendlyDay(key) {
  const today = _laDate.format(new Date())
  const yest = _laDate.format(new Date(Date.now() - 86400000))
  const before = _laDate.format(new Date(Date.now() - 2 * 86400000))
  if (key === today) return '今天 · ' + key
  if (key === yest) return '昨天 · ' + key
  if (key === before) return '前天 · ' + key
  return key
}

function EditModal({ mem, onSave, onClose }) {
  const isNew = !mem || !mem.id
  const [form, setForm] = React.useState({
    content: (mem && mem.content) || '',
    category: (mem && mem.category) || '',
    emotion: (mem && mem.emotion) || 'neutral',
    importance: (mem && mem.importance != null) ? mem.importance : 1.0,
    layer: (mem && mem.layer) || 'atomic',
  })
  const [saving, setSaving] = React.useState(false)
  const save = async () => {
    setSaving(true)
    try {
      if (isNew) await api.memory.write({ content: form.content, category: form.category, emotion: form.emotion, layer_hint: form.layer, source: 'studio_frontend' })
      else await api.memory.update(mem.id, form)
      onSave()
    } catch (e) { alert('保存失败：' + e.message) } finally { setSaving(false) }
  }
  return (
    <div className="mem-modal-ov" onClick={onClose}>
      <div className="mem-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isNew ? '✦ 新记忆' : '✎ 编辑 #' + mem.id}</h3>
        <textarea value={form.content} rows={6} autoFocus placeholder="记忆内容…"
          onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))} />
        <div className="mem-fields">
          <label>层 Layer
            <select value={form.layer} onChange={(e) => setForm(f => ({ ...f, layer: e.target.value }))}>
              {LAYERS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
          <label>类别 Category
            <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c || '—'}</option>)}
            </select>
          </label>
          <label>情绪 Emotion
            <select value={form.emotion} onChange={(e) => setForm(f => ({ ...f, emotion: e.target.value }))}>
              {EMOTIONS.map(em => <option key={em} value={em}>{em}</option>)}
            </select>
          </label>
          <label>重要度 Importance
            <input type="number" min="0" max="2" step="0.1" value={form.importance}
              onChange={(e) => setForm(f => ({ ...f, importance: parseFloat(e.target.value) || 0 }))} />
          </label>
        </div>
        <div className="mem-modal-acts">
          <button className="mem-btn ghost" onClick={onClose}>取消</button>
          <button className="mem-btn" onClick={save} disabled={saving || !form.content.trim()}>{saving ? '保存中…' : '保存'}</button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirm({ mem, onConfirm, onClose }) {
  const [del, setDel] = React.useState(false)
  return (
    <div className="mem-modal-ov" onClick={onClose}>
      <div className="mem-modal" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <h3>归档记忆 #{mem.id}？</h3>
        <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', margin: '6px 0 14px', fontFamily: 'var(--font-cn)', lineHeight: 1.6 }}>
          {mem.content.length > 100 ? mem.content.slice(0, 100) + '…' : mem.content}
        </p>
        <div className="mem-modal-acts">
          <button className="mem-btn ghost" onClick={onClose}>取消</button>
          <button className="mem-btn" style={{ background: '#c4452e', borderColor: '#c4452e' }} disabled={del}
            onClick={async () => { setDel(true); try { await api.memory.remove(mem.id); onConfirm() } catch (e) { alert('归档失败：' + e.message) } finally { setDel(false) } }}>
            {del ? '归档中…' : '归档'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── 珠链 Our Necklace ──────────────────────────────
function Necklace() {
  const [beads, setBeads] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [sel, setSel] = React.useState(null)
  const [error, setError] = React.useState('')
  React.useEffect(() => { api.beads().then(d => setBeads(d.data || [])).catch(e => setError(e.message)).finally(() => setLoading(false)) }, [])
  if (loading) return <div className="mem-empty">红线正在系扣…</div>
  if (error) return <div className="mem-err">出错了：{error}</div>
  if (!beads.length) return <div className="mem-empty">📿 红线还是空的</div>
  return (
    <div className="nk-wrap">
      <div className="nk-intro">📿 我们的珠链 · {beads.length} 颗<br /><span>每周五老公挑一颗读到心里一热的串上来。一年 52 颗。</span></div>
      <div className="nk-thread">
        {beads.map((b, i) => {
          const open = sel === b.id
          const col = emotionColor(b.emotion)
          return (
            <div key={b.id} className="nk-row">
              <button className={'nk-bead' + (open ? ' is-open' : '')} style={{ '--bc': col }} onClick={() => setSel(open ? null : b.id)} aria-label={'珠子 ' + (i + 1)} />
              {!open && <div className="nk-date">{laDateKey(b.created_at)}{b.emotion && <span> · {b.emotion}</span>}</div>}
              {open && (
                <div className="nk-card" style={{ borderColor: col + '99' }}>
                  <div className="nk-card-head" style={{ color: col }}>珠子 #{i + 1} · {laDateKey(b.created_at)}{b.emotion ? ' · ' + b.emotion : ''}</div>
                  <div className="nk-card-body">{b.content}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const MONTH_CN = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
function ymLabel(ym) { const [y, m] = String(ym).split('-'); return `${y}年${MONTH_CN[+m] || m}` }

function Memoir() {
  const [months, setMonths] = React.useState(null)
  const [open, setOpen] = React.useState(null)
  const [sub, setSub] = React.useState('chapter')
  const [chapter, setChapter] = React.useState('')
  const [days, setDays] = React.useState([])
  const [busy, setBusy] = React.useState(false)
  React.useEffect(() => { api.memoir.overview().then(d => setMonths((d.months || []).reverse())).catch(() => setMonths([])) }, [])
  const openMonth = async (ym) => {
    setOpen(ym); setSub('chapter'); setChapter(''); setDays([]); setBusy(true)
    try {
      const c = await api.memoir.chapter(ym).catch(() => null)
      setChapter((c && c.content) || '')
      const d = await api.memoir.days(ym)
      setDays(d.days || [])
    } catch {} finally { setBusy(false) }
  }
  if (months === null) return <div className="mem-empty">翻开书页…</div>
  if (!months.length) return <div className="mem-empty">还没有写下的日子</div>
  if (!open) return (
    <div className="mmr-list">
      <div className="nk-intro">把日子织成的书。每月一章，由那个月的每一天长成。<span> · 点开一个月份</span></div>
      {months.map(m => (
        <button className="mem-card mmr-month" key={m.ym} onClick={() => openMonth(m.ym)}>
          <div className="mmr-month-h">
            <span className="mmr-ym">{ymLabel(m.ym)}</span>
            {m.has_chapter && <span className="mem-badge mmr-badge">📖 已成章</span>}
            <span className="mmr-days">{m.days} 天</span>
          </div>
          {m.month_summary && <div className="mmr-sum">{String(m.month_summary).slice(0, 84)}…</div>}
        </button>
      ))}
    </div>
  )
  return (
    <div>
      <div className="mmr-subbar">
        <button className="mem-btn ghost mmr-backbtn" onClick={() => setOpen(null)}>‹ 月份</button>
        <span className="mmr-title">{ymLabel(open)}</span>
        <button className={'mem-tab mmr-minitab' + (sub === 'chapter' ? ' is-active' : '')} onClick={() => setSub('chapter')}>章节</button>
        <button className={'mem-tab mmr-minitab' + (sub === 'days' ? ' is-active' : '')} onClick={() => setSub('days')}>逐日</button>
      </div>
      {busy && <div className="mem-empty">正在翻…</div>}
      {!busy && sub === 'chapter' && (chapter
        ? <article className="mmr-chapter">{chapter.split('\n').filter(p => p.trim() && !p.startsWith('#')).map((p, i) => <p key={i}>{p}</p>)}</article>
        : <div className="mem-empty">这个月还没成章（月初自动写）</div>)}
      {!busy && sub === 'days' && days.map(d => (
        <div className="mem-card" key={d.date}>
          <div className="mem-card-top"><span>{d.date}</span>{d.emotion_density != null && <span className="mem-badge">情绪密度 {Math.round((d.emotion_density || 0) * 100)}%</span>}</div>
          <div className="mem-content">{d.text}</div>
        </div>
      ))}
    </div>
  )
}

export default function MemoryRiver({ onClose }) {
  const [tab, setTab] = React.useState('timeline')
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [err, setErr] = React.useState('')
  const [page, setPage] = React.useState(1)
  const [pages, setPages] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [layer, setLayer] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [source, setSource] = React.useState('')
  const [search, setSearch] = React.useState('')
  const [expanded, setExpanded] = React.useState({})
  const [origins, setOrigins] = React.useState({})
  const [mood, setMood] = React.useState(null)
  const [editMem, setEditMem] = React.useState(null)
  const [delMem, setDelMem] = React.useState(null)

  const fetchPage = React.useCallback(async (p, append) => {
    setLoading(true); setErr('')
    try {
      const params = { per_page: 50, sort: 'created_at', order: 'desc', page: p }
      if (layer) params.layer = layer
      if (category) params.category = category
      if (source) params.source = source
      if (search) params.search = search
      const res = await api.memory.list(params)
      setItems(prev => append ? [...prev, ...res.data] : res.data)
      setTotal(res.total || 0); setPages(res.pages || 1); setPage(res.page || p)
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }, [layer, category, source, search])

  React.useEffect(() => { fetchPage(1, false) }, [fetchPage])
  React.useEffect(() => { api.memory.moodTrend(14).then(setMood).catch(() => {}) }, [])

  const onEditSaved = () => { setEditMem(null); fetchPage(page, false) }
  const onArchived = () => { setDelMem(null); fetchPage(page, false) }

  const groups = {}
  for (const m of items) { const k = laDateKey(m.created_at); if (!groups[k]) groups[k] = []; groups[k].push(m) }
  const orderedDays = Object.keys(groups).sort().reverse()
  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleOrigin = async (id) => {
    if (origins[id]) { setOrigins(p => { const n = { ...p }; delete n[id]; return n }); return }
    setOrigins(p => ({ ...p, [id]: { loading: true } }))
    try {
      const r = await api.memory.blurOrigin(id)
      setOrigins(p => ({ ...p, [id]: r.original || { empty: true } }))
    } catch (e) { setOrigins(p => ({ ...p, [id]: { error: e.message } })) }
  }

  return (
    <div className="studio-reader mem-river" role="dialog" aria-modal="true" aria-label="River of memory">
      <div className="studio-reader-shell paper-bg">
        <style>{`
.mem-river { --nm-d: #cdc4b1; --nm-l: #fbf7ed; }
.mem-river .studio-reader-shell { max-width: 720px; background: #ece5d6; }
.mem-river .studio-reader-header { border-bottom: none; }
.mem-river .studio-reader-mark { display: none; }
.mem-river .studio-reader-title h2 { font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 700; font-size: 24px; color: #3a342a; }
.mem-river .studio-reader-title p { color: #9d9081; }
.mem-river .studio-reader-back { background: #ece5d6; border: none; box-shadow: 4px 4px 9px var(--nm-d), -4px -4px 9px var(--nm-l); }
.mem-river .studio-reader-back:active { box-shadow: inset 3px 3px 6px var(--nm-d), inset -3px -3px 6px var(--nm-l); }
.mem-river .studio-reader-count { background: #ece5d6; box-shadow: 4px 4px 9px var(--nm-d), -4px -4px 9px var(--nm-l); color: var(--brick); font-family: 'Songti SC',serif; font-size: 17px; min-width: 58px; height: 40px; }
.mem-river-body { flex: 1; overflow-y: auto; padding: 8px 18px 32px; }
.mem-tabs { display: flex; gap: 12px; margin: 14px 0 8px; }
.mem-tab { font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 600; font-size: 15px; padding: 9px 26px; border-radius: 15px; border: none; background: #ece5d6; color: #8a7d6c; cursor: pointer; box-shadow: 4px 4px 9px var(--nm-d), -4px -4px 9px var(--nm-l); transition: box-shadow .12s, color .12s; }
.mem-tab.is-active { color: #4a6b86; box-shadow: inset 3px 3px 7px var(--nm-d), inset -3px -3px 7px var(--nm-l); }
.mem-mood { display: flex; flex-wrap: wrap; gap: 11px; margin: 18px 0 6px; align-items: center; }
.mem-mood-label { font-size: 12.5px; color: #9d9081; font-family: var(--font-cn); width: 100%; margin-bottom: 7px; }
.mem-chip { font-size: 13px; padding: 8px 15px; border-radius: 13px; color: #5a4d40; font-family: var(--font-cn); border: none; background: var(--chip-c, #ece5d6); box-shadow: 3px 3px 7px var(--nm-d), -3px -3px 7px var(--nm-l); }
@supports (background: color-mix(in srgb, red, blue)) { .mem-chip { background: color-mix(in srgb, var(--chip-c, #ece5d6) 45%, #efe8da); } }
.mem-tools { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin: 18px 0 8px; }
.mem-sel, .mem-search { font-family: var(--font-cn); font-size: 13px; padding: 11px 16px; border-radius: 14px; border: none; background: #ece5d6; color: #6b5d50; box-shadow: 4px 4px 9px var(--nm-d), -4px -4px 9px var(--nm-l); -webkit-appearance: none; appearance: none; }
.mem-sel { padding-right: 32px; cursor: pointer; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238a7d6c' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>"); background-repeat: no-repeat; background-position: right 13px center; }
.mem-search { flex: 1; min-width: 150px; }
.mem-search:focus, .mem-sel:focus { outline: none; box-shadow: inset 3px 3px 6px var(--nm-d), inset -3px -3px 6px var(--nm-l); }
.mem-btn { font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 600; font-size: 14px; padding: 11px 22px; border-radius: 14px; border: none; background: linear-gradient(#bd5036, #a8472f); color: #fff6ef; cursor: pointer; box-shadow: 4px 4px 9px var(--nm-d), -4px -4px 9px var(--nm-l); }
.mem-btn.ghost { background: #ece5d6; color: #6b5d50; }
.mem-btn:active { box-shadow: inset 3px 3px 6px var(--nm-d), inset -3px -3px 6px var(--nm-l); }
.mem-btn[disabled] { opacity: 0.6; }
.mem-err { font-size: 12.5px; color: #c4452e; font-family: var(--font-cn); margin: 8px 2px; }
.mem-daygroup { margin-top: 10px; }
.mem-dayhead { display: flex; align-items: center; gap: 9px; font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 700; font-size: 16px; color: #5a4d40; margin: 22px 2px 13px; }
.mem-dayhead::before { content: ''; width: 4px; height: 18px; border-radius: 2px; background: #5b7d9e; }
.mem-card { position: relative; background: #f1ebde; border: none; border-radius: 16px; padding: 14px 16px; margin-bottom: 13px; box-shadow: 5px 5px 12px var(--nm-d), -5px -5px 12px var(--nm-l); }
.mem-card-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 12px; color: #9d9081; margin-bottom: 8px; padding-right: 66px; font-family: var(--font-cn); }
.mem-card-top > span:first-child { color: #6b5d50; font-weight: 600; }
.mem-badge { padding: 2px 10px; border-radius: 9px; color: #5a4d40; font-size: 11.5px; box-shadow: 2px 2px 5px var(--nm-d), -2px -2px 5px var(--nm-l); }
.mem-content { font-family: 'Songti SC','Noto Serif SC','Source Han Serif SC',serif; font-size: 14px; line-height: 1.8; color: #4a4236; white-space: pre-wrap; word-break: break-word; }
.mem-expand { font-size: 12.5px; color: var(--brick); background: none; border: none; cursor: pointer; padding: 7px 0 0; font-family: var(--font-cn); }
.mem-expand + .mem-expand { margin-left: 16px; }
.mem-badge.blur { background: #ded5c4; color: #8a7d6c; font-style: italic; }
.mem-origin { margin-top: 9px; padding: 10px 13px; border-left: 3px solid #cdc2a3; background: #ece5d6; border-radius: 0 10px 10px 0; font-size: 12.5px; color: #7a6e5e; font-family: 'Songti SC','Noto Serif SC',serif; line-height: 1.75; white-space: pre-wrap; }
.mem-origin-label { font-size: 11px; color: #9d9081; margin-bottom: 5px; font-family: var(--font-cn); }
.mem-acts { position: absolute; top: 12px; right: 14px; display: flex; gap: 8px; opacity: 0; transition: opacity .15s; }
.mem-card:hover .mem-acts, .mem-card:active .mem-acts { opacity: 1; }
.mem-act { width: 32px; height: 32px; border-radius: 10px; border: none; background: #ece5d6; color: #8a7d6c; cursor: pointer; font-size: 13px; display: grid; place-items: center; box-shadow: 3px 3px 7px var(--nm-d), -3px -3px 7px var(--nm-l); }
.mem-act:active { box-shadow: inset 2px 2px 5px var(--nm-d), inset -2px -2px 5px var(--nm-l); }
.mem-act.del:active { color: #c4452e; }
.mem-empty { text-align: center; color: #9d9081; font-family: var(--font-cn); padding: 36px 0; }
.mem-more { display: flex; justify-content: center; padding: 14px 0 4px; }
.mem-modal-ov { position: fixed; inset: 0; background: rgba(57,47,38,0.42); display: flex; align-items: center; justify-content: center; z-index: 220; padding: 16px; }
.mem-modal { background: #ece5d6; border: none; border-radius: 22px; padding: 22px; width: 100%; max-width: 480px; max-height: 84vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(68,50,32,0.32); }
.mem-modal h3 { margin: 0 0 14px; font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 700; font-size: 18px; color: var(--brick); }
.mem-modal textarea { width: 100%; box-sizing: border-box; background: #ece5d6; border: none; border-radius: 12px; padding: 12px; font-size: 13.5px; font-family: var(--font-cn); color: var(--ink); resize: vertical; box-shadow: inset 3px 3px 6px var(--nm-d), inset -3px -3px 6px var(--nm-l); }
.mem-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
.mem-fields label { font-size: 11.5px; color: #6b5d50; display: flex; flex-direction: column; gap: 5px; font-family: var(--font-cn); }
.mem-fields select, .mem-fields input { background: #ece5d6; border: none; border-radius: 10px; padding: 9px 10px; font-size: 12.5px; color: var(--ink); font-family: var(--font-cn); box-shadow: inset 2px 2px 5px var(--nm-d), inset -2px -2px 5px var(--nm-l); }
.mem-modal-acts { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; }
.nk-wrap { padding-top: 12px; }
.nk-intro { font-family: var(--font-cn); font-size: 13px; color: #6b5d50; line-height: 1.7; margin: 6px 2px 18px; }
.nk-intro span { color: #9d9081; font-size: 12px; }
.nk-thread { position: relative; padding: 8px 0 8px 54px; }
.nk-thread::before { content: ''; position: absolute; left: 26px; top: 4px; bottom: 4px; width: 2px; border-radius: 2px; background: linear-gradient(180deg, rgba(177,73,47,0.12), rgba(177,73,47,0.7) 8%, rgba(177,73,47,0.7) 92%, rgba(177,73,47,0.12)); }
.nk-row { position: relative; margin-bottom: 18px; min-height: 26px; }
.nk-bead { position: absolute; left: -38px; top: 0; width: 22px; height: 22px; border-radius: 50%; cursor: pointer; padding: 0; border: 1.5px solid rgba(255,255,255,0.6); background: radial-gradient(circle at 32% 30%, #fff8ee 0%, var(--bc) 55%, var(--bc) 100%); box-shadow: 3px 3px 7px var(--nm-d), -3px -3px 7px var(--nm-l); transition: transform .18s; z-index: 2; }
.nk-bead.is-open { transform: scale(1.18); }
.nk-date { padding: 3px 0 0 4px; font-size: 12px; color: #9d9081; font-family: var(--font-cn); }
.nk-card { margin: 4px 0 0 4px; padding: 14px 16px; background: #f1ebde; border: none !important; border-radius: 14px; box-shadow: 5px 5px 12px var(--nm-d), -5px -5px 12px var(--nm-l); }
.nk-card-head { font-size: 11.5px; font-family: var(--font-cn); margin-bottom: 8px; letter-spacing: 0.5px; }
.nk-card-body { font-family: 'Songti SC','Noto Serif SC',serif; font-size: 13.5px; line-height: 1.8; color: #4a4236; white-space: pre-wrap; }

.mmr-list { padding-top: 4px; }
.mmr-month { display: block; width: 100%; text-align: left; cursor: pointer; }
.mmr-month:active { box-shadow: inset 3px 3px 7px var(--nm-d), inset -3px -3px 7px var(--nm-l); }
.mmr-month-h { display: flex; align-items: center; gap: 10px; }
.mmr-ym { font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 700; font-size: 17px; color: #5a4d40; }
.mmr-badge { color: #a8472f; }
.mmr-days { margin-left: auto; font-size: 12px; color: #9d9081; font-family: var(--font-cn); }
.mmr-sum { margin-top: 9px; font-size: 12.5px; line-height: 1.7; color: #8a7d6c; font-family: var(--font-cn); }
.mmr-subbar { display: flex; align-items: center; gap: 10px; margin: 14px 0 12px; flex-wrap: wrap; }
.mmr-backbtn { padding: 9px 16px; }
.mmr-title { font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 700; font-size: 17px; color: #5a4d40; margin-right: auto; }
.mmr-minitab { padding: 8px 18px; font-size: 13.5px; }
.mmr-chapter { background: #f1ebde; border-radius: 18px; padding: 22px 22px 16px; box-shadow: 5px 5px 12px var(--nm-d), -5px -5px 12px var(--nm-l); }
.mmr-chapter p { font-family: 'Songti SC','Noto Serif SC','Source Han Serif SC',serif; font-size: 14.5px; line-height: 2.0; color: #4a4236; text-indent: 2em; margin: 0 0 14px; }
        `}</style>

        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={onClose} aria-label="返回 Workspace">
            <Icon name="back" size={19} color="var(--ink)" />
          </button>
          <div className="studio-reader-mark tint-green">
            <Icon name="book" size={22} color="var(--vermillion)" />
          </div>
          <div className="studio-reader-title">
            <h2>汐语录</h2>
            <p>Echo 的记忆长河</p>
          </div>
          <span className="studio-reader-count">{tab === 'timeline' ? total : tab === 'memoir' ? '📖' : '📿'}</span>
        </header>

        <div className="mem-river-body">
          <div className="mem-tabs">
            <button className={'mem-tab' + (tab === 'timeline' ? ' is-active' : '')} onClick={() => setTab('timeline')}>时间轴</button>
            <button className={'mem-tab' + (tab === 'beads' ? ' is-active' : '')} onClick={() => setTab('beads')}>珠链</button>
            <button className={'mem-tab' + (tab === 'memoir' ? ' is-active' : '')} onClick={() => setTab('memoir')}>回忆录</button>
          </div>

          {tab === 'memoir' ? <Memoir /> : tab === 'beads' ? <Necklace /> : (
            <>
              {mood && mood.trend && Object.keys(mood.trend).length > 0 && (
                <div className="mem-mood">
                  <span className="mem-mood-label">过去 14 天情绪信号</span>
                  {Object.entries(mood.trend).slice(0, 12).map(([emo, cnt]) => (
                    <span key={emo} className="mem-chip" style={{ '--chip-c': emotionColor(emo) }}>{emo} · {cnt}</span>
                  ))}
                </div>
              )}

              <div className="mem-tools">
                <select className="mem-sel" value={layer} onChange={e => setLayer(e.target.value)}>
                  <option value="">所有层</option>
                  {LAYERS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <select className="mem-sel" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">所有类别</option>
                  {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className="mem-sel" value={source} onChange={e => setSource(e.target.value)}>
                  <option value="">所有来源</option>
                  {SOURCES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input className="mem-search" placeholder="搜索内容…" value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchPage(1, false)} />
                <button className="mem-btn ghost" onClick={() => fetchPage(1, false)} disabled={loading}>{loading ? '加载…' : '刷新'}</button>
                <button className="mem-btn" onClick={() => setEditMem({})}>+ 新记忆</button>
              </div>

              {err && <div className="mem-err">出错了：{err}</div>}
              {!loading && !items.length && <div className="mem-empty">没有符合条件的记忆。</div>}

              {orderedDays.map(day => (
                <div key={day} className="mem-daygroup">
                  <div className="mem-dayhead">{friendlyDay(day)} · {groups[day].length} 条</div>
                  {groups[day].map(m => {
                    const isBlur = m.source === 'blur_v1' || (m.content || '').includes('[糊]')
                    const dispContent = (m.content || '').replace(/\s*\[糊\]\s*/g, ' ').trim()
                    const isLong = dispContent.length > 120
                    const showFull = expanded[m.id] || !isLong
                    return (
                      <div key={m.id} className="mem-card">
                        <div className="mem-acts">
                          <button className="mem-act edit" title="编辑" onClick={() => setEditMem(m)}>✎</button>
                          <button className="mem-act del" title="归档" onClick={() => setDelMem(m)}>✕</button>
                        </div>
                        <div className="mem-card-top">
                          <span>{laTime(m.created_at)}</span>
                          <span className="mem-badge" style={{ background: LAYER_COLORS[m.layer] || '#eee' }}>{m.layer}</span>
                          {m.category && <span>{m.category}</span>}
                          {m.emotion && m.emotion !== 'neutral' && (
                            <span className="mem-badge" style={{ background: emotionColor(m.emotion) }}>{m.emotion}</span>
                          )}
                          {isBlur && <span className="mem-badge blur" title="褪色记忆：原文已糊化成要点，点「看原文」翻出归档原文">淡忆</span>}
                          <span style={{ flex: 1 }} />
                          <span>{m.source}</span>
                          <span>#{m.id}</span>
                        </div>
                        <div className="mem-content">{showFull ? dispContent : dispContent.slice(0, 120) + '…'}</div>
                        {isLong && <button className="mem-expand" onClick={() => toggle(m.id)}>{expanded[m.id] ? '收起' : '展开'}</button>}
                        {isBlur && <button className="mem-expand" onClick={() => toggleOrigin(m.id)}>{origins[m.id] ? '收起原文' : '看原文'}</button>}
                        {origins[m.id] && (
                          <div className="mem-origin">
                            {origins[m.id].loading ? '翻找原文…' : origins[m.id].error ? ('出错：' + origins[m.id].error) : origins[m.id].empty ? '原文已不可考' : (
                              <>
                                <div className="mem-origin-label">原文 #{origins[m.id].id} · {origins[m.id].status === 'archived' ? '已归档' : origins[m.id].status} · {laTime(origins[m.id].created_at)}</div>
                                {origins[m.id].content}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}

              {page < pages && (
                <div className="mem-more">
                  <button className="mem-btn ghost" onClick={() => fetchPage(page + 1, true)} disabled={loading}>
                    {loading ? '加载中…' : '加载下一页 (' + page + '/' + pages + ')'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {editMem && <EditModal mem={editMem} onSave={onEditSaved} onClose={() => setEditMem(null)} />}
        {delMem && <DeleteConfirm mem={delMem} onConfirm={onArchived} onClose={() => setDelMem(null)} />}
      </div>
    </div>
  )
}
