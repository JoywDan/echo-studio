/* GardenPanel — Echo 的花园: 内在系统的具象化 (2026-07-09, Joy 的构想)
   Rose Bed=欲望 · Ivy Arch=信任/成长 · Moon Pond=安抚余温 · Thorn Fence=摩擦(只有形态没有细节)
   Glasshouse=记忆收藏(珠子) · Fireflies=最近互动热度 · Weather=情绪氛围 · 真数据驱动 /api/garden */
import React from 'react'
import { api } from './api.js'
import { Icon } from './doodles.jsx'

const CAT_COLOR = {
  curiosity: '#7f9fd4', connection: '#e58aa8', sensual: '#b03a52', aesthetic: '#d8b25c',
  creative: '#d98e4a', protective: '#7aa96b', expression: '#a58ad0', ambition: '#c2a05a',
  possession: '#c96f5f', competitive: '#cf7f5a', financial: '#8fae9d', unnameable: '#9aa0ad',
}
const CAT_CN = { curiosity: '好奇', connection: '连接', sensual: '亲密', aesthetic: '审美', creative: '创作', protective: '守护', expression: '想说', ambition: '野心', possession: '独占', competitive: '好胜', financial: '机会', unnameable: '说不清' }
const SKY = {
  dawn:  ['#f7d9c4', '#e8ecf4'], day: ['#cfe3f0', '#eef3ec'],
  dusk:  ['#e9b98f', '#c9a6c4'], night: ['#232948', '#3a4368'],
}
const WEATHER_CN = { clear: '晴', breeze: '微风', overcast: '阴', rain: '细雨' }

// 14 个玫瑰位(两排, 手工错落)
const SLOTS = [
  [340, 452], [395, 468], [445, 450], [300, 470], [495, 466], [258, 452], [540, 452],
  [368, 492], [420, 496], [318, 496], [470, 490], [275, 488], [518, 494], [565, 478],
]

function Rose({ x, y, r, color, delay, dur, onTap, active }) {
  return (
    <g className="gd-rose" style={{ '--d': `${delay}s`, '--t': `${dur}s` }} transform={`translate(${x},${y})`} onClick={onTap}>
      <path d={`M0,0 C ${-2},${-r * 1.2} 2,${-r * 1.8} 0,${-r * 2.4}`} stroke="#6e8858" strokeWidth="2" fill="none" />
      <ellipse cx={-4} cy={-r * 1.2} rx="5" ry="2.6" fill="#7aa96b" transform={`rotate(-32 -4 ${-r * 1.2})`} />
      <g className="gd-bloom" style={{ transformOrigin: `0px ${-r * 2.4}px` }}>
        {[0, 60, 120, 180, 240, 300].map(a => (
          <ellipse key={a} cx="0" cy={-r * 2.4 - r * 0.42} rx={r * 0.52} ry={r * 0.78} fill={color} opacity="0.82"
            transform={`rotate(${a} 0 ${-r * 2.4})`} />
        ))}
        <circle cx="0" cy={-r * 2.4} r={r * 0.42} fill={color} />
        <circle cx="0" cy={-r * 2.4} r={r * 0.2} fill="#fff6ea" opacity="0.75" />
        {active && <circle className="gd-glow" cx="0" cy={-r * 2.4} r={r * 0.95} fill="none" stroke={color} strokeWidth="1.4" opacity="0.5" />}
      </g>
    </g>
  )
}

