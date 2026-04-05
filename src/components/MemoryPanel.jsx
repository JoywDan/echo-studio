import React, { useEffect, useState } from 'react'
import { api } from '../api'

const TABS = [
  { id: 'recent', label: 'Recent' },
  { id: 'search', label: 'Search' },
  { id: 'time', label: 'By Time' },
  { id: 'entity', label: 'By Entity' },
  { id: 'trend', label: 'Mood Trend' },
  { id: 'write', label: 'Write' },
  { id: 'stats', label: 'Stats' },
]

function extractToolText(response) {
  return response?.result?.content?.[0]?.text || ''
}

function parseToolJson(response) {
  const raw = extractToolText(response)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function prettyPrint(value) {
  if (typeof value === 'string') return value
  return JSON.stringify(value, null, 2)
}

export default function MemoryPanel() {
  const [tab, setTab] = useState('recent')
  const [recent, setRecent] = useState('Loading...')
  const [stats, setStats] = useState(null)
  const [searchForm, setSearchForm] = useState({ query: '', context: '', emotion: '' })
  const [timeForm, setTimeForm] = useState({ start: '', end: '', category: '', emotion: '', limit: 10 })
  const [entityForm, setEntityForm] = useState({ entity: '', entity_type: '', limit: 5 })
  const [trendDays, setTrendDays] = useState(7)
  const [writeForm, setWriteForm] = useState({ content: '', category: '', emotion: '' })
  const [result, setResult] = useState('')
  const [trendResult, setTrendResult] = useState('')
  const [writeMsg, setWriteMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.memory.recent(10)
      .then((data) => setRecent(extractToolText(data) || 'No recent memories yet.'))
      .catch(() => setRecent('Failed to load recent memories.'))

    api.memory.stats()
      .then(setStats)
      .catch(() => setStats({ error: 'Failed to load stats.' }))
  }, [])

  async function runSearch() {
    if (!searchForm.query.trim()) return
    setLoading(true)
    setResult('')

    try {
      const data = await api.memory.recall(searchForm.query, searchForm.context, searchForm.emotion)
      const parsed = parseToolJson(data)
      setResult(prettyPrint(parsed || extractToolText(data) || 'No related memories found.'))
    } catch (error) {
      setResult(`Search failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function runTimeSearch() {
    if (!timeForm.start.trim()) return
    setLoading(true)
    setResult('')

    try {
      const data = await api.memory.byTime({
        ...timeForm,
        limit: Number(timeForm.limit) || 10,
      })
      const parsed = parseToolJson(data)
      setResult(prettyPrint(parsed || extractToolText(data) || 'No memories found in that time range.'))
    } catch (error) {
      setResult(`Time search failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function runEntitySearch() {
    if (!entityForm.entity.trim()) return
    setLoading(true)
    setResult('')

    try {
      const data = await api.memory.byEntity({
        ...entityForm,
        limit: Number(entityForm.limit) || 5,
      })
      const parsed = parseToolJson(data)
      setResult(prettyPrint(parsed || extractToolText(data) || 'No related entity memories found.'))
    } catch (error) {
      setResult(`Entity search failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function loadTrend() {
    setLoading(true)
    setTrendResult('')

    try {
      const data = await api.memory.moodTrend(Number(trendDays) || 7)
      const parsed = parseToolJson(data)
      setTrendResult(parsed?.trend || prettyPrint(parsed || extractToolText(data) || 'No mood trend data yet.'))
    } catch (error) {
      setTrendResult(`Mood trend failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function writeMemory() {
    if (!writeForm.content.trim()) return
    setLoading(true)
    setWriteMsg('')

    try {
      const data = await api.memory.write(writeForm)
      const parsed = parseToolJson(data)
      setWriteMsg(parsed?.note || 'Memory written.')
      setWriteForm({ content: '', category: '', emotion: '' })
    } catch (error) {
      setWriteMsg(`Write failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Memory Core</h2>

      <div className="tab-bar flex-wrap">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`tab ${tab === item.id ? 'active-orange' : ''}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'recent' && (
        <pre className="log-box">{recent}</pre>
      )}

      {tab === 'search' && (
        <div className="space-y-3">
          <input
            value={searchForm.query}
            onChange={(event) => setSearchForm((form) => ({ ...form, query: event.target.value }))}
            placeholder="Ask what memory you want to recall"
          />
          <input
            value={searchForm.context}
            onChange={(event) => setSearchForm((form) => ({ ...form, context: event.target.value }))}
            placeholder="Optional conversation context"
          />
          <input
            value={searchForm.emotion}
            onChange={(event) => setSearchForm((form) => ({ ...form, emotion: event.target.value }))}
            placeholder="Optional emotion tag"
          />
          <button className="btn btn-orange" onClick={runSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Recall Memory'}
          </button>
          {result && <pre className="log-box">{result}</pre>}
        </div>
      )}

      {tab === 'time' && (
        <div className="space-y-3">
          <input
            value={timeForm.start}
            onChange={(event) => setTimeForm((form) => ({ ...form, start: event.target.value }))}
            placeholder="Start time, for example 2026-04-03T00:00:00"
          />
          <input
            value={timeForm.end}
            onChange={(event) => setTimeForm((form) => ({ ...form, end: event.target.value }))}
            placeholder="Optional end time"
          />
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={timeForm.category}
              onChange={(event) => setTimeForm((form) => ({ ...form, category: event.target.value }))}
              placeholder="Optional category"
            />
            <input
              value={timeForm.emotion}
              onChange={(event) => setTimeForm((form) => ({ ...form, emotion: event.target.value }))}
              placeholder="Optional emotion"
            />
            <input
              type="number"
              min="1"
              max="20"
              value={timeForm.limit}
              onChange={(event) => setTimeForm((form) => ({ ...form, limit: event.target.value }))}
              placeholder="Limit"
            />
          </div>
          <button className="btn btn-orange" onClick={runTimeSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Recall By Time'}
          </button>
          {result && <pre className="log-box">{result}</pre>}
        </div>
      )}

      {tab === 'entity' && (
        <div className="space-y-3">
          <input
            value={entityForm.entity}
            onChange={(event) => setEntityForm((form) => ({ ...form, entity: event.target.value }))}
            placeholder="Entity name, for example Echo or Joy"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={entityForm.entity_type}
              onChange={(event) => setEntityForm((form) => ({ ...form, entity_type: event.target.value }))}
              placeholder="Optional type: person, project, pet..."
            />
            <input
              type="number"
              min="1"
              max="20"
              value={entityForm.limit}
              onChange={(event) => setEntityForm((form) => ({ ...form, limit: event.target.value }))}
              placeholder="Limit"
            />
          </div>
          <button className="btn btn-orange" onClick={runEntitySearch} disabled={loading}>
            {loading ? 'Searching...' : 'Recall By Entity'}
          </button>
          {result && <pre className="log-box">{result}</pre>}
        </div>
      )}

      {tab === 'trend' && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <input
              type="number"
              min="1"
              max="30"
              value={trendDays}
              onChange={(event) => setTrendDays(event.target.value)}
              placeholder="Days"
            />
            <button className="btn btn-orange" onClick={loadTrend} disabled={loading}>
              {loading ? 'Loading...' : 'Load Mood Trend'}
            </button>
          </div>
          {trendResult && <pre className="log-box">{trendResult}</pre>}
        </div>
      )}

      {tab === 'write' && (
        <div className="space-y-3">
          <textarea
            value={writeForm.content}
            onChange={(event) => setWriteForm((form) => ({ ...form, content: event.target.value }))}
            rows={4}
            placeholder="Write down what should be remembered"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={writeForm.category}
              onChange={(event) => setWriteForm((form) => ({ ...form, category: event.target.value }))}
            >
              <option value="">Optional category</option>
              {['relationship', 'preference', 'boundary', 'project', 'emotion', 'daily', 'intimacy', 'milestone', 'health', 'creative']
                .map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input
              value={writeForm.emotion}
              onChange={(event) => setWriteForm((form) => ({ ...form, emotion: event.target.value }))}
              placeholder="Optional emotion tag"
            />
          </div>
          <button className="btn btn-orange" onClick={writeMemory} disabled={loading || !writeForm.content.trim()}>
            {loading ? 'Writing...' : 'Write Memory'}
          </button>
          {writeMsg && <div className="text-sm text-muted">{writeMsg}</div>}
        </div>
      )}

      {tab === 'stats' && (
        <pre className="log-box">{prettyPrint(stats || 'Loading...')}</pre>
      )}
    </div>
  )
}
