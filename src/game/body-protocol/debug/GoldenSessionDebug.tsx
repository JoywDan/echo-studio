import React from 'react'
import { goldenObservationLog, runGoldenSession, verifyGoldenReplay } from '../engine/goldenSession'
import { generateActionCards } from '../engine/actionCardGenerator'
import { advanceDirector, initialDirector } from '../engine/sessionDirector'
import { GOLDEN_PROTOCOL } from '../models/protocol'
import { bodyProtocolReducer, initialProtocolState } from '../store/bodyProtocolReducer'
import { makeSave } from '../store/persistence'
import { decryptVault, encryptVault } from '../store/privateVault'
import { readEncryptedVault, writeEncryptedVault } from '../store/vaultStorage'
import { api } from '../../../workspace/api.js'
import { isRecentDuplicate, validateEchoResponse } from '../generation/responseGuard'

export default function GoldenSessionDebug() {
  const [turns, setTurns] = React.useState(30)
  const [run, setRun] = React.useState(() => runGoldenSession(30))
  const [liveState, dispatch] = React.useReducer(bodyProtocolReducer, undefined, initialProtocolState)
  const [password, setPassword] = React.useState('')
  const [vaultStatus, setVaultStatus] = React.useState('Vault locked')
  const [restored, setRestored] = React.useState<Awaited<ReturnType<typeof makeSave>> | null>(null)
  const [lastAction, setLastAction] = React.useState<(typeof liveState.currentCards)[number]['action'] | null>(null)
  const [echoReply, setEchoReply] = React.useState('')
  const [echoStatus, setEchoStatus] = React.useState('')
  const [recentEchoReplies, setRecentEchoReplies] = React.useState<string[]>([])
  const observations = goldenObservationLog(run)
  const finalState = run.turns.at(-1)?.result.stateAfter
  const finalDirector = finalState ? advanceDirector(initialDirector(), finalState, run.turns.length, GOLDEN_PROTOCOL) : initialDirector()
  const cards = finalState ? generateActionCards(finalState, finalDirector, GOLDEN_PROTOCOL) : []
  React.useEffect(() => { dispatch({ type: 'BEGIN_SESSION', sessionId: 'golden-live', seed: 'golden-live-v3.1' }) }, [])
  const revealProtocol = () => dispatch({ type: 'REVEAL_PROTOCOL' })
  const playCard = (action: (typeof liveState.currentCards)[number]['action']) => {
    if (liveState.phase !== 'turn_generate') return
    setLastAction(action); setEchoReply(''); setEchoStatus('')
    dispatch({ type: 'ACTIONS_READY' })
    dispatch({ type: 'RESOLVE_ACTION', action })
  }
  const askEcho = async () => {
    if (!lastAction || !liveState.lastResult) return
    setEchoStatus('Echo is composing…')
    try {
      const result = await api.bodyProtocol.respond({ protocol: liveState.protocol, director: liveState.director, action: lastAction, simulation_result: liveState.lastResult, agency_projection: liveState.agency, triggered_conditions: liveState.triggeredConditionIds, recent_turn_summary: liveState.recentTurnSummary })
      const guarded = validateEchoResponse(result)
      if (isRecentDuplicate(guarded.speech, recentEchoReplies)) { setEchoStatus('重复回应已拦截，请换一轮或重新生成'); return }
      setEchoReply(guarded.speech); setRecentEchoReplies((items) => [...items, guarded.speech].slice(-20)); setEchoStatus(`Claude · ${guarded.model || 'response received'}`)
    } catch (error) { setEchoStatus(error instanceof Error ? error.message : 'Echo response failed') }
  }
  const saveVault = async () => {
    try { if (!password) throw new Error('Enter a test password first'); await writeEncryptedVault(await encryptVault(makeSave(liveState.sessionId || 'golden-live', liveState.body), password)); setVaultStatus('Encrypted live save written to IndexedDB') } catch (error) { setVaultStatus(error instanceof Error ? error.message : 'Vault write failed') }
  }
  const loadVault = async () => {
    try { if (!password) throw new Error('Enter the same password to unlock'); const record = await readEncryptedVault(); if (!record) throw new Error('No encrypted save found'); setRestored(await decryptVault(record, password)); setVaultStatus('Vault unlocked · save restored') } catch (error) { setVaultStatus(error instanceof Error ? error.message : 'Vault unlock failed') }
  }
  const lockVault = () => { setPassword(''); setRestored(null); setVaultStatus('Vault locked · in-memory password cleared') }

  return <div style={{ position: 'fixed', inset: 18, zIndex: 9999, overflow: 'auto', background: '#111827', color: '#e5e7eb', border: '1px solid #475569', borderRadius: 16, padding: 24, fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', boxShadow: '0 20px 70px #0009' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
      <div><div style={{ color: '#a78bfa', fontSize: 12, letterSpacing: 2 }}>BODY PROTOCOL · DEV ONLY</div><h1 style={{ margin: '6px 0', fontSize: 24 }}>Golden Session Debug</h1><div style={{ color: '#94a3b8' }}>seed: {run.seed} · engine: {run.engineVersion} · rules: {run.rulesetVersion}</div></div>
      <div style={{ display: 'flex', gap: 8 }}><select value={turns} onChange={(e) => setTurns(Number(e.target.value))} style={{ padding: 8, borderRadius: 8 }}><option value={10}>10 turns</option><option value={20}>20 turns</option><option value={30}>30 turns</option></select><button onClick={() => setRun(runGoldenSession(turns))} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Run</button><button onClick={() => window.location.href = window.location.pathname} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Close</button></div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, margin: '20px 0' }}>
      {[['Turns', run.turns.length], ['Arousal', finalState?.global.arousal ?? '-'], ['Control', finalState?.global.control ?? '-'], ['Phase', finalDirector.phase], ['Replay', verifyGoldenReplay(run) ? 'PASS' : 'FAIL']].map(([label, value]) => <div key={String(label)} style={{ padding: 14, background: '#1e293b', borderRadius: 10 }}><div style={{ color: '#94a3b8', fontSize: 12 }}>{label}</div><strong style={{ display: 'block', marginTop: 6, fontSize: 20 }}>{value}</strong></div>)}
    </div>
    <h2 style={{ fontSize: 15, color: '#c4b5fd' }}>Observation Log</h2>
    <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.65, background: '#020617', padding: 16, borderRadius: 10 }}>{observations.join('\n')}</pre>
    <h2 style={{ fontSize: 15, color: '#c4b5fd' }}>Live Session · {liveState.director.phase} · turn {liveState.turnIndex}</h2>
    {liveState.phase === 'protocol_reveal' && <div style={{ background: '#312e81', borderRadius: 10, padding: 16, marginBottom: 12 }}><div style={{ color: '#c4b5fd', fontSize: 12, letterSpacing: 1 }}>TONIGHT'S PROTOCOL</div><h3 style={{ margin: '8px 0' }}>{liveState.protocol.title}</h3><div style={{ color: '#ddd6fe', fontSize: 13 }}>Rules: {liveState.protocol.rules.join(' · ')}</div><button onClick={revealProtocol} style={{ marginTop: 12, padding: '9px 14px', borderRadius: 8, cursor: 'pointer' }}>Reveal cards + begin</button></div>}
    <div style={{ display: 'flex', gap: 14, color: '#cbd5e1', fontSize: 13, marginBottom: 10 }}><span>arousal {liveState.body.global.arousal}</span><span>control {liveState.body.global.control}</span><span>tension {liveState.body.global.tension}</span><span>conditions {liveState.conditions.length}</span></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>{liveState.currentCards.map((item) => <button key={item.id} onClick={() => playCard(item.action)} disabled={liveState.phase !== 'turn_generate'} style={{ textAlign: 'left', color: '#e2e8f0', background: '#1e293b', border: '1px solid #475569', borderRadius: 8, padding: 10, cursor: liveState.phase === 'turn_generate' ? 'pointer' : 'default', minHeight: 92 }}><strong>{item.title}</strong><div style={{ marginTop: 5, color: '#94a3b8', fontSize: 12 }}>{item.description}</div><div style={{ marginTop: 7, color: '#a78bfa', fontSize: 11 }}>{item.source} · {item.riskLevel}</div></button>)}</div>
    {liveState.phase === 'turn_generate' && <button onClick={() => dispatch({ type: 'PAUSE' })} style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Pause → Aftercare</button>}
    {liveState.phase === 'aftercare' && <div style={{ marginTop: 12, background: '#14532d', borderRadius: 10, padding: 14, color: '#dcfce7' }}>Session ended safely. The next step is aftercare; no further action cards are active.</div>}
    {liveState.lastResult && <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, background: '#020617', padding: 12, borderRadius: 8, fontSize: 12 }}>LAST RESULT\n{JSON.stringify({ delta: liveState.lastResult.delta, events: liveState.lastResult.events }, null, 2)}</pre>}
    {liveState.lastResult && <div style={{ marginTop: 10, background: '#312e81', borderRadius: 8, padding: 12 }}><button onClick={askEcho} disabled={!lastAction || echoStatus === 'Echo is composing…'} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Ask Echo · 1 model call</button><span style={{ marginLeft: 10, color: '#c4b5fd', fontSize: 12 }}>{echoStatus}</span>{echoReply && <div style={{ marginTop: 10, color: '#f5f3ff', lineHeight: 1.6 }}>{echoReply}</div>}</div>}
    <h2 style={{ fontSize: 15, color: '#c4b5fd', marginTop: 22 }}>Private Vault · Dev Test</h2>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="测试密码（至少 8 位）" style={{ padding: 9, borderRadius: 8, minWidth: 220 }} /><button onClick={saveVault} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Encrypt + Save</button><button onClick={loadVault} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Unlock + Load</button><button onClick={lockVault} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Lock</button><span style={{ color: '#94a3b8', fontSize: 12 }}>{vaultStatus}</span></div>
    {restored && <div style={{ marginTop: 10, color: '#86efac', fontSize: 12 }}>Restored session: {restored.sessionId} · arousal {restored.bodyState.global.arousal} · schema v{restored.schemaVersion}</div>}
    <details><summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>Structured turn results ({run.turns.length})</summary><pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, color: '#cbd5e1' }}>{JSON.stringify(run.turns.map((turn, i) => ({ turn: i + 1, action: turn.action.id, delta: turn.result.delta, events: turn.result.events })), null, 2)}</pre></details>
  </div>
}
