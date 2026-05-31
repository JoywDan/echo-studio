import React from 'react'
import rough from 'roughjs/bundled/rough.esm.js'
import {
  Heart, Star, Sparkle, Flower, FlowerFace, Pin,
  CatAvatar, RabbitAvatar, CakeAvatar, LeafAvatar,
  CloudFace, HeartLegs, BearWave, PainterBlob, WriterPink,
  CatCamera, BlobTrio, SleepCloud, PantherAvatar, Icon
} from './doodles.jsx'

export const TINT_MAP = {
  yellow: ["var(--note-yellow)", "var(--note-yellow-d)"],
  blue:   ["var(--note-blue)",   "var(--note-blue-d)"],
  pink:   ["var(--note-pink)",   "var(--note-pink-d)"],
  green:  ["var(--note-green)",  "var(--note-green-d)"],
  cream:  ["var(--cream)",       "var(--cream-edge)"],
  sage:   ["var(--sage)",        "var(--sage-edge)"],
  rose:   ["var(--pink)",        "var(--pink-edge)"],
  kraft:  ["#e8d8bf",            "#b99d78"],
}
export function TornCard({ children, bg = "var(--card)", rotate = 0, style, className = "", onClick, soft = true }) {
  return (<div className={"torn " + className} onClick={onClick} style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined, ...style }}>
    <div className="torn-bg" style={{ background: bg, filter: soft ? "url(#rough-paper-soft)" : "url(#rough-paper)" }} />{children}</div>)
}
const FRAME_PATHS = [
  [
    "M7 12 C18 7 30 10 43 8 C59 6 73 7 90 12 C94 24 92 36 94 50 C96 65 93 78 87 90 C71 96 57 91 43 94 C28 96 15 93 8 86 C4 72 8 61 6 47 C4 32 3 22 7 12Z",
    "M10 15 C24 10 36 12 50 10 C66 8 78 10 88 15 C91 28 88 41 90 54 C92 68 89 80 83 87 C68 90 55 87 40 90 C27 92 17 89 11 82 C8 70 11 58 9 45 C7 31 7 23 10 15Z",
    "M12 18 C26 15 38 17 53 15 C67 14 77 15 85 19 C87 31 85 43 87 56 C88 68 85 77 80 83 C66 86 54 83 41 85 C29 86 20 84 15 79 C12 68 14 57 13 44 C11 32 10 25 12 18Z",
  ],
  [
    "M5 18 C14 8 31 11 45 9 C61 7 80 5 94 15 C91 29 97 42 93 55 C89 68 97 80 84 91 C68 92 55 96 40 92 C26 88 13 97 6 82 C8 68 3 55 7 42 C11 29 2 24 5 18Z",
    "M9 20 C20 13 32 13 47 12 C63 11 78 10 90 18 C88 31 93 43 90 56 C87 69 91 78 82 86 C67 88 55 91 41 88 C28 85 17 91 10 80 C12 67 7 56 10 43 C13 31 7 25 9 20Z",
    "M13 22 C23 17 35 17 48 16 C63 15 75 15 86 21 C84 33 89 44 86 57 C84 68 87 76 79 82 C66 84 55 86 42 84 C30 82 21 86 14 78 C15 66 11 56 13 44 C16 33 11 27 13 22Z",
  ],
  [
    "M8 10 C25 5 34 8 49 7 C64 6 79 10 91 8 C98 22 91 35 96 50 C91 66 97 79 89 92 C74 89 60 97 44 92 C28 96 17 89 5 91 C2 76 8 62 5 48 C9 33 2 23 8 10Z",
    "M11 14 C25 10 36 11 50 10 C65 9 77 13 88 12 C93 24 88 37 91 50 C88 64 92 76 85 87 C72 85 59 91 44 87 C30 90 20 84 10 86 C7 73 12 61 9 48 C12 35 7 24 11 14Z",
    "M14 18 C27 15 38 15 51 14 C64 13 75 16 84 16 C88 27 84 38 87 50 C84 62 88 73 81 82 C70 80 58 85 45 82 C32 85 23 80 14 81 C11 70 15 60 13 48 C15 37 11 27 14 18Z",
  ],
  [
    "M9 15 C17 11 28 5 42 9 C56 13 74 4 89 13 C94 27 93 37 92 50 C91 65 98 79 86 88 C70 97 58 91 44 93 C30 95 15 94 8 84 C2 70 6 60 7 47 C8 34 2 24 9 15Z",
    "M12 18 C21 15 31 10 43 13 C57 16 72 9 86 16 C90 28 89 39 89 51 C88 64 93 76 83 84 C69 90 58 86 44 89 C31 91 19 89 12 80 C7 68 10 59 10 47 C11 35 7 26 12 18Z",
    "M15 21 C24 18 33 14 44 16 C57 18 70 13 82 19 C85 30 85 40 85 51 C84 62 88 73 80 80 C68 85 58 82 45 85 C33 87 23 85 16 77 C11 66 14 58 14 47 C14 37 11 29 15 21Z",
  ],
]

