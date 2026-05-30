import React from 'react'
const V = "#a7372a", VL = "#c4564a", INK = "#5a4e46"
const sk = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }

export function Heart({ size = 18, color = V, fill = "none", style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" style={style} className={className} aria-hidden="true">
    <path d="M12 20.5C9 18 3.5 14.2 3.5 9.4 3.5 6.7 5.6 4.8 8 4.8c1.7 0 3.1 1 4 2.4 0.9-1.4 2.3-2.4 4-2.4 2.4 0 4.5 1.9 4.5 4.6 0 4.8-5.5 8.6-8.5 11.1z" stroke={color} fill={fill} strokeWidth="1.6" {...sk} /></svg>)
}
export function Star({ size = 16, color = V, fill = "none", style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" style={style} className={className} aria-hidden="true">
    <path d="M12 3.2l2.5 5.4 5.8 0.7-4.3 4 1.2 5.8-5.2-3-5.2 3 1.2-5.8-4.3-4 5.8-0.7z" stroke={color} fill={fill} strokeWidth="1.5" {...sk} /></svg>)
}
export function Sparkle({ size = 16, color = V, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" style={style} className={className} aria-hidden="true">
    <path d="M12 3c0.6 4.2 1.8 5.4 6 6-4.2 0.6-5.4 1.8-6 6-0.6-4.2-1.8-5.4-6-6 4.2-0.6 5.4-1.8 6-6z" stroke={color} fill={color} fillOpacity="0.18" strokeWidth="1.4" {...sk} /></svg>)
}
export function Leaf({ size = 18, color = INK, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" style={style} className={className} aria-hidden="true">
    <path d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14z" stroke={color} strokeWidth="1.5" {...sk} fill="none" />
    <path d="M7 17C10 13 13 10 16.5 8.2" stroke={color} strokeWidth="1.3" {...sk} fill="none" /></svg>)
}
export function Flower({ size = 18, color = VL, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" style={style} className={className} aria-hidden="true">
    <g stroke={color} strokeWidth="1.4" {...sk}>{[0,72,144,216,288].map((a) => (
      <ellipse key={a} cx="12" cy="6.4" rx="2.6" ry="4" transform={`rotate(${a} 12 12)`} fill={color} fillOpacity="0.14" />))}</g>
    <circle cx="12" cy="12" r="2.1" fill="#e7d39a" stroke={color} strokeWidth="1.2" /></svg>)
}
export function Pin({ size = 16, color = V, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 24 24" style={style} className={className} aria-hidden="true">
    <path d="M9 3.5l6.5 6.5M14.5 4.2l5.3 5.3M13.6 10.4l-6.4 2.1 9 9-2.1-6.4M7 17l-3.5 3.5" stroke={color} strokeWidth="1.6" {...sk} fill="none" />
    <path d="M13.6 10.4l-1.5-1.5 5-5 1.5 1.5z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.4" {...sk} /></svg>)
}
export function CoffeeCup({ size = 64, style }) {
  return (<svg width={size} height={size} viewBox="0 0 72 72" style={style} aria-hidden="true">
    <path d="M30 9c-1.5 2 1.5 3.5 0 5.5M38 7c-1.5 2 1.5 3.5 0 5.5" stroke={VL} strokeWidth="1.6" {...sk} fill="none" />
    <path d="M46 12c-0.8-1.3-2.6-0.9-2.6 0.5 0 1.4 2.6 2.8 2.6 2.8s2.6-1.4 2.6-2.8c0-1.4-1.8-1.8-2.6-0.5z" fill={VL} fillOpacity="0.5" stroke={VL} strokeWidth="1" {...sk} />
    <path d="M18 26h30v14c0 8-5 13-15 13s-15-5-15-13z" fill="#f7f3ec" stroke={INK} strokeWidth="2" {...sk} />
    <path d="M48 30c5 0 7 3 7 6s-2 6-7 6" stroke={INK} strokeWidth="2" {...sk} fill="none" />
    <circle cx="28" cy="38" r="1.6" fill={INK} /><circle cx="38" cy="38" r="1.6" fill={INK} />
    <path d="M29 43c1.8 2 5.2 2 7 0" stroke={INK} strokeWidth="1.8" {...sk} fill="none" />
    <circle cx="24.5" cy="42" r="2.2" fill={VL} fillOpacity="0.28" /><circle cx="41.5" cy="42" r="2.2" fill={VL} fillOpacity="0.28" /></svg>)
}
export function CatAvatar({ size = 40, tint = "#f3e6bf", style }) {
  return (<svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill={tint} stroke={INK} strokeWidth="1.5" opacity="0.9" />
    <path d="M14 16l3 6M34 16l-3 6" stroke={INK} strokeWidth="1.6" {...sk} fill="none" />
    <path d="M14 16c-1-3 0-5 2-5 1 2 1 4 1 6zM34 16c1-3 0-5-2-5-1 2-1 4-1 6z" fill={tint} stroke={INK} strokeWidth="1.4" {...sk} />
    <circle cx="19" cy="25" r="1.5" fill={INK} /><circle cx="29" cy="25" r="1.5" fill={INK} />
    <path d="M22.5 29c1 1 2 1 3 0" stroke={INK} strokeWidth="1.4" {...sk} fill="none" />
    <path d="M10 26h6M32 26h6M11 29l5-1M32 28l5 1" stroke={INK} strokeWidth="1.1" {...sk} fill="none" />
    <circle cx="16" cy="28" r="2" fill={VL} fillOpacity="0.25" /><circle cx="32" cy="28" r="2" fill={VL} fillOpacity="0.25" /></svg>)
}
export function RabbitAvatar({ size = 40, tint = "#f1dcd8", style }) {
  return (<svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
    <circle cx="24" cy="26" r="20" fill={tint} stroke={INK} strokeWidth="1.5" opacity="0.9" />
    <path d="M18 10c-1.5-4 0-7 2.2-7 1.8 2.5 1.6 6 0.6 9zM30 10c1.5-4 0-7-2.2-7-1.8 2.5-1.6 6-0.6 9z" fill={tint} stroke={INK} strokeWidth="1.4" {...sk} />
    <circle cx="19" cy="25" r="1.5" fill={INK} /><circle cx="29" cy="25" r="1.5" fill={INK} />
    <path d="M23 28h2M24 28v1.5M22.5 30c1 0.8 2 0.8 3 0" stroke={INK} strokeWidth="1.3" {...sk} fill="none" />
    <circle cx="16.5" cy="28" r="2" fill={VL} fillOpacity="0.22" /><circle cx="31.5" cy="28" r="2" fill={VL} fillOpacity="0.22" /></svg>)
}
export function CakeAvatar({ size = 40, tint = "#e4c3bc", style }) {
  return (<svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill={tint} stroke={INK} strokeWidth="1.5" opacity="0.9" />
    <path d="M14 30v-5c0-3 4-4 10-4s10 1 10 4v5z" fill="#f7f3ec" stroke={INK} strokeWidth="1.5" {...sk} />
    <path d="M14 25c2 2 4 2 6.5 0 2 2 4 2 6.5 0 2 2 4 2 7 0" stroke={VL} strokeWidth="1.4" {...sk} fill="none" />
    <path d="M24 21v-5M24 16c-1.5 0-1.5-2 0-2.5 1.5 0.5 1.5 2.5 0 2.5z" stroke={INK} strokeWidth="1.3" {...sk} fill={VL} fillOpacity="0.4" />
    <path d="M14 30h20" stroke={INK} strokeWidth="1.5" {...sk} /></svg>)
}
export function LeafAvatar({ size = 40, tint = "#dde3d0", style }) {
  return (<svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill={tint} stroke={INK} strokeWidth="1.5" opacity="0.9" />
    <path d="M15 32C15 22 22 15 32 15c0 10-7 17-17 17z" stroke={INK} strokeWidth="1.6" {...sk} fill="#f7f3ec" fillOpacity="0.5" />
    <path d="M18 29c4-4 7-7 11-9.5" stroke={INK} strokeWidth="1.3" {...sk} fill="none" /></svg>)
}
export function EchoAvatar({ size = 40, style, online }) {
  return (<div style={{ position: "relative", width: size, height: size, ...style }}>
    <CatAvatar size={size} tint="#f3ece0" />
    {online && (<span style={{ position: "absolute", right: 1, bottom: 1, width: size * 0.26, height: size * 0.26, background: "#6fa86b", borderRadius: "50%", border: "2px solid #f7f3ec" }} />)}</div>)
}
export function Icon({ name, size = 22, color = INK, stroke = 1.7, style, className }) {
  const p = { stroke: color, strokeWidth: stroke, ...sk, fill: "none" }
  const paths = {
    search: <><circle cx="11" cy="11" r="7" {...p} /><path d="M16.5 16.5L21 21" {...p} /></>,
    filter: <><path d="M4 7h16M7 12h10M10 17h4" {...p} /></>,
    "new-chat": <><path d="M4 6h16v10H9l-4 4v-4H4z" {...p} /><path d="M9 11h6M12 8.5v5" {...p} stroke={V} /></>,
    note: <><path d="M6 3h9l4 4v14H6z" {...p} /><path d="M15 3v4h4M9 12h7M9 16h5" {...p} /></>,
    task: <><path d="M5 4h14v16H5z" {...p} /><path d="M8 9l2 2 3.5-3.5M8 15h8" {...p} stroke={V} /></>,
    upload: <><path d="M12 16V5M8 9l4-4 4 4" {...p} stroke={V} /><path d="M5 19h14" {...p} /></>,
    pencil: <><path d="M5 19l1-4L17 4l3 3L9 18z" {...p} /><path d="M14 7l3 3" {...p} /></>,
    plus: <><path d="M12 5v14M5 12h14" {...p} /></>,
    camera: <><path d="M4 8h4l2-2h4l2 2h4v11H4z" {...p} /><circle cx="12" cy="13" r="3.4" {...p} /></>,
    send: <><path d="M4 12l16-7-7 16-2.5-6z" {...p} fill={color} fillOpacity="0.1" /><path d="M10.5 15L20 5" {...p} /></>,
    back: <><path d="M15 5l-7 7 7 7M8 12h11" {...p} stroke={V} /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" {...p} /></>,
    more: <><circle cx="6" cy="12" r="1.4" fill={color} stroke="none" /><circle cx="12" cy="12" r="1.4" fill={color} stroke="none" /><circle cx="18" cy="12" r="1.4" fill={color} stroke="none" /></>,
    phone: <><path d="M6 4c-2 2-1 7 3 11s9 5 11 3l-2.5-3-3 1c-1.5-1-3-2.5-4-4l1-3z" {...p} /></>,
    chevron: <><path d="M6 9l6 6 6-6" {...p} /></>,
    clip: <><path d="M19 11l-7.5 7.5a4 4 0 01-5.6-5.6L13 5.5a2.6 2.6 0 013.7 3.7L9 16.7a1.2 1.2 0 01-1.8-1.7L14 8" {...p} /></>,
    check: <><path d="M5 12l4 4L19 6" {...p} stroke={V} /></>,
    sort: <><path d="M7 5v14M4 16l3 3 3-3M14 8h6M14 12h4M14 16h2" {...p} /></>,
    image: <><path d="M4 5h16v14H4z" {...p} /><circle cx="9" cy="10" r="1.8" {...p} /><path d="M5 18l5-5 4 3 3-3 2 2" {...p} /></>,
    book: <><path d="M4 5c3-1.2 6-1.2 8 0v15c-2-1.2-5-1.2-8 0zM20 5c-3-1.2-6-1.2-8 0v15c2-1.2 5-1.2 8 0z" {...p} /></>,
    moon: <><path d="M20 14.5A8 8 0 019 4 8 8 0 1020 14.5z" {...p} /></>,
    trash: <><path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13" {...p} /></>,
    gear: <><circle cx="12" cy="12" r="3.2" {...p} /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" {...p} /></>,
  }
  return (<svg width={size} height={size} viewBox="0 0 24 24" style={style} className={className} aria-hidden="true">{paths[name] || null}</svg>)
}
