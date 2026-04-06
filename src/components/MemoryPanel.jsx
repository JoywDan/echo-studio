import React, { useEffect, useState, useCallback, useRef } from 'react'
import { api } from '../api'

const LAYERS = ['', 'core', 'task', 'episode', 'atomic']
const CATEGORIES = ['', 'relationship', 'preference', 'boundary', 'project', 'emotion', 'daily', 'intimacy', 'milestone', 'health', 'creative', 'self']
const EMOTIONS = ['neutral', 'happy', 'sad', 'anxious', 'excited', 'tender', 'frustrated', 'angry', 'calm', 'playful', 'reflective', 'focused']

const LAYER_COLORS = {
  core: '#e8b4b8',
  task: '#b8d4e8',
  episode: '#d4e8b8',
  atomic: '#e8d4b8',
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'Z')
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago'
  return dateStr.slice(0, 10)
}

function MemoryRow({ mem, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = mem.content.length > 80

  return (
    <div
      className="mem-row"
      style={{ borderLeftColor: LAYER_COLORS[mem.layer] || '#666' }}
      onClick={() => isLong && setExpanded(!expanded)}
    >
      <div className="mem-row-header">
        <span className="mem-layer" style={{ background: LAYER_COLORS[mem.layer] || '#444', color: '#1a1a1a' }}>
          {mem.layer}
        </span>
        <span className="mem-category">{mem.category}</span>
        {mem.emotion && mem.emotion !== 'neutral' && (
          <span className="mem-emotion">{mem.emotion}</span>
        )}
        <span className="mem-importance" title={`importance: ${mem.importance}`}>
          {'●'.repeat(Math.min(3, Math.ceil(mem.importance)))}
        </span>
        <span className="mem-spacer" />
        <span className="mem-source">{mem.source}</span>
        <span className="mem-date" title={mem.created_at}>{timeAgo(mem.created_at)}</span>
      </div>
      <div className={`mem-content ${expanded ? 'expanded' : ''}`}>
        {expanded ? mem.content : (isLong ? mem.content.slice(0, 80) + '...' : mem.content)}
      </div>
      <div className="mem-actions">
        <button className="mem-btn edit" onClick={(e) => { e.stopPropagation(); onEdit(mem) }} title="Edit">✎</button>
        <button className="mem-btn del" onClick={(e) => { e.stopPropagation(); onDelete(mem) }} title="Archive">✕</button>
        <span className="mem-id">#{mem.id}</span>
      </div>
    </div>
  )
}

function EditModal({ mem, onSave, onClose }) {
  const [form, setForm] = useState({
    content: mem?.content || '',
    category: mem?.category || '',
    emotion: mem?.emotion || 'neutral',
    importance: mem?.importance ?? 1.0,
    layer: mem?.layer || 'atomic',
  })
  const [saving, setSaving] = useState(false)
  const isNew = !mem?.id

  const handleSave = async () => {
    setSaving(true)
    try {
      if (isNew) {
        await api.memory.write({
          content: form.content,
          category: form.category,
          emotion: form.emotion,
          layer_hint: form.layer,
          source: 'studio_frontend',
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{isNew ? '✦ New Memory' : `✎ Edit #${mem.id}`}</h3>
        <textarea
          value={form.content}
          onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
          rows={6}
          placeholder="Memory content..."
          autoFocus
        />
        <div className="modal-fields">
          <label>
            Layer
            <select value={form.layer} onChange={(e) => setForm(f => ({ ...f, layer: e.target.value }))}>
              {LAYERS.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
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
            <input
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={form.importance}
              onChange={(e) => setForm(f => ({ ...f, importance: parseFloat(e.target.value) || 0 }))}
            />
          </label>
        </div>
        <div className="modal-actions">
          <button className="btn btn-muted" onClick={onClose}>Cancel</button>
          <button className="btn btn-orange" onClick={handleSave} disabled={saving || !form.content.trim()}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirm({ mem, onConfirm, onClose }) {
  const [deleting, setDeleting] = useState(false)
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box small" onClick={(e) => e.stopPropagation()}>
        <h3>Archive Memory #{mem.id}?</h3>
        <p className="text-sm text-muted" style={{ marginBottom: 16 }}>
          {mem.content.length > 100 ? mem.content.slice(0, 100) + '...' : mem.content}
        </p>
        <div className="modal-actions">
          <button className="btn btn-muted" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-danger"
            disabled={deleting}
            onClick={async () => {
              setDeleting(true)
              try { await api.memory.remove(mem.id); onConfirm() }
              catch (err) { alert('Delete failed: ' + err.message) }
              finally { setDeleting(false) }
            }}
          >
            {deleting ? 'Archiving...' : 'Archive'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MemoryPanel() {
  const [memories, setMemories] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [perPage] = useState(20)
  const [sort, setSort] = useState('created_at')
  const [order, setOrder] = useState('desc')
  const [layerFilter, setLayerFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [editMem, setEditMem] = useState(null)
  const [deleteMem, setDeleteMem] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [stats, setStats] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const timerRef = useRef(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.memory.list({
        page, per_page: perPage, sort, order,
        layer: layerFilter, category: categoryFilter,
        search: search,
      })
      setMemories(data.data || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch (err) {
      console.error('Failed to load memories:', err)
    } finally {
      setLoading(false)
    }
  }, [page, perPage, sort, order, layerFilter, categoryFilter, search])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    api.memory.stats().then(setStats).catch(() => {})
  }, [])

  // auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      timerRef.current = setInterval(load, 8000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [autoRefresh, load])

  const toggleSort = (col) => {
    if (sort === col) { setOrder(o => o === 'desc' ? 'asc' : 'desc') }
    else { setSort(col); setOrder('desc') }
    setPage(1)
  }

  const sortIcon = (col) => sort === col ? (order === 'desc' ? ' ↓' : ' ↑') : ''

  const handleSearch = () => { setSearch(searchInput); setPage(1) }

  const extractStatsText = (s) => {
    if (!s) return ''
    const txt = s?.result?.content?.[0]?.text
    if (!txt) return JSON.stringify(s, null, 2)
    try { const p = JSON.parse(txt); return Object.entries(p.counts || p).map(([k,v]) => `${k}: ${v}`).join('  ·  ') }
    catch { return txt }
  }

  return (
    <div className="memory-panel">
      <style>{`
        .memory-panel { font-size: 13px; }
        .mem-toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 12px; }
        .mem-toolbar select, .mem-toolbar input[type="text"] {
          background: var(--bg-card, #f5f3f0); border: 1px solid var(--border, #e0d5cc); color: var(--text, #D97757);
          padding: 5px 8px; border-radius: 4px; font-size: 12px;
        }
        .mem-toolbar select { min-width: 90px; }
        .mem-toolbar input[type="text"] { flex: 1; min-width: 120px; }
        .mem-stats-bar { font-size: 11px; color: var(--text-muted, #b8886e); margin-bottom: 10px; letter-spacing: 0.5px; }
        .mem-sort-bar { display: flex; gap: 2px; margin-bottom: 8px; flex-wrap: wrap; }
        .mem-sort-btn { background: none; border: 1px solid var(--border, #e0d5cc); color: var(--text-muted, #b8886e);
          padding: 3px 10px; border-radius: 3px; font-size: 11px; cursor: pointer; }
        .mem-sort-btn.active { color: var(--accent, #D97757); border-color: var(--accent, #D97757); }
        .mem-row { border-left: 3px solid #666; padding: 8px 12px; margin-bottom: 6px;
          background: var(--bg-card, #f5f3f0); border-radius: 0 4px 4px 0; cursor: pointer;
          transition: background 0.15s; position: relative; }
        .mem-row:hover { background: var(--bg-hover, #ece8e3); }
        .mem-row-header { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; flex-wrap: wrap; }
        .mem-layer { font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
        .mem-category { font-size: 11px; color: var(--text-muted, #c49578); }
        .mem-emotion { font-size: 10px; color: var(--accent, #D97757); background: rgba(217,119,87,0.15); padding: 1px 5px; border-radius: 3px; }
        .mem-importance { font-size: 8px; color: var(--accent, #D97757); letter-spacing: -1px; }
        .mem-spacer { flex: 1; }
        .mem-source { font-size: 10px; color: var(--text-muted, #c9a08a); }
        .mem-date { font-size: 10px; color: var(--text-muted, #c9a08a); }
        .mem-content { font-size: 12px; color: var(--text-body, #5a3d2e); line-height: 1.5; white-space: pre-wrap; word-break: break-word; }
        .mem-content.expanded { max-height: none; }
        .mem-actions { position: absolute; top: 6px; right: 8px; display: flex; gap: 4px; align-items: center; opacity: 0; transition: opacity 0.15s; }
        .mem-row:hover .mem-actions { opacity: 1; }
        .mem-btn { background: none; border: 1px solid var(--border, #e0d5cc); color: var(--text-muted, #b8886e);
          width: 24px; height: 24px; border-radius: 3px; cursor: pointer; font-size: 12px; display: flex; align-items: center; justify-content: center; }
        .mem-btn.edit:hover { color: var(--accent, #D97757); border-color: var(--accent, #D97757); }
        .mem-btn.del:hover { color: #d4553a; border-color: #d4553a; }
        .mem-id { font-size: 9px; color: var(--text-muted, #d4b5a2); }
        .mem-pagination { display: flex; gap: 6px; align-items: center; justify-content: center; margin-top: 12px; }
        .mem-pagination button { background: var(--bg-card, #f5f3f0); border: 1px solid var(--border, #e0d5cc);
          color: var(--text, #D97757); padding: 4px 12px; border-radius: 3px; cursor: pointer; font-size: 12px; }
        .mem-pagination button:disabled { opacity: 0.3; cursor: default; }
        .mem-pagination button.current { border-color: var(--accent, #D97757); color: var(--accent, #D97757); }
        .mem-pagination span { font-size: 11px; color: var(--text-muted, #b8886e); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 999; }
        .modal-box { background: var(--bg-card, #f5f3f0); border: 1px solid var(--border, #e0d5cc); border-radius: 8px;
          padding: 20px; width: 90%; max-width: 520px; max-height: 80vh; overflow-y: auto; }
        .modal-box.small { max-width: 380px; }
        .modal-box h3 { margin: 0 0 12px; font-size: 15px; color: var(--text-heading, #D97757); }
        .modal-box textarea { width: 100%; background: var(--bg, #faf8f6); border: 1px solid var(--border, #e0d5cc);
          color: var(--text-body, #5a3d2e); padding: 8px; border-radius: 4px; font-size: 13px; resize: vertical; font-family: inherit; }
        .modal-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 12px; }
        .modal-fields label { font-size: 11px; color: var(--text-muted, #b8886e); display: flex; flex-direction: column; gap: 4px; }
        .modal-fields select, .modal-fields input {
          background: var(--bg, #faf8f6); border: 1px solid var(--border, #e0d5cc); color: var(--text, #D97757);
          padding: 5px 8px; border-radius: 4px; font-size: 12px; }
        .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
        .btn { padding: 6px 16px; border-radius: 4px; font-size: 12px; cursor: pointer; border: none; }
        .btn-orange { background: var(--accent, #D97757); color: #fff; }
        .btn-orange:disabled { opacity: 0.4; }
        .btn-muted { background: var(--bg, #faf8f6); color: var(--text-muted, #b8886e); border: 1px solid var(--border, #e0d5cc); }
        .btn-danger { background: #d4553a; color: #fff; }
        .btn-danger:disabled { opacity: 0.4; }
        .mem-auto-refresh { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-muted, #b8886e); cursor: pointer; }
        .mem-auto-refresh input { cursor: pointer; }
        .mem-loading { text-align: center; padding: 20px; color: var(--text-muted, #b8886e); font-size: 12px; }
      `}</style>

      <h2 className="text-lg font-semibold" style={{ marginBottom: 8 }}>Memory Core</h2>

      {stats && <div className="mem-stats-bar">{extractStatsText(stats)}</div>}

      <div className="mem-toolbar">
        <select value={layerFilter} onChange={(e) => { setLayerFilter(e.target.value); setPage(1) }}>
          <option value="">All Layers</option>
          {LAYERS.filter(Boolean).map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1) }}>
          <option value="">All Categories</option>
          {CATEGORIES.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search content..."
        />
        <button className="btn btn-orange" onClick={handleSearch} style={{ padding: '5px 12px' }}>Search</button>
        <button className="btn btn-muted" onClick={() => { setSearchInput(''); setSearch(''); setLayerFilter(''); setCategoryFilter(''); setPage(1) }}
          style={{ padding: '5px 10px', fontSize: 11 }}>Reset</button>
        <button className="btn btn-orange" onClick={() => setShowNew(true)} style={{ padding: '5px 12px' }}>+ New</button>
        <label className="mem-auto-refresh">
          <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
          Auto
        </label>
      </div>

      <div className="mem-sort-bar">
        <span style={{ fontSize: 10, color: '#666', marginRight: 4, lineHeight: '22px' }}>Sort:</span>
        {[['created_at', 'Date'], ['importance', 'Importance'], ['category', 'Category'], ['layer', 'Layer']].map(([col, label]) => (
          <button key={col} className={`mem-sort-btn ${sort === col ? 'active' : ''}`} onClick={() => toggleSort(col)}>
            {label}{sortIcon(col)}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 10, color: '#666', lineHeight: '22px' }}>{total} memories</span>
      </div>

      {loading && memories.length === 0 ? (
        <div className="mem-loading">Loading memories...</div>
      ) : (
        <>
          {memories.map(mem => (
            <MemoryRow key={mem.id} mem={mem} onEdit={setEditMem} onDelete={setDeleteMem} />
          ))}
          {memories.length === 0 && <div className="mem-loading">No memories found.</div>}
        </>
      )}

      {pages > 1 && (
        <div className="mem-pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>{page} / {pages}</span>
          <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}

      {editMem && (
        <EditModal mem={editMem} onClose={() => setEditMem(null)} onSave={() => { setEditMem(null); load() }} />
      )}
      {deleteMem && (
        <DeleteConfirm mem={deleteMem} onClose={() => setDeleteMem(null)} onConfirm={() => { setDeleteMem(null); load() }} />
      )}
      {showNew && (
        <EditModal mem={{}} onClose={() => setShowNew(false)} onSave={() => { setShowNew(false); load() }} />
      )}
    </div>
  )
}
