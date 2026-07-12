import { BodyState, NormalizedAction, SimulationResult } from '../models/bodyState'
import { createInitialBodyState, resolveAction } from '../engine/bodySimulator'
import { SeededRng } from '../engine/rng'
import { advanceDirector, initialDirector } from '../engine/sessionDirector'
import { updateConditioning } from '../engine/conditioningEngine'
import { generateActionCards } from '../engine/actionCardGenerator'
import { ActionCard } from '../models/actionCard'
import { ConditionedResponse } from '../models/conditioning'
import { GOLDEN_PROTOCOL, Protocol, SessionDirectorState } from '../models/protocol'
import { protocolForSeed } from '../models/protocolCatalog'
import { EchoAgencyState, decideAgency, initialAgency, updateAgency } from '../models/agency'
import { BodyProtocolSave } from './persistence'
import { LearnedAction } from '../models/learnedAction'
import { parseWildcard, WildcardParseResult } from '../engine/wildcardParser'
import { DEFAULT_PLAYBOOK, JoyPlaybook } from '../models/playbook'

export type BodyProtocolPhase = 'idle' | 'protocol_reveal' | 'turn_generate' | 'action_resolve' | 'aftercare'
export interface BodyProtocolState { phase: BodyProtocolPhase; sessionId: string | null; body: BodyState; seed: string; lastResult: SimulationResult | null; turnIndex: number; protocol: Protocol; director: SessionDirectorState; conditions: ConditionedResponse[]; currentCards: ActionCard[]; triggeredConditionIds: string[]; agency: EchoAgencyState; recentTurnSummary: string[]; learnedActions: LearnedAction[]; wildcardDraft: WildcardParseResult | null; playbook: JoyPlaybook; modelCalls: number; estimatedTokens: number }
export type BodyProtocolEvent = { type: 'BEGIN_SESSION'; sessionId: string; seed: string } | { type: 'REVEAL_PROTOCOL' } | { type: 'ACTIONS_READY' } | { type: 'RESOLVE_ACTION'; action: NormalizedAction; learnedActionId?: string } | { type: 'SUBMIT_WILDCARD'; input: string } | { type: 'CONFIRM_WILDCARD' } | { type: 'UPDATE_PLAYBOOK'; playbook: JoyPlaybook } | { type: 'MODEL_USAGE'; inputChars: number; outputChars: number } | { type: 'RESTORE_SESSION'; save: BodyProtocolSave } | { type: 'PAUSE' | 'END_SESSION' }

export function initialProtocolState(): BodyProtocolState { return { phase: 'idle', sessionId: null, body: createInitialBodyState(), seed: '', lastResult: null, turnIndex: 0, protocol: GOLDEN_PROTOCOL, director: initialDirector(), conditions: [], currentCards: [], triggeredConditionIds: [], agency: initialAgency(), recentTurnSummary: [], learnedActions: [], wildcardDraft: null, playbook: structuredClone(DEFAULT_PLAYBOOK), modelCalls: 0, estimatedTokens: 0 } }

