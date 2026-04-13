import React, { useEffect, useState, useCallback } from 'react'
import { api } from '../api'

const LAYERS = ['core', 'task', 'episode', 'atomic']
const CATEGORIES = ['', 'relationship', 'preference', 'boundary', 'project', 'emotion', 'daily', 'intimacy', 'milestone', 'health', 'creative', 'self']
const EMOTIONS = ['neutral', 'happy', 'sad', 'anxious', 'excited', 'tender', 'frustrated', 'angry', 'calm', 'playful', 'reflective', 'focused', 'profound', 'contemplative', 'grateful', 'warm', 'awe', 'complicated']

const LAYER_COLORS = {
  core:    '#e8b4b8',
  task:    '#b8d4e8',
  episode: '#d4e8b8',
  atomic:  '#e8d4b8',
}

const EMOTION_COLORS = {
  tender:        '#f4a7b2',
  playful:       '#ffd88a',
  focused:       '#8aaed8',
  excited:       '#ff9ab8',
  profound:      '#b299d4',
  contemplative: '#b299d4',
  reflective:    '#b299d4',
  grateful:      '#e8a97d',
  warm:          '#e8a97d',
  calm:          '#8dc9a8',
  happy:         '#ffd88a',
  awe:           '#d88a8a',
  sad:           '#9ba3a9',
  complicated:   '#9ba3a9',
  anxious:       '#d88a8a',
  frustrated:    '#d88a8a',
  angry:         '#d88a8a',
}

function emotionColor(e) { return EMOTION_COLORS[e] || '#cfc7bd' }

function formatDateKey(s) { return s ? s.slice(0, 10) : '' }
function formatTime(s)    { return s ? s.slice(11, 16) : '' }

function friendlyDay(key) {
  const today = new Date().toISOString().slice(0, 10)
  const ymd = (d) => { const x = new Date(); x.setDate(x.getDate() - d); return x.toISOString().slice(0, 10) }
  if (key === today)   return `今天 · ${key}`
  if (key === ymd(1))  return `昨天 · ${key}`
  if (key === ymd(2))  return `前天 · ${key}`
  return key
}

