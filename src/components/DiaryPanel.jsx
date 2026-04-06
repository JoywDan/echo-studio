import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function DiaryPanel() {
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
      const d = await api.diary.get(date)
      setContents(prev => ({ ...prev, [date]: d.content || '（空）' }))
    } catch {
      setContents(prev => ({ ...prev, [date]: '暂无日记' }))
    }
  }

  async function loadExistingEntries(preferredDate = null) {
    setLoading(true)
    setMsg('')

    try {
      const d = await api.diary.list()
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
            const entry = await api.diary.get(date)
            return [date, entry.content || '（空）']
          } catch {
            return [date, '暂无日记']
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
      const d = await api.diary.generate()
      await loadExistingEntries(d.date)
      setMsg('日记已生成')
    } catch (e) { setMsg('error: ' + e.message) }
    finally { setGenerating(false) }
  }

  const content = selected ? contents[selected] || '' : ''

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted tracking-widest uppercase">Echo's Work Diary</span>
        <button className="btn btn-pink text-xs" onClick={generate} disabled={generating}>
          {generating ? 'writing…' : '生成今日'}
        </button>
      </div>

      {msg && <div className="text-xs" style={{ color: msg.includes('error') ? 'var(--pink)' : 'var(--cyan)' }}>{msg}</div>}

      {!loading && !entries.length && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            还没有已生成的日记。
          </p>
        </div>
      )}

      {loading && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            正在加载已有日记…
          </p>
        </div>
      )}

      {content && content !== 'loading…' && (
        <div className="card p-4" style={{ borderColor: 'rgba(255,42,109,0.3)' }}>
          <div className="text-xs text-muted tracking-widest mb-3">
            {selected ? `— ${selected} —` : '— 日记 —'}
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
