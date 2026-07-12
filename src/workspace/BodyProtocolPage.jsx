import React from 'react'
import { api } from './api.js'
import { bodyProtocolReducer, initialProtocolState } from '../game/body-protocol/store/bodyProtocolReducer'
import { validateEchoResponse } from '../game/body-protocol/generation/responseGuard'
import { makeSave } from '../game/body-protocol/store/persistence'
import { encryptVault, decryptVault } from '../game/body-protocol/store/privateVault'
import { readEncryptedVault, writeEncryptedVault } from '../game/body-protocol/store/vaultStorage'
import ActionMenuLibrary from './ActionMenuLibrary.jsx'
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
  const choose = (action) => { if (state.phase !== 'turn_generate') return; setLastAction(action); setReply(''); setStatus(''); dispatch({ type: 'ACTIONS_READY' }); dispatch({ type: 'RESOLVE_ACTION', action }) }
  const askEcho = async () => {
    if (!lastAction || !state.lastResult) return
    setStatus('Echo is composing…')
    try {
      const result = await api.bodyProtocol.respond({ protocol: state.protocol, director: state.director, action: lastAction, simulation_result: state.lastResult, agency_projection: state.agency, triggered_conditions: state.triggeredConditionIds, recent_turn_summary: state.recentTurnSummary })
      const guarded = validateEchoResponse(result)
      setReply(guarded.speech)
      if (result.usage) dispatch({ type: 'MODEL_USAGE', inputChars: result.usage.input_chars || 0, outputChars: result.usage.output_chars || 0 })
      setStatus(`Claude · ${guarded.model || 'response received'}`)
    } catch (error) { setStatus(error.message || 'Echo response failed') }
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
  const confirmWildcard = () => { if (state.wildcardDraft?.accepted) { setLastAction(state.wildcardDraft.action); setReply(''); setStatus(''); dispatch({ type: 'CONFIRM_WILDCARD' }) } }

  return <div className="body-protocol-page" style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'linear-gradient(145deg,#0e1220,#241629)', color: '#f7edf5', overflow: 'auto', padding: '24px clamp(14px,4vw,64px)' }}>
    <header style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'center', maxWidth: 1100, margin: '0 auto' }}><div><div style={{ color: '#c4b5fd', letterSpacing: 3, fontSize: 11 }}>PRIVATE BODY CHAMBER</div><h1 style={{ margin: '8px 0', fontSize: 'clamp(26px,6vw,42px)' }}>BODY PROTOCOL</h1><div style={{ color: '#a8a0b2', fontSize: 13 }}>Joy × Echo · {state.director.phase} · promise {state.narrativePromise.status}</div></div><button onClick={onClose} style={{ padding: '9px 14px', borderRadius: 9, cursor: 'pointer' }}>Exit</button></header>
    {state.phase === 'protocol_reveal' && <section style={{ maxWidth: 720, margin: '54px auto', background: '#312e4d', borderRadius: 18, padding: 30, textAlign: 'center' }}><div style={{ color: '#c4b5fd', fontSize: 12, letterSpacing: 2 }}>TONIGHT'S PROTOCOL</div><h2>{state.protocol.title}</h2><p style={{ color: '#d8cfe5' }}>{state.protocol.rules.join(' · ')}</p><button onClick={() => dispatch({ type: 'REVEAL_PROTOCOL' })} style={{ padding: '12px 20px', borderRadius: 9, cursor: 'pointer' }}>Reveal protocol + begin</button></section>}
    {state.phase !== 'protocol_reveal' && <>
      <ActionMenuLibrary disabled={state.phase !== 'turn_generate'} onChoose={choose} />
      {state.lastResult && <section style={{ maxWidth: 850, margin: '20px auto', background: '#3a2039', borderRadius: 14, padding: 20 }}><button onClick={askEcho} disabled={!lastAction || status === 'Echo is composing…'} style={{ padding: '10px 16px', borderRadius: 9, cursor: 'pointer' }}>让 Echo 回应</button><span style={{ color: '#d8bfd7', marginLeft: 12, fontSize: 12 }}>{status}</span>{state.agency.lastDecision?.type === 'resist' && <p style={{ color: '#f9a8d4' }}>Echo 使用了一次 resistance token，并把强度调整为 {state.agency.lastDecision.effectiveIntensity}。</p>}{reply && <p style={{ fontSize: 17, lineHeight: 1.75 }}>{reply}</p>}</section>}
      <details style={{ maxWidth: 1100, margin: '16px auto', padding: 14, borderRadius: 12, background: '#171a29' }}><summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>身体状态与系统推荐路线</summary><BodyChamber body={state.body} /><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '16px 0' }}>{[['Arousal', state.body.global.arousal], ['Control', state.body.global.control], ['Tension', state.body.global.tension], ['Conditions', state.conditions.length]].map(([label, value]) => <div key={label} style={{ background: '#252a3e', borderRadius: 10, padding: '10px 14px' }}><small>{label}</small><strong style={{ display: 'block', fontSize: 20 }}>{value}</strong></div>)}</div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 9 }}>{state.currentCards.map((card) => <button key={card.id} onClick={() => choose(card.action)} disabled={state.phase !== 'turn_generate'} style={{ padding: 12, textAlign: 'left', borderRadius: 10, border: '1px solid #514866', background: '#191d2d', color: '#fff' }}><strong>{card.title}</strong><p style={{ fontSize: 12, color: '#bcb2c8' }}>{card.description}</p></button>)}</div></details>
      <details style={{ maxWidth: 1100, margin: '16px auto', padding: 14, borderRadius: 12, background: '#171a29' }}><summary style={{ cursor: 'pointer', color: '#c4b5fd' }}>自定义动作与私人设置</summary><WildcardPanel input={wildcardInput} setInput={setWildcardInput} draft={state.wildcardDraft} onParse={() => dispatch({ type: 'SUBMIT_WILDCARD', input: wildcardInput })} onConfirm={confirmWildcard} canConfirm={state.phase === 'turn_generate'} /><JoyPlaybook playbook={state.playbook} onChange={(playbook) => dispatch({ type: 'UPDATE_PLAYBOOK', playbook })} /></details>
      <div style={{ maxWidth: 1100, margin: '14px auto', color: '#a8a0b2', fontSize: 12 }}>Local turns {state.turnIndex} · Claude calls {state.modelCalls} · estimated tokens {state.estimatedTokens} · resistance tokens {state.agency.resistanceTokens}</div>
      {state.phase === 'turn_generate' && <button onClick={() => dispatch({ type: 'PAUSE' })} style={{ display: 'block', margin: '18px auto', padding: '9px 14px', borderRadius: 9 }}>Pause → Aftercare</button>}
      <MemoryCandidatePanel phase={state.phase} promise={state.narrativePromise} candidates={state.memoryCandidates} onApprove={(id) => dispatch({ type: 'APPROVE_MEMORY_CANDIDATE', id })} />
      {state.phase === 'aftercare' && <section style={{ maxWidth: 900, margin: '20px auto', padding: 20, borderRadius: 14, background: '#164532', color: '#d9fbe9' }}><h2>Session Report</h2><p>{state.turnIndex} turns · arousal {state.body.global.arousal} · control {state.body.global.control} · {state.conditions.length} conditions</p><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Vault password" style={{ padding: 9, borderRadius: 8 }} /><button onClick={saveVault}>Save encrypted</button><button onClick={loadVault}>Unlock saved</button><span>{vaultStatus}</span></div></section>}
    </>}
  </div>
}
