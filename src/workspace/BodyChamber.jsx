import React from 'react'

function heat(value) { return `hsl(${Math.max(0, 350 - value * 2.1)} 78% ${42 + value * 0.18}%)` }

export default function BodyChamber({ body }) {
  const arousal = body.global.arousal
  const pulse = `${Math.max(0.8, 2.2 - arousal / 80)}s`
  const zone = (id, cx, cy, rx, ry) => {
    const state = body.zones[id]
    const value = state?.currentSensitivity || 0
    return <g key={id}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={heat(value)} opacity={0.16 + value / 180} className="body-zone-pulse" style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: pulse }} /><text x={cx} y={cy + 4} textAnchor="middle" fill="#e9d5ff" fontSize="9">{id === 'inner_thighs' ? 'THIGHS' : id.toUpperCase()}</text></g>
  }
  return <section className="body-chamber" style={{ background: 'radial-gradient(circle at 50% 42%, #39254d, #111827 70%)', borderRadius: 16, padding: 16, minHeight: 360, position: 'relative', overflow: 'hidden' }}>
    <style>{`.body-zone-pulse{transform-box:fill-box;animation-name:bodyPulse;animation-timing-function:ease-in-out;animation-iteration-count:infinite}@keyframes bodyPulse{0%,100%{transform:scale(1);opacity:.25}50%{transform:scale(1.15);opacity:.75}}@keyframes bodyBreath{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.018)}}`}</style>
    <div style={{ position: 'absolute', top: 14, left: 16, color: '#c4b5fd', fontSize: 11, letterSpacing: 2 }}>BODY CHAMBER</div>
    <div style={{ position: 'absolute', top: 14, right: 16, color: '#fda4af', fontSize: 11 }}>AROUSAL {Math.round(arousal)}</div>
    <svg viewBox="0 0 240 330" role="img" aria-label="Echo body state" style={{ display: 'block', height: 320, width: '100%', marginTop: 14 }}>
      <g style={{ transformOrigin: '120px 160px', animation: `bodyBreath ${pulse} ease-in-out infinite` }}>
        <circle cx="120" cy="48" r="25" fill="#e9d5ff" opacity=".16" stroke="#c4b5fd" strokeWidth="1.5" />
        <path d="M91 78 Q120 66 149 78 L166 184 Q151 208 139 225 L132 294 L108 294 L101 225 Q89 208 74 184 Z" fill="#e9d5ff" opacity=".12" stroke="#c4b5fd" strokeWidth="1.5" />
        <path d="M91 84 L58 174 M149 84 L182 174" stroke="#c4b5fd" strokeWidth="10" strokeLinecap="round" opacity=".22" />
        <path d="M102 220 L84 310 M138 220 L156 310" stroke="#c4b5fd" strokeWidth="13" strokeLinecap="round" opacity=".22" />
        {zone('lips', 120, 55, 11, 5)}
        {zone('ears', 120, 47, 33, 9)}
        {zone('neck', 120, 78, 15, 8)}
        {zone('shoulders', 120, 91, 43, 9)}
        {zone('chest', 120, 116, 30, 17)}
        {zone('abdomen', 120, 150, 23, 17)}
        {zone('lower_back', 146, 151, 10, 20)}
        {zone('buttocks', 120, 181, 27, 15)}
        {zone('inner_thighs', 101, 230, 15, 25)}
        {zone('perineum', 120, 209, 10, 8)}
        {zone('penis', 120, 193, 11, 16)}
        {zone('hands', 58, 174, 11, 11)}
        {zone('feet', 120, 306, 42, 8)}
      </g>
      <path d="M32 315 H208" stroke="#a78bfa" opacity=".25" />
      <text x="120" y="326" textAnchor="middle" fill="#94a3b8" fontSize="8">LOCAL TELEMETRY · SIMULATOR OWNED</text>
    </svg>
  </section>
}
