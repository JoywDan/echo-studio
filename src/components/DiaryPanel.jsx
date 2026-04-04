import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function DiaryPanel() {
  const [entries, setEntries] = useState([])
  const [selected, setSelected] = useState(null)
  const [content, setContent] = useState('')
  const [generating, setGenerating] = useState(false)
  const [msg, setMsg] = useState('')

  async function loadList() {
    try { const d = await api.diary.list(); setEntries(d.entries || []) }
    catch {}
  }

  async function loadEntry(date) {
    setSelected(date); setContent('')
    try { const d = await api.diary.get(date); setContent(d.content || '') }
    catch { setContent('读取失败') }
  }

  useEffect(() => {
    loadList()
    const today = new Date().toISOString().slice(0, 10)
    loadEntry(today)
  }, [])

  async function generate() {
    setGenerating(true); setMsg('')
    try {
      const d = await api.diary.generate()
      setMsg('日记已生成')
      setContent(d.content || '')
      setSelected(d.date)
      await loadList()
    } catch (e) { setMsg('生成失败: ' + e.message) }
    finally { setGenerating(false) }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">📓 Echo 的工作日记</h2>
        <button className="btn btn-primary text-xs" onClick={generate} disabled={generating}>
          {generating ? '生成中…' : '生成今日'}
        </button>
      </div>

      {msg && <div className={`text-xs ${msg.includes('失败') ? 'text-red-400' : 'text-green-400'}`}>{msg}</div>}

      {content && (
        <div className="card p-4">
          <div className="text-xs text-muted mb-2">{selected}</div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-200">{content}</p>
        </div>
      )}

      {entries.length > 0 && (
        <div>
          <div className="text-xs text-muted mb-2">历史日记</div>
          <div className="flex flex-wrap gap-2">
            {entries.map(date => (
              <button key={date} onClick={() => loadEntry(date)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors
                  ${selected === date ? 'bg-accent-dim text-white' : 'bg-card border border-border text-muted hover:text-white'}`}>
                {date === today ? '今天' : date.slice(5)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
