import { BODY_PROTOCOL_SCHEMA_VERSION, BodyState } from '../models/bodyState'
import { ActionCard } from '../models/actionCard'
import { ConditionedResponse } from '../models/conditioning'
import { EchoAgencyState } from '../models/agency'
import { Protocol, SessionDirectorState } from '../models/protocol'
import { LearnedAction } from '../models/learnedAction'
import { JoyPlaybook } from '../models/playbook'
import { NarrativePromise } from '../models/narrativePromise'
import { MemoryCandidate } from '../models/memoryCandidate'

export interface BodyProtocolSnapshot {
  seed: string
  turnIndex: number
  protocol: Protocol
  director: SessionDirectorState
  conditions: ConditionedResponse[]
  currentCards: ActionCard[]
  triggeredConditionIds: string[]
  agency: EchoAgencyState
  recentTurnSummary: string[]
  phase: 'idle' | 'protocol_reveal' | 'turn_generate' | 'action_resolve' | 'aftercare'
  learnedActions?: LearnedAction[]
  playbook?: JoyPlaybook
  modelCalls?: number
  estimatedTokens?: number
  narrativePromise?: NarrativePromise
  memoryCandidates?: MemoryCandidate[]
}

export interface BodyProtocolSave { schemaVersion: number; sessionId: string; savedAt: string; bodyState: BodyState; snapshot: BodyProtocolSnapshot; engineVersion: string; rulesetVersion: string }

export function makeSave(sessionId: string, bodyState: BodyState, snapshot?: BodyProtocolSnapshot, engineVersion = '0.1.0', rulesetVersion = '2'): BodyProtocolSave {
  const fallbackSnapshot: BodyProtocolSnapshot = { seed: '', turnIndex: bodyState.global.turnsInSession, protocol: { id: 'legacy', title: 'Legacy session', theme: 'edge_control', rules: [], modifiers: { controlDecayMultiplier: 1, anticipatoryResponseGain: 1 } }, director: { phase: 'aftercare', tensionBudget: 0, targetSessionLength: 0, phaseStartedAtTurn: 0, transitionReasons: ['legacy body-only save'] }, conditions: [], currentCards: [], triggeredConditionIds: [], agency: { willingness: 0, defiance: 0, vulnerability: 0, anticipation: 0, currentWant: '', resistanceTokens: 0 }, recentTurnSummary: [], phase: 'aftercare', learnedActions: [] }
  return { schemaVersion: BODY_PROTOCOL_SCHEMA_VERSION, sessionId, savedAt: new Date().toISOString(), bodyState: structuredClone(bodyState), snapshot: structuredClone(snapshot || fallbackSnapshot), engineVersion, rulesetVersion }
}

export function validateSave(input: unknown): input is BodyProtocolSave {
  const value = input as BodyProtocolSave
  return !!value && value.schemaVersion === BODY_PROTOCOL_SCHEMA_VERSION && typeof value.sessionId === 'string' && !!value.bodyState?.global && !!value.bodyState?.zones && !!value.snapshot?.protocol && !!value.snapshot?.director
}
