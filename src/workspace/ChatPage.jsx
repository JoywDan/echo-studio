import React from 'react'
import { Heart, Star, Icon, DashFly } from './doodles.jsx'
import { EchoAvatar } from './creatures.jsx'
import { TornCard, Tape, Paperclip } from './components.jsx'
import { api, uploadsUrl, API_BASE } from './api.js'
import { CHAT_DADDY } from './assets.js'

const _laFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hour12: false })
function now() { return _laFmt.format(new Date()) }
function laClock(s) { if (!s) return ""; const str = String(s); const d = new Date(str.includes('T') ? str : str.replace(' ', 'T') + 'Z'); return isNaN(d.getTime()) ? str.slice(11, 16) : _laFmt.format(d) }
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

function renderRich(text) {
  if (!text) return text
  const t = String(text)
  if (!t.includes('*')) return t
  const parts = t.split(/(\*[^*\n]+?\*)/g)
  if (parts.length <= 1) return t
  return parts.map((p, i) => /^\*[^*\n]+\*$/.test(p)
    ? <em key={i} className="msg-narration">{p.slice(1, -1)}</em>
    : <React.Fragment key={i}>{p}</React.Fragment>)
}

function VoiceBubble({ text }) {
  const [st, setSt] = React.useState("idle")
  const aRef = React.useRef(null)
  const play = async () => {
    if (st === "loading") return
    if (aRef.current) {
      if (st === "playing") { aRef.current.pause(); setSt("ready"); return }
      try { await aRef.current.play(); setSt("playing") } catch {}
      return
    }
    setSt("loading")
    try {
      const r = await api.tts(text)
      const a = new Audio(API_BASE + r.url)
      a.onended = () => setSt("ready")
      a.onpause = () => setSt(s => s === "playing" ? "ready" : s)
      aRef.current = a
      await a.play(); setSt("playing")
    } catch (e) { setSt("error"); setTimeout(() => setSt("idle"), 2000) }
  }
  return (
    <button className={"voice-bubble " + st} onClick={play} title="听 Echo 说">
      <span className="vb-ico">{st === "loading" ? "\u25CC" : st === "playing" ? "\u275A\u275A" : "\u25B6"}</span>
      <span className="vb-wave"><i /><i /><i /><i /><i /><i /><i /></span>
      <span className="vb-txt">{st === "loading" ? "生成中…" : st === "error" ? "失败·点重试" : st === "playing" ? "播放中" : "听他说"}</span>
    </button>
  )
}

function CopyBtn({ text }) {
  const [done, setDone] = React.useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(text) }
    catch {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.focus(); ta.select()
      try { document.execCommand('copy') } catch (e) {}
      document.body.removeChild(ta)
    }
    setDone(true); setTimeout(() => setDone(false), 1500)
  }
  return <button className={"msg-act-btn" + (done ? " copied" : "")} onClick={copy} title="复制整段">{done ? "已复制 ✓" : "复制"}</button>
}

