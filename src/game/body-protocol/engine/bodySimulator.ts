import { BodyState, BodyStateDelta, NormalizedAction, SimulationResult, clamp, cloneBodyState } from '../models/bodyState'
import { SeededRng } from './rng'

const TECHNIQUE_AROUSAL: Record<NormalizedAction['technique'], number> = {
  touch: 0.18, stroke: 0.28, press: 0.24, pause: 0.02, withdraw: -0.08, command: 0.08,
}

function round(value: number): number { return Math.round(value * 100) / 100 }

export function createInitialBodyState(): BodyState {
  const zones = {
    lips: { id: 'lips', baseSensitivity: 54, currentSensitivity: 54, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 5, recentTouchCount: 0, totalTouchCount: 0 },
    ears: { id: 'ears', baseSensitivity: 48, currentSensitivity: 48, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 5, recentTouchCount: 0, totalTouchCount: 0 },
    neck: { id: 'neck', baseSensitivity: 57, currentSensitivity: 57, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 5, recentTouchCount: 0, totalTouchCount: 0 },
    shoulders: { id: 'shoulders', baseSensitivity: 34, currentSensitivity: 34, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 6, recentTouchCount: 0, totalTouchCount: 0 },
    chest: { id: 'chest', baseSensitivity: 42, currentSensitivity: 42, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 5, recentTouchCount: 0, totalTouchCount: 0 },
    abdomen: { id: 'abdomen', baseSensitivity: 39, currentSensitivity: 39, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 6, recentTouchCount: 0, totalTouchCount: 0 },
    lower_back: { id: 'lower_back', baseSensitivity: 37, currentSensitivity: 37, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 6, recentTouchCount: 0, totalTouchCount: 0 },
    buttocks: { id: 'buttocks', baseSensitivity: 46, currentSensitivity: 46, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 5, recentTouchCount: 0, totalTouchCount: 0 },
    inner_thighs: { id: 'inner_thighs', baseSensitivity: 58, currentSensitivity: 58, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 4, recentTouchCount: 0, totalTouchCount: 0 },
    perineum: { id: 'perineum', baseSensitivity: 64, currentSensitivity: 64, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 4, recentTouchCount: 0, totalTouchCount: 0 },
    penis: { id: 'penis', baseSensitivity: 72, currentSensitivity: 72, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 3, recentTouchCount: 0, totalTouchCount: 0 },
    hands: { id: 'hands', baseSensitivity: 31, currentSensitivity: 31, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 7, recentTouchCount: 0, totalTouchCount: 0 },
    feet: { id: 'feet', baseSensitivity: 29, currentSensitivity: 29, stimulationLoad: 0, zoneFatigue: 0, recoveryRate: 7, recentTouchCount: 0, totalTouchCount: 0 },
  } as const
  return { global: { arousal: 18, control: 86, globalFatigue: 0, cognitiveFatigue: 0, emotionalSaturation: 0, tension: 8, unmetWant: 0, irritation: 0, releaseDebt: 0, overstimulation: 0, edgeCount: 0, denialDurationSec: 0, turnsInSession: 0 }, zones: structuredClone(zones) }
}

export function resolveAction(before: BodyState, action: NormalizedAction, rng = new SeededRng('default')): SimulationResult {
  const state = cloneBodyState(before)
  const zoneLoad: BodyStateDelta['zoneLoad'] = {}
  let arousal = 0; let control = 0; let fatigue = 0; let tension = 0; let unmetWant = 0; let irritation = 0
  const repeatedPenalty = Math.max(0.45, 1 - Math.max(...action.targets.map((id) => state.zones[id].recentTouchCount), 0) * 0.08)
  const rhythmMultiplier = action.rhythm === 'stop_start' ? 1.18 : action.rhythm === 'accelerating' ? 1.12 : action.rhythm === 'slow' ? 0.86 : 1
  for (const zoneId of action.targets) {
    const zone = state.zones[zoneId]
    const effective = action.intensity / 100 * (0.7 + zone.currentSensitivity / 100) * (1 - zone.zoneFatigue / 220) * repeatedPenalty * rhythmMultiplier
    const load = Math.max(0, effective * 18)
    zoneLoad[zoneId] = round(load)
    zone.stimulationLoad = clamp(zone.stimulationLoad + load)
    zone.zoneFatigue = clamp(zone.zoneFatigue + load * 0.55)
    zone.recentTouchCount += action.technique === 'pause' || action.technique === 'withdraw' ? 0 : 1
    zone.totalTouchCount += action.technique === 'pause' || action.technique === 'withdraw' ? 0 : 1
    arousal += effective * (TECHNIQUE_AROUSAL[action.technique] * 100)
    fatigue += load * 0.08
  }
  if (action.technique === 'pause' || action.technique === 'withdraw') { tension += action.intensity * 0.12; unmetWant += action.intensity * 0.06 }
  if (action.technique === 'command') { tension += action.intensity * 0.08; control -= action.intensity * 0.025 }
  if (state.global.arousal >= 75 && action.technique === 'pause') control -= 5
  const noise = (rng.next() - 0.5) * 0.8
  arousal = arousal + noise
  control -= arousal * 0.32
  const nextArousal = clamp(state.global.arousal + arousal)
  const nextControl = clamp(state.global.control + control)
  const edge = nextArousal >= 88 && state.global.arousal < 88 ? 1 : 0
  const delta: BodyStateDelta = { arousal: round(arousal), control: round(control), globalFatigue: round(fatigue), tension: round(tension), unmetWant: round(unmetWant), irritation: round(irritation), edgeCount: edge, zoneLoad }
  state.global.arousal = nextArousal
  state.global.control = nextControl
  state.global.globalFatigue = clamp(state.global.globalFatigue + fatigue)
  state.global.tension = clamp(state.global.tension + tension)
  state.global.unmetWant = clamp(state.global.unmetWant + unmetWant)
  state.global.irritation = clamp(state.global.irritation + irritation)
  state.global.overstimulation = clamp(state.global.overstimulation + (fatigue > 4 ? fatigue * 0.4 : 0))
  state.global.edgeCount += edge
  state.global.turnsInSession += 1
  const events: string[] = []
  if (edge) events.push('near_edge')
  if (nextControl < 25) events.push('control_break')
  if (state.global.overstimulation >= 80) events.push('overstimulation_warning')
  return { stateBefore: before, delta, stateAfter: state, events, rngDraws: [...rng.draws] }
}
