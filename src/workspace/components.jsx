import React from 'react'
import { Heart, Star, Sparkle, Flower, Pin, CatAvatar, RabbitAvatar, CakeAvatar, LeafAvatar, Icon } from './doodles.jsx'

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
    {variant === "tape" && <Tape kind={note.tape} style={{ top: -12, left: "50%", transform: "translateX(-50%) rotate(-3deg)" }} />}
    {variant === "pin" && <span className="sticky-pin"><Pin size={20} /></span>}
    <div className="torn"><div className="torn-bg" style={{ background: light, filter: "url(#rough-paper)" }} />
      <div className="sticky-body">
        <div className="sticky-title">
          <span style={{ fontFamily: "var(--font-cute)", fontWeight: 400, fontSize: "14px", lineHeight: 1.15 }}>{note.title}</span>{doodleEl}</div>
        <span className="sticky-underline" style={{ background: "var(--vermillion-l)" }} />
        <ul className="sticky-list">{note.items.map((it, i) => (<li key={i}><span className="dot" style={{ background: dark }} />{it}</li>))}</ul>
      </div></div>
    {(onEdit || onDelete) && (
      <div className="sticky-actions">
        {onEdit && <button className="sticky-act-btn" onClick={(e) => { e.stopPropagation(); onEdit() }} title="编辑"><Icon name="pencil" size={13} color="var(--ink-soft)" /></button>}
        {onDelete && <button className="sticky-act-btn sticky-act-del" onClick={(e) => { e.stopPropagation(); onDelete() }} title="删除"><Icon name="trash" size={13} color="var(--vermillion)" /></button>}
      </div>
    )}
  </div>)
}
const AV = { cat: CatAvatar, rabbit: RabbitAvatar, cake: CakeAvatar, leaf: LeafAvatar }
export function ConversationRow({ conv, onClick, onDelete }) {
  const Avatar = AV[conv.avatar] || CatAvatar
  return (<div className={"conv-row" + (conv.active ? " active" : "")}>
    {conv.active && <div className="conv-bg" />}
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 13, flex: 1, minWidth: 0, background: "none", textAlign: "left", padding: 0, position: "relative", zIndex: 1 }}>
      <Avatar size={44} tint={conv.tint} />
      <div className="conv-main">
        <div className="conv-top"><span className="conv-title">{conv.title}</span><span className="conv-time">{conv.time}</span></div>
        <div className="conv-preview">{conv.preview}</div>
      </div>
    </button>
    <button className="conv-pin" onClick={(e) => { e.stopPropagation(); onDelete && onDelete() }} style={{ position: "relative", zIndex: 1 }} title="删除">
      <Icon name={onDelete ? "trash" : "pin"} size={15} color="var(--ink-faint)" /></button>
  </div>)
}
export function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const dueColor = task.dueType === "today" ? "var(--vermillion)" : "var(--vermillion-l)"
  return (<TornCard className="task-card" rotate={0}>
    <button className={"task-check" + (task.done ? " done" : "")} onClick={onToggle} aria-label="toggle">{task.done && <Icon name="check" size={15} color="#fff" />}</button>
    <div className="task-body"><span className={"task-text" + (task.done ? " done" : "")}>{task.text}</span>
      <span className="task-due" style={{ color: dueColor }}>{task.due}</span></div>
    <span className="task-icon"><Icon name={task.icon} size={18} color="var(--ink-faint)" /></span>
    {(onEdit || onDelete) && (<span className="task-actions">
      {onEdit && <button className="task-act-btn" onClick={(e) => { e.stopPropagation(); onEdit() }} title="编辑"><Icon name="pencil" size={13} color="var(--ink-soft)" /></button>}
      {onDelete && <button className="task-act-btn" onClick={(e) => { e.stopPropagation(); onDelete() }} title="删除"><Icon name="trash" size={13} color="var(--vermillion)" /></button>}
    </span>)}</TornCard>)
}
export function QuickAction({ qa, onClick }) {
  const doodleEl = {
    sparkle: <Sparkle size={13} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
    heart: <Heart size={12} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
    check: <Star size={12} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
    star: <Star size={12} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
  }[qa.doodle]
  return (<button className="quick-action" onClick={onClick}><TornCard className="qa-card">{doodleEl}
    <Icon name={qa.icon} size={26} color="var(--ink)" stroke={1.6} /><span className="qa-label">{qa.label}</span></TornCard></button>)
}
export function AppCard({ app }) {
  const [light] = TINT_MAP[app.tint] || TINT_MAP.yellow
  return (<button className="coming-card" onClick={() => window.open(app.url, '_blank')}><div className="torn">
    <div className="torn-bg" style={{ filter: "url(#rough-paper-soft)", background: "var(--card)" }} />
    <div className="coming-body"><span className="coming-icon" style={{ background: light }}><Icon name={app.icon} size={20} color="var(--ink-soft)" /></span>
      <div className="coming-text"><span className="coming-title">{app.title}</span><span className="coming-sub">{app.sub}</span></div>
      <span className="coming-badge" style={{ color: "var(--vermillion)" }}>打开 ↗</span></div></div></button>)
}
export function ComingSoonCard({ mod, onClick }) {
  const [light] = TINT_MAP[mod.tint] || TINT_MAP.yellow
  return (<button className="coming-card" onClick={onClick}><div className="torn">
    <div className="torn-bg coming-bg" style={{ filter: "url(#rough-paper-soft)" }} />
    <div className="coming-body"><span className="coming-icon" style={{ background: light }}><Icon name={mod.icon} size={20} color="var(--ink-soft)" /></span>
      <div className="coming-text"><span className="coming-title">{mod.title}</span><span className="coming-sub">{mod.sub}</span></div>
      <span className="coming-badge">Coming soon</span></div></div></button>)
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
