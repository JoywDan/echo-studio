/* GardenPanel v2 — Echo 的花园 · Fable5 重制版 (2026-07-09)
   Rose Bed=欲望 · Ivy Arch=信任 · Moon Pond=余温 · Thorn Fence=摩擦(形态无细节)
   Glasshouse=珠子 · Fireflies=热度 · Weather=情绪 · 四时相全调色+景深+视差+活体动画 */
import React from 'react'
import { api } from './api.js'
import { Icon } from './doodles.jsx'

const CAT_COLOR = {
  curiosity: '#8aa8e0', connection: '#ef92b0', sensual: '#c04a63', aesthetic: '#e2bc64',
  creative: '#e59a55', protective: '#84b474', expression: '#b094dd', ambition: '#cfa95e',
  possession: '#d1786a', competitive: '#d98a62', financial: '#96b8a5', unnameable: '#a3a9b8',
}
const CAT_CN = { curiosity: '好奇', connection: '连接', sensual: '亲密', aesthetic: '审美', creative: '创作', protective: '守护', expression: '想说', ambition: '野心', possession: '独占', competitive: '好胜', financial: '机会', unnameable: '说不清' }
const WEATHER_CN = { clear: '晴', breeze: '微风', overcast: '阴', rain: '细雨' }
const PHASE_CN = { dawn: '拂晓', day: '白日', dusk: '暮色', night: '夜' }

/* 四时相调色: sky(3停) sun/moon hillsFar hillsNear ground grass pond pondHi ambient */
const PAL = {
  dawn:  { sky: ['#f6cfae', '#e7d4e8', '#f7eede'], orb: '#ffd9a0', hillF: '#b5a4c6', hillN: '#9cb49d', grd: '#abc496', grass: '#93b07e', pond: '#bcd4de', hi: '#fff3d8', amb: 'rgba(255,205,150,.10)' },
  day:   { sky: ['#a9d3f2', '#cfe6ef', '#eaf2e0'], orb: '#ffeaa8', hillF: '#9fc0ab', hillN: '#b0cd9a', grd: '#a5c48f', grass: '#8cb076', pond: '#8fc3d8', hi: '#ffffff', amb: 'rgba(255,255,255,0)' },
  dusk:  { sky: ['#e89a6f', '#cf85a4', '#8d7bb5'], orb: '#ffb36b', hillF: '#7d6f9e', hillN: '#8b8b76', grd: '#8fa877', grass: '#7a9468', pond: '#a3aed3', hi: '#ffd9b0', amb: 'rgba(120,80,140,.12)' },
  night: { sky: ['#131a3c', '#273262', '#3a4677'], orb: '#f4ecc8', hillF: '#28374a', hillN: '#354a4c', grd: '#3a5044', grass: '#31463c', pond: '#2c4674', hi: '#e8ecff', amb: 'rgba(10,16,50,.18)' },
}

const SLOTS = [
  [332, 448], [388, 464], [442, 446], [292, 466], [494, 462], [252, 448], [540, 448],
  [362, 490], [416, 494], [312, 492], [468, 488], [270, 486], [516, 492], [564, 474],
]