// ── Edit / New modal ────────────────────────────────────────
function EditModal({ mem, onSave, onClose }) {
  const [form, setForm] = useState({
    content:    mem?.content || '',
    category:   mem?.category || '',
    emotion:    mem?.emotion || 'neutral',
    importance: mem?.importance ?? 1.0,
    layer:      mem?.layer || 'atomic',
  })
  const [saving, setSaving] = useState(false)
  const isNew = !mem?.id

  const handleSave = async () => {
    setSaving(true)
    try {
      if (isNew) {
        await api.memory.write({
          content:    form.content,
          category:   form.category,
          emotion:    form.emotion,
          layer_hint: form.layer,
          source:     'studio_frontend',
        })
      } else {
        await api.memory.update(mem.id, form)
      }
      onSave()
    } catch (err) {
      alert('Save failed: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="tl-modal-overlay" onClick={onClose}>
      <div className="tl-modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{isNew ? '✦ New Memory' : `✎ Edit #${mem.id}`}</h3>
        <textarea
          value={form.content}
          onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
          rows={6}
          placeholder="Memory content..."
          autoFocus
        />
        <div className="tl-modal-fields">
          <label>
            Layer
            <select value={form.layer} onChange={(e) => setForm(f => ({ ...f, layer: e.target.value }))}>
              {LAYERS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </label>
          <label>
            Category
            <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c || '—'}</option>)}
            </select>
          </label>
          <label>
            Emotion
            <select value={form.emotion} onChange={(e) => setForm(f => ({ ...f, emotion: e.target.value }))}>
              {EMOTIONS.map(em => <option key={em} value={em}>{em}</option>)}
            </select>
          </label>
          <label>
            Importance
            <input type="number" min="0" max="2" step="0.1"
              value={form.importance}
              onChange={(e) => setForm(f => ({ ...f, importance: parseFloat(e.target.value) || 0 }))} />
          </label>
        </div>
        <div className="tl-modal-actions">
          <button className="btn btn-ghost text-xs" onClick={onClose}>Cancel</button>
          <button className="btn btn-orange text-xs" onClick={handleSave} disabled={saving || !form.content.trim()}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Archive confirm modal ──────────────────────────────────
function DeleteConfirm({ mem, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false)
  return (
    <div className="tl-modal-overlay" onClick={onClose}>
      <div className="tl-modal-box tl-modal-small" onClick={(e) => e.stopPropagation()}>
        <h3>Archive Memory #{mem.id}?</h3>
        <p style={{ fontSize: 12, color: 'var(--muted)', margin: '8px 0 16px' }}>
          {mem.content.length > 100 ? mem.content.slice(0, 100) + '...' : mem.content}
        </p>
        <div className="tl-modal-actions">
          <button className="btn btn-ghost text-xs" onClick={onClose}>Cancel</button>
          <button className="btn text-xs" style={{ background: '#d4553a', color: '#fff' }}
            disabled={deleting}
            onClick={async () => {
              setDeleting(true)
              try { await api.memory.remove(mem.id); onConfirm() }
              catch (err) { alert('Archive failed: ' + err.message) }
              finally { setDeleting(false) }
            }}>
            {deleting ? 'Archiving...' : 'Archive'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main panel ─────────────────────────────────────────────
export default function TimelinePanel() {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr]       = useState('')
  const [page, setPage]     = useState(1)
  const [pages, setPages]   = useState(1)
  const [total, setTotal]   = useState(0)
  const [layer, setLayer]   = useState('')
  const [source, setSource] = useState('')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState({})
  const [mood, setMood]     = useState(null)
  const [editMem, setEditMem]     = useState(null)
  const [deleteMem, setDeleteMem] = useState(null)

  const fetchPage = useCallback(async (p, append) => {
    setLoading(true)
    setErr('')
    try {
      const params = { per_page: 50, sort: 'created_at', order: 'desc', page: p }
      if (layer)  params.layer  = layer
      if (source) params.source = source
      if (search) params.search = search
      const res = await api.memory.list(params)
      setItems(prev => append ? [...prev, ...res.data] : res.data)
      setTotal(res.total || 0)
      setPages(res.pages || 1)
      setPage(res.page || p)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }, [layer, source, search])

  useEffect(() => { fetchPage(1, false) }, [fetchPage])
  useEffect(() => { api.memory.moodTrend(14).then(setMood).catch(() => {}) }, [])

  const onEditSaved   = () => { setEditMem(null);   fetchPage(page, false) }
  const onArchiveDone = () => { setDeleteMem(null); fetchPage(page, false) }

  const groups = {}
  for (const m of items) {
    const k = formatDateKey(m.created_at)
    if (!groups[k]) groups[k] = []
    groups[k].push(m)
  }
  const orderedDays = Object.keys(groups).sort().reverse()

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="space-y-4">
      <style>{`
        .tl-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 999; }
        .tl-modal-box { background: var(--card); border: 1px solid var(--border); border-radius: 12px;
          padding: 20px; width: 90%; max-width: 520px; max-height: 80vh; overflow-y: auto;
          box-shadow: var(--shadow); }
        .tl-modal-small { max-width: 380px; }
        .tl-modal-box h3 { margin: 0 0 12px; font-size: 15px; color: var(--orange); font-weight: 600; }
        .tl-modal-box textarea { width: 100%; background: var(--surface); border: 1px solid var(--border);
          color: var(--text); padding: 10px; border-radius: 6px; font-size: 13px; resize: vertical;
          font-family: inherit; }
        .tl-modal-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
        .tl-modal-fields label { font-size: 11px; color: var(--muted); display: flex; flex-direction: column; gap: 4px; }
        .tl-modal-fields select, .tl-modal-fields input {
          background: var(--surface); border: 1px solid var(--border); color: var(--text);
          padding: 6px 8px; border-radius: 6px; font-size: 12px; }
        .tl-modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
        .tl-row-actions { position: absolute; top: 8px; right: 10px; display: flex; gap: 4px; opacity: 0; transition: opacity .15s; }
        .tl-row:hover .tl-row-actions { opacity: 1; }
        .tl-row-btn { background: var(--surface); border: 1px solid var(--border); color: var(--muted);
          width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 12px;
          display: flex; align-items: center; justify-content: center; }
        .tl-row-btn.edit:hover { color: var(--orange); border-color: var(--orange); }
        .tl-row-btn.del:hover  { color: #d4553a; border-color: #d4553a; }
      `}</style>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-muted tracking-widest uppercase">Memory Timeline</span>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {total} active · p{page}/{pages}
          </span>
          <button className="btn btn-orange text-xs" onClick={() => setEditMem({})}>+ New</button>
        </div>
      </div>

      {mood && mood.trend && (
        <div className="card p-3">
          <div className="text-xs text-muted tracking-widest mb-2">过去 14 天情绪信号</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(mood.trend).slice(0, 12).map(([emo, cnt]) => (
              <span key={emo} className="text-xs px-2 py-1 rounded"
                style={{ background: emotionColor(emo), color: '#352d29' }}>
                {emo} · {cnt}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="card p-3 flex flex-wrap gap-2 items-center">
        <select className="text-xs px-2 py-1 rounded border" value={layer} onChange={e => setLayer(e.target.value)}
          style={{ borderColor: 'var(--border-s)', background: 'var(--surface)', color: 'var(--text)' }}>
          <option value="">所有层</option>
          <option value="core">core</option>
          <option value="task">task</option>
          <option value="episode">episode</option>
          <option value="atomic">atomic</option>
        </select>
        <select className="text-xs px-2 py-1 rounded border" value={source} onChange={e => setSource(e.target.value)}
          style={{ borderColor: 'var(--border-s)', background: 'var(--surface)', color: 'var(--text)' }}>
          <option value="">所有 source</option>
          <option value="weekly_health">weekly_health</option>
          <option value="echo_voice">echo_voice</option>
          <option value="consolidate">consolidate</option>
          <option value="manual">manual</option>
          <option value="wechat">wechat</option>
          <option value="studio_frontend">studio_frontend</option>
        </select>
        <input className="text-xs px-2 py-1 rounded border flex-1 min-w-[140px]"
          placeholder="搜索内容…" value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchPage(1, false)}
          style={{ borderColor: 'var(--border-s)', background: 'var(--surface)', color: 'var(--text)' }} />
        <button className="btn btn-ghost text-xs" onClick={() => fetchPage(1, false)} disabled={loading}>
          {loading ? '加载…' : '刷新'}
        </button>
      </div>

      {err && <div className="text-xs" style={{ color: '#d88a8a' }}>error: {err}</div>}

      {!loading && !items.length && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>没有符合条件的记忆。</p>
        </div>
      )}

      {orderedDays.map(day => (
        <div key={day}>
          <div className="text-xs tracking-widest mb-2 mt-3" style={{ color: 'var(--muted)' }}>
            {friendlyDay(day)}  ·  {groups[day].length} 条
          </div>
          <div className="space-y-2">
            {groups[day].map(m => {
              const isLong = (m.content || '').length > 120
              const showFull = expanded[m.id] || !isLong
              return (
                <div key={m.id} className="card p-3 tl-row"
                  style={{ borderLeft: `4px solid ${LAYER_COLORS[m.layer] || 'var(--border-s)'}`, position: 'relative' }}>
                  <div className="tl-row-actions">
                    <button className="tl-row-btn edit" title="Edit"
                      onClick={(e) => { e.stopPropagation(); setEditMem(m) }}>✎</button>
                    <button className="tl-row-btn del" title="Archive"
                      onClick={(e) => { e.stopPropagation(); setDeleteMem(m) }}>✕</button>
                  </div>
                  <div className="flex items-center gap-2 text-xs mb-1 flex-wrap pr-16">
                    <span style={{ color: 'var(--muted)' }}>{formatTime(m.created_at)}</span>
                    <span className="px-2 py-0.5 rounded" style={{ background: LAYER_COLORS[m.layer] || '#eee', color: '#352d29' }}>{m.layer}</span>
                    <span style={{ color: 'var(--muted)' }}>{m.category}</span>
                    {m.emotion && m.emotion !== 'neutral' && (
                      <span className="px-2 py-0.5 rounded" style={{ background: emotionColor(m.emotion), color: '#352d29' }}>{m.emotion}</span>
                    )}
                    <span className="flex-1" />
                    <span style={{ color: 'var(--muted)' }}>{m.source}</span>
                    <span style={{ color: 'var(--muted)' }}>#{m.id}</span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text)' }}>
                    {showFull ? m.content : (m.content || '').slice(0, 120) + '…'}
                  </p>
                  {isLong && (
                    <button className="text-xs mt-1" onClick={() => toggleExpand(m.id)} style={{ color: 'var(--orange)' }}>
                      {expanded[m.id] ? '收起' : '展开'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {page < pages && (
        <div className="flex justify-center pt-2">
          <button className="btn btn-ghost text-xs" onClick={() => fetchPage(page + 1, true)} disabled={loading}>
            {loading ? '加载中…' : `加载下一页 (${page}/${pages})`}
          </button>
        </div>
      )}

      {editMem   && <EditModal     mem={editMem}   onSave={onEditSaved}    onClose={() => setEditMem(null)} />}
      {deleteMem && <DeleteConfirm mem={deleteMem} onConfirm={onArchiveDone} onClose={() => setDeleteMem(null)} />}
    </div>
  )
}
