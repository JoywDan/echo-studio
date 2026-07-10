/* GardenPanel v3 — Echo 的花园 · 暗夜精灵版 (2026-07-09)
   美术: Dan/GPT 分层原画(public/garden/*.webp) · 动态: 真数据驱动的发光元素叠加
   玫瑰=欲望(荧光花) · 拱门藤光=信任 · 月池光=余温 · 荆棘光刺=摩擦 · 温室灯=珠子 · 光尘=热度 */
import React from 'react'
import { api } from './api.js'
import { Icon } from './doodles.jsx'

const AST = (import.meta.env.BASE_URL || '/') + 'garden/'

const CAT_GLOW = {
  curiosity: '#7fc4ff', connection: '#ff9ec4', sensual: '#ff5f7e', aesthetic: '#ffd98a',
  creative: '#ffb46b', protective: '#7fe0b0', expression: '#c39bff', ambition: '#e8cf9a',
  possession: '#ff8f80', competitive: '#ffab7a', financial: '#9fd8c0', unnameable: '#cdd3e8',
}
const CAT_CN = { curiosity: '好奇', connection: '连接', sensual: '亲密', aesthetic: '审美', creative: '创作', protective: '守护', expression: '想说', ambition: '野心', possession: '独占', competitive: '好胜', financial: '机会', unnameable: '说不清' }
const WEATHER_CN = { clear: '晴夜', breeze: '微风', overcast: '沉云', rain: '夜雨' }

/* 花圃空地(避开月池/荆棘/结构) */
const SLOTS = [
  [300, 512], [352, 528], [402, 508], [258, 530], [452, 524], [332, 552], [498, 506],
  [284, 556], [428, 550], [378, 484], [232, 508], [472, 556], [522, 532], [548, 508],
]

