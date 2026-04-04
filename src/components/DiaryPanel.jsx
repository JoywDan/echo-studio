import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function DiaryPanel() {
  const [entries, setEntries] = useState([])
  const [selected, setSelected] = useState(null)
  const [content, setContent] = useState('')
  const [generating, setGenerating] = useState(false)
  const [msg, setMsg] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  async function loadList() {
    try { const d = await api.diary.list(); setEntries(d.entries || []) } catch {}
  }

  async function loadEntry(date) {
    setSelected(date); setContent('loading…')
    try { const d = await api.diary.get(date); setContent(d.content || '（空）') }
    catch { setContent('暂无日记') }
  }

  useEffect(() => {
    loadList()
    loadEntry(today)
  }, [])

  async function generate() {
    setGenerating(true); setMsg('')
    try {
      const d = await api.diary.generate()
      setContent(d.content || ''); setSelected(d.date); setMsg('日记已生成')
      await loadList()
    } catch (e) { setMsg('error: ' + e.message) }
    finally { setGenerating(false) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted tracking-widest uppercase">Echo's Work Diary</span>
        <button className="btn btn-pink text-xs" onClick={generate} disabled={generating}>
          {generating ? 'writing…' : '生成今日'}
        </button>
      </div>

      {msg && <div className="text-xs" style={{ color: msg.includes('error') ? 'var(--pink)' : 'var(--cyan)' }}>{msg}</div>}

      {content && content !== 'loading…' && (
        <div className="card p-4" style={{ borderColor: 'rgba(255,42,109,0.3)' }}>
          <div className="text-xs text-muted tracking-widest mb-3">
            {selected === today ? '— 今天 —' : `— ${selected} —`}
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text)' }}>
            {content}
          </p>
        </div>
      )}

      {entries.length > 1 && (
        <div>
          <div className="text-xs text-muted tracking-widest uppercase mb-2">历史记录</div>
          <div className="flex flex-wrap gap-2">
            {entries.filter(d => d !== today).map(date => (
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
