import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function MemoryPanel() {
  const [tab, setTab] = useState('recent')
  const [recent, setRecent] = useState([])
  const [stats, setStats] = useState(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [writeForm, setWriteForm] = useState({ content: '', category: '', emotion: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.memory.recent(10).then(d => setRecent(d?.result?.content?.[0]?.text ? [d.result.content[0].text] : [])).catch(() => {})
    api.memory.stats().then(setStats).catch(() => {})
  }, [])

  async function recall() {
    if (!query.trim()) return
    setLoading(true); setResults(null)
    try {
      const d = await api.memory.recall(query)
      setResults(d?.result?.content?.[0]?.text || '没有找到相关记忆')
    } catch (e) { setResults('查询失败: ' + e.message) }
    finally { setLoading(false) }
  }

  async function writeMemory() {
    if (!writeForm.content.trim()) return
    setLoading(true); setMsg('')
    try {
      await api.memory.write(writeForm)
      setMsg('记忆已写入')
      setWriteForm({ content: '', category: '', emotion: '' })
    } catch (e) { setMsg('写入失败: ' + e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">🧠 记忆</h2>

      <div className="flex gap-2 text-sm border-b border-border pb-2">
        {['recent','search','write','stats'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1 rounded-full transition-colors ${tab===t ? 'bg-accent-dim text-white' : 'text-muted'}`}>
            {t === 'recent' ? '最近' : t === 'search' ? '搜索' : t === 'write' ? '写入' : '统计'}
          </button>
        ))}
      </div>

      {tab === 'recent' && (
        <div className="space-y-2">
          {recent.length === 0
            ? <p className="text-muted text-sm">加载中…</p>
            : <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-black/30 rounded-lg p-3 max-h-96 overflow-y-auto">{recent[0]}</pre>
          }
        </div>
      )}

      {tab === 'search' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="搜索记忆…" onKeyDown={e => e.key==='Enter' && recall()} />
            <button className="btn btn-primary whitespace-nowrap" onClick={recall} disabled={loading}>搜索</button>
          </div>
          {results && (
            <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-black/30 rounded-lg p-3 max-h-96 overflow-y-auto">{results}</pre>
          )}
        </div>
      )}

      {tab === 'write' && (
        <div className="space-y-3">
          <textarea value={writeForm.content} onChange={e => setWriteForm(f=>({...f,content:e.target.value}))}
            rows={4} placeholder="写下要记住的内容…" />
          <div className="flex gap-2">
            <select value={writeForm.category} onChange={e => setWriteForm(f=>({...f,category:e.target.value}))}>
              <option value="">分类（可选）</option>
              {['relationship','preference','boundary','project','emotion','daily','intimacy','milestone','health','creative']
                .map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={writeForm.emotion} onChange={e => setWriteForm(f=>({...f,emotion:e.target.value}))}
              placeholder="情绪标签（可选）" />
          </div>
          <div className="flex items-center gap-3">
            <button className="btn btn-primary" onClick={writeMemory} disabled={loading || !writeForm.content}>
              {loading ? '写入中…' : '写入记忆'}
            </button>
            {msg && <span className={`text-xs ${msg.includes('失败') ? 'text-red-400' : 'text-green-400'}`}>{msg}</span>}
          </div>
        </div>
      )}

      {tab === 'stats' && (
        <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-black/30 rounded-lg p-3">
          {stats ? JSON.stringify(stats, null, 2) : '加载中…'}
        </pre>
      )}
    </div>
  )
}