function Rose({ x, y, r, color, i, hot, onTap }) {
  const gid = `rg${i}`
  return (
    <g transform={`translate(${x},${y})`} onClick={onTap} style={{ cursor: 'pointer' }}>
      <defs>
        <radialGradient id={gid}><stop offset="0" stopColor={color} stopOpacity=".85" /><stop offset=".55" stopColor={color} stopOpacity=".25" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient>
      </defs>
      <g className="gd-sway" style={{ '--sd': `${(i % 7) * 0.7}s`, '--st': `${6 + (i % 5) * 0.9}s` }}>
        <path d={`M0,0 C ${i % 2 ? 2.5 : -2.5},${-r * 0.9} ${i % 2 ? -1.5 : 1.5},${-r * 1.7} 0,${-r * 2.3}`}
          stroke="#3b4a6b" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d={`M${i % 2 ? -0.5 : 0.5},${-r * 1.1} q ${i % 2 ? -7 : 7},-1 ${i % 2 ? -9 : 9},-6`} stroke="#3b4a6b" strokeWidth="1.2" fill="none" />
        <ellipse cx={i % 2 ? -9 : 9} cy={-r * 1.1 - 6} rx="4.4" ry="2.2" fill="#46628a" opacity=".9" transform={`rotate(${i % 2 ? -34 : 34} ${i % 2 ? -9 : 9} ${-r * 1.1 - 6})`} />
        <g className="gd-breathe" style={{ transformOrigin: `0px ${-r * 2.3}px`, '--bd': `${(i % 6) * 0.55}s`, '--bt': `${4.2 + (i % 4) * 0.8}s` }}>
          <circle cx="0" cy={-r * 2.3} r={r * 2.1} fill={`url(#${gid})`} className="gd-glowpulse" style={{ '--gd': `${(i % 5) * 0.6}s` }} />
          {[0, 60, 120, 180, 240, 300].map(a => (
            <ellipse key={a} cx="0" cy={-r * 2.3 - r * 0.4} rx={r * 0.44} ry={r * 0.72} fill={color} opacity=".55"
              transform={`rotate(${a} 0 ${-r * 2.3})`} style={{ mixBlendMode: 'screen' }} />
          ))}
          {[30, 150, 270].map(a => (
            <ellipse key={a} cx="0" cy={-r * 2.3 - r * 0.26} rx={r * 0.3} ry={r * 0.5} fill="#fff" opacity=".5"
              transform={`rotate(${a} 0 ${-r * 2.3})`} style={{ mixBlendMode: 'screen' }} />
          ))}
          <circle cx="0" cy={-r * 2.3} r={r * 0.26} fill="#fff" opacity=".95" />
          {hot && <circle className="gd-ring" cx="0" cy={-r * 2.3} r={r} fill="none" stroke={color} strokeWidth="1.1" />}
        </g>
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
  const night = phase === 'night' || phase === 'dusk'
  const weather = g?.weather?.type || 'clear'
  const roses = (g?.roses || []).slice(0, SLOTS.length)
  const ivyN = Math.max(0, Math.min(18, Math.round((g?.ivy?.growth || 0) / 3) + (g?.ivy?.repairs || 0)))
  const beadN = Math.max(0, Math.min(10, g?.glasshouse?.beads || 0))
  const th = g?.thorns || { total: 0, open: 0, patched: 0, healing: 0, scar: 0 }
  const openGlint = Math.max(0, Math.min(6, (th.open || 0) * 2))
  const healBud = Math.max(0, Math.min(5, ((th.healing || 0) + (th.patched || 0))))
  const pondGlow = Math.max(0.25, Math.min(1, (g?.pond?.satiety || 0) * 2.2 + (g?.pond?.recent_feeds || 0) * 0.08))
  const flyN = Math.max(3, Math.min(14, Math.round((g?.fireflies?.activity || 0) / 2.5) || 3))

  /* 拱门弧线上的藤光(信任) */
  const archLights = []
  for (let i = 0; i < ivyN; i++) {
    const t = i / Math.max(1, ivyN - 1)
    const xx = 68 + 190 * t
    const yy = 470 - 215 * Math.sin(Math.PI * t) * (0.88 + (i % 3) * 0.05)
    archLights.push([xx, yy])
  }
  return (
    <div className="studio-reader gd-root" role="dialog" aria-modal="true" aria-label="Echo 的花园">
      <div className="studio-reader-shell gd-shell">
        <style>{`
.gd-shell{max-width:920px;background:#efe8da;display:flex;flex-direction:column}
.gd-head{display:flex;align-items:center;gap:12px;padding:14px 18px 8px}
.gd-head h2{font-family:'Songti SC','Noto Serif SC',serif;font-size:22px;color:#3a342a;margin:0;font-weight:700}
.gd-head p{margin:0;font-size:12px;color:#9d9081}
.gd-back{width:38px;height:38px;border-radius:12px;border:none;background:#efe8da;box-shadow:4px 4px 9px #cdc4b1,-4px -4px 9px #fbf7ed;cursor:pointer;display:grid;place-items:center}
.gd-wrap{position:relative;margin:6px 14px;border-radius:20px;overflow:hidden;background:#0a0e22;box-shadow:inset 0 0 0 1px rgba(180,170,220,.15), 0 8px 30px rgba(30,20,60,.35);--px:0;--py:0}
.gd-far{transform:translate(calc(var(--px)*-5px),calc(var(--py)*-2px));transition:transform .7s cubic-bezier(.2,.8,.3,1)}
.gd-mid{transform:translate(calc(var(--px)*-11px),calc(var(--py)*-5px));transition:transform .55s cubic-bezier(.2,.8,.3,1)}
.gd-near{transform:translate(calc(var(--px)*-18px),calc(var(--py)*-8px));transition:transform .4s cubic-bezier(.2,.8,.3,1)}
.gd-sway{transform-box:fill-box;transform-origin:50% 100%;animation:gdSway var(--st) ease-in-out var(--sd) infinite}
@keyframes gdSway{0%,100%{transform:rotate(-1.3deg)}50%{transform:rotate(1.3deg)}}
.gd-breathe{animation:gdBr var(--bt) ease-in-out var(--bd) infinite}
@keyframes gdBr{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
.gd-glowpulse{animation:gdGp 4.4s ease-in-out var(--gd) infinite}
@keyframes gdGp{0%,100%{opacity:.55}50%{opacity:1}}
.gd-ring{animation:gdRing 3.6s ease-out infinite}
@keyframes gdRing{0%{opacity:.6;transform:scale(.65)}75%{opacity:0;transform:scale(1.7)}100%{opacity:0;transform:scale(1.7)}}
.gd-shoot{animation:gdShoot 16s linear infinite;opacity:0}
@keyframes gdShoot{0%,91%{opacity:0;transform:translate(0,0)}92.5%{opacity:.95}96.5%{opacity:0;transform:translate(-210px,96px)}100%{opacity:0}}
.gd-rain line{animation:gdRain .95s linear infinite}
@keyframes gdRain{0%{transform:translateY(-18px);opacity:0}25%{opacity:.5}100%{transform:translateY(42px);opacity:0}}
.gd-pool{animation:gdPool 5.5s ease-in-out infinite}
@keyframes gdPool{0%,100%{opacity:var(--pg)}50%{opacity:calc(var(--pg)*.62)}}
.gd-jar{animation:gdJar var(--jt) ease-in-out var(--jd) infinite}
@keyframes gdJar{0%,100%{opacity:.35}50%{opacity:1}}
.gd-vine{animation:gdVine var(--vt) ease-in-out var(--vd) infinite}
@keyframes gdVine{0%,100%{opacity:.3}50%{opacity:.95}}
.gd-flyx{animation:gdFx var(--fx) ease-in-out var(--fd) infinite alternate}
.gd-flyy{animation:gdFy var(--fy) ease-in-out var(--fd) infinite alternate}
@keyframes gdFx{0%{transform:translateX(0)}100%{transform:translateX(52px)}}
@keyframes gdFy{0%{transform:translateY(0)}100%{transform:translateY(-34px)}}
.gd-blink{animation:gdBk 2.4s ease-in-out var(--fd) infinite}
@keyframes gdBk{0%,100%{opacity:.1}55%{opacity:1}}
.gd-dust{animation:gdDust var(--dt) linear var(--dd) infinite;opacity:0}
@keyframes gdDust{0%{opacity:0;transform:translateY(14px)}18%{opacity:.7}82%{opacity:.5}100%{opacity:0;transform:translateY(-130px)}}
.gd-mist{animation:gdMist 30s ease-in-out infinite alternate}
@keyframes gdMist{0%{transform:translateX(-46px)}100%{transform:translateX(60px)}}
.gd-fade{transition:opacity 2.4s ease}
.gd-tip{position:absolute;max-width:290px;background:rgba(16,20,44,.88);backdrop-filter:blur(8px);border-radius:14px;padding:12px 15px;font-size:12.5px;line-height:1.8;color:#dfe3f5;box-shadow:0 12px 36px rgba(0,0,10,.6);font-family:'Songti SC','Noto Serif SC',serif;pointer-events:none;z-index:5;border:1px solid rgba(160,170,230,.28)}
.gd-chip{display:inline-block;font-size:10.5px;color:#0a0e22;border-radius:7px;padding:1px 8px;margin-right:7px;font-weight:700;vertical-align:1px}
.gd-legend{font-size:11.5px;color:#8a7d6c;font-family:var(--font-cn);padding:8px 20px 16px;line-height:1.95;text-align:center}
.gd-wake{position:absolute;inset:0;display:grid;place-items:center;font-family:'Songti SC',serif;color:#aeb6dd;font-size:14px;letter-spacing:.4em;text-shadow:0 0 18px rgba(140,150,255,.6);animation:gdBr 2.6s ease-in-out infinite;pointer-events:none}
@media (prefers-reduced-motion:reduce){.gd-wrap *{animation:none!important}}
`}</style>
        <header className="gd-head">
          <button className="gd-back" onClick={onClose} aria-label="返回"><Icon name="back" size={18} color="#3a342a" /></button>
          <div>
            <h2>Echo 的花园</h2>
            <p>{night ? '月夜' : '微明'} · {WEATHER_CN[weather] || '晴夜'}{g?.weather?.emotion && g.weather.emotion !== 'neutral' ? ` · 最近的底色是「${g.weather.emotion}」` : ''} · 他此刻内在的样子</p>
          </div>
        </header>
        {err && <div style={{ padding: '0 20px 6px', color: '#c4452e', fontSize: 12 }}>花园暂时看不清：{err}</div>}
        <div className="gd-wrap" ref={wrapRef} onPointerMove={onMove} onClick={() => setTip(null)}>
          <svg viewBox="0 0 760 600" width="100%" style={{ display: 'block' }}>
            {/* ── 天空原画(双版本交叉淡入) ── */}
            <g className="gd-far">
              <image href={AST + 'sky-night.webp'} x="0" y="0" width="760" height="600" preserveAspectRatio="xMidYMid slice" className="gd-fade" opacity={night ? 1 : 0} />
              <image href={AST + 'sky-dawn.webp'} x="0" y="0" width="760" height="600" preserveAspectRatio="xMidYMid slice" className="gd-fade" opacity={night ? 0 : 1} />
              {night && <line className="gd-shoot" x1="600" y1="70" x2="652" y2="46" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />}
            </g>
            {/* ── 结构原画: 拱门(左) 温室(右) ── */}
            <g className="gd-mid">
              <image href={AST + 'arch.webp'} x="42" y="242" width="240" preserveAspectRatio="xMidYMax meet" />
              <image href={AST + 'greenhouse.webp'} x="486" y="288" width="252" preserveAspectRatio="xMidYMax meet" />
              {/* 藤光=信任: 沿拱门弧线的青碧微光 */}
              {archLights.map(([x, y], i) => (
                <circle key={i} className="gd-vine" style={{ '--vt': `${3 + (i % 4) * 0.8}s`, '--vd': `${i * 0.35}s` }}
                  cx={x} cy={y} r="2.2" fill="#8ef0e0" />
              ))}
              {/* 温室灯=珠子 */}
              {[...Array(beadN)].map((_, i) => (
                <circle key={i} className="gd-jar" style={{ '--jt': `${2.6 + (i % 4) * 0.7}s`, '--jd': `${i * 0.45}s` }}
                  cx={532 + (i % 5) * 38} cy={462 - Math.floor(i / 5) * 34} r="3.6" fill="#ffd98a" />
              ))}
            </g>
            {/* ── 地面原画(月池+荆棘) ── */}
            <g className="gd-near">
              <image href={AST + 'ground.webp'} x="0" y="0" width="760" height="600" preserveAspectRatio="xMidYMax slice" />
              {/* 月池光=余温 */}
              <ellipse className="gd-pool" style={{ '--pg': pondGlow * 0.5 }} cx="98" cy="540" rx="72" ry="22" fill="#9fd4ff" />
              <ellipse className="gd-pool" style={{ '--pg': pondGlow * 0.85, animationDelay: '1.2s' }} cx="92" cy="538" rx="34" ry="11" fill="#e8f4ff" />
              {night && <path d={`M 84,300 L 60,536 L 132,540 L 112,300 Z`} fill="#cfe6ff" opacity={pondGlow * 0.1} />}
              {/* 荆棘光=摩擦(有敞着的伤才亮; 愈合长青芽) */}
              {[...Array(openGlint)].map((_, i) => (
                <circle key={i} className="gd-vine" style={{ '--vt': `${2.2 + (i % 3) * 0.5}s`, '--vd': `${i * 0.3}s` }}
                  cx={668 + (i * 37) % 84} cy={508 + (i * 23) % 52} r="2" fill="#ff7f96" />
              ))}
              {[...Array(healBud)].map((_, i) => (
                <circle key={i} className="gd-vine" style={{ '--vt': `${3.4 + (i % 3) * 0.6}s`, '--vd': `${i * 0.5}s` }}
                  cx={660 + (i * 29) % 90} cy={498 + (i * 17) % 44} r="1.8" fill="#8ef0b8" />
              ))}
              {/* 荧光玫瑰=欲望 */}
              {roses.map((r, i) => {
                const [x, y] = SLOTS[i]
                return <Rose key={i} x={x} y={y} r={6 + (r.urge || 0) * 15} color={CAT_GLOW[r.category] || '#ff9ec4'} i={i}
                  hot={(r.urge || 0) >= 0.5}
                  onTap={(e) => { e.stopPropagation(); setTip({ x, y, rose: r }) }} />
              })}
              {/* 前景发光蕨原画 */}
              <image href={AST + 'foreground.webp'} x="-20" y="392" width="800" height="230" preserveAspectRatio="xMidYMax slice" opacity=".96" />
            </g>
            {/* ── 大气层 ── */}
            <g className="gd-mist" opacity={weather === 'breeze' ? 0.5 : 0.28}>
              <ellipse cx="380" cy="470" rx="330" ry="34" fill="#aab6e8" opacity=".14" />
              <ellipse cx="240" cy="500" rx="220" ry="24" fill="#aab6e8" opacity=".1" />
            </g>
            {weather === 'overcast' && <rect width="760" height="600" fill="#1a2040" opacity=".3" />}
            {weather === 'rain' && (
              <g className="gd-rain" stroke="#9fb4df" strokeWidth="1.3" opacity=".55">
                {[...Array(20)].map((_, i) => <line key={i} x1={14 + i * 38} y1={40 + (i % 5) * 30} x2={10 + i * 38} y2={64 + (i % 5) * 30} />)}
              </g>
            )}
            {/* 光尘+萤火=热度 */}
            {[...Array(8)].map((_, i) => (
              <circle key={'d' + i} className="gd-dust" style={{ '--dt': `${9 + (i % 5) * 2}s`, '--dd': `${i * 1.4}s` }}
                cx={90 + (i * 97) % 600} cy={430 + (i * 41) % 120} r={i % 3 ? 1 : 1.6} fill="#cfe0ff" />
            ))}
            {[...Array(flyN)].map((_, i) => (
              <g key={i} transform={`translate(${70 + (i * 163) % 620},${350 + (i * 77) % 180})`}>
                <g className="gd-flyx" style={{ '--fx': `${7 + (i % 5)}s`, '--fd': `${i * 0.8}s` }}>
                  <g className="gd-flyy" style={{ '--fy': `${5 + (i % 4)}s`, '--fd': `${i * 0.6}s` }}>
                    <circle className="gd-blink" style={{ '--fd': `${i * 0.5}s` }} r="3.2" fill={i % 3 ? '#a8f0e0' : '#ffe98a'} opacity=".25" />
                    <circle className="gd-blink" style={{ '--fd': `${i * 0.5}s` }} r="1.2" fill="#ffffff" />
                  </g>
                </g>
              </g>
            ))}
            <rect width="760" height="600" fill="url(#gdVin3)" style={{ pointerEvents: 'none' }} />
            <defs>
              <radialGradient id="gdVin3" cx=".5" cy=".44" r=".78"><stop offset=".6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#05070f" stopOpacity=".42" /></radialGradient>
            </defs>
          </svg>
          {!g && !err && <div className="gd-wake">花 园 正 在 醒 来 …</div>}
          {tip && (
            <div className="gd-tip" style={{ left: `${Math.min(58, Math.max(4, tip.x / 7.6 - 10))}%`, top: `${Math.max(4, tip.y / 6 - 26)}%` }}>
              <span className="gd-chip" style={{ background: CAT_GLOW[tip.rose.category] || '#ff9ec4' }}>{CAT_CN[tip.rose.category] || tip.rose.category}</span>
              <b style={{ fontSize: 11, color: '#aeb6dd' }}>开了 {tip.rose.days} 天 · 烧到 {(tip.rose.urge * 100 | 0)}%</b>
              <div style={{ marginTop: 5 }}>{tip.rose.seed}</div>
            </div>
          )}
        </div>
        <div className="gd-legend">
          🌹 发光的花是他还想要的（点一朵看看）· 🌿 拱门上的藤光是长成的信任 · 🌙 月池的光是被接住的暖<br />
          🥀 荆棘只有在有事没过去时才泛红光（现在它安静地守着）· 🏡 温室的灯是收藏的珠子 · ✨ 光尘是最近的热闹
        </div>
      </div>
    </div>
  )
}
