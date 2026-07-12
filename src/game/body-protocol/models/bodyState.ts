export type BodyZoneId = 'lips' | 'ears' | 'neck' | 'shoulders' | 'chest' | 'abdomen' | 'lower_back' | 'buttocks' | 'inner_thighs' | 'perineum' | 'penis' | 'hands' | 'feet'
export type RhythmType = 'still' | 'slow' | 'steady' | 'stop_start' | 'accelerating'
export type ActionTechnique = 'touch' | 'stroke' | 'press' | 'pause' | 'withdraw' | 'command'

export interface BodyZoneState {
  id: BodyZoneId
  baseSensitivity: number
  currentSensitivity: number
  stimulationLoad: number
  zoneFatigue: number
  recoveryRate: number
  recentTouchCount: number
  totalTouchCount: number
}

export interface GlobalBodyState {
  arousal: number
  control: number
  globalFatigue: number
  cognitiveFatigue: number
  emotionalSaturation: number
  tension: number
  unmetWant: number
  irritation: number
  releaseDebt: number
  overstimulation: number
  edgeCount: number
  denialDurationSec: number
  turnsInSession: number
}

export interface BodyState {
  global: GlobalBodyState
  zones: Record<BodyZoneId, BodyZoneState>
}

export interface NormalizedAction {
  id: string
  technique: ActionTechnique
  targets: BodyZoneId[]
  intensity: number
  rhythm: RhythmType
  durationSec: number
  permissionRequired?: boolean
}

export interface BodyStateDelta {
  arousal: number
  control: number
  globalFatigue: number
  tension: number
  unmetWant: number
  irritation: number
  edgeCount: number
  zoneLoad: Partial<Record<BodyZoneId, number>>
}

export interface SimulationResult {
  stateBefore: BodyState
  delta: BodyStateDelta
  stateAfter: BodyState
  events: string[]
  rngDraws: number[]
}

export const BODY_PROTOCOL_SCHEMA_VERSION = 2

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))
}

export function cloneBodyState(state: BodyState): BodyState {
  return structuredClone(state)
}
