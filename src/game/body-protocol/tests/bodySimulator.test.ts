import { describe, expect, it } from 'vitest'
import { createInitialBodyState, resolveAction } from '../engine/bodySimulator'
import { SeededRng } from '../engine/rng'
import { NormalizedAction } from '../models/bodyState'

const action: NormalizedAction = { id: 'touch-penis-slow', technique: 'stroke', targets: ['penis'], intensity: 40, rhythm: 'slow', durationSec: 8 }

describe('Body Simulator', () => {
  it('clamps all core values and produces state deltas', () => {
    const result = resolveAction(createInitialBodyState(), action, new SeededRng('test'))
    expect(result.stateAfter.global.arousal).toBeGreaterThanOrEqual(0)
    expect(result.stateAfter.global.arousal).toBeLessThanOrEqual(100)
    expect(result.stateAfter.zones.penis.stimulationLoad).toBeGreaterThan(0)
    expect(result.delta.zoneLoad.penis).toBeGreaterThan(0)
  })

  it('makes repeated actions less effective through local fatigue and repetition penalty', () => {
    const first = resolveAction(createInitialBodyState(), action, new SeededRng('same'))
    const second = resolveAction(first.stateAfter, action, new SeededRng('same'))
    expect(second.delta.arousal).toBeLessThan(first.delta.arousal)
    expect(second.stateAfter.zones.penis.zoneFatigue).toBeGreaterThan(first.stateAfter.zones.penis.zoneFatigue)
  })

  it('raises tension on a pause near an elevated state', () => {
    const state = createInitialBodyState()
    state.global.arousal = 87
    const result = resolveAction(state, { id: 'pause', technique: 'pause', targets: ['penis'], intensity: 35, rhythm: 'still', durationSec: 6 }, new SeededRng('pause'))
    expect(result.delta.tension).toBeGreaterThan(0)
    expect(result.events).toContain('near_edge')
  })

  it('never lets state values escape the 0-100 range under repeated actions', () => {
    let state = createInitialBodyState()
    for (let i = 0; i < 100; i++) state = resolveAction(state, { ...action, intensity: 100 }, new SeededRng(`clamp-${i}`)).stateAfter
    expect(state.global.arousal).toBeLessThanOrEqual(100)
    expect(state.global.control).toBeGreaterThanOrEqual(0)
    expect(state.global.globalFatigue).toBeLessThanOrEqual(100)
    expect(state.zones.penis.stimulationLoad).toBeLessThanOrEqual(100)
    expect(state.zones.penis.zoneFatigue).toBeLessThanOrEqual(100)
  })
})
