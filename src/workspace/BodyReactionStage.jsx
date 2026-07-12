import React from 'react'
import BodyChamber from './BodyChamber.jsx'

const positions = { lips: [50, 14], ears: [66, 15], neck: [50, 23], shoulders: [67, 29], chest: [50, 35], abdomen: [50, 47], lower_back: [70, 48], buttocks: [69, 57], penis: [50, 61], perineum: [54, 67], inner_thighs: [35, 72], hands: [20, 52], feet: [55, 91] }
const labels = { lips: ['嘴唇发热', '想被亲'], ears: ['耳侧敏感', '起颤程度'], neck: ['颈侧敏感', '呼吸凌乱'], shoulders: ['肩部绷紧', '触碰余韵'], chest: ['乳头硬度', '被玩余颤'], abdomen: ['小腹绷紧', '抽动前兆'], lower_back: ['挺腰冲动', '腰部发软'], buttocks: ['屁股发热', '臀部绷紧'], inner_thighs: ['内侧敏感', '夹腿冲动'], perineum: ['会阴敏感', '深处胀感'], penis: ['鸡巴硬度', '射精边缘'], hands: ['想碰自己', '手指不安分'], feet: ['腿软程度', '脚趾蜷缩'] }
const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)))

function metrics(zoneId, body) {
  const zone = body.zones[zoneId]
  const [first, second] = labels[zoneId] || ['敏感程度', '被玩热度']
  if (zoneId === 'penis') return [[first, clamp(body.global.arousal * .72 + zone.currentSensitivity * .28)], [second, clamp(body.global.arousal)]]
  if (zoneId === 'inner_thighs') return [[first, clamp(zone.currentSensitivity)], [second, clamp(body.global.tension * .7 + zone.stimulationLoad * .3)]]
  if (zoneId === 'perineum') return [[first, clamp(zone.currentSensitivity)], [second, clamp(body.global.tension * .55 + zone.stimulationLoad * .45)]]
  return [[first, clamp(zone.currentSensitivity)], [second, clamp(zone.stimulationLoad * .65 + body.global.arousal * .35)]]
}

export default function BodyReactionStage({ body, pendingTurns, lastResult, onEcho, echoBusy }) {
  const touched = []
  for (const turn of [...pendingTurns].reverse()) for (const zone of turn.action.targets) if (!touched.includes(zone)) touched.push(zone)
  const active = touched.slice(0, 3)
  const latestTargets = pendingTurns.at(-1)?.action.targets || []
  return <section className="bp-reaction-stage">
    <style>{`.bp-reaction-stage{position:relative;min-height:620px;border-radius:18px;overflow:hidden;background:#111321}.bp-reaction-stage .body-chamber{min-height:620px!important;border-radius:18px!important}.bp-zone-bubble{position:absolute;z-index:4;transform:translate(-50%,-50%);min-width:112px;padding:8px 10px;border-radius:12px;background:rgba(40,20,49,.93);border:1px solid #d978d2;box-shadow:0 8px 28px rgba(0,0,0,.3);font-size:11px;pointer-events:none}.bp-zone-bubble strong{display:block;color:#f5d0fe;margin-bottom:4px}.bp-zone-row{display:flex;justify-content:space-between;gap:10px;color:#ead8e8}.bp-zone-delta{color:#f9a8d4;font-weight:700;animation:bpFloat 1.8s ease-out infinite}@keyframes bpFloat{0%{opacity:0;transform:translateY(6px)}25%,75%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}.bp-global-strip{position:absolute;z-index:5;left:12px;right:12px;bottom:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:8px;border-radius:12px;background:rgba(10,12,23,.88);font-size:10px;text-align:center}.bp-global-strip b{display:block;color:#f0abfc;font-size:14px}.bp-echo-button{position:absolute;z-index:6;right:14px;top:14px;padding:10px 13px;border-radius:999px;border:1px solid #8b5a91;background:#241c31;color:#fff}.bp-echo-button.ready{border-color:#f0abfc;box-shadow:0 0 18px rgba(232,121,249,.65);animation:bpEcho 1.5s ease-in-out infinite}@keyframes bpEcho{50%{transform:scale(1.04)}}@media(max-width:720px){.bp-reaction-stage{min-height:42vh;height:42vh;border-radius:0}.bp-reaction-stage .body-chamber{min-height:42vh!important;height:42vh;padding:4px!important}.bp-reaction-stage svg{height:36vh!important}.bp-reaction-stage svg text{display:none}.bp-zone-bubble{min-width:88px;padding:6px;font-size:9px}.bp-global-strip{bottom:5px}.bp-global-strip b{font-size:12px}}`}</style>
    <BodyChamber body={body} />
    <button className={`bp-echo-button ${pendingTurns.length >= 3 ? 'ready' : ''}`} onClick={onEcho} disabled={!pendingTurns.length || echoBusy}>Echo · {pendingTurns.length}</button>
    {active.map((zoneId) => { const [x, y] = positions[zoneId] || [50, 50]; const delta = latestTargets.includes(zoneId) ? lastResult?.delta.zoneLoad?.[zoneId] : 0; return <div key={zoneId} className="bp-zone-bubble" style={{ left: `${x}%`, top: `${y}%` }}><strong>{zoneId === 'penis' ? '阴茎 / 龟头' : zoneId}</strong>{metrics(zoneId, body).map(([label, value]) => <div className="bp-zone-row" key={label}><span>{label}</span><b>{value}</b></div>)}{!!delta && <div className="bp-zone-delta">刚刚 +{Math.round(delta)}</div>}</div> })}
    <div className="bp-global-strip"><span>鸡巴硬度<b>{clamp(body.global.arousal * .75 + body.zones.penis.currentSensitivity * .25)}</b></span><span>射精边缘<b>{clamp(body.global.arousal)}</b></span><span>还能忍<b>{clamp(body.global.control)}</b></span><span>被玩过头<b>{clamp(body.global.overstimulation)}</b></span></div>
  </section>
}