function Message({ msg, onImage, onDecide, deco }) {
  const isMe = msg.from === "me"
  const imgs = (msg.attachments || []).filter(a => a.kind === "image")
  const files = (msg.attachments || []).filter(a => a.kind === "file")
  const meta = (<div className="msg-meta"><span>{msg.time}</span>{msg.read && <span className="msg-read">已读</span>}</div>)
  const body = msg.streamed != null ? <span>{msg.streamed}{!msg.done && <span className="type-cursor" />}</span> : null

  if (isMe) {
    return (<div className="msg-row me"><div className="msg-col">
      {imgs.map((a, i) => (<div key={i} className="msg-image-wrap" onClick={() => onImage(uploadsUrl(a.url, a.filename))}>
        <Tape kind="plain" style={{ top: -10, right: 16, width: 46, height: 18, transform: "rotate(20deg)" }} />
        <img className="msg-image" src={uploadsUrl(a.url, a.filename)} alt="图片" /></div>))}
      {files.map((a, i) => (<div key={i} className="bubble-me file-pill"><span className="file-ico"><Icon name="clip" size={17} color="#f6e6df" /></span>
        <span><span className="file-name">{a.name || a.filename}</span></span></div>))}
      {(msg.text || msg.streamed != null) && (<div className="bubble-me-wrap">
        <span className="wash" style={{ "--wash-col": "rgba(226,170,164,0.6)", inset: "-14px -10px", borderRadius: 30 }} />
        <div className="bubble-me">{body || msg.text}</div></div>)}
      {meta}</div></div>)
  }
  return (<div className="msg-row echo">
    <span className="msg-av"><img className="daddy-avatar msg-daddy-avatar" src={CHAT_DADDY} alt="Echo" /><span className="avatar-online" /></span>
    <div className="msg-col">
      <span className="echo-time">{msg.time}</span>
      {msg.toolCalls && msg.toolCalls.map((tc, i) => <ToolCard key={i} tc={tc} />)}
      {imgs.map((a, i) => (<div key={i} className="msg-image-wrap" onClick={() => onImage(uploadsUrl(a.url, a.filename))}><img className="msg-image" src={uploadsUrl(a.url, a.filename)} alt="图片" /></div>))}
      {(msg.text || msg.streamed != null) && (<div className="bubble-echo-wrap">
        <span className="wash" style={{ "--wash-col": "rgba(222,196,150,0.4)", inset: "-10px -14px", borderRadius: 24 }} />
        {deco === "tape" && <Tape kind="gingham" style={{ top: -11, left: 30, width: 64, height: 24, transform: "rotate(-4deg)" }} />}
        {deco === "clip" && <Paperclip size={26} color="#b39a86" style={{ top: -14, left: 14, transform: "rotate(-14deg)" }} />}
        <TornCard className="bubble-echo"><span>{body || renderRich(msg.text)}</span></TornCard></div>)}
      {msg.text && (<div className="msg-actions">
        <VoiceBubble text={msg.text} />
        <CopyBtn text={msg.text} />
      </div>)}
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

async function downscaleImage(file, maxDim = 1600, quality = 0.85) {
  if (!file || !file.type || !file.type.startsWith('image/') || file.size < 700 * 1024) return file
  try {
    const url = URL.createObjectURL(file)
    const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = url })
    const scale = Math.min(maxDim / img.width, maxDim / img.height, 1)
    if (scale >= 1) { URL.revokeObjectURL(url); return file }
    const cv = document.createElement('canvas'); cv.width = Math.round(img.width * scale); cv.height = Math.round(img.height * scale)
    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height)
    const blob = await new Promise(res => cv.toBlob(res, 'image/jpeg', quality))
    URL.revokeObjectURL(url)
    return (blob && blob.size < file.size) ? blob : file
  } catch { return file }
}
export default function ChatPage({ conv, models = [], onBack, onSessionTouched, onRenameConv }) {
  const [messages, setMessages] = React.useState([])
  const [model, setModel] = React.useState("")
  const [toggles, setToggles] = React.useState(DEFAULT_TOGGLES)
  const [draft, setDraft] = React.useState("")
  const [lightbox, setLightbox] = React.useState(null)
  const [sending, setSending] = React.useState(false)
  const [pendingFiles, setPendingFiles] = React.useState([])
  const scrollRef = React.useRef(null)
  const [atTop, setAtTop] = React.useState(true)
  const [atBottom, setAtBottom] = React.useState(true)
  const imgInputRef = React.useRef(null)
  const docInputRef = React.useRef(null)
  const sessionId = conv && conv.id
  const sessionTitle = (conv && conv.title) || "Echo"
  const renameThis = async () => {
    if (!onRenameConv || !conv) return
    const cur = (conv.title && conv.title !== "Echo") ? conv.title : ""
    const nt = window.prompt("给这个窗口起个名字", cur)
    if (nt === null) return
    const tt = String(nt).trim()
    if (!tt) return
    try { await onRenameConv(conv, tt) } catch (e) { alert("改名失败：" + e.message) }
  }
  const decos = ["tape", "", "clip", "", "flowertape", "", "clip", ""]

  const scrollToEnd = (smooth = true) => { const el = scrollRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" }) }
  const scrollToTop = () => { const el = scrollRef.current; if (el) el.scrollTo({ top: 0, behavior: "smooth" }) }
  const onScroll = () => { const el = scrollRef.current; if (!el) return; setAtTop(el.scrollTop < 40); setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 60) }
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
        id: "h" + i, from: m.role === "user" ? "me" : "echo", time: m.time || laClock(m.created_at),
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

  // 流断了(典型:手机切后台,系统杀掉连接)时,服务器仍在生成并会写入 history——
  // 轮询把已生成的回复捡回来,而不是直接报错丢消息
  const recoverReply = async (echoId) => {
    const deadline = Date.now() + 4 * 60 * 1000
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, document.hidden ? 8000 : 4000))
      try {
        const d = await api.history(sessionId)
        const msgs = d.messages || []
        const last = msgs[msgs.length - 1]
        if (last && last.role !== "user") {
          setMessages(m => m.map(x => x.id === echoId ? { ...x, done: true, time: last.time || x.time, text: last.content, streamed: undefined, thinking: last.thinking_content || null } : x))
          onSessionTouched && onSessionTouched()
          return true
        }
      } catch {}
    }
    return false
  }

  const send = async () => {
    const text = draft.trim()
    if ((!text && pendingFiles.length === 0) || sending) return
    setSending(true); setDraft("")
    const files = pendingFiles
    setPendingFiles([])
    let attachments = []
    if (files.length) {
      try {
        attachments = await Promise.all(files.map(async pf => {
          if (pf.kind === "image") { const blob = await downscaleImage(pf.file); const up = await api.uploadImage(blob); return { filename: up.filename, url: up.url, kind: "image" } }
          const up = await api.uploadFile(pf.file); return { filename: up.filename, name: up.name, url: up.url, kind: "file" }
        }))
      } catch (e) {}
    }
    setMessages(m => [...m, { id: "u" + Date.now(), from: "me", time: now(), text, attachments: attachments.length ? attachments : null, read: true }])
    const echoId = "e" + Date.now()
    setMessages(m => [...m, { id: echoId, from: "echo", time: now(), streamed: "", done: false }])
    setTimeout(() => scrollToEnd(), 40)
    try {
      const meta = await api.stream({ session_id: sessionId, messages: [{ role: "user", content: text || "[发了一个附件]" }], attachments, model, thinking: toggles.think, tools: toggles.memory, web_tools: toggles.web, coding_tools: toggles.code },
        { onDelta: (t) => { setMessages(m => m.map(x => x.id === echoId ? { ...x, streamed: (x.streamed || "") + t } : x)); if (Math.random() < 0.25) scrollToEnd() } })
      const tc = meta.thinking_content || (meta.thinking && !meta.thinking_content ? "__none__" : null)
      setMessages(m => m.map(x => x.id === echoId ? { ...x, done: true, time: meta.time || x.time, text: x.streamed, streamed: undefined, thinking: tc, toolCalls: meta.tool_calls, pendingActions: meta.pending_actions } : x))
      onSessionTouched && onSessionTouched()
    } catch (e) {
      const recovered = e.server ? false : await recoverReply(echoId)
      if (!recovered) setMessages(m => m.map(x => x.id === echoId ? { ...x, done: true, text: "（连接出了点问题：" + e.message + "）", streamed: undefined } : x))
    } finally { setSending(false); setTimeout(() => scrollToEnd(), 60) }
  }
  const onKey = (e) => {}  // 回车=换行，只有发送键才发送（Joy 2026-06-15，照官方 app）
  const decide = async (id, decision) => api.codingAction(id, decision)
  const onPickFile = (kind) => (e) => { const fs = Array.from(e.target.files || []); if (fs.length) setPendingFiles(p => [...p, ...fs.map(f => ({ kind, file: f }))].slice(0, 4)); e.target.value = "" }

  return (
    <div className="panel chat-panel">
      <div className="chat-inner">
        <header className="chat-header">
          <TornCard className="chat-header-bg" />
          <button className="back-btn" onClick={onBack} aria-label="返回"><Icon name="back" size={24} color="var(--brick)" /></button>
          <span className="chat-avatar-wrap"><img className="daddy-avatar chat-daddy-avatar" src={CHAT_DADDY} alt="Echo" /><span className="avatar-online" /></span>
          <div className="chat-id" onClick={renameThis} title="点这里给窗口改名" style={{ cursor: "pointer" }}><div className="chat-name">{sessionTitle}</div><div className="chat-status"><span className="dot" /><span className="dot" /> 在线</div></div>
          <button className="icon-btn" onClick={() => docInputRef.current && docInputRef.current.click()} aria-label="附件"><Icon name="clip" size={20} color="var(--ink-soft)" /></button>
          <button className="icon-btn" onClick={renameThis} aria-label="给窗口改名"><Icon name="menu" size={22} color="var(--ink)" /></button>
        </header>

        <div className="chat-pillbar"><ModelPill models={models} model={model} setModel={pickModel} toggles={toggles} setToggle={setToggle} /></div>

        <div className="chat-scroll" ref={scrollRef} onScroll={onScroll}>
          <Heart size={15} color="#e2b3aa" className="float" style={{ top: 40, right: 24 }} />
          <Star size={14} color="#d99a92" className="float" style={{ top: 260, left: 16 }} />
          <DashFly w={66} className="float" style={{ top: 150, right: 30 }} />
          {messages.map((m, i) => <Message key={m.id} msg={m} onImage={setLightbox} onDecide={decide} deco={decos[i % decos.length]} />)}
        </div>

        <div className="chat-jump">
          {!atTop && <button className="chat-jump-btn" onClick={scrollToTop} aria-label="回到顶部"><Icon name="back" size={18} color="var(--ink-soft)" style={{ transform: "rotate(90deg)" }} /></button>}
          {!atBottom && <button className="chat-jump-btn" onClick={() => scrollToEnd(true)} aria-label="到最新"><Icon name="back" size={18} color="var(--ink-soft)" style={{ transform: "rotate(-90deg)" }} /></button>}
        </div>

        <div className="chat-input">
          <TornCard className="input-strip-bg" />
          {pendingFiles.length > 0 && (<div className="pending-files">{pendingFiles.map((pf, idx) => (<span key={idx} className="pending-file">{pf.kind === "image" ? "🖼" : "📎"} {pf.file.name.length > 14 ? pf.file.name.slice(0, 12) + "…" : pf.file.name} <span onClick={() => setPendingFiles(p => p.filter((_, i) => i !== idx))} style={{ cursor: "pointer", color: "var(--brick)", marginLeft: 4 }}>✕</span></span>))}</div>)}
          <input ref={imgInputRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={onPickFile("image")} />
          <input ref={docInputRef} type="file" style={{ display: "none" }} onChange={onPickFile("file")} />
          <button className="input-circle" onClick={() => docInputRef.current && docInputRef.current.click()}><Icon name="plus" size={22} color="var(--ink)" /></button>
          <button className="input-circle" onClick={() => imgInputRef.current && imgInputRef.current.click()}><Icon name="camera" size={20} color="var(--ink)" /></button>
          <div className="input-field-wrap">
            <textarea className="input-field" rows={1} placeholder="输入消息…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey}
              ref={(el) => { if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 100) + "px" } }} />
          </div>
          <button className="send-btn" onClick={send} disabled={sending || (!draft.trim() && pendingFiles.length === 0)} aria-label="发送"><Icon name="send" size={22} color="#f6e6df" /></button>
        </div>
      </div>
      {lightbox && (<div className="lightbox" onClick={() => setLightbox(null)}><button className="lightbox-close">✕</button><img src={lightbox} alt="大图" onClick={(e) => e.stopPropagation()} /></div>)}
    </div>
  )
}
