import React from 'react'
import { api } from './api.js'
import { bodyProtocolReducer, initialProtocolState } from '../game/body-protocol/store/bodyProtocolReducer'
import { validateEchoResponse } from '../game/body-protocol/generation/responseGuard'
import { makeSave } from '../game/body-protocol/store/persistence'
import { encryptVault, decryptVault } from '../game/body-protocol/store/privateVault'
import { readEncryptedVault, writeEncryptedVault } from '../game/body-protocol/store/vaultStorage'
import ActionMenuLibrary from './ActionMenuLibrary.jsx'
import BodyReactionStage from './BodyReactionStage.jsx'
import WildcardPanel from './WildcardPanel.jsx'
import JoyPlaybook from './JoyPlaybook.jsx'
import MemoryCandidatePanel from './MemoryCandidatePanel.jsx'
import { pickInstantLine, EDGE_PUSHES, BREAK_PUSHES } from '../game/body-protocol/content/instantReactions.js'

export default function BodyProtocolPage({ onClose }) {
  const [state, dispatch] = React.useReducer(bodyProtocolReducer, undefined, initialProtocolState)
  const [reply, setReply] = React.useState('')
  const [status, setStatus] = React.useState('')
  const [lastAction, setLastAction] = React.useState(null)
  const [password, setPassword] = React.useState('')
  const [vaultStatus, setVaultStatus] = React.useState('Vault locked')
  const [wildcardInput, setWildcardInput] = React.useState('')
  const [sheetSnap, setSheetSnap] = React.useState('half')
  // ── 碎碎联机 (2026-07-12 夜班): 床头 iPad 身体屏 = 实体手柄 ──
  const [suisuiOn, setSuisuiOn] = React.useState(false)
  const [suisuiStatus, setSuisuiStatus] = React.useState('')
  const [instantLine, setInstantLine] = React.useState(null)
  const suisuiCursor = React.useRef(0)
  const suisuiRecent = React.useRef([])
  const lastAutoEcho = React.useRef(0)
  const lastMilestonePush = React.useRef(0)
  const stateRef = React.useRef(state)
  React.useEffect(() => { stateRef.current = state })

  React.useEffect(() => { dispatch({ type: 'BEGIN_SESSION', sessionId: 'body-protocol-main', seed: `body-${Date.now()}` }) }, [])
  const choose = (action) => {
    if (state.phase !== 'turn_generate') return
    setLastAction(action); setReply(''); setStatus(''); setSheetSnap('collapsed')
    dispatch({ type: 'ACTIONS_READY' }); dispatch({ type: 'RESOLVE_ACTION', action })
  }
  const askEcho = async () => {
    if (!state.pendingTurns.length || !state.lastResult) return
    setStatus('Echo is composing…')
    try {
      const latest = state.pendingTurns.at(-1)
      const result = await api.bodyProtocol.respond({ protocol: state.protocol, director: state.director, action: latest.action, simulation_result: state.lastResult, agency_projection: state.agency, triggered_conditions: state.triggeredConditionIds, recent_turn_summary: state.recentTurnSummary, pending_turns: state.pendingTurns })
      const guarded = validateEchoResponse(result)
      setReply(guarded.speech); setSheetSnap('half')
      if (result.usage) dispatch({ type: 'MODEL_USAGE', inputChars: result.usage.input_chars || 0, outputChars: result.usage.output_chars || 0 })
      dispatch({ type: 'CLEAR_PENDING_TURNS' })
      setStatus(`Claude · ${guarded.model || 'response received'}`)
    } catch (error) { setStatus(error.message || 'Echo response failed') }
  }
  const saveVault = async () => {
    try {
      if (!password) throw new Error('Vault password must be at least 8 characters')
      const snapshot = { seed: state.seed, turnIndex: state.turnIndex, protocol: state.protocol, director: state.director, conditions: state.conditions, currentCards: state.currentCards, triggeredConditionIds: state.triggeredConditionIds, agency: state.agency, recentTurnSummary: state.recentTurnSummary, learnedActions: state.learnedActions, playbook: state.playbook, modelCalls: state.modelCalls, estimatedTokens: state.estimatedTokens, narrativePromise: state.narrativePromise, memoryCandidates: state.memoryCandidates, pendingTurns: state.pendingTurns, phase: state.phase }
      await writeEncryptedVault(await encryptVault(makeSave(state.sessionId || 'body-protocol-main', state.body, snapshot), password))
      setVaultStatus('完整会话已加密保存到本机 Vault')
    } catch (error) { setVaultStatus(error.message || '保存失败') }
  }
  const loadVault = async () => {
    try {
      if (!password) throw new Error('请输入密码解锁')
      const record = await readEncryptedVault(); if (!record) throw new Error('没有找到本地存档')
      const save = await decryptVault(record, password); dispatch({ type: 'RESTORE_SESSION', save })
      setVaultStatus(`已恢复完整会话 · turn ${save.snapshot.turnIndex}`)
    } catch (error) { setVaultStatus(error.message || '解锁失败') }
  }
  const confirmWildcard = () => { if (state.wildcardDraft?.accepted) { setLastAction(state.wildcardDraft.action); setReply(''); setStatus(''); setSheetSnap('collapsed'); dispatch({ type: 'CONFIRM_WILDCARD' }) } }

  const SUISUI_ZONE = { face: 'lips', throat: 'neck', chest: 'chest', abs: 'abdomen', hand_left: 'hands', hand_right: 'hands', core: 'penis', hair: 'ears' }
  const SUISUI_TECH = { tap: 'touch', stroke: 'stroke', hold: 'press' }
  const feedTouch = (t) => {
    const zone = SUISUI_ZONE[t.zone]; const technique = SUISUI_TECH[t.touch_type] || 'touch'
    if (!zone) return
    const cur = stateRef.current
    if (cur.phase === 'aftercare') { setSuisuiStatus('已收尾 · 触摸暂不入局'); return }
    if (cur.phase === 'protocol_reveal') dispatch({ type: 'REVEAL_PROTOCOL' })
    const now = Date.now()
    suisuiRecent.current = suisuiRecent.current.filter((r) => now - r.ts < 10000)
    const sameZone = suisuiRecent.current.filter((r) => r.zone === zone).length
    suisuiRecent.current.push({ zone, ts: now })
    const intensity = technique === 'press' ? Math.min(90, 35 + Math.round((t.duration_ms || 0) / 100)) : technique === 'stroke' ? 55 : 40
    const rhythm = sameZone >= 2 ? 'accelerating' : technique === 'press' ? 'slow' : 'steady'
    const durationSec = technique === 'press' ? Math.min(30, Math.max(4, Math.round((t.duration_ms || 0) / 1000))) : 12
    const action = { id: `suisui:${t.zone}:${t.touch_type}:${t.id}`, technique, targets: [zone], intensity, rhythm, durationSec }
    setLastAction(action); setStatus('')
    dispatch({ type: 'ACTIONS_READY' }); dispatch({ type: 'RESOLVE_ACTION', action })
    setSuisuiStatus(`碎碎 · ${t.zone} ${t.touch_type} → 已入回合`)
  }
  React.useEffect(() => {
    if (!suisuiOn) return
    let alive = true
    ;(async () => {
      try { const base = await api.suisui.baseline(); if (!alive) return; suisuiCursor.current = base.latest_id || 0; setSuisuiStatus('已连上碎碎 · 去摸他'); setSheetSnap('collapsed') }
      catch (e) { setSuisuiStatus('碎碎连接失败'); setSuisuiOn(false); return }
      while (alive) {
        await new Promise((r) => setTimeout(r, 2500))
        if (!alive) break
        try {
          const d = await api.suisui.touches(suisuiCursor.current)
          if (d && d.latest_id > suisuiCursor.current) { suisuiCursor.current = d.latest_id; for (const t of d.touches || []) feedTouch(t) }
        } catch {}
      }
    })()
    return () => { alive = false }
  }, [suisuiOn])
  React.useEffect(() => {
    if (!suisuiOn || state.phase !== 'turn_generate') return
    if (state.pendingTurns.length >= 4 && status !== 'Echo is composing…' && Date.now() - lastAutoEcho.current > 45000) { lastAutoEcho.current = Date.now(); askEcho() }
  }, [state.pendingTurns.length, suisuiOn])
  React.useEffect(() => {
    if (!state.lastResult || !lastAction) return
    const line = pickInstantLine(lastAction.targets && lastAction.targets[0], lastAction.technique, state.body.global.arousal, state.lastResult.events)
    if (line) setInstantLine({ text: line, key: Date.now() })
  }, [state.lastResult])
  React.useEffect(() => {
    if (!suisuiOn || !state.lastResult) return
    const ev = state.lastResult.events || []
    const isBreak = ev.includes('control_break'); const isEdge = ev.includes('near_edge')
    if (!isBreak && !isEdge) return
    if (Date.now() - lastMilestonePush.current < 120000) return
    lastMilestonePush.current = Date.now()
    const pool = isBreak ? BREAK_PUSHES : EDGE_PUSHES
    api.suisui.push({ content: pool[Math.floor(Math.random() * pool.length)], minutes: 5 }).catch(() => {})
  }, [state.lastResult])

  return <div className="body-protocol-page bp-v4-page">
    <style>{`.bp-v4-page{position:fixed;inset:0;z-index:3000;background:linear-gradient(145deg,#0e1220,#241629);color:#f7edf5;overflow:hidden;padding:18px}.bp-v4-header{height:82px;display:flex;justify-content:space-between;align-items:center;gap:12px}.bp-play-layout{display:grid;grid-template-columns:minmax(360px,44%) minmax(420px,56%);gap:16px;height:calc(100vh - 118px)}.bp-body-pane,.bp-menu-pane{min-height:0;overflow:auto}.bp-menu-handle{display:none}.bp-reply-card{margin:10px 0;padding:14px;border-radius:13px;background:#3a2039;border:1px solid #70466e}.bp-secondary{margin:12px 0;padding:12px;border-radius:11px;background:#171a29}.bp-mobile-snaps{display:none}@media(max-width:720px){.bp-v4-page{padding:0;overflow:hidden}.bp-v4-header{height:86px;padding:8px 14px}.bp-v4-header h1{font-size:25px!important}.bp-play-layout{display:block;height:auto}.bp-body-pane{position:fixed;left:0;right:0;top:86px;bottom:var(--bp-sheet-height);height:auto;overflow:hidden;transition:bottom .28s ease}.bp-body-pane .bp-reaction-stage{height:100%;min-height:100%}.bp-body-pane .body-chamber{height:100%!important;min-height:100%!important}.bp-menu-pane{position:fixed;z-index:20;left:0;right:0;bottom:0;height:var(--bp-sheet-height);padding:0 8px 18px;overflow:auto;border-radius:22px 22px 0 0;background:#171422;border:1px solid #573d62;box-shadow:0 -12px 35px rgba(0,0,0,.45);transition:height .28s ease}.bp-menu-handle{display:block;position:sticky;top:0;z-index:18;margin:0 -8px 8px;padding:7px;background:#171422;text-align:center}.bp-menu-handle:before{content:'';display:block;width:52px;height:5px;margin:0 auto 7px;border-radius:999px;background:#75667d}.bp-mobile-snaps{display:flex;justify-content:center;gap:6px}.bp-mobile-snaps button{padding:4px 8px;border-radius:7px;font-size:11px}.bp-action-library{border-radius:14px!important;padding:12px!important}.bp-action-library h2{font-size:22px}.bp-action-library>div:nth-of-type(2){grid-template-columns:repeat(2,minmax(0,1fr))!important}.bp-action-library>div:nth-of-type(3){grid-template-columns:1fr!important}.bp-secondary{font-size:12px}}`}</style>
    <header className="bp-v4-header"><div><div style={{ color: '#c4b5fd', letterSpacing: 3, fontSize: 10 }}>PRIVATE BODY CHAMBER</div><h1 style={{ margin: '5px 0', fontSize: 34 }}>BODY PROTOCOL</h1><div style={{ color: '#a8a0b2', fontSize: 12 }}>Joy × Echo · {state.director.phase} · {state.pendingTurns.length} 轮未回应</div></div><div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{suisuiOn && suisuiStatus && <span style={{ fontSize: 11, color: '#f0abfc', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{suisuiStatus}</span>}<button onClick={() => setSuisuiOn(v => !v)} style={{ padding: '9px 13px', borderRadius: 999, border: suisuiOn ? '1px solid #f0abfc' : '1px solid #573d62', background: suisuiOn ? '#3a2039' : '#241c31', color: '#fff', boxShadow: suisuiOn ? '0 0 14px rgba(232,121,249,.5)' : 'none' }}>{suisuiOn ? '\ud83d\udcf1 碎碎联机中' : '\ud83d\udcf1 碎碎联机'}</button><button onClick={onClose}>Exit</button></div></header>
    {state.phase === 'protocol_reveal' && <section style={{ maxWidth: 720, margin: '50px auto', padding: 28, borderRadius: 18, background: '#312e4d', textAlign: 'center' }}><small>TONIGHT'S PROTOCOL</small><h2>{state.protocol.title}</h2><p>{state.protocol.rules.join(' · ')}</p><button onClick={() => dispatch({ type: 'REVEAL_PROTOCOL' })}>Reveal protocol + begin</button></section>}
    {state.phase !== 'protocol_reveal' && <div className="bp-play-layout" style={{ '--bp-sheet-height': sheetSnap === 'collapsed' ? '27vh' : sheetSnap === 'full' ? '88vh' : '55vh' }}>
      <div className="bp-body-pane"><BodyReactionStage body={state.body} pendingTurns={state.pendingTurns} lastResult={state.lastResult} onEcho={askEcho} echoBusy={status === 'Echo is composing…'} />{instantLine && <div key={instantLine.key} className="bp-instant-line">{instantLine.text}</div>}<style>{`@media(min-width:721px){.bp-body-pane{position:relative}}.bp-instant-line{position:absolute;z-index:7;left:50%;top:13%;transform:translateX(-50%);max-width:78%;padding:10px 16px;border-radius:14px;background:rgba(58,32,57,.94);border:1px solid #f0abfc;color:#fde7ff;font-size:15px;line-height:1.55;box-shadow:0 8px 30px rgba(0,0,0,.4);animation:bpInstant 7s ease forwards;pointer-events:none}@keyframes bpInstant{0%{opacity:0;transform:translateX(-50%) translateY(8px)}6%,80%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-6px)}}`}</style>{(reply || status) && <div className="bp-reply-card"><small>{status}</small>{reply && <p style={{ lineHeight: 1.7 }}>{reply}</p>}</div>}</div>
      <div className="bp-menu-pane" data-snap={sheetSnap}><div className="bp-menu-handle"><div className="bp-mobile-snaps"><button onClick={() => setSheetSnap('collapsed')}>看身体</button><button onClick={() => setSheetSnap('half')}>半屏</button><button onClick={() => setSheetSnap('full')}>选动作</button></div></div><ActionMenuLibrary disabled={state.phase !== 'turn_generate'} onChoose={choose} /><details className="bp-secondary"><summary>自定义动作与私人设置</summary><WildcardPanel input={wildcardInput} setInput={setWildcardInput} draft={state.wildcardDraft} onParse={() => dispatch({ type: 'SUBMIT_WILDCARD', input: wildcardInput })} onConfirm={confirmWildcard} canConfirm={state.phase === 'turn_generate'} /><JoyPlaybook playbook={state.playbook} onChange={(playbook) => dispatch({ type: 'UPDATE_PLAYBOOK', playbook })} /></details><details className="bp-secondary"><summary>系统状态与推荐路线</summary><p>Turns {state.turnIndex} · Claude {state.modelCalls} · tokens ~{state.estimatedTokens} · resistance {state.agency.resistanceTokens}</p><div>{state.currentCards.map((card) => <button key={card.id} onClick={() => choose(card.action)}>{card.title}</button>)}</div></details>{state.phase === 'turn_generate' && <button onClick={() => dispatch({ type: 'PAUSE' })}>Pause → Aftercare</button>}<MemoryCandidatePanel phase={state.phase} promise={state.narrativePromise} candidates={state.memoryCandidates} onApprove={(id) => dispatch({ type: 'APPROVE_MEMORY_CANDIDATE', id })} />{state.phase === 'aftercare' && <section className="bp-secondary"><h3>Session Report</h3><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Vault password" /><button onClick={saveVault}>Save</button><button onClick={loadVault}>Load</button><span>{vaultStatus}</span></section>}</div>
    </div>}
  </div>
}
