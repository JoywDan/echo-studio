import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function HealthPanel() {
  const [entries, setEntries] = useState([])
  const [selected, setSelected] = useState(null)
  const [contents, setContents] = useState({})
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [msg, setMsg] = useState('')

  async function loadEntry(date) {
    if (!date) return
    setSelected(date)

    if (contents[date]) return

    setContents(prev => ({ ...prev, [date]: 'loading…' }))
    try {
      const d = await api.health.get(date)
      setContents(prev => ({ ...prev, [date]: d.content || '（空）' }))
    } catch {
      setContents(prev => ({ ...prev, [date]: '暂无周报' }))
    }
  }

  async function loadExistingEntries(preferredDate = null) {
    setLoading(true)
    setMsg('')

    try {
      const d = await api.health.list()
      const dates = d.entries || []
      setEntries(dates)

      if (!dates.length) {
        setSelected(null)
        setContents({})
        return
      }

      const loadedEntries = await Promise.all(
        dates.map(async (date) => {
          try {
            const entry = await api.health.get(date)
            return [date, entry.content || '（空）']
          } catch {
            return [date, '暂无周报']
          }
        })
      )

      const nextContents = Object.fromEntries(loadedEntries)
      const nextSelected = preferredDate && dates.includes(preferredDate) ? preferredDate : dates[0]

      setContents(nextContents)
      setSelected(nextSelected)
    } catch (e) {
      setEntries([])
      setSelected(null)
      setContents({})
      setMsg('error: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExistingEntries()
  }, [])

  async function generate() {
    setGenerating(true); setMsg('')
    try {
      const d = await api.health.generate()
      await loadExistingEntries(d.date)
      setMsg('周报已生成')
    } catch (e) { setMsg('error: ' + e.message) }
    finally { setGenerating(false) }
  }

  const content = selected ? contents[selected] || '' : ''

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted tracking-widest uppercase">Echo's Weekly Health</span>
        <button className="btn btn-pink text-xs" onClick={generate} disabled={generating}>
          {generating ? 'checking…' : '生成本周'}
        </button>
      </div>

      {msg && <div className="text-xs" style={{ color: msg.includes('error') ? 'var(--pink)' : 'var(--cyan)' }}>{msg}</div>}

      {!loading && !entries.length && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            还没有周报。每周日 UTC 15:00 自动生成，也可以手动触发。
          </p>
        </div>
      )}

      {loading && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            正在加载周报…
          </p>
        </div>
      )}

      {content && content !== 'loading…' && (
        <div className="card p-4" style={{ borderColor: 'rgba(255,42,109,0.3)' }}>
          <div className="text-xs text-muted tracking-widest mb-3">
            {selected ? `— ${selected} —` : '— 周报 —'}
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text)' }}>
            {content}
          </p>
          </div>
      )}

      {entries.length > 0 && (
        <div>
          <div className="text-xs text-muted tracking-widest uppercase mb-2">历史记录</div>
          <div className="flex flex-wrap gap-2">
            {entries.map(date => (
              <button key={date} onClick={() => loadEntry(date)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all card
                  ${selected === date ? 'neon-pink border-pink' : 'text-muted'}`}
                style={ selected === date ? { borderColor: 'var(--pink)' } : {}}>
                {date.slice(5)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
