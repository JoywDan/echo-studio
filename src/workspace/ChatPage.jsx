import React from 'react'
import { Heart, Star, Flower, Sparkle, Icon, EchoAvatar } from './doodles.jsx'
import { TornCard, Tape, WashiToggle, ModelSelect } from './components.jsx'
import { TOGGLES } from './data.jsx'
import { api, uploadsUrl } from './api.js'

function now() { const d = new Date(); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") }
const DEFAULT_TOGGLES = { think: false, memory: true, web: false, code: false }
const settingsKey = (sessionId) => `ws_chat_settings_${sessionId}`

function readSessionSettings(sessionId) {
  if (!sessionId) return null
  try {
    return JSON.parse(localStorage.getItem(settingsKey(sessionId)) || 'null')
  } catch {
    return null
  }
}

function writeSessionSettings(sessionId, patch) {
  if (!sessionId) return
  const prev = readSessionSettings(sessionId) || {}
  localStorage.setItem(settingsKey(sessionId), JSON.stringify({ ...prev, ...patch }))
}

function ThinkingBlock({ text }) {
  const [open, setOpen] = React.useState(false)
  if (text === '__none__') return <div className="thinking-block"><span className="muted" style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.6 }}>本轮没有可展示的思考摘要</span></div>
  return (<div className="thinking-block">
    <button className={"thinking-toggle" + (open ? " open" : "")} onClick={() => setOpen((o) => !o)}>
      <Sparkle size={14} color="var(--ink-faint)" />思考过程<Icon name="chevron" size={14} color="var(--ink-faint)" className="chev" /></button>
    {open && <div className="thinking-content">{text}</div>}</div>)
}
const TOOL_LABELS = { memory_search: '🔍 记忆搜索', memory_recent: '📋 最近记忆', memory_write: '✏️ 写入记忆', memory_wakeup: '🌅 记忆唤醒', web_fetch: '🌐 网页抓取', twitter_read: '🐦 推特阅读', vps_read_file: '📄 读文件', vps_list_dir: '📁 列目录', vps_grep: '🔎 搜代码', vps_git: '🌿 Git', vps_pm2: '⚙️ 进程' }
function ToolCard({ tc }) {
  return (<div className="tool-card"><span className="tool-name">{TOOL_LABELS[tc.tool] || tc.tool}</span>
    <span style={{ opacity: 0.6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{tc.result ? String(tc.result).slice(0, 80) : ''}</span></div>)
}
const ACTION_LABELS = { write_file: '📝 写文件', pm2_restart: '🔄 重启服务', run_build: '🔨 构建', git_commit: '💾 Git提交' }
function ActionCard({ pa, onDecide }) {
  const [status, setStatus] = React.useState(pa.status === 'pending' ? null : pa.status)
  const [busy, setBusy] = React.useState(false)
  const [showContent, setShowContent] = React.useState(false)
  const decide = async (decision) => {
    setBusy(true)
    try { const r = await onDecide(pa.id, decision); setStatus(r.status) }
    catch (e) { setStatus('failed') } finally { setBusy(false) }
  }
  return (<div className="tool-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8, background: 'rgba(167,55,42,0.06)', borderColor: 'rgba(167,55,42,0.25)' }}>
    <div style={{ fontWeight: 600, color: 'var(--vermillion)' }}>{ACTION_LABELS[pa.action_type] || pa.action_type} · 需要确认</div>
    <div style={{ fontSize: 13, color: 'var(--ink)' }}>{pa.summary}</div>
    {pa.params && pa.params.content !== undefined && (<>
      <button onClick={() => setShowContent(s => !s)} style={{ fontSize: 12, color: 'var(--vermillion-l)', alignSelf: 'flex-start' }}>{showContent ? '收起 ▴' : '查看内容 ▾'}</button>
      {showContent && <pre style={{ fontSize: 11, maxHeight: 160, overflow: 'auto', background: 'rgba(44,36,32,0.05)', padding: 8, borderRadius: 6, whiteSpace: 'pre-wrap' }}>{pa.params.content}</pre>}</>)}
    {!status ? (<div style={{ display: 'flex', gap: 8 }}>
      <button disabled={busy} onClick={() => decide('execute')} style={{ flex: 1, padding: 7, borderRadius: 7, background: 'var(--vermillion)', color: '#faf3ec', fontSize: 13 }}>{busy ? '执行中…' : '执行'}</button>
      <button disabled={busy} onClick={() => decide('cancel')} style={{ flex: 1, padding: 7, borderRadius: 7, border: '1px solid var(--washi-deep)', color: 'var(--ink-soft)', fontSize: 13 }}>取消</button></div>)
      : (<div style={{ fontSize: 13, color: status === 'executed' ? '#3a7d44' : status === 'cancelled' ? 'var(--ink-faint)' : 'var(--vermillion)' }}>
        {status === 'executed' ? '✓ 执行成功' : status === 'cancelled' ? '已取消' : '✗ 失败'}</div>)}
  </div>)
}
function Bubble({ children, who }) {
  return (<div className={`bubble torn bubble-${who}`}><div className="torn-bg" /><div className="bubble-content">{children}</div></div>)
}
function Message({ msg, onImage, onDecide }) {
  const isMe = msg.from === "me", isSys = msg.from === "system"
  if (isSys) return (<div className="sys-row"><span className="sys-note"><span className="warn">⚠</span>{msg.text}</span></div>)
  const meta = (<div className="msg-meta">{msg.read && <span className="msg-read">已读</span>}<span>{msg.time}</span></div>)
  return (<div className={"msg-row " + (isMe ? "me" : "echo")}>
    {!isMe && <span className="msg-avatar"><EchoAvatar size={34} online /></span>}
    <div className="msg-col">
      {msg.toolCalls && msg.toolCalls.map((tc, i) => <ToolCard key={i} tc={tc} />)}
      {msg.attachments && msg.attachments.map((a, i) => a.kind === 'file' ? (
        <Bubble key={i} who={isMe ? "me" : "echo"}><div className="file-card">
          <span className="file-icon"><Icon name="clip" size={19} color={isMe ? "#faf3ec" : "var(--vermillion)"} /></span>
          <div><div className="file-name">{a.name || '文件'}</div><div className="file-size">附件</div></div></div></Bubble>
      ) : (
        <div key={i} className="msg-image-wrap" onClick={() => onImage(uploadsUrl(a.url, a.filename))}>
          <Tape kind="warm" className="msg-image-tape" style={{ position: "absolute" }} />
          <img className="msg-image" src={uploadsUrl(a.url, a.filename)} alt="图片" /></div>))}
      {(msg.text || msg.streamed != null) && (
        <Bubble who={isMe ? "me" : "echo"}>
          {msg.streamed != null ? (<span>{msg.streamed}{!msg.done && <span className="type-cursor" />}</span>) : msg.text}</Bubble>)}
      {msg.thinking && <ThinkingBlock text={msg.thinking} />}
      {msg.pendingActions && msg.pendingActions.map((pa) => <ActionCard key={pa.id} pa={pa} onDecide={onDecide} />)}
      {meta}
    </div></div>)
}

export default function ChatPage({ conv, models, onBack, onSessionTouched, onRenameConv }) {
  const [messages, setMessages] = React.useState([])
  const [model, setModel] = React.useState('')
  const [toggles, setToggles] = React.useState(DEFAULT_TOGGLES)
  const [draft, setDraft] = React.useState("")
  const [titleDraft, setTitleDraft] = React.useState("")
  const [editingTitle, setEditingTitle] = React.useState(false)
  const [savingTitle, setSavingTitle] = React.useState(false)
  const [lightbox, setLightbox] = React.useState(null)
  const [sending, setSending] = React.useState(false)
  const [toolbarOpen, setToolbarOpen] = React.useState(false)
  const [pendingFile, setPendingFile] = React.useState(null)
  const scrollRef = React.useRef(null)
  const fileInputRef = React.useRef(null)
  const docInputRef = React.useRef(null)
  const sessionId = conv && conv.id
  const sessionTitle = (conv && conv.title) || "Echo"

  const curModel = models.find((m) => m.id === model)
  const summaryToggles = [toggles.think && '思考', toggles.memory && '记忆', toggles.web && '联网', toggles.code && '编码'].filter(Boolean).join('·')
  const scrollToEnd = (smooth = true) => { const el = scrollRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" }) }

  // Load per-session model + toggles. Each chat keeps its own little control panel.
  React.useEffect(() => {
    if (!models.length || !sessionId) return
    const saved = readSessionSettings(sessionId)
    const legacyModel = localStorage.getItem('ws_model_' + sessionId)
    const savedModel = saved && saved.model
    const nextModel = [savedModel, legacyModel, models[0].id].find((id) => id && models.some((m) => m.id === id))
    const m = models.find((x) => x.id === nextModel)
    const nextToggles = {
      ...DEFAULT_TOGGLES,
      think: m ? !!m.defaultThinking : false,
      ...(saved && saved.toggles ? saved.toggles : {}),
    }
    if (m && !m.supportsThinking) nextToggles.think = false
    setModel(nextModel)
    setToggles(nextToggles)
    setToolbarOpen(!!(saved && saved.toolbarOpen))
    if (!saved) writeSessionSettings(sessionId, { model: nextModel, toggles: nextToggles, toolbarOpen: false })
  }, [models, sessionId])

  // load history when session changes
  React.useEffect(() => {
    if (!sessionId) { setMessages([]); return }
    if (conv.isNew) { setMessages([{ id: 'welcome', from: 'echo', time: now(), text: '在呢，囡囡。想聊什么？' }]); return }
    let alive = true
    api.history(sessionId).then((d) => {
      if (!alive) return
      const msgs = (d.messages || []).map((m, i) => ({
        id: 'h' + i, from: m.role === 'user' ? 'me' : 'echo', time: (m.created_at || '').slice(11, 16),
        text: m.content, thinking: m.thinking_content || null,
        attachments: m.attachments_json ? (() => { try { return JSON.parse(m.attachments_json) } catch { return null } })() : null,
        read: m.role === 'user',
      }))
      setMessages(msgs.length ? msgs : [{ id: 'welcome', from: 'echo', time: now(), text: '在呢，囡囡。' }])
      setTimeout(() => scrollToEnd(false), 60)
    }).catch(() => setMessages([{ id: 'welcome', from: 'echo', time: now(), text: '在呢，囡囡。' }]))
    return () => { alive = false }
  }, [sessionId])

  React.useEffect(() => { scrollToEnd(false) }, [])
  React.useEffect(() => {
    setTitleDraft(sessionTitle)
    setEditingTitle(false)
  }, [sessionId, sessionTitle])

  const saveTitle = async () => {
    const next = titleDraft.trim()
    if (!next || !conv || !onRenameConv) { setEditingTitle(false); return }
    if (next === sessionTitle) { setEditingTitle(false); return }
    setSavingTitle(true)
    try {
      await onRenameConv(conv, next)
      setEditingTitle(false)
    } catch (e) {
      alert('改名失败：' + e.message)
    } finally {
      setSavingTitle(false)
    }
  }
  const onModelChange = (id) => {
    setModel(id)
    const m = models.find(x => x.id === id)
    const nextToggles = { ...toggles, think: m ? !!m.defaultThinking : false }
    setToggles(nextToggles)
    writeSessionSettings(sessionId, { model: id, toggles: nextToggles, toolbarOpen })
    if (sessionId) localStorage.setItem('ws_model_' + sessionId, id) // one-time compatibility for older saved sessions
  }
  const flipToggle = (id) => {
    if (id === 'think' && curModel && !curModel.supportsThinking) return
    setToggles((t) => {
      const next = { ...t, [id]: !t[id] }
      writeSessionSettings(sessionId, { model, toggles: next, toolbarOpen })
      return next
    })
  }

  const pickFile = (e, kind) => { const f = e.target.files[0]; if (!f) return; const lim = kind === 'image' ? 5 : 10; if (f.size > lim * 1024 * 1024) { alert(`文件太大，最大${lim}MB`); return } setPendingFile({ file: f, kind }); e.target.value = '' }

  const send = async () => {
    if (sending) return
    const text = draft.trim()
    if (!text && !pendingFile) return
    setSending(true); setDraft("")
    let attachments
    if (pendingFile) {
      try {
        const up = pendingFile.kind === 'image' ? await api.uploadImage(pendingFile.file) : await api.uploadFile(pendingFile.file)
        attachments = [pendingFile.kind === 'image' ? { filename: up.filename, url: up.url, kind: 'image' } : { filename: up.filename, name: up.name, url: up.url, kind: 'file' }]
      } catch (e) { setMessages((m) => [...m, { id: 's' + Date.now(), from: 'system', text: '附件上传失败：' + e.message }]); setSending(false); return }
    }
    const myMsg = { id: 'u' + Date.now(), from: 'me', time: now(), text: text || (attachments && attachments[0].kind === 'file' ? '📎 ' + (attachments[0].name || '文件') : '[图片]'), attachments, read: true }
    setMessages((m) => [...m, myMsg]); setPendingFile(null); setTimeout(() => scrollToEnd(), 40)
    const echoId = 'e' + Date.now()
    setMessages((m) => [...m, { id: echoId, from: 'echo', time: now(), streamed: '', done: false }])
    setTimeout(() => scrollToEnd(), 30)
    try {
      const meta = await api.stream({
        session_id: sessionId, messages: [{ role: 'user', content: text || '[发了一个附件]' }],
        session_title: sessionTitle === '新对话' ? undefined : sessionTitle,
        model, thinking: toggles.think, tools: toggles.memory, web_tools: toggles.web, coding_tools: toggles.code,
        attachments,
      }, { onDelta: (t) => { setMessages((m) => m.map((x) => x.id === echoId ? { ...x, streamed: (x.streamed || '') + t } : x)); if (Math.random() < 0.25) scrollToEnd() } })
      const tc = meta.thinking_content || (meta.thinking && !meta.thinking_content ? '__none__' : null)
      setMessages((m) => m.map((x) => x.id === echoId ? { ...x, done: true, text: x.streamed, streamed: undefined, thinking: tc, toolCalls: meta.tool_calls, pendingActions: meta.pending_actions } : x))
      if (onSessionTouched) onSessionTouched()
    } catch (e) {
      setMessages((m) => m.map((x) => x.id === echoId ? { ...x, done: true, text: '（连接出了点问题：' + e.message + '）', streamed: undefined } : x))
    } finally { setSending(false); setTimeout(() => scrollToEnd(), 50) }
  }
  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }
  const decide = async (id, decision) => { const r = await api.codingAction(id, decision); return r }

  return (
    <div className="panel chat-panel paper-bg">
      <Heart size={16} color="var(--vermillion-l)" className="float-doodle" style={{ top: 120, right: 24 }} />
      <Star size={15} color="var(--vermillion)" className="float-doodle" style={{ top: 320, left: 18 }} />
      <Flower size={18} className="float-doodle" style={{ bottom: 110, right: 30 }} />
      <div className="chat-panel-inner">
        <header className="chat-header">
          <TornCard className="chat-header-bg" />
          <button className="back-btn" onClick={onBack} aria-label="返回"><Icon name="back" size={22} color="var(--vermillion)" /></button>
          <div className="chat-id"><EchoAvatar size={40} online />
            <div className="chat-title-block">
              {editingTitle ? (
                <input
                  className="chat-title-input"
                  value={titleDraft}
                  maxLength={60}
                  disabled={savingTitle}
                  autoFocus
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); saveTitle() }
                    if (e.key === 'Escape') { setTitleDraft(sessionTitle); setEditingTitle(false) }
                  }}
                />
              ) : (
                <button className="chat-name-edit" onClick={() => setEditingTitle(true)} title="改窗口名">
                  <span className="chat-name">{sessionTitle}</span><Icon name="pencil" size={13} color="var(--ink-faint)" />
                </button>
              )}
              <div className="chat-status"><span className="dot" />在线</div>
            </div></div>
          <div className="chat-header-actions">
            <button className="icon-btn" onClick={onBack}><Icon name="menu" size={20} color="var(--ink-soft)" /></button></div>
        </header>
        <div className="chat-toolbar">
          <button className={"toolbar-toggle" + (toolbarOpen ? " open" : "")} onClick={() => { const v = !toolbarOpen; setToolbarOpen(v); writeSessionSettings(sessionId, { model, toggles, toolbarOpen: v }) }}>
            <Heart size={12} color="var(--vermillion-l)" fill="var(--vermillion-l)" />
            <span className="tt-text">{toolbarOpen ? '收起设置' : ((curModel ? curModel.label : '模型') + (summaryToggles ? ' · ' + summaryToggles : ''))}</span>
            <span className="tt-chev"><Icon name="chevron" size={15} color="var(--vermillion)" /></span>
          </button>
          {toolbarOpen && (<TornCard className="toolbar-card">
            <div className="toolbar-group"><span className="toolbar-label">模型</span>
              <ModelSelect value={model} options={models} onChange={onModelChange} /></div>
            {TOGGLES.map((tg) => (<WashiToggle key={tg.id} label={tg.label} on={toggles[tg.id]} disabled={tg.id === 'think' && curModel && !curModel.supportsThinking} onChange={() => flipToggle(tg.id)} />))}
          </TornCard>)}
        </div>
        <div className="chat-scroll" ref={scrollRef}>
          {messages.map((m) => (<Message key={m.id} msg={m} onImage={setLightbox} onDecide={decide} />))}
        </div>
        <div className="chat-input chat-input-bar">
          <TornCard className="input-strip-bg" />
          <button className="input-circle input-icon-btn" onClick={() => docInputRef.current.click()} title="发文件"><Icon name="plus" size={22} color="var(--ink-soft)" /></button>
          <button className="input-circle input-icon-btn" onClick={() => fileInputRef.current.click()} title="发图片"><Icon name="camera" size={20} color="var(--ink-soft)" /></button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => pickFile(e, 'image')} />
          <input ref={docInputRef} type="file" accept=".txt,.md,.pdf,.json,.csv,.log,.js,.ts,.py,.html,.css,.docx" style={{ display: 'none' }} onChange={(e) => pickFile(e, 'file')} />
          <div className="input-field-wrap">
            {pendingFile && (<div style={{ position: 'absolute', top: -34, left: 0, fontSize: 12, color: 'var(--ink-soft)', background: 'rgba(255,253,248,0.95)', padding: '4px 10px', borderRadius: 12, border: '1px solid var(--washi-deep)' }}>
              {pendingFile.kind === 'image' ? '🖼' : '📎'} {pendingFile.file.name} <span onClick={() => setPendingFile(null)} style={{ cursor: 'pointer', color: 'var(--vermillion)', marginLeft: 6 }}>✕</span></div>)}
            <textarea className="input-field" rows={1} placeholder="输入消息…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey}
              ref={(el) => { if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 110) + "px" } }} /></div>
          <button className="send-btn" onClick={send} disabled={sending || (!draft.trim() && !pendingFile)} aria-label="发送"><Icon name="send" size={21} color="#faf3ec" /></button>
        </div>
      </div>
      {lightbox && (<div className="lightbox" onClick={() => setLightbox(null)}>
        <button className="lightbox-close">✕</button><img src={lightbox} alt="大图" onClick={(e) => e.stopPropagation()} /></div>)}
    </div>
  )
}
