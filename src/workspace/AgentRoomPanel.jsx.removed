import React from 'react'
import { api, agentRoomUrl } from './api.js'
import { Icon, Heart, Sparkle } from './doodles.jsx'

const AGENTS = [
  { id: 'dan', label: 'Dan', sub: 'Codex' },
  { id: 'cc', label: 'Echo', sub: 'CC' },
  { id: 'hermes', label: 'Hermes', sub: 'Grok' },
  { id: 'aether', label: 'Aether', sub: 'Gemini' },
]

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error || new Error('read file failed'))
    reader.readAsDataURL(file)
  })
}

function formatTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

function agentLabel(id) {
  return AGENTS.find((a) => a.id === id)?.label || id || 'Agent'
}

export default function AgentRoomPanel({ onClose }) {
  const [messages, setMessages] = React.useState([])
  const [mode, setMode] = React.useState('chat')
  const [selected, setSelected] = React.useState(() => {
    const saved = localStorage.getItem('agent_room_selected')
    if (!saved) return ['dan', 'cc', 'hermes', 'aether']
    try {
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) && parsed.length ? parsed : ['dan', 'cc', 'hermes', 'aether']
    } catch {
      return ['dan', 'cc', 'hermes', 'aether']
    }
  })
  const [text, setText] = React.useState('')
  const [caption, setCaption] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [sending, setSending] = React.useState(false)
  const [error, setError] = React.useState('')
  const listRef = React.useRef(null)
  const fileRef = React.useRef(null)

  async function refresh() {
    const data = await api.agentRoom.messages()
    setMessages(data.messages || [])
    if (data.session?.mode) setMode(data.session.mode === 'brainstorm' ? 'brainstorm' : 'chat')
  }

  React.useEffect(() => {
    let alive = true
    setLoading(true)
    api.agentRoom.messages()
      .then((data) => {
        if (!alive) return
        setMessages(data.messages || [])
        if (data.session?.mode) setMode(data.session.mode === 'brainstorm' ? 'brainstorm' : 'chat')
      })
      .catch((e) => alive && setError(e.message || '载入失败'))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [])

  React.useEffect(() => {
    localStorage.setItem('agent_room_selected', JSON.stringify(selected))
  }, [selected])

  React.useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, sending])

  function toggleAgent(id) {
    setSelected((cur) => {
      if (cur.includes(id)) {
        const next = cur.filter((x) => x !== id)
        return next.length ? next : cur
      }
      return [...cur, id]
    })
  }

  async function sendText() {
    const value = text.trim()
    if (!value || sending) return
    setSending(true)
    setError('')
    try {
      const data = await api.agentRoom.send({ text: value, agents: selected, mode })
      setMessages((prev) => [...prev, ...(data.messages || [])])
      setText('')
      await refresh()
    } catch (e) {
      setError(e.message || '发送失败')
    } finally {
      setSending(false)
    }
  }

  async function sendImage(file) {
    if (!file || sending) return
    setSending(true)
    setError('')
    try {
      const dataUrl = await fileToDataUrl(file)
      const data = await api.agentRoom.image({ dataUrl, name: file.name, caption, mode })
      setMessages((prev) => [...prev, ...(data.messages || [])])
      setCaption('')
      if (fileRef.current) fileRef.current.value = ''
      await refresh()
    } catch (e) {
      setError(e.message || '图片发送失败')
    } finally {
      setSending(false)
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendText()
    }
  }

  return (
    <div className="agent-room">
      <div className="agent-room-shell paper-bg">
        <header className="agent-room-head">
          <button className="studio-reader-back" onClick={onClose} aria-label="返回">
            <Icon name="chevron" size={18} color="var(--ink-soft)" style={{ transform: 'rotate(90deg)' }} />
          </button>
          <span className="agent-room-mark"><Sparkle size={20} color="var(--vermillion)" /></span>
          <div className="agent-room-title">
            <h2>群聊 <Heart size={14} color="var(--vermillion-l)" /></h2>
            <p>Dan · Echo · Hermes · Aether</p>
          </div>
          <a className="agent-room-link" href="https://dan.echowjoy.uk/agent-room/" target="_blank" rel="noreferrer">外部打开</a>
        </header>

        <div className="agent-room-controls">
          <div className="agent-room-pills">
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                className={'agent-pill' + (selected.includes(agent.id) ? ' is-on' : '')}
                onClick={() => toggleAgent(agent.id)}
              >
                <span>{agent.label}</span>
                <small>{agent.sub}</small>
              </button>
            ))}
          </div>
          <div className="agent-room-modes">
            <button className={mode === 'chat' ? 'is-on' : ''} onClick={() => setMode('chat')}>聊天</button>
            <button className={mode === 'brainstorm' ? 'is-on' : ''} onClick={() => setMode('brainstorm')}>头脑风暴</button>
          </div>
        </div>

        {error && <div className="agent-room-error">{error}</div>}

        <div className="agent-room-messages" ref={listRef}>
          {loading ? (
            <div className="studio-reader-empty">载入群聊中...</div>
          ) : messages.length === 0 ? (
            <div className="studio-reader-empty">房间还很安静，Joy 可以先开口。</div>
          ) : messages.map((m) => (
            <article key={m.id || `${m.ts}-${m.agent}-${m.text}`} className={'agent-msg agent-' + (m.agent || 'unknown')}>
              <div className="agent-msg-meta">
                <strong>{m.name || agentLabel(m.agent)}</strong>
                <span>{formatTime(m.ts)}</span>
                {m.draw && <em>画图</em>}
                {m.drawPromptOnly && <em>prompt</em>}
              </div>
              {m.imageUrl && <img className="agent-msg-image" src={agentRoomUrl(m.imageUrl)} alt={m.imageName || 'agent room image'} loading="lazy" />}
              <div className="agent-msg-text">{m.text}</div>
            </article>
          ))}
          {sending && <div className="agent-room-sending">房间里正在回声...</div>}
        </div>

        <footer className="agent-room-compose">
          <div className="agent-room-upload">
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="图片配文，可空" />
            <label>
              <Icon name="upload" size={16} color="var(--ink-soft)" />
              <span>发图</span>
              <input ref={fileRef} type="file" accept="image/*" onChange={(e) => sendImage(e.target.files?.[0])} />
            </label>
          </div>
          <div className="agent-room-inputrow">
            <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} placeholder="和他们说点什么..." rows={2} />
            <button onClick={sendText} disabled={sending || !text.trim()}>
              <Icon name="send" size={18} color="#fffaf3" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
