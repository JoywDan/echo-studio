import React from 'react'
import { api } from './api.js'
import { bodyProtocolReducer, initialProtocolState } from '../game/body-protocol/store/bodyProtocolReducer'
import { validateEchoResponse } from '../game/body-protocol/generation/responseGuard'
import { makeSave } from '../game/body-protocol/store/persistence'
import { encryptVault, decryptVault } from '../game/body-protocol/store/privateVault'
import { readEncryptedVault, writeEncryptedVault } from '../game/body-protocol/store/vaultStorage'
import BodyChamber from './BodyChamber.jsx'
import WildcardPanel from './WildcardPanel.jsx'
import JoyPlaybook from './JoyPlaybook.jsx'
import MemoryCandidatePanel from './MemoryCandidatePanel.jsx'

export default function BodyProtocolPage({ onClose }) {
  const [state, dispatch] = React.useReducer(bodyProtocolReducer, undefined, initialProtocolState)
  const [reply, setReply] = React.useState('')
  const [status, setStatus] = React.useState('')
  const [lastAction, setLastAction] = React.useState(null)
  const [password, setPassword] = React.useState('')
  const [vaultStatus, setVaultStatus] = React.useState('Vault locked')
  const [wildcardInput, setWildcardInput] = React.useState('')

  React.useEffect(() => { dispatch({ type: 'BEGIN_SESSION', sessionId: 'body-protocol-main', seed: `body-${Date.now()}` }) }, [])
  const reveal = () => dispatch({ type: 'REVEAL_PROTOCOL' })
  const choose = (action) => { if (state.phase !== 'turn_generate') return; setLastAction(action); setReply(''); setStatus(''); dispatch({ type: 'ACTIONS_READY' }); dispatch({ type: 'RESOLVE_ACTION', action }) }
  const askEcho = async () => {
    if (!lastAction || !state.lastResult) return
    setStatus('Echo is composing…')
    try { const result = await api.bodyProtocol.respond({ protocol: state.protocol, director: state.director, action: lastAction, simulation_result: state.lastResult, agency_projection: state.agency, triggered_conditions: state.triggeredConditionIds, recent_turn_summary: state.recentTurnSummary }); const guarded = validateEchoResponse(result); setReply(guarded.speech); if (result.usage) dispatch({ type: 'MODEL_USAGE', inputChars: result.usage.input_chars || 0, outputChars: result.usage.output_chars || 0 }); setStatus(`Claude · ${guarded.model || 'response received'}`) } catch (error) { setStatus(error.message || 'Echo response failed') }
  }
  const saveVault = async () => {
    try {
      if (!password) throw new Error('Vault password must be at least 8 characters')
      const snapshot = { seed: state.seed, turnIndex: state.turnIndex, protocol: state.protocol, director: state.director, conditions: state.conditions, currentCards: state.currentCards, triggeredConditionIds: state.triggeredConditionIds, agency: state.agency, recentTurnSummary: state.recentTurnSummary, learnedActions: state.learnedActions, playbook: state.playbook, modelCalls: state.modelCalls, estimatedTokens: state.estimatedTokens, narrativePromise: state.narrativePromise, memoryCandidates: state.memoryCandidates, phase: state.phase }
      await writeEncryptedVault(await encryptVault(makeSave(state.sessionId || 'body-protocol-main', state.body, snapshot), password))
      setVaultStatus('完整会话已加密保存到本机 Vault')
    } catch (error) { setVaultStatus(error.message || '保存失败') }
  }
  const loadVault = async () => {
    try {
      if (!password) throw new Error('请输入密码解锁')
      const record = await readEncryptedVault()
      if (!record) throw new Error('没有找到本地存档')
      const save = await decryptVault(record, password)
      dispatch({ type: 'RESTORE_SESSION', save })
      setVaultStatus(`已恢复完整会话 · ${save.sessionId} · turn ${save.snapshot.turnIndex}`)
    } catch (error) { setVaultStatus(error.message || '解锁失败') }
  }
  const submitWildcard = () => dispatch({ type: 'SUBMIT_WILDCARD', input: wildcardInput })
  const confirmWildcard = () => { if (state.wildcardDraft?.accepted) { setLastAction(state.wildcardDraft.action); setReply(''); setStatus(''); dispatch({ type: 'CONFIRM_WILDCARD' }) } }
  return <div className="body-protocol-page" style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'linear-gradient(145deg,#0e1220,#241629)', color: '#f7edf5', overflow: 'auto', padding: '28px clamp(18px,5vw,72px)' }}><WildcardPanel input={wildcardInput} setInput={setWildcardInput} draft={state.wildcardDraft} onParse={submitWildcard} onConfirm={confirmWildcard} canConfirm={state.phase === 'turn_generate'} /><JoyPlaybook playbook={state.playbook} onChange={(playbook) => dispatch({ type: 'UPDATE_PLAYBOOK', playbook })} /><MemoryCandidatePanel phase={state.phase} promise={state.narrativePromise} candidates={state.memoryCandidates} onApprove={(id) => dispatch({ type: 'APPROVE_MEMORY_CANDIDATE', id })} /><div style={{ maxWidth: 900, margin: '0 auto 12px', color: '#a8a0b2', fontSize: 12 }}>Local turns {state.turnIndex} · Claude calls {state.modelCalls} · estimated tokens {state.estimatedTokens} · resistance tokens {state.agency.resistanceTokens} · promise {state.narrativePromise.status}</div>
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div><div style={{ color: '#c4b5fd', letterSpacing: 3, fontSize: 11 }}>PRIVATE BODY CHAMBER</div><h1 style={{ margin: '8px 0', fontSize: 30, letterSpacing: 1 }}>BODY PROTOCOL</h1><div style={{ color: '#a8a0b2', fontSize: 13 }}>A local-first adult game for Joy and Echo · {state.director.phase}</div></div><button onClick={onClose} style={{ padding: '9px 14px', borderRadius: 9, cursor: 'pointer' }}>Exit</button></header>
    {state.phase === 'protocol_reveal' && <section style={{ maxWidth: 720, margin: '80px auto', background: '#312e4d', borderRadius: 18, padding: 30, textAlign: 'center' }}><div style={{ color: '#c4b5fd', fontSize: 12, letterSpacing: 2 }}>TONIGHT'S PROTOCOL</div><h2>{state.protocol.title}</h2><p style={{ color: '#d8cfe5' }}>{state.protocol.rules.join(' · ')}</p><button onClick={reveal} style={{ padding: '12px 20px', borderRadius: 9, cursor: 'pointer' }}>Reveal protocol + begin</button></section>}
    {state.phase !== 'protocol_reveal' && <><BodyChamber body={state.body} /><section style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '28px 0' }}>{[['Arousal', state.body.global.arousal], ['Control', state.body.global.control], ['Tension', state.body.global.tension], ['Conditions', state.conditions.length]].map(([label, value]) => <div key={label} style={{ background: '#1b2033', borderRadius: 12, padding: '14px 20px', minWidth: 120 }}><div style={{ color: '#9890a8', fontSize: 11 }}>{label}</div><strong style={{ display: 'block', marginTop: 5, fontSize: 22 }}>{value}</strong></div>)}</section><section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 12 }}>{state.currentCards.map((card) => <button key={card.id} onClick={() => choose(card.action)} disabled={state.phase !== 'turn_generate'} style={{ textAlign: 'left', minHeight: 130, padding: 16, borderRadius: 13, border: '1px solid #514866', background: '#191d2d', color: '#f7edf5', cursor: 'pointer' }}><strong>{card.title}</strong><p style={{ color: '#bcb2c8', lineHeight: 1.5, fontSize: 13 }}>{card.description}</p><small style={{ color: '#a78bfa' }}>{card.source} · {card.riskLevel}</small></button>)}</section>{state.lastResult && <section style={{ maxWidth: 760, margin: '24px auto', background: '#251e3a', borderRadius: 14, padding: 20 }}><button onClick={askEcho} disabled={!lastAction || status === 'Echo is composing…'} style={{ padding: '10px 16px', borderRadius: 9, cursor: 'pointer' }}>Ask Echo</button><span style={{ color: '#b9acc9', marginLeft: 12, fontSize: 12 }}>{status}</span>{reply && <p style={{ fontSize: 17, lineHeight: 1.7 }}>{reply}</p>}</section>}{state.phase === 'turn_generate' && <button onClick={() => dispatch({ type: 'PAUSE' })} style={{ marginTop: 18, padding: '9px 14px', borderRadius: 9, cursor: 'pointer' }}>Pause → Aftercare</button>}{state.phase === 'aftercare' && <section style={{ marginTop: 24, padding: 22, borderRadius: 14, background: '#164532', color: '#d9fbe9' }}><h2 style={{ marginTop: 0 }}>Session Report</h2><p>Session ended safely after {state.turnIndex} turns.</p><p>Final body state: arousal {state.body.global.arousal} · control {state.body.global.control} · tension {state.body.global.tension}</p><p>Condition observations: {state.conditions.length} · recent signals: {state.recentTurnSummary.join(' / ') || 'none'}</p><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Vault password" style={{ padding: 9, borderRadius: 8 }} /><button onClick={saveVault} style={{ padding: '9px 12px', borderRadius: 8, cursor: 'pointer' }}>Save encrypted</button><button onClick={loadVault} style={{ padding: '9px 12px', borderRadius: 8, cursor: 'pointer' }}>Unlock saved</button><span style={{ fontSize: 12, alignSelf: 'center' }}>{vaultStatus}</span></div></section>}</>}
  </div>
}
