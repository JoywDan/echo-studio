import React from 'react'
import { Heart, Star, Sparkle, Flower, Pin, CatAvatar, RabbitAvatar, CakeAvatar, LeafAvatar, CloudFace, HeartLegs, Icon } from './doodles.jsx'

export const TINT_MAP = {
  yellow: ["var(--note-yellow)", "var(--note-yellow-d)"],
  blue:   ["var(--note-blue)",   "var(--note-blue-d)"],
  pink:   ["var(--note-pink)",   "var(--note-pink-d)"],
  green:  ["var(--note-green)",  "var(--note-green-d)"],
}
export function TornCard({ children, bg = "var(--card)", rotate = 0, style, className = "", onClick, soft = true }) {
  return (<div className={"torn " + className} onClick={onClick} style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}>
    <div className="torn-bg" style={{ background: bg, filter: soft ? "url(#rough-paper-soft)" : "url(#rough-paper)" }} />{children}</div>)
}
export function CrayonCard({ children, tint = "pink", edge, className = "", style, onClick, dbl = true }) {
  const palette = {
    pink: ["var(--pink)", "var(--pink-edge)"],
    sage: ["var(--sage)", "var(--sage-edge)"],
    cream: ["var(--cream)", "var(--cream-edge)"],
    blue: ["var(--blue)", "var(--blue-edge)"],
    yellow: ["var(--cream)", "var(--cream-edge)"],
    green: ["var(--sage)", "var(--sage-edge)"],
  }
  const [fill, border] = palette[tint] || palette.pink
  const [, edgeBorder] = palette[edge] || []
  return (<div className={"crayon-card " + className} onClick={onClick} style={{ "--tint": fill, "--edge": edgeBorder || border, ...style }}>
    <div className="crayon-bg" />
    <div className={"hand-border" + (dbl ? " dbl" : "")} />
    {children}
  </div>)
}
export function Tape({ kind = "warm", style, className = "" }) {
  return <span className={"tape " + kind + " " + className} style={style} aria-hidden="true" />
}
export function SectionHead({ title, doodle, action, onAction }) {
  return (<div className="section-head"><h2>{title}</h2>{doodle}
    {action && (<button className="head-action" onClick={onAction}>{action}</button>)}</div>)
}
export function StickyNote({ note, variant = "tape", onClick, onEdit, onDelete, deleting }) {
  const [light, dark] = TINT_MAP[note.tint] || TINT_MAP.yellow
  const doodleEl = { bowl: <Sparkle size={16} color="var(--vermillion-l)" />, sparkle: <Sparkle size={16} color="var(--vermillion-l)" />, flower: <Flower size={18} /> }[note.doodle]
  return (<div className={"sticky sticky-" + variant + (deleting ? " sticky-deleting" : "")} style={{ "--rot": (note.rotate || 0) + "deg" }} onClick={onClick}>
    {variant === "tape" && <Tape kind={note.tape || "gingham"} style={{ top: -13, left: 24, transform: "rotate(-8deg)", width: 72, height: 28 }} />}
    {variant === "pin" && <span className="sticky-pin"><Pin size={20} /></span>}
    <CrayonCard tint={note.tint === "green" ? "sage" : note.tint === "blue" ? "blue" : note.tint === "pink" ? "pink" : "cream"} className="sticky-card" style={{ "--tint": light, "--edge": dark }}>
      <div className="sticky-body">
        <div className="sticky-title sticky-title-row">
          <span>{note.title}</span>{doodleEl}</div>
        <span className="sticky-rule sticky-underline" style={{ background: "var(--vermillion-l)" }} />
        <ul className="sticky-list">{note.items.map((it, i) => (<li key={i}><span className="dot" style={{ background: dark }} />{it}</li>))}</ul>
      </div>
    </CrayonCard>
    {(onEdit || onDelete) && (
      <div className="sticky-actions">
        {onEdit && <button className="sticky-act-btn" onClick={(e) => { e.stopPropagation(); onEdit() }} title="编辑"><Icon name="pencil" size={13} color="var(--ink-soft)" /></button>}
        {onDelete && <button className="sticky-act-btn sticky-act-del" onClick={(e) => { e.stopPropagation(); onDelete() }} title="删除"><Icon name="trash" size={13} color="var(--vermillion)" /></button>}
      </div>
    )}
  </div>)
}
const AV = { cat: CatAvatar, rabbit: RabbitAvatar, cake: CakeAvatar, leaf: LeafAvatar, cloud: CloudFace, heart: HeartLegs }
export function ConversationRow({ conv, onClick, onDelete, onRename }) {
  const Avatar = AV[conv.avatar] || CatAvatar
  return (<div className={"conv-row doodle-row" + (conv.active ? " active" : "")}>
    {conv.active && <span className="wash conv-wash" />}
    <button className="conv-open" onClick={onClick}>
      <span className="conv-avatar-wrap"><Avatar size={48} tint={conv.tint} /></span>
      <div className="conv-main">
        <div className="conv-top"><span className="conv-title">{conv.title}</span><span className="conv-time">{conv.time}</span></div>
        <div className="conv-preview">{conv.preview}</div>
      </div>
    </button>
    <button className="conv-pin" onClick={(e) => { e.stopPropagation(); onRename && onRename() }} style={{ position: "relative", zIndex: 1 }} title="改名">
      <Icon name="pencil" size={15} color="var(--ink-faint)" /></button>
    <button className="conv-pin" onClick={(e) => { e.stopPropagation(); onDelete && onDelete() }} style={{ position: "relative", zIndex: 1 }} title="删除">
      <Icon name={onDelete ? "trash" : "pin"} size={15} color="var(--ink-faint)" /></button>
  </div>)
}
export function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const dueColor = task.dueType === "today" ? "var(--vermillion)" : "var(--vermillion-l)"
  const keys = ["pink", "sage", "cream", "blue"]
  const tint = keys[Math.abs(String(task.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % keys.length]
  return (<div className="task-wrap" style={{ "--rot": tint === "sage" ? "1.2deg" : tint === "blue" ? "-0.4deg" : "-1deg" }}>
    <Tape kind={tint === "sage" ? "gingham" : tint === "blue" ? "plain" : "polka"} style={{ top: -12, left: -4, transform: "rotate(-18deg)", width: 62, height: 24 }} />
    <CrayonCard tint={tint} className="task-card" dbl>
      <div className="task-inner">
        <button className={"task-check" + (task.done ? " done" : "")} onClick={onToggle} aria-label="toggle">{task.done && <Icon name="check" size={15} color="#fff" />}</button>
        <div className="task-body"><span className={"task-text" + (task.done ? " done" : "")}>{task.text}</span>
          <span className="task-due" style={{ color: dueColor }}>{task.due}</span></div>
      </div>
      <div className="task-foot">
        <span className="task-icon"><Icon name={task.icon} size={18} color="var(--ink-faint)" /></span>
        {(onEdit || onDelete) && (<span className="task-actions">
      {onEdit && <button className="task-act-btn" onClick={(e) => { e.stopPropagation(); onEdit() }} title="编辑"><Icon name="pencil" size={13} color="var(--ink-soft)" /></button>}
      {onDelete && <button className="task-act-btn" onClick={(e) => { e.stopPropagation(); onDelete() }} title="删除"><Icon name="trash" size={13} color="var(--vermillion)" /></button>}
        </span>)}
      </div>
    </CrayonCard>
  </div>)
}
export function QuickAction({ qa, onClick }) {
  const doodleEl = {
    sparkle: <Sparkle size={13} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
    heart: <Heart size={12} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
    check: <Star size={12} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
    star: <Star size={12} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
  }[qa.doodle]
  return (<button className="quick-action" onClick={onClick}>
    <CrayonCard tint="pink" edge={qa.edge || "pink"} className="qa-card" dbl={false} style={{ "--tint": "rgba(255,253,247,0.62)" }}>{doodleEl}
      <span className="qa-icon"><Icon name={qa.icon} size={28} color="var(--ink)" stroke={1.6} /></span><span className="qa-label">{qa.label}</span>
    </CrayonCard>
  </button>)
}
export function AppCard({ app }) {
  const [light] = TINT_MAP[app.tint] || TINT_MAP.yellow
  return (<button className="coming-card studio-card" onClick={() => window.open(app.url, '_blank')}>
    <CrayonCard tint={app.tint === "green" ? "sage" : app.tint === "blue" ? "blue" : app.tint === "yellow" ? "cream" : "pink"} className="studio-inner" dbl={false} style={{ "--tint": "rgba(255,253,247,0.58)" }}>
    <span className="studio-deco-fill" />
    <div className="coming-body"><span className="coming-icon studio-icon" style={{ background: light }}><Icon name={app.icon} size={20} color="var(--ink-soft)" /></span>
      <div className="coming-text"><span className="coming-title">{app.title}</span><span className="coming-sub">{app.sub}</span></div>
      <span className="coming-badge" style={{ color: "var(--vermillion)" }}>打开 ↗</span></div>
    </CrayonCard></button>)
}
export function ComingSoonCard({ mod, onClick }) {
  const [light] = TINT_MAP[mod.tint] || TINT_MAP.yellow
  return (<button className="coming-card studio-card" onClick={onClick}>
    <CrayonCard tint={mod.tint === "green" ? "sage" : mod.tint === "blue" ? "blue" : mod.tint === "yellow" ? "cream" : "pink"} className="studio-inner" dbl={false} style={{ "--tint": "rgba(255,253,247,0.58)" }}>
    <span className="studio-deco-fill" />
    <div className="coming-body"><span className="coming-icon studio-icon" style={{ background: light }}><Icon name={mod.icon} size={20} color="var(--ink-soft)" /></span>
      <div className="coming-text"><span className="coming-title">{mod.title}</span><span className="coming-sub">{mod.sub}</span></div>
      <span className="coming-badge">Coming soon</span></div>
    </CrayonCard></button>)
}
export function WashiToggle({ on, onChange, label, disabled }) {
  return (<button className="wtoggle-wrap" onClick={() => !disabled && onChange(!on)} style={disabled ? { opacity: 0.4, pointerEvents: "none" } : undefined}>
    {label && <span className="wtoggle-label">{label}</span>}<span className={"wtoggle" + (on ? " on" : "")}><span className="wtoggle-knob" /></span></button>)
}
export function ModelSelect({ value, options, onChange }) {
  const [open, setOpen] = React.useState(false)
  const cur = options.find((o) => o.id === value)
  return (<div className="model-select">
    <button className="model-trigger" onClick={() => setOpen((o) => !o)}><span>{cur ? cur.label : value}</span><Icon name="chevron" size={15} color="var(--ink-soft)" /></button>
    {open && (<><div className="model-backdrop" onClick={() => setOpen(false)} />
      <div className="model-menu">{options.map((o) => (
        <button key={o.id} className={"model-opt" + (o.id === value ? " sel" : "")} onClick={() => { onChange(o.id); setOpen(false) }}>
          {o.id === value && <Icon name="check" size={14} color="var(--vermillion)" />}<span>{o.label}</span></button>))}</div></>)}</div>)
}
