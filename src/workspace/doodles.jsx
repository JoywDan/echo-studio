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
export function PantherAvatar({ size = 40, style }) {
  return (<svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
    <path d="M10.5 19.8c-2.2-6.1-.2-11.6 3.2-13.2 1.8 2.8 2.1 6.1 1.4 8.8 3.2-2.3 6.6-3.3 8.9-3.3s5.8 1 8.9 3.3c-.7-2.7-.4-6 1.4-8.8 3.4 1.6 5.4 7.1 3.2 13.2 1.5 2.1 2.2 4.8 2.2 7.8 0 8.2-6.1 13.3-15.7 13.3S8.3 35.8 8.3 27.6c0-3 .7-5.7 2.2-7.8z" {...sk} fill="#221f1b" stroke="#171411" strokeWidth="1.7" />
    <path d="M13.5 10.4c.2 2.1.6 4.2 1.3 6.1M34.5 10.4c-.2 2.1-.6 4.2-1.3 6.1" stroke="#5b5148" strokeWidth="1.2" {...sk} />
    <path d="M15.8 25.3c1.8-2.7 5.3-2.6 7.1-.1-1.8 2.1-5.3 2.1-7.1.1zM25.1 25.2c1.8-2.5 5.3-2.6 7.1.1-1.8 2-5.3 2-7.1-.1z" {...sk} fill="#f0df99" stroke="#171411" strokeWidth="0.9" />
    <circle cx="19.3" cy="25.2" r="1.1" fill="#171411" /><circle cx="28.7" cy="25.2" r="1.1" fill="#171411" />
    <path d="M22.5 30.2l1.5 1.2 1.5-1.2z" {...sk} fill="#d5a1a0" stroke="#171411" strokeWidth="0.8" />
    <path d="M24 31.5v2M24 33.5c-1.5 1.2-3.1.8-3.9-.5M24 33.5c1.5 1.2 3.1.8 3.9-.5" stroke="#171411" strokeWidth="1.15" {...sk} />
    <path d="M14 29.2l-6.2-1.1M14.8 31.7l-5.5 1.7M34 29.2l6.2-1.1M33.2 31.7l5.5 1.7" stroke="#8a8175" strokeWidth="1.05" {...sk} />
    <path d="M12.5 21.4c2.4-1.7 5-2.4 8-2.1M27.5 19.3c3-.3 5.6.4 8 2.1" stroke="#4b443d" strokeWidth="1.1" {...sk} opacity="0.7" />
  </svg>)
}
export function EchoAvatar({ size = 40, style, online }) {
  return (<div style={{ position: "relative", width: size, height: size, ...style }}>
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#f2dcd7" opacity="0.5" />
      <circle cx="24" cy="24" r="21" fill="none" stroke="#d8a89d" strokeWidth="2" strokeDasharray="1.6 3.4" />
    </svg>
    <PantherAvatar size={size * 0.86} style={{ position: "absolute", left: size * 0.07, top: size * 0.07 }} />
    {online && (<span style={{ position: "absolute", right: 0, bottom: 1, width: size * 0.22, height: size * 0.22, background: "#52986c", borderRadius: "50%", border: "2px solid #f4ecdb" }} />)}</div>)
}
export function Crab({ size = 64, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 72 72" style={style} className={className} aria-hidden="true">
    <path d="M17 43c-5-2-9 .4-11 4M55 43c5-2 9 .4 11 4M15 37c-5 .5-8 3.5-8 7M57 37c5 .5 8 3.5 8 7" stroke={INK} strokeWidth="1.8" {...sk} />
    <ellipse cx="36" cy="43" rx="19" ry="14" {...sk} fill="#dd7c4e" stroke={INK} strokeWidth="1.8" />
    <path d="M17 34c-6-1.8-12-.2-13.1-5.2-.8-3.9 4.7-6.2 8.7-3.7M14.8 30c-4.2-3.2-3.4-7 .2-8.7 2.2 3 4.2 4.5 5.2 6.7M55 34c6-1.8 12-.2 13.1-5.2.8-3.9-4.7-6.2-8.7-3.7M57.2 30c4.2-3.2 3.4-7-.2-8.7-2.2 3-4.2 4.5-5.2 6.7" {...sk} fill="#dd7c4e" stroke={INK} strokeWidth="1.8" />
    <path d="M28 31V21M44 31V21" stroke={INK} strokeWidth="1.7" {...sk} />
    <circle cx="28" cy="18" r="5.8" fill="#fff8ea" stroke={INK} strokeWidth="1.6" /><circle cx="44" cy="18" r="5.8" fill="#fff8ea" stroke={INK} strokeWidth="1.6" />
    <circle cx="29" cy="19" r="2.2" fill={INK} /><circle cx="45" cy="19" r="2.2" fill={INK} />
    <path d="M30 48c2.8 2.2 6.2 2.2 8.8 0" stroke={INK} strokeWidth="1.6" {...sk} />
  </svg>)
}
export function TreasureChest({ size = 68, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 76 76" style={style} className={className} aria-hidden="true">
    <rect x="12" y="38" width="52" height="25" rx="4" fill="#b46654" stroke={INK} strokeWidth="1.8" />
    <path d="M12 42c0-10 8-16 26-16s26 6 26 16v2H12z" {...sk} fill="#c6816a" stroke={INK} strokeWidth="1.8" />
    <path d="M22 27v36M54 27v36" stroke="#d7ad4a" strokeWidth="3.3" {...sk} />
    <rect x="33" y="46" width="10" height="9" rx="2" fill="#d7ad4a" stroke={INK} strokeWidth="1.3" />
    <path d="M30 30c1.1-4 3.4-4.9 4.4-2.2 2-2 4-.8 3.4 2.2zM44 29c1.1-4 3.4-4.9 4.4-2.2 2-2 4-.8 3.4 2.2z" {...sk} fill="#fff7e9" stroke={INK} strokeWidth="1.2" />
    <path d="M37 19l1.4 3 3.2.4-2.4 2.2.7 3.2-2.9-1.7-2.9 1.7.7-3.2-2.4-2.2 3.2-.4z" {...sk} fill="#f0c65b" stroke="#c89b32" strokeWidth="1" />
  </svg>)
}
export function CloudFace({ size = 38, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 44 40" style={style} className={className} aria-hidden="true">
    <path d="M10 23c-4 0-6.5-3-5.4-6.3.7-2.9 3.8-4.8 6.8-3.6 1.1-4.1 5.2-6.3 9.1-4.5 3.8-1.4 7.7 1.1 7.9 5 3.5-.2 6.2 2.6 5.5 6-.7 3.4-4 4.5-7.2 3.7z" {...sk} fill="#afbd83" stroke={INK} strokeWidth="1.6" />
    <circle cx="16" cy="17" r="1.5" fill={INK} /><circle cx="24" cy="17" r="1.5" fill={INK} />
    <path d="M17 20c1.5 1.3 4 1.3 5.5 0" stroke={INK} strokeWidth="1.3" {...sk} />
    <circle cx="13" cy="19.5" r="2" fill="#d9958d" opacity="0.45" /><circle cx="27" cy="19.5" r="2" fill="#d9958d" opacity="0.45" />
  </svg>)
}
export function HeartLegs({ size = 34, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 48 48" style={style} className={className} aria-hidden="true">
    <path d="M24 28C20 24.5 13 20 13 13.6 13 10 15.8 7.6 19 7.6c2.3 0 4 1.4 5 3.2 1-1.8 2.7-3.2 5-3.2 3.2 0 6 2.4 6 6 0 6.4-7 10.9-11 14.4z" {...sk} fill="#ea9a91" stroke={INK} strokeWidth="1.7" />
    <circle cx="20.5" cy="16" r="1.2" fill={INK} /><circle cx="27.5" cy="16" r="1.2" fill={INK} /><path d="M21.5 19c1.4 1.2 3.6 1.2 5 0" stroke={INK} strokeWidth="1.3" {...sk} />
    <path d="M9 22c-3 1-4 3-3.5 5M39 22c3 1 4 3 3.5 5M19 30v6M22 31l-2 7M29 30v6M26 31l2 7" stroke={INK} strokeWidth="1.6" {...sk} />
  </svg>)
}
export function FlowerFace({ size = 28, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 40 40" style={style} className={className} aria-hidden="true">
    {[0, 60, 120, 180, 240, 300].map((a) => <ellipse key={a} cx="20" cy="9" rx="4.5" ry="6" transform={`rotate(${a} 20 20)`} fill="#e8b6ab" stroke={INK} strokeWidth="1.3" />)}
    <circle cx="20" cy="20" r="7.5" fill="#f4e3b4" stroke={INK} strokeWidth="1.3" />
    <circle cx="17.5" cy="19.5" r="1.1" fill={INK} /><circle cx="22.5" cy="19.5" r="1.1" fill={INK} />
    <path d="M18 22.2c1.2 1.1 2.8 1.1 4 0" stroke={INK} strokeWidth="1.2" {...sk} />
  </svg>)
}
export function BearWave({ size = 40, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 44 44" style={style} className={className} aria-hidden="true">
    <circle cx="12" cy="13" r="4" fill="#f0e2cc" stroke={INK} strokeWidth="1.4" />
    <circle cx="32" cy="13" r="4" fill="#f0e2cc" stroke={INK} strokeWidth="1.4" />
    <circle cx="22" cy="24" r="13" fill="#f3e7d3" stroke={INK} strokeWidth="1.4" />
    <path d="M8 16l-3-5M5 11c2-2 5-1 5 2" stroke={INK} strokeWidth="1.4" {...sk} />
    <circle cx="18" cy="23" r="1.5" fill={INK} /><circle cx="26" cy="23" r="1.5" fill={INK} />
    <ellipse cx="22" cy="27" rx="3" ry="2.2" fill="#e7d2b0" stroke={INK} strokeWidth="1" />
    <circle cx="22" cy="26" r="1" fill={INK} />
    <path d="M16 36c2-2 4-3 7-1" stroke="#c98a7c" strokeWidth="2" {...sk} />
  </svg>)
}
export function PainterBlob({ size = 40, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 44 44" style={style} className={className} aria-hidden="true">
    <path d="M8 18c-2-4 2-8 7-8 1-3 8-3 9 0 5 0 8 4 6 8 2 3-1 7-5 6H12c-4 1-6-3-4-6z" fill="#f3e0d0" stroke={INK} strokeWidth="1.4" {...sk} />
    <ellipse cx="14.5" cy="11" rx="9" ry="2.5" fill="#caa18c" stroke={INK} strokeWidth="1.4" />
    <path d="M30 16l5-5M35 11l1-2" stroke={INK} strokeWidth="1.4" {...sk} />
    <circle cx="14" cy="17" r="1.4" fill={INK} /><circle cx="22" cy="17" r="1.4" fill={INK} />
    <path d="M15 20c1.5 1.3 4 1.3 5.5 0" stroke={INK} strokeWidth="1.2" {...sk} />
    <circle cx="35" cy="9" r="1.6" fill="#d36a6a" />
  </svg>)
}
export function WriterPink({ size = 42, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 46 40" style={style} className={className} aria-hidden="true">
    <path d="M4 34c4-4 14-5 20-2" stroke="#c9a98c" strokeWidth="1.4" {...sk} />
    <path d="M6 30c2-9 16-9 18 0z" fill="#f3ece0" stroke={INK} strokeWidth="1.4" {...sk} />
    <circle cx="13" cy="16" r="9" fill="#f1ddd6" stroke={INK} strokeWidth="1.4" />
    <path d="M5 14c0-5 5-8 8-7M21 14c0-5-5-8-8-7" fill="#eeb6b8" stroke={INK} strokeWidth="1.4" {...sk} />
    <path d="M22 30l8-4 2 3-8 4z" fill="#d8b98a" stroke={INK} strokeWidth="1.4" {...sk} />
    <circle cx="10" cy="16" r="1.3" fill={INK} /><circle cx="16" cy="16" r="1.3" fill={INK} />
    <path d="M11 19c1 1 3 1 4 0" stroke={INK} strokeWidth="1.2" {...sk} />
  </svg>)
}
export function CatCamera({ size = 42, style, className }) {
  return (<svg width={size} height={size} viewBox="0 0 46 40" style={style} className={className} aria-hidden="true">
    <path d="M8 12l2-5 3 4zM18 11l3-4 1 5z" fill="#f3ece2" stroke={INK} strokeWidth="1.4" {...sk} />
    <circle cx="15" cy="18" r="10" fill="#f5efe6" stroke={INK} strokeWidth="1.4" />
    <rect x="22" y="16" width="16" height="12" rx="2.5" fill="#cdbfa8" stroke={INK} strokeWidth="1.4" />
    <circle cx="30" cy="22" r="3.6" fill="#e6ddca" stroke={INK} strokeWidth="1.2" />
    <circle cx="12" cy="18" r="1.3" fill={INK} /><circle cx="18" cy="18" r="1.3" fill={INK} />
    <path d="M13.5 21c.8.8 2.2.8 3 0M24 16l3-3h6l3 3" stroke={INK} strokeWidth="1.2" {...sk} />
  </svg>)
}
export function BlobTrio({ size = 56, style, className }) {
  const cfg = [[12, 22, "#eeb6b8"], [27, 20, "#aebd86"], [42, 22, "#e8c98c"]]
  return (<svg width={size} height={size * 0.62} viewBox="0 0 56 34" style={style} className={className} aria-hidden="true">
    {cfg.map(([x, y, c], i) => <g key={i} stroke={INK} strokeWidth="1.3" {...sk}>
      <circle cx={x} cy={y} r="8" fill={c} />
      <circle cx={x - 2.5} cy={y - 1} r="1.2" fill={INK} /><circle cx={x + 2.5} cy={y - 1} r="1.2" fill={INK} />
      <path d={`M${x - 2} ${y + 2.5}c1.3 1.2 2.7 1.2 4 0`} />
    </g>)}
  </svg>)
}
export function SleepCloud({ size = 50, style, className }) {
  return (<svg width={size} height={size * 0.62} viewBox="0 0 52 32" style={style} className={className} aria-hidden="true">
    <ellipse cx="26" cy="27" rx="22" ry="4.5" fill="#bcd0d6" stroke={INK} strokeWidth="1.2" />
    <path d="M12 22c-4 0-6-3-5-6 0-3 4-5 7-3 1-4 6-5 9-2 3-1 7 1 6 5 3 0 4 4 1 6z" fill="#cdd6b8" stroke={INK} strokeWidth="1.4" {...sk} />
    <path d="M15 17c1.2 1 3 1 4 0M22 17c1.2 1 3 1 4 0" stroke={INK} strokeWidth="1.2" {...sk} />
  </svg>)
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
