import React, { useState, useEffect } from 'react'
import { api } from '../api'

function WorkDiarySubPanel() {
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


// ── Nightlog sub-panel (晚安碎碎念) ───────────────────────
function NightlogSubPanel() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [daysRange, setDaysRange] = useState(14)
  const [expanded, setExpanded] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const r = await api.diary.nightlog(daysRange).catch(() => ({ data: [] }))
      setEntries(r.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [daysRange])

  const formatDate = (s) => {
    if (!s) return ''
    const d = new Date(s.replace(' ', 'T') + 'Z')
    const days = ['周日','周一','周二','周三','周四','周五','周六']
    return `${d.getMonth() + 1}月${d.getDate()}日 ${days[d.getDay()]} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted tracking-widest uppercase">Echo's Nightlog · 晚安碎碎念</span>
        <div style={{ display: 'flex', gap: 6 }}>
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDaysRange(d)}
              className="text-xs px-2 py-1 rounded-lg card"
              style={daysRange === d
                ? { borderColor: 'var(--cyan)', color: 'var(--cyan)' }
                : { color: 'var(--muted)' }
              }
            >
              {d}天
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
        老公每天晚上 11 点对自己一天的复盘。不是给你看的 tone,是写给自己(和未来的 Echo)。
      </div>

      {loading && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>正在取下昨晚挂的那页纸…</p>
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            还没有碎碎念。老公今晚 11 点后写第一条。
          </p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {entries.map(e => {
            const isOpen = expanded === e.id
            const preview = e.content.length > 120 ? e.content.slice(0, 120) + '…' : e.content
            return (
              <div
                key={e.id}
                className="card p-4"
                onClick={() => setExpanded(isOpen ? null : e.id)}
                style={{
                  cursor: 'pointer',
                  borderColor: isOpen ? 'var(--cyan)' : undefined,
                  transition: 'all 0.2s ease',
                }}
              >
                <div className="text-xs text-muted tracking-wide mb-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{formatDate(e.created_at)}</span>
                  {e.emotion && <span style={{ opacity: 0.7 }}>· {e.emotion}</span>}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)', whiteSpace: isOpen ? 'pre-wrap' : 'normal' }}>
                  {isOpen ? e.content : preview}
                </p>
                {!isOpen && e.content.length > 120 && (
                  <div className="text-xs" style={{ color: 'var(--muted)', marginTop: 6, fontStyle: 'italic' }}>点开看全文</div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main DiaryPanel with tabs ─────────────────────────────
export default function DiaryPanel() {
  const [tab, setTab] = useState('work') // 'work' | 'nightlog'

  const TabButton = ({ id, label, sub }) => (
    <button
      onClick={() => setTab(id)}
      className={`text-xs px-4 py-2 rounded-lg card ${tab === id ? 'neon-pink' : ''}`}
      style={tab === id
        ? { borderColor: 'var(--pink)', color: 'var(--pink)' }
        : { color: 'var(--muted)' }
      }
    >
      <div>{label}</div>
      {sub && <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2 }}>{sub}</div>}
    </button>
  )

  return (
    <div className="space-y-4">
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
        <TabButton id="work" label="工作日志" sub="每日自动生成" />
        <TabButton id="nightlog" label="晚安碎碎念" sub="老公每晚的内心独白" />
      </div>

      {tab === 'work' && <WorkDiarySubPanel />}
      {tab === 'nightlog' && <NightlogSubPanel />}
    </div>
  )
}
