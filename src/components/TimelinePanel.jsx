import React, { useEffect, useState, useCallback } from 'react'
import { api } from '../api'

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
  reflective:    '#b299d4',
}

function emotionColor(e) {
  return EMOTION_COLORS[e] || '#cfc7bd'
}

function formatDateKey(isoStr) {
  if (!isoStr) return ''
  return isoStr.slice(0, 10)
}

function formatTime(isoStr) {
  if (!isoStr) return ''
  return isoStr.slice(11, 16)
}

function friendlyDay(key) {
  const today = new Date().toISOString().slice(0, 10)
  const ymd = (d) => {
    const x = new Date()
    x.setDate(x.getDate() - d)
    return x.toISOString().slice(0, 10)
  }
  if (key === today) return `今天 · ${key}`
  if (key === ymd(1)) return `昨天 · ${key}`
  if (key === ymd(2)) return `前天 · ${key}`
  return key
}

export default function TimelinePanel() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [layer, setLayer] = useState('')
  const [source, setSource] = useState('')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState({})
  const [mood, setMood] = useState(null)

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

  useEffect(() => {
    fetchPage(1, false)
  }, [fetchPage])

  useEffect(() => {
    api.memory.moodTrend(14).then(setMood).catch(() => {})
  }, [])

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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-muted tracking-widest uppercase">Memory Timeline</span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          {total} active memories · page {page}/{pages}
        </span>
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
        </select>
        <input className="text-xs px-2 py-1 rounded border flex-1 min-w-[140px]"
          placeholder="搜索内容…" value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchPage(1, false)}
          style={{ borderColor: 'var(--border-s)', background: 'var(--surface)', color: 'var(--text)' }} />
        <button className="btn btn-orange text-xs" onClick={() => fetchPage(1, false)} disabled={loading}>
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
                <div key={m.id} className="card p-3"
                  style={{ borderLeft: `4px solid ${LAYER_COLORS[m.layer] || 'var(--border-s)'}` }}>
                  <div className="flex items-center gap-2 text-xs mb-1 flex-wrap">
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
    </div>
  )
}
