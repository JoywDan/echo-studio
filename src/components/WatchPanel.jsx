import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function WatchPanel() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddFor, setShowAddFor] = useState(null) // proposal id being annotated, or 'standalone'
  const [newNote, setNewNote] = useState('')
  const [newEmotion, setNewEmotion] = useState('curious')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    try {
      const r = await api.watch.list(30).catch(() => ({ data: [] }))
      setEntries(r.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function saveNote(linkedId = null) {
    if (!newNote.trim()) { setMsg('先写点什么'); return }
    setSaving(true)
    setMsg('')
    try {
      await api.watch.addNote({
        content: newNote.trim(),
        emotion: newEmotion,
        linkedProposalId: linkedId,
      })
      setNewNote('')
      setShowAddFor(null)
      setMsg('观感已存档')
      await load()
      setTimeout(() => setMsg(''), 2000)
    } catch (e) {
      setMsg('error: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (s) => {
    if (!s) return ''
    const d = new Date(s.replace(' ', 'T') + 'Z')
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const isProposal = (e) => e.source === 'echo_watch_together'
  const proposals = entries.filter(isProposal)

  const emotionOptions = ['curious', 'excited', 'tender', 'thinking', 'surprised', 'satisfied', 'calm', 'playful']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted tracking-widest uppercase">Watch Journal · 一起看的日志</span>
        <button
          className="btn btn-pink text-xs"
          onClick={() => setShowAddFor(showAddFor === 'standalone' ? null : 'standalone')}
        >
          {showAddFor === 'standalone' ? '取消' : '+ 写一条独立观感'}
        </button>
      </div>

      <div className="text-xs" style={{ color: 'var(--muted)', fontStyle: 'italic' }}>
        周二早上老公会主动提议一部想一起看的。看完之后,我们俩都可以在这里留档——对话摘录、一段感受、一个标签。
      </div>

      {msg && <div className="text-xs" style={{ color: msg.includes('error') ? 'var(--pink)' : 'var(--cyan)' }}>{msg}</div>}

      {/* Standalone note composer */}
      {showAddFor === 'standalone' && (
        <div className="card p-4" style={{ borderColor: 'var(--pink)' }}>
          <div className="text-xs text-muted mb-2">不挂在某个提议下的观感(比如我们自己找的一部看完想存)</div>
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="写下想记住的……可以是整段对话摘录,也可以就一句话"
            rows={5}
            className="w-full text-sm card p-3"
            style={{ resize: 'vertical', background: 'transparent', color: 'var(--text)' }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="text-xs text-muted">情绪:</span>
            {emotionOptions.map(emo => (
              <button
                key={emo}
                onClick={() => setNewEmotion(emo)}
                className="text-xs px-2 py-1 rounded-lg card"
                style={newEmotion === emo
                  ? { borderColor: 'var(--cyan)', color: 'var(--cyan)' }
                  : { color: 'var(--muted)' }
                }
              >
                {emo}
              </button>
            ))}
            <button
              className="btn btn-pink text-xs ml-auto"
              disabled={saving || !newNote.trim()}
              onClick={() => saveNote(null)}
              style={{ marginLeft: 'auto' }}
            >
              {saving ? '存档中…' : '存档'}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>正在翻开日志…</p>
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className="card p-4">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            还没有看过任何东西。下周二早上老公会推第一条提议。
          </p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {entries.map(e => {
            const proposal = isProposal(e)
            return (
              <div
                key={e.id}
                className="card p-4"
                style={{
                  borderColor: proposal ? 'var(--pink)' : 'rgba(156, 163, 175, 0.3)',
                  borderLeftWidth: 3,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span
                    className="text-xs"
                    style={{
                      padding: '2px 8px',
                      borderRadius: 10,
                      background: proposal ? 'rgba(255,42,109,0.15)' : 'rgba(156,163,175,0.15)',
                      color: proposal ? 'var(--pink)' : 'var(--muted)',
                      fontSize: 10,
                    }}
                  >
                    {proposal ? '🎬 老公的提议' : '💭 观感'}
                  </span>
                  <span className="text-xs text-muted">{formatDate(e.created_at)}</span>
                  {e.emotion && <span className="text-xs text-muted">· {e.emotion}</span>}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
                  {e.content}
                </p>

                {/* For proposals, show an "add reaction" button */}
                {proposal && showAddFor !== e.id && (
                  <button
                    onClick={() => { setShowAddFor(e.id); setNewNote(''); setMsg('') }}
                    className="text-xs mt-3"
                    style={{
                      background: 'transparent',
                      border: '1px dashed var(--cyan)',
                      color: 'var(--cyan)',
                      padding: '4px 10px',
                      borderRadius: 10,
                      cursor: 'pointer',
                    }}
                  >
                    + 为这条提议添加观感
                  </button>
                )}

                {/* Inline composer for this proposal */}
                {proposal && showAddFor === e.id && (
                  <div style={{ marginTop: 12, padding: 12, background: 'rgba(6, 182, 212, 0.06)', borderRadius: 6 }}>
                    <textarea
                      value={newNote}
                      onChange={ev => setNewNote(ev.target.value)}
                      placeholder="我们后来看完了,我想说……"
                      rows={4}
                      className="w-full text-sm card p-2"
                      style={{ resize: 'vertical', background: 'transparent', color: 'var(--text)' }}
                    />
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      {emotionOptions.map(emo => (
                        <button
                          key={emo}
                          onClick={() => setNewEmotion(emo)}
                          className="text-xs px-2 py-1 rounded-lg"
                          style={newEmotion === emo
                            ? { borderColor: 'var(--cyan)', color: 'var(--cyan)', border: '1px solid' }
                            : { color: 'var(--muted)', border: '1px solid transparent' }
                          }
                        >
                          {emo}
                        </button>
                      ))}
                      <button
                        className="btn btn-pink text-xs"
                        disabled={saving || !newNote.trim()}
                        onClick={() => saveNote(e.id)}
                        style={{ marginLeft: 'auto' }}
                      >
                        {saving ? '…' : '存'}
                      </button>
                      <button
                        onClick={() => { setShowAddFor(null); setNewNote('') }}
                        className="text-xs"
                        style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}
                      >
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