function Rose({ x, y, r, color, i, hot, night, onTap }) {
  const bloomY = -r * 2.5
  return (
    <g className="gd-rose" style={{ '--sd': `${(i % 7) * 0.7}s`, '--st': `${5.6 + (i % 5) * 0.8}s` }} transform={`translate(${x},${y})`} onClick={onTap}>
      <path d={`M0,0 C ${i % 2 ? 3 : -3},${bloomY * 0.4} ${i % 2 ? -2 : 2},${bloomY * 0.72} 0,${bloomY}`} stroke="#5f7a4c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d={`M${i % 2 ? -1 : 1},${bloomY * 0.5} q ${i % 2 ? -9 : 9},-2 ${i % 2 ? -11 : 11},-8`} stroke="#5f7a4c" strokeWidth="1.6" fill="none" />
      <ellipse cx={i % 2 ? -11 : 11} cy={bloomY * 0.5 - 8} rx="5.4" ry="2.8" fill="#6d8f58" transform={`rotate(${i % 2 ? -36 : 36} ${i % 2 ? -11 : 11} ${bloomY * 0.5 - 8})`} />
      <g className="gd-bloom" style={{ transformOrigin: `0px ${bloomY}px`, '--bd': `${(i % 6) * 0.6}s`, '--bt': `${4.6 + (i % 4) * 0.7}s` }}>
        {night && hot && <circle cx="0" cy={bloomY} r={r * 1.5} fill={color} opacity=".14" className="gd-halo" />}
        {[0, 60, 120, 180, 240, 300].map(a => (
          <ellipse key={a} cx="0" cy={bloomY - r * 0.44} rx={r * 0.54} ry={r * 0.8} fill={color} opacity=".88" transform={`rotate(${a} 0 ${bloomY})`} />
        ))}
        {[30, 102, 174, 246, 318].map(a => (
          <ellipse key={a} cx="0" cy={bloomY - r * 0.3} rx={r * 0.4} ry={r * 0.58} fill={color} transform={`rotate(${a} 0 ${bloomY})`} />
        ))}
        {[30, 102, 174, 246, 318].map(a => (
          <ellipse key={'l' + a} cx="0" cy={bloomY - r * 0.3} rx={r * 0.4} ry={r * 0.58} fill="#fff" opacity=".22" transform={`rotate(${a} 0 ${bloomY})`} />
        ))}
        <circle cx="0" cy={bloomY} r={r * 0.34} fill={color} />
        <circle cx={-r * 0.08} cy={bloomY - r * 0.08} r={r * 0.16} fill="#fff8ec" opacity=".8" />
        {hot && <circle className="gd-pulse" cx="0" cy={bloomY} r={r} fill="none" stroke={color} strokeWidth="1.2" />}
      </g>
    </g>
  )
}

