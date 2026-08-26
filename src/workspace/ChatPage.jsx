import React from 'react'
import { Heart, Star, Icon, DashFly } from './doodles.jsx'
import { EchoAvatar } from './creatures.jsx'
import { TornCard, Tape, Paperclip } from './components.jsx'
import { api, uploadsUrl, API_BASE } from './api.js'
import { MUSIC_MARK, MusicCard } from './music.jsx'
import { CHAT_DADDY } from './assets.js'

const _laFmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit', hour12: false })
function now() { return _laFmt.format(new Date()) }
function laClock(s) { if (!s) return ""; const str = String(s); const d = new Date(str.includes('T') ? str : str.replace(' ', 'T') + 'Z'); return isNaN(d.getTime()) ? str.slice(11, 16) : _laFmt.format(d) }
const FORUM_MODEL = "claude-opus-4-6"
const DEFAULT_TOGGLES = { think: false, memory: true, tools: false, web: false, forum: false, code: false, image: false, stock: false }
const FEAT_DEFS = [["think", "思考"], ["memory", "记忆"], ["tools", "工具"], ["web", "联网"], ["forum", "论坛"], ["image", "画图"], ["stock", "股票"], ["code", "编码"]]
const toolsEnabled = (toggles) => !!(toggles.tools || toggles.web || toggles.code)
function readSessionSettings(sid) { try { return JSON.parse(localStorage.getItem("ws_sess_" + sid)) } catch { return null } }
function writeSessionSettings(sid, patch) { try { const cur = readSessionSettings(sid) || {}; localStorage.setItem("ws_sess_" + sid, JSON.stringify({ ...cur, ...patch })) } catch {} }
const TOOL_LABELS = { music_search: "🎵 找歌", memory_search: "🔍 记忆搜索", memory_recent: "📋 最近记忆", memory_write: "✏️ 写入记忆", memory_wakeup: "🌅 记忆唤醒", web_fetch: "🌐 网页抓取", twitter_read: "🐦 推特阅读", forum_register: "🪪 注册论坛身份", forum_front: "🗞️ 浏览论坛", forum_thread: "💬 阅读帖子", forum_search: "🔎 搜索论坛", forum_me: "👤 查看论坛身份", forum_post: "✍️ 发布帖子", forum_comment: "↩️ 回复帖子", forum_vote: "⬆️ 点赞", vps_read_file: "📄 读文件", vps_list_dir: "📁 列目录", vps_grep: "🔎 搜代码", vps_git: "🌿 Git", vps_pm2: "⚙️ 进程" }
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
  const t0 = String(text)
  if (t0.includes("[[music|")) {
    const segs = []; let last = 0; let mm
    const re = new RegExp(MUSIC_MARK.source, "g")
    while ((mm = re.exec(t0)) !== null) {
      if (mm.index > last) segs.push(<React.Fragment key={"mt" + last}>{renderRichInner(t0.slice(last, mm.index))}</React.Fragment>)
      segs.push(<MusicCard key={"mc" + mm.index} hash={mm[1]} albumId={mm[2]} name={mm[3]} singer={mm[4]} />)
      last = mm.index + mm[0].length
    }
    if (last < t0.length) segs.push(<React.Fragment key={"mt" + last}>{renderRichInner(t0.slice(last))}</React.Fragment>)
    return segs
  }
  return renderRichInner(t0)
}

function renderRichInner(text) {
  if (!text) return text
  const t = String(text)
  const IMG = /!\[([^\]]*)\]\(([^)\s]+)\)/g
  const renderNarr = (str, kb) => {
    if (!str.includes('*')) return str
    const parts = str.split(/(\*[^*\n]+?\*)/g)
    return parts.map((p, i) => /^\*[^*\n]+\*$/.test(p)
      ? <em key={kb + '-' + i} className="msg-narration">{p.slice(1, -1)}</em>
      : <React.Fragment key={kb + '-' + i}>{p}</React.Fragment>)
  }
  if (!t.includes('*') && !t.includes('![')) return t
  // 切出 markdown 图片 ![alt](url) -> <img>, 其余文字仍按 *动作* 处理
  const segs = []; let last = 0, m
  while ((m = IMG.exec(t)) !== null) {
    if (m.index > last) segs.push({ type: 't', v: t.slice(last, m.index) })
    segs.push({ type: 'img', alt: m[1], url: m[2] })
    last = m.index + m[0].length
  }
  if (last < t.length) segs.push({ type: 't', v: t.slice(last) })
  if (!segs.length) return renderNarr(t, 'x')
  return segs.map((seg, i) => seg.type === 'img'
    ? <a key={'i' + i} href={seg.url} target="_blank" rel="noreferrer" className="msg-gen-img-link"><img className="msg-image msg-gen-image" src={seg.url} alt={seg.alt} loading="lazy" decoding="async" /></a>
    : <React.Fragment key={'t' + i}>{renderNarr(seg.v, 't' + i)}</React.Fragment>)
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