export function bodyProtocolReducer(state: BodyProtocolState, event: BodyProtocolEvent): BodyProtocolState {
  if (event.type === 'RESTORE_SESSION') {
    const snapshot = event.save.snapshot
    const initialBody = createInitialBodyState(); const restoredBody = structuredClone(event.save.bodyState); restoredBody.zones = { ...initialBody.zones, ...restoredBody.zones }
    return { ...state, phase: snapshot.phase, sessionId: event.save.sessionId, body: restoredBody, seed: snapshot.seed, lastResult: null, turnIndex: snapshot.turnIndex, protocol: structuredClone(snapshot.protocol), director: structuredClone(snapshot.director), conditions: structuredClone(snapshot.conditions), currentCards: structuredClone(snapshot.currentCards), triggeredConditionIds: [...snapshot.triggeredConditionIds], agency: structuredClone(snapshot.agency), recentTurnSummary: [...snapshot.recentTurnSummary], learnedActions: structuredClone(snapshot.learnedActions || []), playbook: structuredClone(snapshot.playbook || DEFAULT_PLAYBOOK), modelCalls: snapshot.modelCalls || 0, estimatedTokens: snapshot.estimatedTokens || 0, wildcardDraft: null }
  }
  if (event.type === 'BEGIN_SESSION') {
    const body = createInitialBodyState()
    const director = initialDirector()
    return { ...state, phase: 'protocol_reveal', sessionId: event.sessionId, seed: event.seed, body, lastResult: null, turnIndex: 0, protocol: protocolForSeed(event.seed), director, conditions: [], triggeredConditionIds: [], currentCards: [], agency: initialAgency(), recentTurnSummary: [], learnedActions: [], wildcardDraft: null }
  }
  if (event.type === 'REVEAL_PROTOCOL' && state.phase === 'protocol_reveal') return { ...state, phase: 'turn_generate', currentCards: generateActionCards(state.body, state.director, state.protocol, [], state.learnedActions, state.playbook) }
  if (event.type === 'ACTIONS_READY' && state.phase === 'turn_generate') return { ...state, phase: 'action_resolve' }
  if (event.type === 'UPDATE_PLAYBOOK') return { ...state, playbook: structuredClone(event.playbook), currentCards: state.phase === 'turn_generate' ? generateActionCards(state.body, state.director, state.protocol, state.conditions, state.learnedActions, event.playbook) : state.currentCards }
  if (event.type === 'MODEL_USAGE') return { ...state, modelCalls: state.modelCalls + 1, estimatedTokens: state.estimatedTokens + Math.ceil((event.inputChars + event.outputChars) / 4) }
  if (event.type === 'SUBMIT_WILDCARD') return { ...state, wildcardDraft: parseWildcard(event.input) }
  if (event.type === 'CONFIRM_WILDCARD' && state.phase === 'turn_generate' && state.wildcardDraft?.accepted && state.wildcardDraft.action) {
    const id = state.wildcardDraft.action.id
    const existing = state.learnedActions.find((item) => item.id === id)
    const candidate = existing || { id, label: state.wildcardDraft.label, action: state.wildcardDraft.action, observations: 0, confirmedUses: 0, status: 'candidate' as const, createdAt: new Date().toISOString(), lastUsedAt: new Date().toISOString() }
    return bodyProtocolReducer({ ...state, phase: 'action_resolve', wildcardDraft: null, learnedActions: existing ? state.learnedActions : [...state.learnedActions, candidate] }, { type: 'RESOLVE_ACTION', action: state.wildcardDraft.action, learnedActionId: id })
  }
  if (event.type === 'RESOLVE_ACTION' && state.phase === 'action_resolve') {
    const agencyDecision = decideAgency(state.agency, event.action, state.body)
    const result = resolveAction(state.body, agencyDecision.action, new SeededRng(`${state.seed}:${state.turnIndex}`))
    if (agencyDecision.event) result.events.push(agencyDecision.event)
    const conditionUpdate = updateConditioning(state.conditions, { action: agencyDecision.action, beforeArousal: state.body.global.arousal, afterArousal: result.stateAfter.global.arousal, events: result.events, zone: agencyDecision.action.targets[0] })
    const nextTurn = state.turnIndex + 1
    const director = advanceDirector(state.director, result.stateAfter, nextTurn, state.protocol)
    const agency = updateAgency(agencyDecision.agency, result.stateAfter, conditionUpdate.triggeredIds.length)
    const summary = `turn ${nextTurn}: ${event.action.technique}/${event.action.rhythm} → arousal ${result.stateAfter.global.arousal}, control ${result.stateAfter.global.control}; events ${result.events.join(',') || 'none'}`
    const phase = director.phase === 'aftercare' ? 'aftercare' : 'turn_generate'
    const learnedActions = event.learnedActionId ? state.learnedActions.map((item) => item.id === event.learnedActionId ? { ...item, observations: item.observations + 1, confirmedUses: item.confirmedUses + 1, status: item.confirmedUses + 1 >= 3 ? 'learned' as const : item.status, lastUsedAt: new Date().toISOString() } : item) : state.learnedActions
    return { ...state, phase, body: result.stateAfter, lastResult: result, turnIndex: nextTurn, director, conditions: conditionUpdate.conditions, triggeredConditionIds: conditionUpdate.triggeredIds, currentCards: generateActionCards(result.stateAfter, director, state.protocol, conditionUpdate.conditions, learnedActions, state.playbook), agency, recentTurnSummary: [...state.recentTurnSummary, summary].slice(-3), learnedActions, wildcardDraft: null }
  }
  if (event.type === 'PAUSE' || event.type === 'END_SESSION') return { ...state, phase: 'aftercare' }
  return state
}
