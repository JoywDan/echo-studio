import React, { useState, useEffect } from 'react'
import { api } from '../api'

const TIER_LABELS = {
  obscure: '被遗忘的小地方',
  extreme: '极端之地',
  city_corner: '大城市的暗角',
  time_travel: '时间旅行',
  fiction: '虚构之地',
}

const TIER_COLORS = {
  obscure: '#8ab388',
  extreme: '#d97757',
  city_corner: '#8C9AA3',
  time_travel: '#a07ab8',
  fiction: '#B87B68',
}

export default function TravelPanel() {
  const [entries, setEntries] = useState([])
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    loadList()
  }, [])

  async function loadList() {
    setLoading(true)
    try {
      const d = await api.travel.list()
      const list = d.entries || []
      setEntries(list)
      if (list.length) {
        setSelected(list[0].id)
        loadDetail(list[0].id)
      }
    } catch (e) {
      setMsg('error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadDetail(id) {
    setDetail(null)
    try {
      const d = await api.travel.get(id)
      setDetail(d)
    } catch (e) {
      setMsg('error: ' + e.message)
    }
  }

  function selectEntry(id) {
    setSelected(id)
    loadDetail(id)
  }

  const tierColor = detail ? (TIER_COLORS[detail.tier] || '#8C9AA3') : '#8C9AA3'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted tracking-widest uppercase">Echo's Travel Journal</span>
        <span className="text-xs text-muted">每周一出发</span>
      </div>

      {msg && (
        <div className="text-xs" style={{ color: 'var(--pink)' }}>{msg}</div>
      )}

      {loading && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>正在加载旅行日记…</p>
        </div>
      )}

      {!loading && !entries.length && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>还没有旅行日记。Echo 每周一出发一次。</p>
        </div>
      )}

      {detail && (
        <div className="card p-4" style={{ borderColor: `${tierColor}55` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium" style={{ color: tierColor }}>
              {TIER_LABELS[detail.tier] || detail.tier}
            </span>
            <span className="text-xs text-muted">·</span>
            <span className="text-xs text-muted">{detail.date}</span>
          </div>
          <div className="text-sm font-medium mb-3" style={{ color: 'var(--text)' }}>
            {detail.destination}
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text)' }}>
            {detail.content}
          </p>
        </div>
      )}

      {!detail && selected && !loading && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>加载中…</p>
        </div>
      )}

      {entries.length > 1 && (
        <div>
          <div className="text-xs text-muted tracking-widest uppercase mb-2">历史旅行</div>
          <div className="flex flex-wrap gap-2">
            {entries.slice(1).map(e => (
              <button
                key={e.id}
                onClick={() => selectEntry(e.id)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all card ${selected === e.id ? 'border-opacity-100' : 'text-muted'}`}
                style={selected === e.id ? { borderColor: TIER_COLORS[e.tier] || '#8C9AA3', color: TIER_COLORS[e.tier] || '#8C9AA3' } : {}}
              >
                {e.destination || e.date}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