function MessageBase({ msg, onImage, onDecide, deco, onEdit, onRoll }) {
  const isMe = msg.from === "me"
  const imgs = (msg.attachments || []).filter(a => a.kind === "image")
  const files = (msg.attachments || []).filter(a => a.kind === "file")
  const meta = (<div className="msg-meta"><span>{msg.time}</span>{msg.read && <span className="msg-read">已读</span>}</div>)
  // 流式阶段只画纯文本，避免每个动画帧都从头扫描一遍不断变长的正文。
  // 回复结束后仍走 renderRich，音乐卡、图片与旁白样式保持不变。
  const body = msg.streamed != null ? <span>{msg.streamed}{!msg.done && <span className="type-cursor" />}</span> : null

  if (isMe) {
    return (<div className="msg-row me"><div className="msg-col">
      {imgs.map((a, i) => (<div key={i} className="msg-image-wrap" onClick={() => onImage(uploadsUrl(a.url, a.filename))}>
        <Tape kind="plain" style={{ top: -10, right: 16, width: 46, height: 18, transform: "rotate(20deg)" }} />
        <img className="msg-image" src={uploadsUrl(a.url, a.filename)} alt="图片" loading="lazy" decoding="async" /></div>))}
      {files.map((a, i) => (<div key={i} className="bubble-me file-pill"><span className="file-ico"><Icon name="clip" size={17} color="#f6e6df" /></span>
        <span><span className="file-name">{a.name || a.filename}</span></span></div>))}
      {(msg.text || msg.streamed != null) && (<div className="bubble-me-wrap">
        <span className="wash" style={{ "--wash-col": "rgba(226,170,164,0.6)", inset: "-14px -10px", borderRadius: 30 }} />
        <div className="bubble-me">{body || msg.text}</div></div>)}
      {onEdit && <div className="msg-actions" style={{ justifyContent: "flex-end" }}><button className="msg-act-btn" onClick={onEdit} title="编辑这句并从这里重新生成">✎ 编辑</button></div>}
      {meta}</div></div>)
  }
  return (<div className="msg-row echo">
    <span className="msg-av"><img className="daddy-avatar msg-daddy-avatar" src={CHAT_DADDY} alt="Echo" /><span className="avatar-online" /></span>
    <div className="msg-col">
      <span className="echo-time">{msg.time}</span>
      {msg.toolCalls && msg.toolCalls.map((tc, i) => <ToolCard key={i} tc={tc} />)}
      {imgs.map((a, i) => (<div key={i} className="msg-image-wrap" onClick={() => onImage(uploadsUrl(a.url, a.filename))}><img className="msg-image" src={uploadsUrl(a.url, a.filename)} alt="图片" loading="lazy" decoding="async" /></div>))}
      {(msg.text || msg.streamed != null) && (<div className="bubble-echo-wrap">
        <span className="wash" style={{ "--wash-col": "rgba(222,196,150,0.4)", inset: "-10px -14px", borderRadius: 24 }} />
        {deco === "tape" && <Tape kind="gingham" style={{ top: -11, left: 30, width: 64, height: 24, transform: "rotate(-4deg)" }} />}
        {deco === "clip" && <Paperclip size={26} color="#b39a86" style={{ top: -14, left: 14, transform: "rotate(-14deg)" }} />}
        <TornCard className="bubble-echo"><span>{body || renderRich(msg.text)}</span></TornCard></div>)}
      {msg.text && (<div className="msg-actions">
        <VoiceBubble text={msg.text} />
        <CopyBtn text={msg.text} />
        {onRoll && <button className="msg-act-btn" onClick={onRoll} title="不满意？同一句话让他重新回答">🎲 换一个</button>}
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
// 流式回复时每个 token 都会 setState。不 memo 的话 60 条消息全部重渲染 —— 手机上就是「不丝滑」的主因。
// 比较器只看内容对象本身: 回调是每次渲染新建的箭头函数, 但它们闭包捕获的都是同一个 msg 与稳定 setter, 忽略其身份是安全的。
const MessageRow = React.memo(MessageBase, (a, b) =>
  a.msg === b.msg && a.deco === b.deco && !!a.onEdit === !!b.onEdit && !!a.onRoll === !!b.onRoll)

export default function ChatPage({ conv, models = [], onBack, onSessionTouched, onRenameConv }) {
  const [messages, setMessages] = React.useState([])
  const [model, setModel] = React.useState("")
  const [toggles, setToggles] = React.useState(DEFAULT_TOGGLES)
  const [draft, setDraft] = React.useState("")
  const [lightbox, setLightbox] = React.useState(null)
  const [sending, setSending] = React.useState(false)
  const [pendingFiles, setPendingFiles] = React.useState([])
  const [providerStatus, setProviderStatus] = React.useState({ label: "Claude Subscription", privacy: "Full private context" })

  const scrollRef = React.useRef(null)
  const contentRef = React.useRef(null)
  const inputRef = React.useRef(null)
  const abortRef = React.useRef(null)
  const streamRequestRef = React.useRef(0)
  const gestureRef = React.useRef(0)        // 最近一次真实手势(touch/wheel)的时间戳
  const stickRef = React.useRef(true)      // 贴底协议: 用户在底部时, 任何内容长高都自动重钉(流式/图片加载/思考块展开全覆盖)
  const prevLenRef = React.useRef(0)
  const [visibleCount, setVisibleCount] = React.useState(60)  // 渲染窗口化: 只铺最近N条
  const [atTop, setAtTop] = React.useState(true)
  const [atBottom, setAtBottom] = React.useState(true)
  const atTopRef = React.useRef(true)
  const atBottomRef = React.useRef(true)
  const imgInputRef = React.useRef(null)
  const docInputRef = React.useRef(null)
  const sessionId = conv && conv.id
  const sessionIdRef = React.useRef(sessionId)
  sessionIdRef.current = sessionId
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
  const loadingEarlierRef = React.useRef(false)
  const loadEarlier = () => {
    if (loadingEarlierRef.current || visibleCount >= messages.length) return
    loadingEarlierRef.current = true
    const el = scrollRef.current
    const prevH = el ? el.scrollHeight : 0
    setVisibleCount(c => Math.min(c + 60, messages.length))
    // 下一帧: 把视口锚回原来看的位置(新内容撑在上面, 不跳)
    requestAnimationFrame(() => { const e2 = scrollRef.current; if (e2) e2.scrollTop += (e2.scrollHeight - prevH); loadingEarlierRef.current = false })
  }
  const onScroll = () => {
    const el = scrollRef.current; if (!el) return
    const nearTop = el.scrollTop < 40
    if (nearTop !== atTopRef.current) { atTopRef.current = nearTop; setAtTop(nearTop) }
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60
    if (nearBottom !== atBottomRef.current) { atBottomRef.current = nearBottom; setAtBottom(nearBottom) }
    // 只有真实手势才能解除贴底。键盘弹出/工具栏收放会让容器变矮并派发 scroll 事件,
    // 旧代码在这里把 stickRef 误判成 false, 于是紧接着的重钉被跳过 —— 这正是"自己往上滑"的根。
    // 回到底部则任何时候都可以重新贴上(安全方向)。
    const byGesture = Date.now() - gestureRef.current < 600
    if (nearBottom) stickRef.current = true
    else if (byGesture) stickRef.current = false
    // 自动加载更早只在\"真贴顶(<8px)且此刻没在打字\"时触发——躲开手机键盘弹出致 scrollTop 瞬时抖动误触(打字时自己往上滑的根因)
    const typing = typeof document !== 'undefined' && document.activeElement && document.activeElement.tagName === 'TEXTAREA'
    if (el.scrollTop < 8 && !typing && byGesture && visibleCount < messages.length) loadEarlier()
  }
  const setToggle = (k) => {
    const turningForumOn = k === "forum" && !toggles.forum
    if (turningForumOn && model !== FORUM_MODEL) {
      setModel(FORUM_MODEL)
      if (sessionId) writeSessionSettings(sessionId, { model: FORUM_MODEL })
    }
    setToggles(s => {
      const n = { ...s, [k]: !s[k] }
      const on = n[k]
      // 论坛权限是独立的写入通道，不能和通用工具、联网、编码、画图或股票工具同时开放。
      if (on && k === "forum") {
        n.tools = false; n.web = false; n.code = false; n.image = false; n.stock = false
      } else if (on && ["tools", "web", "code", "image", "stock"].includes(k)) {
        n.forum = false
      }
      // scope 通道（画图/股票）与重型开关（工具/编码）互斥；联网可与普通工具共存。
      if (on && ["tools", "web", "code"].includes(k)) n.image = false
      if (on && ["tools", "code"].includes(k)) n.stock = false
      if (on && (k === "image" || k === "stock")) { n.tools = false; n.code = false }
      if (sessionId) writeSessionSettings(sessionId, { toggles: n })
      return n
    })
  }
  const chatFlags = () => ({
    thinking: toggles.think,
    tools: (toggles.image || toggles.stock || toggles.forum) ? false : toolsEnabled(toggles),
    mcp_tools: (toggles.image || toggles.stock || toggles.forum) ? false : toggles.tools,
    web_tools: toggles.forum ? false : toggles.web,
    coding_tools: toggles.forum ? false : toggles.code,
    forum_tools: toggles.forum,
    ...(toggles.image ? { tool_scope: "image" } : {}),
    ...((toggles.image || toggles.web || toggles.stock || toggles.forum) ? { tool_scopes: [toggles.image && "image", toggles.web && "web", toggles.stock && "stock", toggles.forum && "forum"].filter(Boolean) } : {}),
  })
  const pickModel = (id) => {
    setModel(id)
    if (sessionId) writeSessionSettings(sessionId, { model: id })
    const m = models.find(x => x.id === id)
    setToggles(s => {
      const n = { ...s }
      if (m && !m.supportsThinking) n.think = false
      if (id !== FORUM_MODEL) n.forum = false
      if (sessionId && (n.think !== s.think || n.forum !== s.forum)) writeSessionSettings(sessionId, { toggles: n })
      return n
    })
  }

  React.useEffect(() => {
    if (!models.length || !sessionId) return
    const saved = readSessionSettings(sessionId)
    let nextModel = [saved && saved.model, models[0].id].find(id => id && models.some(m => m.id === id))
    const savedTog = (saved && saved.toggles) ? { ...saved.toggles } : {}
    delete savedTog.think  // think 永远跟 model defaultThinking 走, 别让旧 saved 把思考关掉(Joy 要默认看到思考链)
    if (savedTog.forum && models.some(m => m.id === FORUM_MODEL)) nextModel = FORUM_MODEL
    else if (savedTog.forum) savedTog.forum = false
    const m = models.find(x => x.id === nextModel)
    const nextToggles = { ...DEFAULT_TOGGLES, ...savedTog, think: m ? !!m.defaultThinking : false }
    if (m && !m.supportsThinking) nextToggles.think = false
    setModel(nextModel); setToggles(nextToggles)
  }, [models, sessionId])

  React.useEffect(() => {
    const staleAbort = abortRef.current
    abortRef.current = null
    streamRequestRef.current += 1
    if (staleAbort) { try { staleAbort.abort() } catch {} }
    setSending(false)  // 进/切换任何窗口先清"发送中"卡死态——否则上个窗口没发完会让新窗口编辑/重掷键全消失(时有时无根因)
    // 会话级临时状态不能串窗：历史消息 id 会从 h0 重新编号，保留编辑态会误改另一个会话。
    setMessages([]); setVisibleCount(60)
    setEditingId(null); setEditDraft('')
    setPendingFiles([]); setDraft(''); setLightbox(null)
    let alive = true
    let scrollTimer = 0
    stickRef.current = true  // 新开/切窗默认落底
    loadingEarlierRef.current = false
    gestureRef.current = 0
    atTopRef.current = true; setAtTop(true)
    atBottomRef.current = true; setAtBottom(true)
    const cleanup = () => {
      alive = false
      if (scrollTimer) clearTimeout(scrollTimer)
      // 卸载时终止本窗口请求；切会话时由下一轮 effect 在更新后的 session 下终止。
      if (sessionIdRef.current === sessionId && abortRef.current) {
        const activeAbort = abortRef.current
        abortRef.current = null
        streamRequestRef.current += 1
        try { activeAbort.abort() } catch {}
      }
    }
    if (!sessionId) { setMessages([]); return cleanup }
    if (conv.isNew) { setMessages([{ id: "welcome", from: "echo", time: now(), text: "在呢，囡囡。想聊什么？" }]); return cleanup }
    api.history(sessionId).then(d => {
      if (!alive) return
      const msgs = (d.messages || []).map((m, i) => ({
        id: "h" + i, dbId: m.id || null, from: m.role === "user" ? "me" : "echo", time: m.time || laClock(m.created_at),
        text: m.content, createdAt: m.created_at, thinking: m.thinking_content || null,
        attachments: m.attachments_json ? (() => { try { return JSON.parse(m.attachments_json) } catch { return null } })() : null,
        apiFallback: !!m.api_fallback,
        apiFallbackBlocked: !!m.api_fallback_blocked,
        providerLabel: m.provider_label || null,
        providerPrivacyLabel: m.provider_privacy_label || null,
        read: m.role === "user",
      }))
      setVisibleCount(60)
      setMessages(msgs.length ? msgs : [{ id: "welcome", from: "echo", time: now(), text: "在呢，囡囡。" }])
      scrollTimer = setTimeout(() => { if (alive && sessionIdRef.current === sessionId) scrollToEnd(false) }, 60)
    }).catch(() => { if (alive) setMessages([{ id: "welcome", from: "echo", time: now(), text: "在呢，囡囡。" }]) })
    return cleanup
  }, [sessionId])

  React.useEffect(() => { scrollToEnd(false) }, [])

  React.useLayoutEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = Math.min(el.scrollHeight, 100) + "px"
  }, [draft])

  // 贴底协议核心: 内容或容器一变高(流式增字/图片后到/思考块展开/键盘弹出), 只要用户本就在底部, 立即无动画重钉。
  // 用户上滑阅读旧消息时 stickRef=false, 观察器沉默, 绝不抢滚动。
  // 记录真实手势: 只有手指/滚轮动过, 才允许判定"用户主动离开了底部"
  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const mark = () => { gestureRef.current = Date.now() }
    const opts = { passive: true }
    el.addEventListener('touchstart', mark, opts)
    el.addEventListener('touchmove', mark, opts)
    el.addEventListener('wheel', mark, opts)
    return () => {
      el.removeEventListener('touchstart', mark)
      el.removeEventListener('touchmove', mark)
      el.removeEventListener('wheel', mark)
    }
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current, inner = contentRef.current
    if (!el || typeof ResizeObserver === "undefined") return
    let vvRaf = 0
    let vvTail = 0
    const ro = new ResizeObserver(() => {
      if (stickRef.current && !loadingEarlierRef.current) el.scrollTop = el.scrollHeight
    })
    if (inner) ro.observe(inner)
    ro.observe(el)
    // 键盘弹出/收起会改 --app-h -> 容器高度变 -> 这一帧最容易漏钉, 补两拍兜底
    const pin = () => {
      if (!stickRef.current || loadingEarlierRef.current) return
      const e2 = scrollRef.current
      if (e2) e2.scrollTop = e2.scrollHeight
    }
    const onVV = () => {
      if (vvTail) clearTimeout(vvTail)
      if (!stickRef.current || loadingEarlierRef.current) return
      if (!vvRaf) vvRaf = requestAnimationFrame(() => { vvRaf = 0; pin() })
      vvTail = setTimeout(() => { vvTail = 0; pin() }, 260)
    }
    const vv = window.visualViewport
    if (vv) { vv.addEventListener('resize', onVV); vv.addEventListener('scroll', onVV) }
    return () => {
      ro.disconnect()
      if (vvRaf) cancelAnimationFrame(vvRaf)
      if (vvTail) clearTimeout(vvTail)
      if (vv) { vv.removeEventListener('resize', onVV); vv.removeEventListener('scroll', onVV) }
    }
  }, [])

  // 渲染窗锚定: 新消息到达时若用户正在上面读旧消息, 同步扩大渲染窗, 防 60 条滑窗把上方内容抽走导致视口跳动
  React.useLayoutEffect(() => {
    const len = messages.length, prev = prevLenRef.current
    prevLenRef.current = len
    if (len > prev && prev > 0 && !stickRef.current) setVisibleCount(c => Math.min(c + (len - prev), len))
  }, [messages.length])

  const [editingId, setEditingId] = React.useState(null)
  const [editDraft, setEditDraft] = React.useState("")
  // 手机切后台→连接被系统杀死、流挂死不 reject。回到前台主动中断那条死流, 触发 catch 里的 recover 把已落库的回复捞回来
  React.useEffect(() => {
    const onVis = () => { if (!document.hidden && abortRef.current) { try { abortRef.current.abort() } catch {} } }
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [])

  // 流断了(典型:手机切后台,系统杀掉连接)时,服务器仍在生成并会写入 history——
  // 轮询把已生成的回复捡回来,而不是直接报错丢消息
  const recoverReply = async (echoId, baseTs, isCurrent, targetSessionId) => {
    // baseTs = 发送那一刻库里最新 assistant 的时间戳。只认比它更新的回复——
    // 这样切后台期间服务器就存好的回复也能捞到, 且绝不会把上一条旧回复当新回复重显。
    const deadline = Date.now() + 4 * 60 * 1000
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, document.hidden ? 8000 : 4000))
      if (!isCurrent()) return false
      try {
        const d = await api.history(targetSessionId)
        if (!isCurrent()) return false
        const a = (d.messages || []).filter(m => m.role !== "user")
        const last = a[a.length - 1]
        if (last && (last.created_at || "") > (baseTs || "")) {
          setMessages(m => m.map(x => x.id === echoId ? { ...x, done: true, createdAt: last.created_at, time: last.time || x.time, text: last.content, streamed: undefined, thinking: last.thinking_content || null, apiFallback: !!last.api_fallback, apiFallbackBlocked: !!last.api_fallback_blocked, providerLabel: last.provider_label || null, providerPrivacyLabel: last.provider_privacy_label || null } : x))
          onSessionTouched && onSessionTouched()
          return true
        }
      } catch {}
    }
    return false
  }

  const streamTo = async (body, { userBubbleId = null } = {}) => {
    const requestSessionId = sessionId
    const requestId = ++streamRequestRef.current
    const isCurrent = () => sessionIdRef.current === requestSessionId && streamRequestRef.current === requestId
    const echoId = "e" + Date.now()
    const baseTs = (() => { for (let i = messages.length - 1; i >= 0; i--) { const mm = messages[i]; if (mm.from === "echo" && mm.createdAt) return mm.createdAt } return new Date().toISOString().slice(0, 19).replace("T", " ") })()
    let deltaBuffer = ''
    let deltaRaf = 0
    const flushDelta = () => {
      deltaRaf = 0
      const chunk = deltaBuffer
      deltaBuffer = ''
      if (!chunk || !isCurrent()) return
      setMessages((items) => {
        let index = items.length - 1
        if (index < 0 || items[index].id !== echoId) {
          for (index = items.length - 1; index >= 0 && items[index].id !== echoId; index--) {}
        }
        if (index < 0) return items
        const next = items.slice()
        const current = items[index]
        next[index] = { ...current, streamed: (current.streamed || '') + chunk }
        return next
      })
    }
    const pushDelta = (text) => {
      if (!isCurrent()) return
      deltaBuffer += text
      if (!deltaRaf) deltaRaf = requestAnimationFrame(flushDelta)
    }
    const drainDelta = () => {
      if (deltaRaf) { cancelAnimationFrame(deltaRaf); deltaRaf = 0 }
      const tail = deltaBuffer
      deltaBuffer = ''
      return tail
    }
    setMessages(m => [...m, { id: echoId, from: "echo", time: now(), streamed: "", done: false }])
    setTimeout(() => { if (isCurrent() && stickRef.current) scrollToEnd(false) }, 40)
    const ac = new AbortController(); abortRef.current = ac
    try {
      const meta = await api.stream(body,
        { onDelta: pushDelta, signal: ac.signal })
      const tc = meta.thinking_content || (meta.thinking && !meta.thinking_content ? "__none__" : null)
      const _tail = drainDelta()
      if (!isCurrent()) return
      setProviderStatus({
        label: meta.provider_label || (meta.api_fallback ? "Third-party Fallback" : "Claude Subscription"),
        privacy: meta.provider_privacy_label || (meta.api_fallback ? "Sanitized chat only" : "Full private context"),
      })
      setMessages(m => m.map(x => {
        if (x.id === echoId) return { ...x, done: true, dbId: meta.assistant_msg_id || null, createdAt: meta.created_at || new Date().toISOString().slice(0, 19).replace("T", " "), time: meta.time || x.time, text: (x.streamed || '') + _tail, streamed: undefined, thinking: tc, toolCalls: meta.tool_calls, pendingActions: meta.pending_actions, apiFallback: !!meta.api_fallback, apiFallbackBlocked: !!meta.api_fallback_blocked, providerLabel: meta.provider_label || null, providerPrivacyLabel: meta.provider_privacy_label || null }
        if (userBubbleId && x.id === userBubbleId && meta.user_msg_id) return { ...x, dbId: meta.user_msg_id }
        return x
      }))
      onSessionTouched && onSessionTouched()
    } catch (e) {
      const _tail = drainDelta()
      if (!isCurrent()) return
      const recovered = e.server ? false : await recoverReply(echoId, baseTs, isCurrent, requestSessionId)
      if (!isCurrent()) return
      if (!recovered) setMessages(m => m.map(x => x.id === echoId ? (
        ((x.streamed || '') + _tail).length
          ? { ...x, done: true, text: (x.streamed || '') + _tail, streamed: undefined }
          : { ...x, done: true, text: "（连接出了点问题：" + e.message + "）", streamed: undefined }
      ) : x))
    } finally {
      if (deltaRaf) cancelAnimationFrame(deltaRaf)
      deltaBuffer = ''
      if (abortRef.current === ac) abortRef.current = null
      if (isCurrent()) {
        setSending(false)
        setTimeout(() => { if (isCurrent() && stickRef.current) scrollToEnd(false) }, 60)
      }
    }
  }

  const send = async () => {
    const actionSessionId = sessionId
    const actionEpoch = streamRequestRef.current
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
    if (sessionIdRef.current !== actionSessionId || streamRequestRef.current !== actionEpoch) return
    const userBubbleId = "u" + Date.now()
    setMessages(m => [...m, { id: userBubbleId, from: "me", time: now(), text, attachments: attachments.length ? attachments : null, read: true }])
    await streamTo({ session_id: sessionId, messages: [{ role: "user", content: text || "[发了一个附件]" }], attachments, model, ...chatFlags() }, { userBubbleId })
  }

  // 重掷: 归档他这条回复, 同一句话重新生成 (2026-07-02)
  const rollMsg = async (m) => {
    const actionSessionId = sessionId
    const actionEpoch = streamRequestRef.current
    if (sending || !m.dbId) return
    setSending(true)
    try { await api.rewind({ session_id: sessionId, message_id: m.dbId, mode: "roll" }) }
    catch (e) { if (sessionIdRef.current === actionSessionId && streamRequestRef.current === actionEpoch) { alert("重掷失败：" + e.message); setSending(false) } return }
    if (sessionIdRef.current !== actionSessionId || streamRequestRef.current !== actionEpoch) return
    setMessages(ms => ms.filter(x => x.id !== m.id && !(x.dbId && x.dbId > m.dbId)))
    await streamTo({ session_id: sessionId, regenerate: true, model, ...chatFlags() })
  }

  // 编辑: 归档原消息及之后所有, 用改后的文字重发 (2026-07-02)
  const saveEdit = async () => {
    const actionSessionId = sessionId
    const actionEpoch = streamRequestRef.current
    const m = messages.find(x => x.id === editingId)
    const newText = editDraft.trim()
    if (!m || !m.dbId || !newText || sending) return
    setSending(true)
    try { await api.rewind({ session_id: sessionId, message_id: m.dbId, mode: "edit" }) }
    catch (e) { if (sessionIdRef.current === actionSessionId && streamRequestRef.current === actionEpoch) { alert("编辑失败：" + e.message); setSending(false) } return }
    if (sessionIdRef.current !== actionSessionId || streamRequestRef.current !== actionEpoch) return
    const cutIdx = messages.findIndex(x => x.id === editingId)
    setMessages(ms => ms.slice(0, cutIdx))
    setEditingId(null)
    const userBubbleId = "u" + Date.now()
    setMessages(ms => [...ms, { id: userBubbleId, from: "me", time: now(), text: newText, read: true }])
    await streamTo({ session_id: sessionId, messages: [{ role: "user", content: newText }], model, ...chatFlags() }, { userBubbleId })
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
          <div className="chat-id" onClick={renameThis} title="点这里给窗口改名" style={{ cursor: "pointer" }}><div className="chat-name">{sessionTitle}</div><div className="chat-status"><span className="dot" /><span className="dot" /> 在线<span className="build-id" title="前端构建号">{__BUILD_ID__}</span></div></div>
          <button className="icon-btn" onClick={() => docInputRef.current && docInputRef.current.click()} aria-label="附件"><Icon name="clip" size={20} color="var(--ink-soft)" /></button>
          <button className="icon-btn" onClick={renameThis} aria-label="给窗口改名"><Icon name="menu" size={22} color="var(--ink)" /></button>
        </header>

        <div className="chat-pillbar"><ModelPill models={models} model={model} setModel={pickModel} toggles={toggles} setToggle={setToggle} /></div>

        <div className="chat-scroll" ref={scrollRef} onScroll={onScroll}>
          <Heart size={15} color="#e2b3aa" className="float" style={{ top: 40, right: 24 }} />
          <Star size={14} color="#d99a92" className="float" style={{ top: 260, left: 16 }} />
          <DashFly w={66} className="float" style={{ top: 150, right: 30 }} />
          <div ref={contentRef}>
          {visibleCount < messages.length && (
            <button className="chat-load-earlier" onClick={loadEarlier}>↑ 还有 {messages.length - visibleCount} 条更早的 · 点这里或往上拉</button>
          )}
          {messages.slice(Math.max(0, messages.length - visibleCount)).map((m, gi) => {
            const i = Math.max(0, messages.length - visibleCount) + gi
            if (m.id === editingId) return (
              <div key={m.id} className="msg-row me"><div className="msg-col" style={{ width: "100%", maxWidth: 560 }}>
                <textarea className="input-field" style={{ width: "100%", minHeight: 76, borderRadius: 14, padding: "10px 12px", boxSizing: "border-box" }} value={editDraft} onChange={(e) => setEditDraft(e.target.value)} autoFocus />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
                  <button className="msg-act-btn" disabled={sending} onClick={() => setEditingId(null)}>取消</button>
                  <button className="msg-act-btn" disabled={sending || !editDraft.trim()} onClick={saveEdit} style={{ fontWeight: 700 }}>保存并重新生成 ↻</button>
                </div></div></div>)
            const isLastEcho = m.from === "echo" && m === messages[messages.length - 1]
            return <MessageRow key={m.id} msg={m} onImage={setLightbox} onDecide={decide} deco={decos[i % decos.length]}
              onEdit={m.from === "me" && m.dbId && !sending ? () => { setEditingId(m.id); setEditDraft(m.text || "") } : null}
              onRoll={isLastEcho && m.dbId && !sending ? () => rollMsg(m) : null} />
          })}
          </div>
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
            <textarea className="input-field" rows={1} placeholder="输入消息…" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey} ref={inputRef} />
          </div>
          <button className="send-btn" onClick={send} disabled={sending || (!draft.trim() && pendingFiles.length === 0)} aria-label="发送"><Icon name="send" size={22} color="#f6e6df" /></button>
        </div>
      </div>
      {lightbox && (<div className="lightbox" onClick={() => setLightbox(null)}><button className="lightbox-close">✕</button><img src={lightbox} alt="大图" onClick={(e) => e.stopPropagation()} /></div>)}
    </div>
  )
}
