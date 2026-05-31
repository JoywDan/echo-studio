import React from 'react'
/* doodles.jsx — crayon decorations + hand-drawn icon library */

const INK = "#3a3027";
const BRICK = "#b1492f";
const GOLD = "#d8a93f";
const PINKD = "#d98c84";
const SAGED = "#8a9b6d";
const sk = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

/* ——— tiny scattered marks ——— */
function Star({ size = 18, color = GOLD, fill = "none", style, sw = 1.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path d="M12 3.4l2.3 5.2 5.7 0.6-4.2 3.9 1.2 5.6-5-2.9-5 2.9 1.2-5.6L4 9.2l5.7-0.6z"
        stroke={color} fill={fill === "same" ? color : fill} fillOpacity={fill === "same" ? 0.85 : 1} strokeWidth={sw} {...sk} />
    </svg>
  );
}
function Heart({ size = 18, color = BRICK, fill = "none", style, sw = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path d="M12 20.4C9 17.9 3.6 14.2 3.6 9.5 3.6 6.8 5.7 4.9 8 4.9c1.7 0 3.1 1 4 2.4 0.9-1.4 2.3-2.4 4-2.4 2.3 0 4.4 1.9 4.4 4.6 0 4.7-5.4 8.4-8.4 10.9z"
        stroke={color} fill={fill === "same" ? color : fill} fillOpacity={fill === "same" ? 0.85 : 1} strokeWidth={sw} {...sk} />
    </svg>
  );
}
function Sparkle({ size = 16, color = GOLD, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      <path d="M12 3c0.6 4.2 1.8 5.4 6 6-4.2 0.6-5.4 1.8-6 6-0.6-4.2-1.8-5.4-6-6 4.2-0.6 5.4-1.8 6-6z"
        stroke={color} fill={color} fillOpacity="0.2" strokeWidth="1.3" {...sk} />
    </svg>
  );
}
function Squiggle({ w = 60, color = PINKD, style, sw = 2 }) {
  return (
    <svg width={w} height={12} viewBox="0 0 60 12" style={style} preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 6c4-5 8 5 12 0s8-5 12 0 8 5 12 0 8-5 10 0" stroke={color} strokeWidth={sw} {...sk} fill="none" />
    </svg>
  );
}
function Wave({ w = 40, color = SAGED, style, sw = 2 }) {
  return (
    <svg width={w} height={10} viewBox="0 0 40 10" style={style} preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 5c3-4 6 4 9 0s6-4 9 0 6 4 9 0 6-4 9 0" stroke={color} strokeWidth={sw} {...sk} fill="none" />
    </svg>
  );
}
function Flower({ size = 18, color = BRICK, center = GOLD, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="12" cy="6.6" rx="2.7" ry="4" transform={`rotate(${a} 12 12)`}
          fill={color} fillOpacity="0.32" stroke={color} strokeWidth="1.3" />
      ))}
      <circle cx="12" cy="12" r="2.2" fill={center} stroke={color} strokeWidth="1.1" />
    </svg>
  );
}
function FlowerFace({ size = 30, color = "#e8b6ab", center = "#f4e3b4", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={style} aria-hidden="true">
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="20" cy="9" rx="4.6" ry="6.4" transform={`rotate(${a} 20 20)`}
          fill={color} stroke={INK} strokeWidth="1.3" />
      ))}
      <circle cx="20" cy="20" r="7.5" fill={center} stroke={INK} strokeWidth="1.3" />
      <circle cx="17.4" cy="19.4" r="1.1" fill={INK} /><circle cx="22.6" cy="19.4" r="1.1" fill={INK} />
      <path d="M17.8 22.2c1.2 1.2 3.2 1.2 4.4 0" stroke={INK} strokeWidth="1.2" {...sk} fill="none" />
      <circle cx="15.6" cy="21.4" r="1.5" fill="#e89b8e" opacity="0.6" /><circle cx="24.4" cy="21.4" r="1.5" fill="#e89b8e" opacity="0.6" />
    </svg>
  );
}
function StarFace({ size = 26, color = "#e8a64a", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" style={style} aria-hidden="true">
      <path d="M16 3l3.3 7 7.7 0.8-5.7 5.3 1.6 7.6L16 26.9 9.1 30.7l1.6-7.6L5 17.8l7.7-0.8z"
        fill={color} stroke={INK} strokeWidth="1.5" {...sk} />
      <circle cx="13.4" cy="15" r="1.1" fill={INK} /><circle cx="18.6" cy="15" r="1.1" fill={INK} />
      <path d="M13.8 17.6c1.2 1.2 3.2 1.2 4.4 0" stroke={INK} strokeWidth="1.2" {...sk} fill="none" />
    </svg>
  );
}
/* walking heart with face + arms + legs (bottom of P2) */
function HeartLegs({ size = 40, color = "#ef9d93", style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={style} aria-hidden="true">
      <path d="M24 28C20 24.5 13 20 13 13.6 13 10 15.8 7.6 19 7.6c2.3 0 4 1.4 5 3.2 1-1.8 2.7-3.2 5-3.2 3.2 0 6 2.4 6 6 0 6.4-7 10.9-11 14.4z"
        fill={color} stroke={INK} strokeWidth="1.7" {...sk} />
      <circle cx="20.5" cy="16" r="1.2" fill={INK} /><circle cx="27.5" cy="16" r="1.2" fill={INK} />
      <path d="M21.5 19c1.4 1.2 3.6 1.2 5 0" stroke={INK} strokeWidth="1.3" {...sk} fill="none" />
      <path d="M9 22c-3 1-4 3-3.5 5M39 22c3 1 4 3 3.5 5" stroke={INK} strokeWidth="1.6" {...sk} fill="none" />
      <path d="M19 30v6M22 31l-2 7M29 30v6M26 31l2 7" stroke={INK} strokeWidth="1.6" {...sk} fill="none" />
      <circle cx="17" cy="18.5" r="1.8" fill="#e07f72" opacity="0.55" /><circle cx="31" cy="18.5" r="1.8" fill="#e07f72" opacity="0.55" />
    </svg>
  );
}
function Cloud({ size = 26, color = "#e4b9b2", style, sw = 1.6 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 32 22" style={style} aria-hidden="true">
      <path d="M8 18c-3 0-5-2-5-4.5S5 9 8 9.3C8.5 5.5 11.5 3 15 3.4c3 .3 5 2.6 5.3 5.3C24 8 27 10 27 13.5S24.5 18 21 18z"
        fill="#fff" fillOpacity="0.5" stroke={color} strokeWidth={sw} {...sk} />
    </svg>
  );
}
function Rainbow({ size = 30, style }) {
  const cols = ["#e89b8e", "#e8c06a", "#a9c08a"];
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 32 19" style={style} aria-hidden="true">
      {cols.map((c, i) => (
        <path key={i} d={`M${4 + i * 3} 18a${12 - i * 3} ${12 - i * 3} 0 0 1 ${24 - i * 6} 0`}
          stroke={c} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      ))}
    </svg>
  );
}
function SpeechHeart({ size = 26, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" style={style} aria-hidden="true">
      <path d="M4 5h17a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-8l-4 4v-4H4a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3z"
        fill="#fff" fillOpacity="0.5" stroke={INK} strokeWidth="1.5" {...sk} transform="translate(1 1)" />
      <path d="M13 9.5c.6-.9 2-.6 2 .4 0 .9-2 2.1-2 2.1s-2-1.2-2-2.1c0-1 1.4-1.3 2-.4z" fill={BRICK} stroke={BRICK} strokeWidth="0.6" />
    </svg>
  );
}
/* dashed flight path with little arrow (P4) */
function DashFly({ w = 70, h = 50, color = "#b39a86", style }) {
  return (
    <svg width={w} height={h} viewBox="0 0 70 50" style={style} aria-hidden="true">
      <path d="M6 6c20 2 30 14 28 26" stroke={color} strokeWidth="1.6" strokeDasharray="2 5" fill="none" strokeLinecap="round" />
      <path d="M28 38l6-6M34 32l-8-1M34 32l-1 8" stroke={color} strokeWidth="1.6" {...sk} fill="none" />
    </svg>
  );
}