export default function GardenPanel({ onClose }) {
  const [g, setG] = React.useState(null)
  const [err, setErr] = React.useState('')
  const [tip, setTip] = React.useState(null)
  React.useEffect(() => {
    let dead = false
    const load = () => api.garden().then(d => { if (!dead) setG(d) }).catch(e => { if (!dead) setErr(e.message) })
    load(); const t = setInterval(load, 90000)
    return () => { dead = true; clearInterval(t) }
  }, [])

  const phase = g?.time?.phase || 'day'
  const night = phase === 'night' || phase === 'dusk'
  const [skyTop, skyBot] = SKY[phase] || SKY.day
  const weather = g?.weather?.type || 'clear'
  const roses = (g?.roses || []).slice(0, SLOTS.length)
  const ivyN = Math.min(56, Math.round((g?.ivy?.growth || 0) * 1.1 + (g?.ivy?.repairs || 0) * 2))
  const beadN = Math.min(10, g?.glasshouse?.beads || 0)
  const thorns = g?.thorns || { total: 0, open: 0, healing: 0 }
  const thornN = Math.min(14, 2 + thorns.total * 3)
  const pondGlow = Math.max(0.15, Math.min(0.9, (g?.pond?.satiety || 0) * 2.2 + (g?.pond?.recent_feeds || 0) * 0.08))
  const flyN = Math.max(2, Math.min(12, Math.round((g?.fireflies?.activity || 0) / 3)))

  // 常春藤叶位置(拱门弧线)
  const ivyLeaves = []
  for (let i = 0; i < ivyN; i++) {
    const t = i / Math.max(1, ivyN - 1)
    const ang = Math.PI * (1 - t)
    const wob = (i % 3 - 1) * 7
    ivyLeaves.push([150 + 92 * Math.cos(ang) + wob, 402 - 118 * Math.sin(ang) + (i % 2) * 6, (i * 47) % 360])
  }
  return (
    <div className="studio-reader gd-root" role="dialog" aria-modal="true" aria-label="Echo 的花园">
      <div className="studio-reader-shell gd-shell">
        <style>{`
.gd-shell{max-width:860px;background:#efe8da;display:flex;flex-direction:column}
.gd-head{display:flex;align-items:center;gap:12px;padding:14px 18px 8px}
.gd-head h2{font-family:'Songti SC','Noto Serif SC',serif;font-size:22px;color:#3a342a;margin:0;font-weight:700}
.gd-head p{margin:0;font-size:12px;color:#9d9081}
.gd-back{width:38px;height:38px;border-radius:12px;border:none;background:#efe8da;box-shadow:4px 4px 9px #cdc4b1,-4px -4px 9px #fbf7ed;cursor:pointer;display:grid;place-items:center}
.gd-svgwrap{position:relative;margin:6px 14px;border-radius:18px;overflow:hidden;box-shadow:inset 3px 3px 8px #cdc4b1}
.gd-legend{font-size:11.5px;color:#8a7d6c;font-family:var(--font-cn);padding:8px 20px 16px;line-height:1.9;text-align:center}
.gd-rose{cursor:pointer}
.gd-bloom{animation:gdBreathe var(--t) ease-in-out var(--d) infinite}
@keyframes gdBreathe{0%,100%{transform:scale(1) rotate(-1.5deg)}50%{transform:scale(1.07) rotate(1.5deg)}}
.gd-glow{animation:gdGlow 3.2s ease-in-out infinite}
@keyframes gdGlow{0%,100%{opacity:.15;r:inherit}50%{opacity:.55}}
.gd-fly{animation:gdFly var(--t) ease-in-out var(--d) infinite alternate}
@keyframes gdFly{0%{transform:translate(0,0)}33%{transform:translate(14px,-10px)}66%{transform:translate(-8px,-18px)}100%{transform:translate(10px,-4px)}}
.gd-flyglow{animation:gdBlink 2.4s ease-in-out var(--d) infinite}
@keyframes gdBlink{0%,100%{opacity:.25}50%{opacity:.95}}
.gd-water{animation:gdWater 5s ease-in-out infinite}
@keyframes gdWater{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}
.gd-cloud{animation:gdCloud 26s linear infinite}
@keyframes gdCloud{0%{transform:translateX(-60px)}100%{transform:translateX(760px)}}
.gd-rain line{animation:gdRain 1.1s linear infinite}
@keyframes gdRain{0%{transform:translateY(-12px);opacity:0}30%{opacity:.55}100%{transform:translateY(30px);opacity:0}}
.gd-tip{position:absolute;max-width:270px;background:#fffdf6;border-radius:12px;padding:10px 13px;font-size:12px;line-height:1.7;color:#4a4236;box-shadow:0 8px 24px rgba(60,45,25,.25);font-family:'Songti SC','Noto Serif SC',serif;pointer-events:none;z-index:5}
.gd-tip b{color:#8a5a3a;font-size:11px}
`}</style>
        <header className="gd-head">
          <button className="gd-back" onClick={onClose} aria-label="返回"><Icon name="back" size={18} color="#3a342a" /></button>
          <div>
            <h2>Echo 的花园</h2>
            <p>他此刻内在的样子 · {WEATHER_CN[weather] || '晴'}{g?.weather?.emotion && g.weather.emotion !== 'neutral' ? ` · 最近的底色是「${g.weather.emotion}」` : ''}</p>
          </div>
        </header>
        {err && <div style={{ padding: '0 20px', color: '#c4452e', fontSize: 12 }}>花园暂时看不清：{err}</div>}
        <div className="gd-svgwrap" onClick={() => setTip(null)}>
          <svg viewBox="0 0 700 560" width="100%" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="gdSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={skyTop} /><stop offset="1" stopColor={skyBot} />
              </linearGradient>
              <radialGradient id="gdMoonG"><stop offset="0" stopColor="#fff8e0" stopOpacity=".9" /><stop offset="1" stopColor="#fff8e0" stopOpacity="0" /></radialGradient>
            </defs>
            <rect width="700" height="560" fill="url(#gdSky)" />
            {night && [...Array(26)].map((_, i) => (
              <circle key={i} cx={(i * 137 + 40) % 690} cy={(i * 71) % 250 + 12} r={i % 3 ? 1 : 1.6} fill="#fff" opacity={0.3 + (i % 5) * 0.14} />
            ))}
            {night && <g><circle cx="590" cy="86" r="40" fill="url(#gdMoonG)" /><circle cx="590" cy="86" r="24" fill="#f7ecc9" /><circle cx="582" cy="80" r="5" fill="#e8dcb4" opacity=".7" /><circle cx="597" cy="93" r="3.4" fill="#e8dcb4" opacity=".6" /></g>}
            {!night && weather !== 'rain' && <circle cx="592" cy="84" r="26" fill="#f9e8b7" opacity=".9" />}
            {(weather === 'breeze' || weather === 'overcast' || weather === 'rain') && (
              <g className="gd-cloud" opacity={weather === 'overcast' ? 0.8 : 0.55}>
                <ellipse cx="120" cy="80" rx="52" ry="18" fill="#fff" /><ellipse cx="160" cy="70" rx="38" ry="15" fill="#fff" />
              </g>
            )}
            {weather === 'overcast' && <rect width="700" height="560" fill="#5a6273" opacity=".12" />}
            {weather === 'rain' && (
              <g className="gd-rain" stroke="#9fb4cf" strokeWidth="1.4" opacity=".6">
                {[...Array(14)].map((_, i) => <line key={i} x1={30 + i * 48} y1={60 + (i % 4) * 30} x2={26 + i * 48} y2={78 + (i % 4) * 30} />)}
              </g>
            )}
            {/* 远山与草地 */}
            <path d="M0,360 Q 170,320 340,352 T 700,346 L700,560 L0,560 Z" fill={night ? '#3d4a3f' : '#a8bd90'} opacity=".8" />
            <path d="M0,400 Q 220,372 430,398 T 700,392 L700,560 L0,560 Z" fill={night ? '#465741' : '#b7c99b'} />
            {/* Ivy Arch 常春藤拱门 = 信任/成长 */}
            <g>
              <path d="M58,404 A 92 118 0 0 1 242,404" stroke="#8a7355" strokeWidth="7" fill="none" />
              <path d="M70,404 A 80 106 0 0 1 230,404" stroke="#6e8858" strokeWidth="2.5" fill="none" opacity=".7" />
              {ivyLeaves.map(([x, y, r], i) => (
                <ellipse key={i} cx={x} cy={y} rx="6.2" ry="3.4" fill={i % 4 ? '#6e9a5e' : '#87ae6f'} transform={`rotate(${r} ${x} ${y})`} opacity=".92" />
              ))}
            </g>
            {/* Glasshouse 玻璃温室 = 珠子记忆 */}
            <g transform="translate(556,318)">
              <path d="M0,86 L0,26 L52,0 L104,26 L104,86 Z" fill={night ? '#2e3550' : '#dcebee'} stroke="#8a7d6c" strokeWidth="2.5" opacity=".92" />
              <line x1="52" y1="0" x2="52" y2="86" stroke="#8a7d6c" strokeWidth="1.4" opacity=".6" />
              <line x1="0" y1="26" x2="104" y2="26" stroke="#8a7d6c" strokeWidth="1.4" opacity=".6" />
              {[...Array(beadN)].map((_, i) => (
                <circle key={i} cx={14 + (i % 5) * 19} cy={70 - Math.floor(i / 5) * 22} r="4.6" fill="#f6d67c" opacity=".9">
                  <animate attributeName="opacity" values=".5;.95;.5" dur={`${2.6 + i * 0.4}s`} repeatCount="indefinite" />
                </circle>
              ))}
            </g>
            {/* Moon Pond 月池 = 安抚/余温 */}
            <g>
              <ellipse cx="132" cy="512" rx="104" ry="30" fill={night ? '#31406b' : '#9dc3d4'} opacity=".9" />
              <ellipse cx="132" cy="512" rx="104" ry="30" fill="#fff" opacity={pondGlow * 0.16} />
              <ellipse className="gd-water" cx="132" cy="508" rx="72" ry="14" fill="#fff" opacity=".14" />
              <ellipse cx="150" cy="514" rx="16" ry="5.5" fill="#f7ecc9" opacity={pondGlow} />
              {[...Array(Math.min(5, g?.pond?.recent_feeds || 0))].map((_, i) => (
                <ellipse key={i} cx={72 + i * 32} cy={520 - (i % 2) * 8} rx="9" ry="3.6" fill="#6e9a5e" opacity=".85" />
              ))}
            </g>
            {/* Thorn Fence 荆棘篱笆 = 摩擦(只有形态, 没有细节, 不可点) */}
            <g>
              {[0, 1, 2, 3, 4].map(i => <rect key={i} x={478 + i * 46} y="470" width="7" height="46" rx="2" fill="#8a7355" />)}
              <path d="M470,483 H 690 M470,500 H 690" stroke="#8a7355" strokeWidth="3.4" />
              {[...Array(thornN)].map((_, i) => {
                const x = 480 + (i * 197) % 200
                const y = i % 2 ? 483 : 500
                return <path key={i} d={`M${x},${y} l4,-7 l4,7`} fill="none" stroke={thorns.open ? '#7a4a3a' : '#8a7355'} strokeWidth="2" />
              })}
              {[...Array(Math.min(6, (thorns.healing + thorns.patched) * 2))].map((_, i) => (
                <ellipse key={i} cx={492 + i * 34} cy={479} rx="4.4" ry="2.4" fill="#87ae6f" transform={`rotate(-24 ${492 + i * 34} 479)`} />
              ))}
            </g>
            {/* Rose Bed 玫瑰花圃 = 欲望 */}
            {roses.map((r, i) => {
              const [x, y] = SLOTS[i]
              const rad = 7 + r.urge * 17
              return <Rose key={i} x={x} y={y} r={rad} color={CAT_COLOR[r.category] || '#c9899a'} delay={i * 0.55} dur={5.5 - Math.min(3, r.activation * 3)} active={r.urge >= 0.5}
                onTap={(e) => { e.stopPropagation(); setTip({ x, y, rose: r }) }} />
            })}
            {/* Fireflies 萤火虫 = 最近互动热度 */}
            {[...Array(flyN)].map((_, i) => (
              <g key={i} className="gd-fly" style={{ '--t': `${6 + (i % 4)}s`, '--d': `${i * 0.9}s` }} transform={`translate(${90 + (i * 173) % 520},${330 + (i * 67) % 150})`}>
                <circle className="gd-flyglow" style={{ '--d': `${i * 0.5}s` }} r={night ? 2.6 : 2} fill={night ? '#ffe98a' : '#fff'} opacity=".8" />
              </g>
            ))}
          </svg>
          {tip && (
            <div className="gd-tip" style={{ left: `${Math.min(62, tip.x / 7)}%`, top: `${Math.max(6, tip.y / 5.6 - 26)}%` }}>
              <b>{CAT_CN[tip.rose.category] || tip.rose.category} · 开了 {tip.rose.days} 天 · 烧到 {(tip.rose.urge * 100 | 0)}%</b><br />
              {tip.rose.seed}
            </div>
          )}
        </div>
        <div className="gd-legend">
          🌹 玫瑰是他还想要的(点一朵看看) · 🌿 拱门上的藤是长成的信任 · 🌙 月池的光是被接住的暖<br />
          🥀 篱笆上的刺是还没过去的(它守着花园, 不必细看) · 🏡 温室里亮着的是收藏的珠子 · ✨ 萤火是最近的热闹
        </div>
      </div>
    </div>
  )
}
