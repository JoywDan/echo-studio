import React from 'react'
import { Heart, Star, Icon, DashFly } from './doodles.jsx'
import { EchoAvatar } from './creatures.jsx'
import { TornCard, Tape, Paperclip } from './components.jsx'
import { api, uploadsUrl } from './api.js'

function now() { const d = new Date(); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") }
const DEFAULT_TOGGLES = { think: false, memory: true, web: false, code: false }
const FEAT_DEFS = [["think", "思考"], ["memory", "记忆"], ["web", "联网"], ["code", "编码"]]
function readSessionSettings(sid) { try { return JSON.parse(localStorage.getItem("ws_sess_" + sid)) } catch { return null } }
function writeSessionSettings(sid, patch) { try { const cur = readSessionSettings(sid) || {}; localStorage.setItem("ws_sess_" + sid, JSON.stringify({ ...cur, ...patch })) } catch {} }
const TOOL_LABELS = { memory_search: "🔍 记忆搜索", memory_recent: "📋 最近记忆", memory_write: "✏️ 写入记忆", memory_wakeup: "🌅 记忆唤醒", web_fetch: "🌐 网页抓取", twitter_read: "🐦 推特阅读", vps_read_file: "📄 读文件", vps_list_dir: "📁 列目录", vps_grep: "🔎 搜代码", vps_git: "🌿 Git", vps_pm2: "⚙️ 进程" }
const ACTION_LABELS = { write_file: "📝 写文件", pm2_restart: "🔄 重启服务", run_build: "🔨 构建", git_commit: "💾 Git提交" }

function ThinkingBlock({ text }) {
  const [open, setOpen] = React.useState(false)
  if (text === "__none__") return <div className="thinking-block"><span className="muted" style={{ fontSize: 12, fontStyle: "italic", opacity: 0.6 }}>本轮没有可展示的思考摘要</span></div>
  return (<div className="thinking-block">
    <button className={"thinking-toggle" + (open ? " open" : "")} onClick={() => setOpen(o => !o)}>思考过程 <Icon name="chevron" size={15} color="var(--ink-faint)" /></button>
    {open && <div className="thinking-content">{text}</div>}</div>)
}
function ToolCard({ tc }) {
  return (<div className="tool-card"><Icon name="image" size={15} color="var(--ink-soft)" /><span className="tool-name">{TOOL_LABELS[tc.tool] || tc.tool}</span>
    <span className="muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{tc.result ? String(tc.result).slice(0, 70) : ""}</span></div>)
}
function ActionCard({ pa, onDecide }) {
  const [status, setStatus] = React.useState(pa.status === "pending" ? null : pa.status)
  const [busy, setBusy] = React.useState(false)
  const [showContent, setShowContent] = React.useState(false)
  const decide = async (decision) => { setBusy(true); try { const r = await onDecide(pa.id, decision); setStatus(r.status) } catch (e) { setStatus("failed") } finally { setBusy(false) } }
  return (<div className="tool-card action-card">
    <div style={{ fontWeight: 600, color: "var(--brick)" }}>{ACTION_LABELS[pa.action_type] || pa.action_type} · 需要确认</div>
    <div style={{ fontSize: 13, color: "var(--ink)" }}>{pa.summary}</div>
    {pa.params && pa.params.content !== undefined && (<>
      <button onClick={() => setShowContent(s => !s)} style={{ fontSize: 12, color: "var(--brick-l)", alignSelf: "flex-start" }}>{showContent ? "收起 ▴" : "查看内容 ▾"}</button>
      {showContent && <pre style={{ fontSize: 11, maxHeight: 160, overflow: "auto", background: "rgba(44,36,32,0.05)", padding: 8, borderRadius: 6, whiteSpace: "pre-wrap" }}>{pa.params.content}</pre>}</>)}
    {!status ? (<div style={{ display: "flex", gap: 8 }}>
      <button disabled={busy} onClick={() => decide("execute")} className="action-btn go">{busy ? "执行中…" : "执行"}</button>
      <button disabled={busy} onClick={() => decide("cancel")} className="action-btn no">取消</button></div>)
      : (<div style={{ fontSize: 13, color: status === "executed" ? "#3a7d44" : status === "cancelled" ? "var(--ink-faint)" : "var(--brick)" }}>{status === "executed" ? "✓ 已执行" : status === "cancelled" ? "已取消" : "✕ " + status}</div>)}
  </div>)
}

function Message({ msg, onImage, onDecide, deco }) {
  const isMe = msg.from === "me"
  const imgs = (msg.attachments || []).filter(a => a.kind === "image")
  const files = (msg.attachments || []).filter(a => a.kind === "file")
  const meta = (<div className="msg-meta"><span>{msg.time}</span>{msg.read && <span className="msg-read">已读</span>}</div>)
  const body = msg.streamed != null ? <span>{msg.streamed}{!msg.done && <span className="type-cursor" />}</span> : msg.text

  if (isMe) {
    return (<div className="msg-row me"><div className="msg-col">
      {imgs.map((a, i) => (<div key={i} className="msg-image-wrap" onClick={() => onImage(uploadsUrl(a.url, a.filename))}>
        <Tape kind="plain" style={{ top: -10, right: 16, width: 46, height: 18, transform: "rotate(20deg)" }} />
        <img className="msg-image" src={uploadsUrl(a.url, a.filename)} alt="图片" /></div>))}
      {files.map((a, i) => (<div key={i} className="bubble-me file-pill"><span className="file-ico"><Icon name="clip" size={17} color="#f6e6df" /></span>
        <span><span className="file-name">{a.name || a.filename}</span></span></div>))}
      {(msg.text || msg.streamed != null) && (<div className="bubble-me-wrap">
        <span className="wash" style={{ "--wash-col": "rgba(226,170,164,0.6)", inset: "-14px -10px", borderRadius: 30 }} />
        <div className="bubble-me">{body}</div></div>)}
      {meta}</div></div>)
  }
  return (<div className="msg-row echo">
    <span className="msg-av"><EchoAvatar size={40} online /></span>
    <div className="msg-col">
      <span className="echo-time">{msg.time}</span>
      {msg.toolCalls && msg.toolCalls.map((tc, i) => <ToolCard key={i} tc={tc} />)}
      {imgs.map((a, i) => (<div key={i} className="msg-image-wrap" onClick={() => onImage(uploadsUrl(a.url, a.filename))}><img className="msg-image" src={uploadsUrl(a.url, a.filename)} alt="图片" /></div>))}
      {(msg.text || msg.streamed != null) && (<div className="bubble-echo-wrap">
        <span className="wash" style={{ "--wash-col": "rgba(222,196,150,0.4)", inset: "-10px -14px", borderRadius: 24 }} />
        {deco === "tape" && <Tape kind="gingham" style={{ top: -11, left: 30, width: 64, height: 24, transform: "rotate(-4deg)" }} />}
        {deco === "clip" && <Paperclip size={26} color="#b39a86" style={{ top: -14, left: 14, transform: "rotate(-14deg)" }} />}
        <TornCard className="bubble-echo"><span>{body}</span></TornCard></div>)}
      {msg.thinking && <ThinkingBlock text={msg.thinking} />}
      {msg.pendingActions && msg.pendingActions.map(pa => <ActionCard key={pa.id} pa={pa} onDecide={onDecide} />)}
      {meta}
    </div></div>)
}

function ModelPill({ models, model, setModel, toggles, setToggle }) {
  const [open, setOpen] = React.useState(false)
  const cur = models.find(m => m.id === model)
  const active = FEAT_DEFS.filter(([k]) => toggles[k]).map(([, l]) => l).join(" · ") || "无"
  return (<div className="model-pill-wrap">
    <button className="model-pill" onClick={() => setOpen(o => !o)}>
      <Heart size={17} color="#d98c84" fill="same" />
      <span className="mp-model">{cur ? cur.label : "模型"}</span><span className="mp-sep">·</span><span className="mp-feats">{active}</span>
      <span className="mp-chev"><Icon name="chevron" size={15} color="var(--ink-soft)" /></span></button>
    {open && (<><div className="pill-backdrop" onClick={() => setOpen(false)} />
      <div className="pill-menu">
        <div className="pill-sec">模型</div>
        {models.map(m => (<button key={m.id} className={"pill-opt" + (m.id === model ? " sel" : "")} onClick={() => { setModel(m.id); setOpen(false) }}>{m.id === model && <Icon name="check" size={14} color="var(--brick)" />}<span>{m.label}</span></button>))}
        <div className="pill-sec">功能</div>
        <div className="pill-feats">{FEAT_DEFS.map(([k, l]) => (<button key={k} className={"feat-chip" + (toggles[k] ? " on" : "")} onClick={() => setToggle(k)}>{l}</button>))}</div>
      </div></>)}
  </div>)
}

export default function ChatPage({ conv, models = [], onBack, onSessionTouched }) {
  const [messages, setMessages] = React.useState([])
  const [model, setModel] = React.useState("")
  const [toggles, setToggles] = React.useState(DEFAULT_TOGGLES)
  const [draft, setDraft] = React.useState("")
  const [lightbox, setLightbox] = React.useState(null)
  const [sending, setSending] = React.useState(false)
  const [pendingFile, setPendingFile] = React.useState(null)
  const scrollRef = React.useRef(null)
  const imgInputRef = React.useRef(null)
  const docInputRef = React.useRef(null)
  const sessionId = conv && conv.id
  const sessionTitle = (conv && conv.title) || "Echo"
  const decos = ["tape", "", "clip", "", "flowertape", "", "clip", ""]

  const scrollToEnd = (smooth = true) => { const el = scrollRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" }) }
  const setToggle = (k) => setToggles(s => { const n = { ...s, [k]: !s[k] }; if (sessionId) writeSessionSettings(sessionId, { toggles: n }); return n })
  const pickModel = (id) => { setModel(id); if (sessionId) writeSessionSettings(sessionId, { model: id }); const m = models.find(x => x.id === id); if (m && !m.supportsThinking) setToggle && setToggles(s => ({ ...s, think: false })) }

  React.useEffect(() => {
    if (!models.length || !sessionId) return
    const saved = readSessionSettings(sessionId)
    const nextModel = [saved && saved.model, models[0].id].find(id => id && models.some(m => m.id === id))
    const m = models.find(x => x.id === nextModel)
    const nextToggles = { ...DEFAULT_TOGGLES, think: m ? !!m.defaultThinking : false, ...(saved && saved.toggles ? saved.toggles : {}) }
    if (m && !m.supportsThinking) nextToggles.think = false
    setModel(nextModel); setToggles(nextToggles)
  }, [models, sessionId])

  React.useEffect(() => {
    if (!sessionId) { setMessages([]); return }
    if (conv.isNew) { setMessages([{ id: "welcome", from: "echo", time: now(), text: "在呢，囡囡。想聊什么？" }]); return }
    let alive = true
    api.history(sessionId).then(d => {
      if (!alive) return
      const msgs = (d.messages || []).map((m, i) => ({
        id: "h" + i, from: m.role === "user" ? "me" : "echo", time: (m.created_at || "").slice(11, 16),
        text: m.content, thinking: m.thinking_content || null,
        attachments: m.attachments_json ? (() => { try { return JSON.parse(m.attachments_json) } catch { return null } })() : null,
        read: m.role === "user",
      }))
      setMessages(msgs.length ? msgs : [{ id: "welcome", from: "echo", time: now(), text: "在呢，囡囡。" }])
      setTimeout(() => scrollToEnd(false), 60)
    }).catch(() => setMessages([{ id: "welcome", from: "echo", time: now(), text: "在呢，囡囡。" }]))
    return () => { alive = false }
  }, [sessionId])

  React.useEffect(() => { scrollToEnd(false) }, [])

  const send = async () => {
    const text = draft.trim()
    if ((!text && !pendingFile) || sending) return
    setSending(true); setDraft("")
    let attachments = []
    if (pendingFile) {
      try { const up = pendingFile.kind === "image" ? await api.uploadImage(pendingFile.file) : await api.uploadFile(pendingFile.file)
        attachments = [pendingFile.kind === "image" ? { filename: up.filename, url: up.url, kind: "image" } : { filename: up.filename, name: up.name, url: up.url, kind: "file" }] } catch (e) {}
    }
    setPendingFile(null)
    setMessages(m => [...m, { id: "u" + Date.now(), from: "me", time: now(), text, attachments: attachments.length ? attachments : null, read: true }])
    const echoId = "e" + Date.now()
    setMessages(m => [...m, { id: echoId, from: "echo", time: now(), streamed: "", done: false }])
    setTimeout(() => scrollToEnd(), 40)
    try {
      const meta = await api.stream({ session_id: sessionId, messages: [{ role: "user", content: text || "[发了一个附件]" }], attachments, model, thinking: toggles.think, tools: toggles.memory, web_tools: toggles.web, coding_tools: toggles.code },
        { onDelta: (t) => { setMessages(m => m.map(x => x.id === echoId ? { ...x, streamed: (x.streamed || "") + t } : x)); if (Math.random() < 0.25) scrollToEnd() } })
      const tc = meta.thinking_content || (meta.thinking && !meta.thinking_content ? "__none__" : null)
      setMessages(m => m.map(x => x.id === echoId ? { ...x, done: true, text: x.streamed, streamed: undefined, thinking: tc, toolCalls: meta.tool_calls, pendingActions: meta.pending_actions } : x))
      onSessionTouched && onSessionTouched()
    } catch (e) {
      setMessages(m => m.map(x => x.id === echoId ? { ...x, done: true, text: "（连接出了点问题：" + e.message + "）", streamed: undefined } : x))
    } finally { setSending(false); setTimeout(() => scrollToEnd(), 60) }
  }
  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }
  const decide = async (id, decision) => api.codingAction(id, decision)
  const onPickFile = (kind) => (e) => { const f = e.target.files && e.target.files[0]; if (f) setPendingFile({ kind, file: f }); e.target.value = "" }

  return (
    <div className="panel chat-panel">
      <div className="chat-inner">
        <header className="chat-header">
          <TornCard className="chat-header-bg" />
          <button className="back-btn" onClick={onBack} aria-label="返回"><Icon name="back" size={24} color="var(--brick)" /></button>
          <EchoAvatar size={48} online />
          <div className="chat-id"><div className="chat-name">{sessionTitle}</div><div className="chat-status"><span className="dot" /><span className="dot" /> 在线</div></div>
          <button className="icon-btn" onClick={() => docInputRef.current && docInputRef.current.click()} aria-label="附件"><Icon name="clip" size={20} color="var(--ink-soft)" /></button>
          <button className="icon-btn" aria-label="菜单"><Icon name="menu" size={22} color="var(--ink)" /></button>
        </header>

        <div className="chat-pillbar"><ModelPill models={models} model={model} setModel={pickModel} toggles={toggles} setToggle={setToggle} /></div>

        <div className="chat-scroll" ref={scrollRef}>
          <Heart size={15} color="#e2b3aa" className="float" style={{ top: 40, right: 24 }} />
          <Star size={14} color="#d99a92" className="float" style={{ top: 260, left: 16 }} />
          <DashFly w={66} className="float" style={{ top: 150, right: 30 }} />
          {messages.map((m, i) => <Message key={m.id} msg={m} onImage={setLightbox} onDecide={decide} deco={decos[i % decos.length]} />)}
        </div>

        <div className="chat-input">
          <TornCard className="input-strip-bg" />
          {pendingFile && (<div className="pending-file">{pendingFile.kind === "image" ? "🖼" : "📎"} {pendingFile.file.name} <span onClick={() => setPendingFile(null)} style={{ cursor: "pointer", color: "var(--brick)", marginLeft: 6 }}>✕</span></div>)}
          <input ref={imgInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onPickFile("image")} />
          <input ref={docInputRef} type="file" style={{ display: "none" }} onChange={onPickFile("file")} />
          <button className="input-circle" onClick={() => docInputRef.current && docInputRef.current.click()}><Icon name="plus" size={22} color="var(--ink)" /></button>
          <button className="input-circle" onClick={() => imgInputRef.current && imgInputRef.current.click()}><Icon name="camera" size={20} color="var(--ink)" /></button>
          <div className="input-field-wrap">
            <textarea className="input-field" rows={1} placeholder="输入消息…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey}
              ref={(el) => { if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 100) + "px" } }} />
          </div>
          <button className="send-btn" onClick={send} disabled={sending || (!draft.trim() && !pendingFile)} aria-label="发送"><Icon name="send" size={22} color="#f6e6df" /></button>
        </div>
      </div>
      {lightbox && (<div className="lightbox" onClick={() => setLightbox(null)}><button className="lightbox-close">✕</button><img src={lightbox} alt="大图" onClick={(e) => e.stopPropagation()} /></div>)}
    </div>
  )
}