/* ——— hand-drawn line icons ——— */
function Icon({ name, size = 22, color = INK, stroke = 1.8, style }) {
  const p = { stroke: color, strokeWidth: stroke, ...sk, fill: "none" };
  const paths = {
    search: <><circle cx="11" cy="11" r="6.5" {...p} /><path d="M16 16l5 5" {...p} /></>,
    sliders: <><path d="M5 8h9M18 8h1M5 16h1M10 16h9" {...p} /><circle cx="16" cy="8" r="2" {...p} /><circle cx="8" cy="16" r="2" {...p} /></>,
    plus: <><path d="M12 5.5v13M5.5 12h13" {...p} /></>,
    edit: <><path d="M5 19l1-4L16 4.5l3 3L9 18z" {...p} /><path d="M13.5 7l3 3" {...p} /></>,
    trash: <><path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" {...p} /><path d="M11 11v6M14 11v6" {...p} /></>,
    sort: <><path d="M7 5v13M4 15l3 3 3-3M13 7h7M13 11h5M13 15h3" {...p} /></>,
    chevron: <><path d="M6 9l6 6 6-6" {...p} /></>,
    back: <><path d="M14 5l-7 7 7 7M7 12h12" {...p} /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" {...p} /></>,
    clip: <><path d="M18 10l-7.5 7.5a3.6 3.6 0 0 1-5.1-5.1L12.5 5a2.4 2.4 0 0 1 3.4 3.4L8 16.3a1.1 1.1 0 0 1-1.6-1.5L13 8" {...p} /></>,
    camera: <><path d="M4 8h4l2-2h4l2 2h4v11H4z" {...p} /><circle cx="12" cy="13" r="3.3" {...p} /></>,
    send: <><path d="M4 12l16-7-7 16-2.5-6z" {...p} fill={color} fillOpacity="0.12" /><path d="M10.5 15L20 5" {...p} /></>,
    image: <><path d="M4 5h16v14H4z" {...p} /><circle cx="9" cy="10" r="1.7" {...p} /><path d="M5 18l5-5 4 3 3-3 2 2" {...p} /></>,
    file: <><path d="M6 3h9l4 4v14H6z" {...p} /><path d="M15 3v4h4M9 12h7M9 16h5" {...p} /></>,
    upload: <><path d="M12 16V5M8 9l4-4 4 4" {...p} /><path d="M5 19h14" {...p} /></>,
    "chat-plus": <><path d="M4 6h16v10H9l-4 4v-4H4z" {...p} /><path d="M9 11h6M12 8.5v5" {...p} /></>,
    phone: <><path d="M6 4c-2 2-1 7 3 11s9 5 11 3l-2.5-3-3 1c-1.5-1-3-2.5-4-4l1-3z" {...p} /></>,
    more: <><circle cx="6" cy="12" r="1.4" fill={color} stroke="none" /><circle cx="12" cy="12" r="1.4" fill={color} stroke="none" /><circle cx="18" cy="12" r="1.4" fill={color} stroke="none" /></>,
    check: <><path d="M5 12l4.5 4.5L19 6" {...p} /></>,
    book: <><path d="M4 5c3-1.2 6-1.2 8 0v15c-2-1.2-5-1.2-8 0zM20 5c-3-1.2-6-1.2-8 0v15c2-1.2 5-1.2 8 0z" {...p} /></>,
    moon: <><path d="M20 14.5A8 8 0 0 1 9 4 8 8 0 1 0 20 14.5z" {...p} /></>,
    clipboard: <><path d="M7 5h10v15H7z" {...p} /><path d="M9 5V3.5h6V5M10 11h4M10 15h4" {...p} /></>,
  };
  return (<svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden="true">{paths[name] || null}</svg>);
}

export { Star, Heart, Sparkle, Squiggle, Wave, Flower, FlowerFace, StarFace, HeartLegs, Cloud, Rainbow, SpeechHeart, DashFly, Icon };