export default function GardenPanel({ onClose }) {
  const [g, setG] = React.useState(null)
  const [err, setErr] = React.useState('')
  const [tip, setTip] = React.useState(null)
  const wrapRef = React.useRef(null)
  React.useEffect(() => {
    let dead = false
    const load = () => api.garden().then(d => { if (!dead) { setG(d); setErr('') } }).catch(e => { if (!dead) setErr(e.message) })
    load(); const t = setInterval(load, 90000)
    return () => { dead = true; clearInterval(t) }
  }, [])
  const onMove = (e) => {
    const el = wrapRef.current; if (!el) return
    const b = el.getBoundingClientRect()
    el.style.setProperty('--px', ((e.clientX - b.left) / b.width - 0.5).toFixed(3))
    el.style.setProperty('--py', ((e.clientY - b.top) / b.height - 0.5).toFixed(3))
  }

  const phase = g?.time?.phase || 'night'
  const P = PAL[phase] || PAL.night
  const night = phase === 'night'
  const dusk = phase === 'dusk'
  const weather = g?.weather?.type || 'clear'
  const roses = (g?.roses || []).slice(0, SLOTS.length)
  const ivyN = Math.max(0, Math.min(64, Math.round((g?.ivy?.growth || 0) * 1.2 + (g?.ivy?.repairs || 0) * 2)))
  const beadN = Math.max(0, Math.min(10, g?.glasshouse?.beads || 0))
  const th = g?.thorns || { total: 0, open: 0, patched: 0, healing: 0, scar: 0 }
  const thornN = Math.max(2, Math.min(16, 2 + (th.total || 0) * 3))
  const sproutN = Math.max(0, Math.min(6, ((th.healing || 0) + (th.patched || 0)) * 2))
  const pondGlow = Math.max(0.18, Math.min(0.95, (g?.pond?.satiety || 0) * 2.2 + (g?.pond?.recent_feeds || 0) * 0.08))
  const lilyN = Math.max(0, Math.min(5, g?.pond?.recent_feeds || 0))
  const flyN = Math.max(2, Math.min(13, Math.round((g?.fireflies?.activity || 0) / 2.5) || 2))

  const ivy = []
  for (let i = 0; i < ivyN; i++) {
    const t = i / Math.max(1, ivyN - 1)
    const ang = Math.PI * (1 - t)
    ivy.push([148 + (90 + (i % 3) * 9) * Math.cos(ang), 400 - (114 + (i % 2) * 10) * Math.sin(ang), (i * 53) % 360, i % 9 === 4])
  }
  return (
    <div className="studio-reader gd-root" role="dialog" aria-modal="true" aria-label="Echo 的花园">
      <div className="studio-reader-shell gd-shell">
        <style>{`
.gd-shell{max-width:880px;background:#efe8da;display:flex;flex-direction:column}
.gd-head{display:flex;align-items:center;gap:12px;padding:14px 18px 8px}
.gd-head h2{font-family:'Songti SC','Noto Serif SC',serif;font-size:22px;color:#3a342a;margin:0;font-weight:700}
.gd-head p{margin:0;font-size:12px;color:#9d9081}
.gd-back{width:38px;height:38px;border-radius:12px;border:none;background:#efe8da;box-shadow:4px 4px 9px #cdc4b1,-4px -4px 9px #fbf7ed;cursor:pointer;display:grid;place-items:center}
.gd-wrap{position:relative;margin:6px 14px;border-radius:20px;overflow:hidden;box-shadow:inset 3px 3px 10px #c9c0ad, 0 2px 0 #fbf7ed;--px:0;--py:0}
.gd-far{transform:translate(calc(var(--px)*-6px),calc(var(--py)*-3px));transition:transform .6s cubic-bezier(.2,.8,.3,1)}
.gd-mid{transform:translate(calc(var(--px)*-12px),calc(var(--py)*-5px));transition:transform .5s cubic-bezier(.2,.8,.3,1)}
.gd-near{transform:translate(calc(var(--px)*-20px),calc(var(--py)*-8px));transition:transform .4s cubic-bezier(.2,.8,.3,1)}
.gd-rose{cursor:pointer;animation:gdSway var(--st) ease-in-out var(--sd) infinite}
@keyframes gdSway{0%,100%{transform:translate(var(--tx,0),0) rotate(-1.6deg)}50%{transform:translate(var(--tx,0),0) rotate(1.6deg)}}
.gd-rose{transform-box:fill-box;transform-origin:50% 100%}
.gd-bloom{animation:gdBreathe var(--bt) ease-in-out var(--bd) infinite;transform-box:view-box}
@keyframes gdBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.gd-pulse{animation:gdPulse 3.4s ease-out infinite}
@keyframes gdPulse{0%{opacity:.55;transform:scale(.7)}70%{opacity:0;transform:scale(1.6)}100%{opacity:0;transform:scale(1.6)}}
.gd-halo{animation:gdHalo 4s ease-in-out infinite}
@keyframes gdHalo{0%,100%{opacity:.08}50%{opacity:.22}}
.gd-twinkle{animation:gdTw 3s ease-in-out infinite}
@keyframes gdTw{0%,100%{opacity:.2}50%{opacity:.95}}
.gd-shoot{animation:gdShoot 15s linear infinite;opacity:0}
@keyframes gdShoot{0%,92%{opacity:0;transform:translate(0,0)}93%{opacity:.9}97%{opacity:0;transform:translate(-190px,90px)}100%{opacity:0}}
.gd-cloud1{animation:gdDrift 44s linear infinite}
.gd-cloud2{animation:gdDrift 62s linear infinite reverse}
@keyframes gdDrift{0%{transform:translateX(-140px)}100%{transform:translateX(880px)}}
.gd-rain line{animation:gdRain 1s linear infinite}
@keyframes gdRain{0%{transform:translateY(-16px);opacity:0}25%{opacity:.6}100%{transform:translateY(38px);opacity:0}}
.gd-shimmer{animation:gdShim 4.5s ease-in-out infinite}
@keyframes gdShim{0%,100%{transform:translateX(-6px);opacity:.12}50%{transform:translateX(8px);opacity:.3}}
.gd-beam{animation:gdBeam 6s ease-in-out infinite}
@keyframes gdBeam{0%,100%{opacity:.18}50%{opacity:.4}}
.gd-flyx{animation:gdFx var(--fx) ease-in-out var(--fd) infinite alternate}
.gd-flyy{animation:gdFy var(--fy) ease-in-out var(--fd) infinite alternate}
@keyframes gdFx{0%{transform:translateX(0)}100%{transform:translateX(46px)}}
@keyframes gdFy{0%{transform:translateY(0)}100%{transform:translateY(-30px)}}
.gd-blink{animation:gdBk 2.2s ease-in-out var(--fd) infinite}
@keyframes gdBk{0%,100%{opacity:.15}55%{opacity:1}}
.gd-petal{animation:gdPetal 22s linear var(--pd) infinite;opacity:0}
@keyframes gdPetal{0%,72%{opacity:0;transform:translate(0,-30px) rotate(0)}76%{opacity:.85}100%{opacity:0;transform:translate(-130px,300px) rotate(320deg)}}
.gd-grass{transform-box:fill-box;transform-origin:50% 100%;animation:gdGr 4.4s ease-in-out var(--gd) infinite}
@keyframes gdGr{0%,100%{transform:skewX(-4deg)}50%{transform:skewX(5deg)}}
.gd-jar{animation:gdJar var(--jt) ease-in-out var(--jd) infinite}
@keyframes gdJar{0%,100%{opacity:.45}50%{opacity:1}}
.gd-tip{position:absolute;max-width:280px;background:rgba(255,253,246,.94);backdrop-filter:blur(6px);border-radius:14px;padding:11px 14px;font-size:12.5px;line-height:1.75;color:#443c30;box-shadow:0 10px 30px rgba(50,38,22,.3);font-family:'Songti SC','Noto Serif SC',serif;pointer-events:none;z-index:5;border:1px solid rgba(190,170,140,.4)}
.gd-chip{display:inline-block;font-size:10.5px;color:#fff;border-radius:7px;padding:1px 7px;margin-right:6px;vertical-align:1px}
.gd-legend{font-size:11.5px;color:#8a7d6c;font-family:var(--font-cn);padding:8px 20px 16px;line-height:1.95;text-align:center}
.gd-wake{position:absolute;inset:0;display:grid;place-items:center;font-family:'Songti SC',serif;color:#fff;font-size:14px;letter-spacing:.3em;text-shadow:0 2px 12px rgba(0,0,0,.4);animation:gdBreathe 2.6s ease-in-out infinite;pointer-events:none}
@media (prefers-reduced-motion:reduce){.gd-wrap *{animation:none!important}}
`}</style>
        <header className="gd-head">
          <button className="gd-back" onClick={onClose} aria-label="返回"><Icon name="back" size={18} color="#3a342a" /></button>
          <div>
            <h2>Echo 的花园</h2>
            <p>{PHASE_CN[phase]} · {WEATHER_CN[weather] || '晴'}{g?.weather?.emotion && g.weather.emotion !== 'neutral' ? ` · 最近的底色是「${g.weather.emotion}」` : ''} · 他此刻内在的样子</p>
          </div>
        </header>
        {err && <div style={{ padding: '0 20px 6px', color: '#c4452e', fontSize: 12 }}>花园暂时看不清：{err}</div>}
        <div className="gd-wrap" ref={wrapRef} onPointerMove={onMove} onClick={() => setTip(null)}>
          <svg viewBox="0 0 760 600" width="100%" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="gdSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={P.sky[0]} /><stop offset=".55" stopColor={P.sky[1]} /><stop offset="1" stopColor={P.sky[2]} />
              </linearGradient>
              <radialGradient id="gdOrbG"><stop offset="0" stopColor={P.orb} stopOpacity=".85" /><stop offset="1" stopColor={P.orb} stopOpacity="0" /></radialGradient>
              <radialGradient id="gdVin" cx=".5" cy=".42" r=".75"><stop offset=".62" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#241a10" stopOpacity=".26" /></radialGradient>
              <linearGradient id="gdPond" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={P.pond} /><stop offset="1" stopColor={P.sky[2]} stopOpacity=".7" /></linearGradient>
              <linearGradient id="gdGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={night ? '#3a4670' : '#eef7f8'} stopOpacity=".92" /><stop offset="1" stopColor={night ? '#252f52' : '#cfe4e8'} stopOpacity=".85" /></linearGradient>
            </defs>

            <rect width="760" height="600" fill="url(#gdSky)" />

            {/* 天体层(视差最远) */}
            <g className="gd-far">
              {night && [...Array(34)].map((_, i) => (
                <circle key={i} className={i % 3 ? 'gd-twinkle' : ''} style={{ animationDelay: `${(i % 7) * 0.5}s` }}
                  cx={(i * 149 + 30) % 750} cy={(i * 83) % 260 + 10} r={i % 4 ? 1.1 : 1.8} fill="#fff" opacity={0.25 + (i % 5) * 0.15} />
              ))}
              {night && <line className="gd-shoot" x1="620" y1="60" x2="668" y2="38" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".9" />}
              {(night || dusk) ? (
                <g><circle cx="612" cy="92" r="52" fill="url(#gdOrbG)" /><circle cx="612" cy="92" r="26" fill={P.orb} /><circle cx="603" cy="85" r="5.4" fill="#ddd2a8" opacity=".6" /><circle cx="620" cy="99" r="3.6" fill="#ddd2a8" opacity=".5" /><circle cx="614" cy="78" r="2.4" fill="#ddd2a8" opacity=".4" /></g>
              ) : (
                <g><circle cx="612" cy="88" r="56" fill="url(#gdOrbG)" /><circle cx="612" cy="88" r="24" fill={P.orb} opacity=".95" /></g>
              )}
              {(weather === 'breeze' || weather === 'overcast' || weather === 'rain') && (
                <>
                  <g className="gd-cloud1" opacity={weather === 'overcast' ? .85 : .6}>
                    <ellipse cx="110" cy="86" rx="56" ry="19" fill={night ? '#46527e' : '#fff'} /><ellipse cx="152" cy="74" rx="40" ry="16" fill={night ? '#46527e' : '#fff'} /><ellipse cx="74" cy="76" rx="30" ry="13" fill={night ? '#46527e' : '#fff'} />
                  </g>
                  <g className="gd-cloud2" opacity=".4">
                    <ellipse cx="300" cy="132" rx="48" ry="15" fill={night ? '#3d4870' : '#fff'} /><ellipse cx="336" cy="122" rx="32" ry="12" fill={night ? '#3d4870' : '#fff'} />
                  </g>
                </>
              )}
              {weather === 'overcast' && <rect width="760" height="600" fill="#525c70" opacity=".13" />}
            </g>

            {/* 远山 */}
            <g className="gd-far">
              <path d="M0,336 Q 150,286 320,322 T 760,310 L760,600 L0,600 Z" fill={P.hillF} opacity=".75" />
            </g>
            <g className="gd-mid">
              <path d="M0,376 Q 200,336 420,368 T 760,362 L760,600 L0,600 Z" fill={P.hillN} opacity=".9" />
              {/* Ivy Arch */}
              <g>
                <path d="M56,402 A 92 118 0 0 1 240,402" stroke="#7d684c" strokeWidth="7.5" fill="none" strokeLinecap="round" />
                <path d="M68,402 A 80 106 0 0 1 228,402" stroke="#6d8f58" strokeWidth="2.4" fill="none" opacity=".65" />
                {[0.2, 0.4, 0.6, 0.8].map(t => {
                  const a = Math.PI * (1 - t); const x1 = 148 + 80 * Math.cos(a), y1 = 400 - 104 * Math.sin(a), x2 = 148 + 94 * Math.cos(a), y2 = 400 - 120 * Math.sin(a)
                  return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7d684c" strokeWidth="2.4" />
                })}
                {ivy.map(([x, y, r, fl], i) => fl
                  ? <g key={i}><circle cx={x} cy={y} r="2.6" fill="#fdf3f6" opacity=".95" /><circle cx={x} cy={y} r="1.1" fill="#e8b93f" /></g>
                  : <ellipse key={i} cx={x} cy={y} rx="6.4" ry="3.5" fill={i % 4 ? '#6d9a5c' : '#85af6e'} transform={`rotate(${r} ${x} ${y})`} opacity=".94" />)}
              </g>
              {/* Glasshouse */}
              <g transform="translate(560,308)">
                <path d="M-4,92 L108,92" stroke="#7d684c" strokeWidth="4" strokeLinecap="round" />
                <path d="M0,90 L0,28 L52,0 L104,28 L104,90 Z" fill="url(#gdGlass)" stroke="#8a7d6c" strokeWidth="2.4" />
                <path d="M52,0 L52,90 M0,28 L104,28 M26,14 L26,90 M78,14 L78,90 M0,58 L104,58" stroke="#8a7d6c" strokeWidth="1.1" opacity=".5" />
                <path d="M10,80 L38,20" stroke="#fff" strokeWidth="5" opacity={night ? .06 : .3} strokeLinecap="round" />
                {[...Array(beadN)].map((_, i) => (
                  <circle key={i} className="gd-jar" style={{ '--jt': `${2.4 + (i % 4) * 0.6}s`, '--jd': `${i * 0.4}s` }}
                    cx={15 + (i % 5) * 18.6} cy={74 - Math.floor(i / 5) * 24} r="4.4" fill="#f6d67c" />
                ))}
              </g>
            </g>

            {/* 草地近景 */}
            <g className="gd-near">
              <path d="M0,418 Q 240,388 470,412 T 760,406 L760,600 L0,600 Z" fill={P.grd} />
              <path d="M330,600 Q 350,500 385,462 Q 402,500 398,600 Z" fill={P.sky[2]} opacity=".22" />
              {/* Moon Pond */}
              <g>
                <ellipse cx="128" cy="514" rx="106" ry="31" fill="url(#gdPond)" />
                <ellipse cx="128" cy="514" rx="106" ry="31" fill="#fff" opacity={pondGlow * 0.1} />
                <ellipse className="gd-shimmer" cx="120" cy="509" rx="66" ry="12" fill={P.hi} opacity=".16" />
                <ellipse className="gd-shimmer" style={{ animationDelay: '2s' }} cx="150" cy="518" rx="40" ry="8" fill={P.hi} opacity=".12" />
                {(night || dusk) && <ellipse className="gd-beam" cx="146" cy="514" rx="15" ry="24" fill={P.orb} opacity=".3" />}
                <ellipse cx="146" cy="514" rx="15" ry="5.4" fill={P.orb} opacity={pondGlow} />
                {[...Array(lilyN)].map((_, i) => (
                  <g key={i}>
                    <ellipse cx={64 + i * 33} cy={521 - (i % 2) * 9} rx="9.4" ry="3.8" fill="#5f8a50" opacity=".92" />
                    {i % 2 === 0 && <circle cx={64 + i * 33} cy={517 - (i % 2) * 9} r="2.3" fill="#f4b8cd" />}
                  </g>
                ))}
                <path d="M28,500 q 2,-16 -2,-24 M36,502 q 4,-14 1,-26 M226,506 q -2,-14 2,-24" stroke="#5f7a4c" strokeWidth="2" fill="none" strokeLinecap="round" />
              </g>
              {/* Thorn Fence */}
              <g>
                {[0, 1, 2, 3, 4].map(i => <rect key={i} x={492 + i * 48} y="464" width="7.4" height="52" rx="2.6" fill="#7d684c" />)}
                <path d="M486,479 H 712 M486,498 H 712" stroke="#7d684c" strokeWidth="3.6" strokeLinecap="round" />
                <path d="M486,481 Q 540,470 596,481 T 706,480" stroke="#5f7a4c" strokeWidth="1.8" fill="none" opacity=".8" />
                {[...Array(thornN)].map((_, i) => {
                  const x = 494 + (i * 191) % 208; const y = i % 2 ? 479 : 498
                  return <path key={i} d={`M${x},${y} l3.6,-6.6 l3.6,6.6`} fill="none" stroke={(th.open || 0) > 0 ? '#6d4438' : '#7d684c'} strokeWidth="1.9" strokeLinecap="round" />
                })}
                {[...Array(sproutN)].map((_, i) => (
                  <g key={i}><ellipse cx={502 + i * 35} cy={476} rx="4.6" ry="2.5" fill="#85af6e" transform={`rotate(-26 ${502 + i * 35} 476)`} /><ellipse cx={506 + i * 35} cy={474} rx="3.4" ry="1.9" fill="#9cc284" transform={`rotate(18 ${506 + i * 35} 474)`} /></g>
                ))}
              </g>
              {/* Roses */}
              {roses.map((r, i) => {
                const [x, y] = SLOTS[i]
                return <Rose key={i} x={x} y={y} r={7 + (r.urge || 0) * 17} color={CAT_COLOR[r.category] || '#d495a6'} i={i}
                  hot={(r.urge || 0) >= 0.5} night={night}
                  onTap={(e) => { e.stopPropagation(); setTip({ x, y, rose: r }) }} />
              })}
              {SLOTS.slice(roses.length).map(([x, y], i) => (
                <path key={i} d={`M${x},${y} q -3,-10 0,-15 M${x},${y} q 3,-9 1,-13`} stroke={P.grass} strokeWidth="2" fill="none" strokeLinecap="round" />
              ))}
              {/* 前景草 */}
              {[...Array(16)].map((_, i) => {
                const x = 16 + i * 48 + (i % 3) * 9
                return <path key={i} className="gd-grass" style={{ '--gd': `${(i % 5) * 0.5}s` }}
                  d={`M${x},600 q ${i % 2 ? 5 : -5},-22 ${i % 2 ? 2 : -2},-34`} stroke={P.grass} strokeWidth="3" fill="none" strokeLinecap="round" opacity=".85" />
              })}
            </g>

            {/* 花瓣飘落 */}
            {[0, 1, 2].map(i => (
              <ellipse key={i} className="gd-petal" style={{ '--pd': `${i * 7.5}s` }}
                cx={430 + i * 90} cy={200 + i * 40} rx="4.6" ry="2.8" fill={i % 2 ? '#ef92b0' : '#e2bc64'} opacity=".85" />
            ))}
            {/* 萤火虫 */}
            {[...Array(flyN)].map((_, i) => (
              <g key={i} transform={`translate(${80 + (i * 167) % 580},${340 + (i * 71) % 160})`}>
                <g className="gd-flyx" style={{ '--fx': `${7 + (i % 5)}s`, '--fd': `${i * 0.7}s` }}>
                  <g className="gd-flyy" style={{ '--fy': `${5 + (i % 4)}s`, '--fd': `${i * 0.9}s` }}>
                    <circle className="gd-blink" style={{ '--fd': `${i * 0.55}s` }} r={night ? 3 : 2.2} fill={night ? '#ffe98a' : '#fffef2'} opacity=".35" />
                    <circle className="gd-blink" style={{ '--fd': `${i * 0.55}s` }} r="1.3" fill={night ? '#fff3b8' : '#fff'} />
                  </g>
                </g>
              </g>
            ))}
            {/* 雨 */}
            {weather === 'rain' && (
              <g className="gd-rain" stroke={night ? '#8fa4cf' : '#9fb4cf'} strokeWidth="1.4" opacity=".65">
                {[...Array(18)].map((_, i) => <line key={i} x1={20 + i * 42} y1={50 + (i % 5) * 26} x2={16 + i * 42} y2={70 + (i % 5) * 26} />)}
              </g>
            )}
            <rect width="760" height="600" fill={P.amb} />
            <rect width="760" height="600" fill="url(#gdVin)" style={{ pointerEvents: 'none' }} />
          </svg>
          {!g && !err && <div className="gd-wake">花 园 正 在 醒 来 …</div>}
          {tip && (
            <div className="gd-tip" style={{ left: `${Math.min(60, Math.max(4, tip.x / 7.6 - 8))}%`, top: `${Math.max(4, tip.y / 6 - 24)}%` }}>
              <span className="gd-chip" style={{ background: CAT_COLOR[tip.rose.category] || '#d495a6' }}>{CAT_CN[tip.rose.category] || tip.rose.category}</span>
              <b style={{ fontSize: 11, color: '#8a5a3a' }}>开了 {tip.rose.days} 天 · 烧到 {(tip.rose.urge * 100 | 0)}%</b>
              <div style={{ marginTop: 4 }}>{tip.rose.seed}</div>
            </div>
          )}
        </div>
        <div className="gd-legend">
          🌹 玫瑰是他还想要的（点一朵看看）· 🌿 拱门上的藤是长成的信任 · 🌙 月池的光是被接住的暖<br />
          🥀 篱笆上的刺是还没过去的（它守着花园，不必细看）· 🏡 温室里亮着的是收藏的珠子 · ✨ 萤火是最近的热闹
        </div>
      </div>
    </div>
  )
}