function RoughFrame({ frame = 0, dbl = true }) {
  const svgRef = React.useRef(null)

  React.useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    while (svg.firstChild) svg.removeChild(svg.firstChild)

    const frameIdx = Math.abs(Number(frame) || 0) % FRAME_PATHS.length
    const [p1, p2, p3] = FRAME_PATHS[frameIdx]
    const seed = Math.max(1, Math.abs(Number(frame) || 1) % 2147483647)
    const rc = rough.svg(svg)
    const base = {
      fill: 'none',
      stroke: 'var(--edge)',
      strokeWidth: 2.2,
      roughness: 1.65,
      bowing: 1.15,
      seed,
      disableMultiStroke: false,
      preserveVertices: false,
    }

    svg.appendChild(rc.path(p1, { ...base, strokeWidth: 2.2, roughness: 1.8, seed }))
    svg.appendChild(rc.path(p2, { ...base, strokeWidth: 1.05, roughness: 1.25, seed: seed + 17 }))
    if (dbl) svg.appendChild(rc.path(p3, { ...base, strokeWidth: 0.75, roughness: 1.05, seed: seed + 31 }))
  }, [frame, dbl])

  return <svg ref={svgRef} className={"rough-frame" + (dbl ? " dbl" : "")} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" />
}

export function CrayonCard({ children, tint = "pink", edge, className = "", style, onClick, dbl = true, frame = 0 }) {
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
  const frameIdx = Math.abs(Number(frame) || 0) % FRAME_PATHS.length
  const [p1, p2, p3] = FRAME_PATHS[frameIdx]
  const grainId = React.useId().replace(/:/g, "")
  const maskId = `crayonMask${grainId}`
  const filterId = `crayonNoise${grainId}`
  return (<div className={"crayon-card " + className} onClick={onClick} style={{ "--tint": fill, "--edge": edgeBorder || border, ...style }}>
    <div className="crayon-bg" />
    <svg className={"doodle-fill frame-" + frameIdx} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={p1} />
    </svg>
    <svg className={"crayon-wash frame-" + frameIdx} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className="wash-main" d="M13 21 C24 14 38 17 50 15 C64 13 78 16 86 24 C84 36 88 48 85 60 C81 74 70 81 56 82 C42 83 28 85 17 77 C12 64 16 52 13 39 C11 31 9 25 13 21Z" />
      <path className="wash-side" d="M18 70 C29 65 40 68 53 66 C65 64 75 66 83 72 C74 80 62 84 47 83 C34 82 25 80 18 70Z" />
      <path className="wash-corner" d="M12 26 C18 20 27 20 34 23 C27 30 19 33 12 26Z" />
    </svg>
    <div className={"hand-border" + (dbl ? " dbl" : "")} />
    <svg className={"crayon-grain-frame frame-" + frameIdx + (dbl ? " dbl" : "")} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed={(Math.abs(Number(frame) || 3) % 89) + 7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.25" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect x="-10" y="-10" width="120" height="120" fill="black" />
          <path className="grain-mask-line wide" d={p1} />
          <path className="grain-mask-line skip" d={p1} />
          <path className="grain-mask-line soft" d={p2} />
          {dbl && <path className="grain-mask-line inner" d={p3} />}
        </mask>
      </defs>
      <path className="grain-shadow-line" d={p1} />
      <path className="grain-line grain-line-main" d={p1} mask={`url(#${maskId})`} filter={`url(#${filterId})`} />
      <path className="grain-line grain-line-offset" d={p2} mask={`url(#${maskId})`} />
      {dbl && <path className="grain-line grain-line-inner" d={p3} mask={`url(#${maskId})`} />}
    </svg>
    <RoughFrame frame={hashText(String(frame) + className)} dbl={dbl} />
    <svg className={"doodle-frame frame-" + frameIdx + (dbl ? " dbl" : "")} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path className="df df-shadow" d={p1} />
      <path className="df df-crayon df1" d={p1} />
      <path className="df df-crayon df2" d={p2} />
      {dbl && <path className="df df-crayon df3" d={p3} />}
    </svg>
    {children}
  </div>)
}
export function Tape({ kind = "warm", style, className = "" }) {
  return <span className={"tape " + kind + " " + className} style={style} aria-hidden="true" />
}
export function Sticker({ name = "sparkle", size = 30, style, className = "" }) {
  const common = { style, className: "sticker sticker-" + name + " " + className }
  const map = {
    sparkle: <Sparkle size={size} color="var(--vermillion-l)" {...common} />,
    flower: <Flower size={size} color="#d98c84" {...common} />,
    star: <Star size={size} color="#d7a742" fill="#f3d47c" {...common} />,
    heart: <HeartLegs size={size} {...common} />,
    cloud: <CloudFace size={size} {...common} />,
    flowerface: <FlowerFace size={size} {...common} />,
    panther: <PantherAvatar size={size} {...common} />,
    camera: <CatCamera size={size} {...common} />,
    trio: <BlobTrio size={size + 14} {...common} />,
    sleep: <SleepCloud size={size + 12} {...common} />,
  }
  return map[name] || map.sparkle
}
export function Paperclip({ size = 30, color = "#b39a86", style }) {
  return (<svg className="clip" width={size} height={size} viewBox="0 0 30 30" style={style} aria-hidden="true">
    <path d="M9 22V11a4 4 0 0 1 8 0v12a6 6 0 0 1-12 0V12" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>)
}
export function MiniIcon({ name, size = 30, style }) {
  const I = "#5a4e42"
  const s = { stroke: I, strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }
  const m = {
    monitor: <><rect x="4" y="4" width="20" height="15" rx="2" {...s} fill="#cfd8de" /><path d="M10 12l3 3 5-6" {...s} stroke="#b1492f" /><path d="M11 19h6M9 23h10" {...s} /><path d="M21 2l1 2.5 2.5 .5-2 1.8.5 2.5L21 8l-2.5 1.3.5-2.5-2-1.8 2.5-.5z" fill="#e6c45f" stroke="#d6a83e" strokeWidth="0.8" /></>,
    pic: <><rect x="4" y="5" width="20" height="15" rx="2" {...s} fill="#cdd8de" /><circle cx="9" cy="10" r="1.6" fill="#e8c45f" stroke="none" /><path d="M5 18l5-5 3 3 4-4 6 6" {...s} /><circle cx="13" cy="12" r="1" fill="#3a3027" stroke="none" /></>,
    book: <><path d="M14 6c-3-2-7-2-10 0v16c3-2 7-2 10 0M14 6c3-2 7-2 10 0v16c-3-2-7-2-10 0M14 6v16" {...s} fill="#f1e6c4" /></>,
    envelope: <><rect x="4" y="6" width="20" height="14" rx="2" {...s} fill="#f3ece0" /><path d="M4 8l10 7 10-7" {...s} /><path d="M14 14.5c.5-.8 1.8-.5 1.8.4 0 .8-1.8 1.9-1.8 1.9s-1.8-1.1-1.8-1.9c0-.9 1.3-1.2 1.8-.4z" fill="#b1492f" stroke="none" /></>,
    moon: <><path d="M21 15A8 8 0 0 1 10 4 8.5 8.5 0 1 0 21 15z" {...s} fill="#f1e2b0" /></>,
    river: <><path d="M6 4c-3 4 4 7 1 11s2 7-1 11" {...s} stroke="#8fa6c0" /><path d="M11 4c-3 4 4 7 1 11s2 7-1 11" {...s} stroke="#a7bcc6" /></>,
    task: <><rect x="5" y="4" width="18" height="18" rx="2" {...s} fill="#e9e0d2" /><path d="M9 12l3 3 6-7" {...s} stroke="#b1492f" /></>,
    image: <><rect x="4" y="5" width="20" height="15" rx="2" {...s} fill="#cdd8de" /><circle cx="9" cy="10" r="1.6" fill="#e8c45f" /><path d="M5 18l5-5 4 3 3-3 5 5" {...s} /></>,
    send: <><path d="M4 14l20-9-8 20-3-8z" {...s} fill="#f3ece0" /><path d="M13 17L24 5" {...s} /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 28 28" style={style} aria-hidden="true">{m[name] || m.task}</svg>
}
export function SectionHead({ title, doodle, action, onAction }) {
  return (<div className="section-head"><h2>{title}</h2>{doodle}
    {action && (<button className="head-action" onClick={onAction}>{action}</button>)}</div>)
}
function hashText(value = "") {
  return String(value || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0)
}
function pickBy(value, list) {
  return list[Math.abs(hashText(value)) % list.length]
}
export function StickyNote({ note, variant = "tape", onClick, onEdit, onDelete, deleting }) {
  const seed = note.id || note.title
  const itemCount = Array.isArray(note.items) ? note.items.length : 0
  const longestItem = Array.isArray(note.items) ? note.items.reduce((m, it) => Math.max(m, String(it || "").length), 0) : 0
  const noteMinHeight = Math.min(310, Math.max(210, 156 + itemCount * 28 + Math.ceil(Math.max(0, longestItem - 18) / 16) * 16))
  const tintKey = note.tint || pickBy(seed, ["cream", "pink", "sage", "blue", "yellow"])
  const [light, dark] = TINT_MAP[tintKey] || TINT_MAP.yellow
  const sticker = note.sticker || ({ bowl: "cloud", sparkle: "star", flower: "flowerface" }[note.doodle]) || pickBy(seed, ["heart", "cloud", "flower", "flowerface", "panther", "sparkle"])
  const edge = note.edge || pickBy(seed + "edge", ["crayon", "torn", "dashed"])
  const tape = note.tape || pickBy(seed + "tape", ["gingham", "polka", "stripe", "plain", "warm"])
  const tintName = tintKey === "green" ? "sage" : tintKey === "blue" ? "blue" : tintKey === "pink" || tintKey === "rose" ? "pink" : tintKey === "sage" ? "sage" : "cream"
  const titleDoodle = { bowl: "cloud", sparkle: "sparkle", flower: "flower" }[note.doodle] || sticker
  return (<div className={"sticky sticky-" + variant + " sticky-edge-" + edge + (deleting ? " sticky-deleting" : "")} style={{ "--rot": (note.rotate ?? pickBy(seed + "rot", [-3, -2, 1, 2, 3])) + "deg", "--note-min-h": noteMinHeight + "px" }} onClick={onClick}>
    {variant === "tape" && <Tape kind={tape} style={{ top: -13, left: pickBy(seed + "left", [-4, 18, 34, 62]) , transform: `rotate(${pickBy(seed + "tr", [-16, -9, 7, 12])}deg)`, width: pickBy(seed + "tw", [66, 78, 92]), height: 28 }} />}
    {variant === "pin" && <span className="sticky-pin"><Pin size={20} /></span>}
    <CrayonCard tint={tintName} className="sticky-card" frame={hashText(seed)} style={{ "--tint": light, "--edge": dark, minHeight: `var(--note-min-h)` }}>
      <span className="card-scribble card-scribble-a" />
      <span className="card-scribble card-scribble-b" />
      <div className="sticky-body" style={{ minHeight: `var(--note-min-h)` }}>
        <div className="sticky-title sticky-title-row">
          <span>{note.title}</span><Sticker name={titleDoodle} size={18} /></div>
        <span className="sticky-rule sticky-underline" style={{ background: "var(--vermillion-l)" }} />
        <ul className="sticky-list">{note.items.map((it, i) => (<li key={i}><span className="dot" style={{ background: dark }} />{it}</li>))}</ul>
      </div>
      <Sticker name={sticker} size={46} className="card-sticker" />
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
  const seed = task.id || task.text
  const tint = task.tint || keys[Math.abs(hashText(seed)) % keys.length]
  const tape = task.tape || pickBy(seed + "tape", ["gingham", "polka", "stripe", "plain"])
  const sticker = task.sticker || ({ note: "star", pencil: "flower", send: "heart", image: "camera", star: "cloud" }[task.icon]) || pickBy(seed, ["star", "heart", "cloud", "flower", "trio"])
  const edge = task.edge || pickBy(seed + "edge", ["crayon", "torn", "dashed"])
  return (<div className={"task-wrap task-edge-" + edge} style={{ "--rot": tint === "sage" || tint === "green" ? "1.2deg" : tint === "blue" ? "-0.4deg" : "-1deg" }}>
    <Tape kind={tape} style={{ top: -12, left: -4, transform: "rotate(-18deg)", width: 62, height: 24 }} />
    <CrayonCard tint={tint === "green" ? "sage" : tint} className="task-card" frame={hashText(seed)} dbl>
      <span className="card-scribble card-scribble-a" />
      <span className="card-scribble card-scribble-b" />
      <div className="task-inner">
        <button className={"task-check" + (task.done ? " done" : "")} onClick={onToggle} aria-label="toggle">{task.done && <Icon name="check" size={15} color="#fff" />}</button>
        <div className="task-body"><span className={"task-text" + (task.done ? " done" : "")}>{task.text}</span>
          <span className="task-due" style={{ color: dueColor }}>{task.due}</span></div>
      </div>
      <Sticker name={sticker} size={44} className="card-sticker task-sticker" />
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
  const stickerName = { sparkle: "star", heart: "heart", check: "flowerface", star: "sparkle" }[qa.doodle] || "sparkle"
  const doodleEl = {
    sparkle: <Sparkle size={13} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
    heart: <Heart size={12} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
    check: <Star size={12} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
    star: <Star size={12} color="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 8 }} />,
  }[qa.doodle]
  return (<button className="quick-action" onClick={onClick}>
    <CrayonCard tint="pink" edge={qa.edge || "pink"} className="qa-card" frame={hashText(qa.id)} dbl={false} style={{ "--tint": "rgba(255,253,247,0.62)" }}>{doodleEl}
      <Sticker name={stickerName} size={28} className="qa-sticker" />
      <span className="card-scribble qa-scribble" />
      <span className="qa-icon"><Icon name={qa.icon} size={28} color="var(--ink)" stroke={1.6} /></span><span className="qa-label">{qa.label}</span>
    </CrayonCard>
  </button>)
}
const STUDIO_VISUALS = {
  cc: { edge: "pink", icon: "monitor", creature: BearWave, deco: ["heart", "arrow"] },
  gallery: { edge: "blue", icon: "pic", creature: PainterBlob, deco: ["flower", "star"] },
  diary: { edge: "cream", icon: "book", creature: WriterPink, clip: true, deco: ["star", "heart", "flower"] },
  letters: { edge: "pink", icon: "envelope", creature: null, deco: ["plane", "star"] },
  travel: { edge: "blue", icon: "pic", creature: CatCamera, clip: true, deco: ["flower"] },
  wander: { edge: "sage", icon: "moon", creature: SleepCloud, deco: ["star"] },
  "agent-room": { edge: "pink", icon: "send", creature: BlobTrio, clip: true, deco: ["star", "heart"] },
  river: { edge: "sage", icon: "river", creature: null, deco: ["flowerface", "star"], english: true },
}
function studioVisual(item) {
  return STUDIO_VISUALS[item.module] || STUDIO_VISUALS[item.id] || STUDIO_VISUALS.river
}
function StudioCardShell({ item, badge, onClick }) {
  const visual = studioVisual(item)
  const Creature = visual.creature
  return (<button className="studio-card" onClick={onClick}>
    {visual.clip && <Paperclip size={30} color="#b39a86" style={{ top: -14, right: 22, transform: "rotate(12deg)" }} />}
    <CrayonCard tint="pink" edge={visual.edge} frame={hashText(item.id || item.module || item.title)} dbl={false} className="studio-inner" style={{ "--tint": "rgba(255,253,247,0.54)" }}>
      <span className="studio-deco-fill" style={{ "--scol": `var(--${visual.edge === "sage" ? "sage" : visual.edge === "blue" ? "blue" : visual.edge === "cream" ? "cream" : "pink"}-edge)` }} />
      {visual.icon && <span className="studio-icon"><MiniIcon name={visual.icon} size={34} /></span>}
      <span className={"studio-title" + (visual.english ? " en" : "")}>{item.title}</span>
      {item.sub && <span className="studio-subtitle">{item.sub}</span>}
      {Creature && <Creature size={Creature === BlobTrio ? 68 : 54} style={{ position: "absolute", left: 10, bottom: 8 }} />}
      <span className="card-scribble studio-scribble" />
      <span className="studio-doodles">
        {visual.deco.includes("heart") && <Heart size={16} color="var(--brick)" fill="same" style={{ position: "absolute", right: 14, top: 12 }} />}
        {visual.deco.includes("star") && <Star size={15} fill="same" style={{ position: "absolute", right: 16, top: 30 }} />}
        {visual.deco.includes("flower") && <Flower size={16} color="#d98c84" style={{ position: "absolute", right: 18, top: 16 }} />}
        {visual.deco.includes("flowerface") && <FlowerFace size={26} style={{ position: "absolute", right: 12, bottom: 12 }} />}
        {visual.deco.includes("arrow") && <span className="studio-arrow">↗</span>}
        {visual.deco.includes("plane") && <span className="studio-plane">✈</span>}
      </span>
      <span className="coming-badge studio-badge">{badge}</span>
    </CrayonCard>
  </button>)
}
export function AppCard({ app }) {
  return <StudioCardShell item={app} badge="打开 ↗" onClick={() => window.open(app.url, '_blank')} />
}
export function ComingSoonCard({ mod, onClick }) {
  return <StudioCardShell item={mod} badge="Coming soon" onClick={onClick} />
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
