import { describe, expect, it } from 'vitest'
import { createInitialBodyState } from '../engine/bodySimulator'
import { bodyProtocolReducer, initialProtocolState } from '../store/bodyProtocolReducer'

describe('V3.1 acceptance', () => {
  it('initializes all thirteen body zones', () => { expect(Object.keys(createInitialBodyState().zones)).toHaveLength(13) })

  it('applies Playbook ceilings to generated cards', () => {
    let state = bodyProtocolReducer(initialProtocolState(), { type: 'BEGIN_SESSION', sessionId: 'p', seed: 'p' })
    state = bodyProtocolReducer(state, { type: 'UPDATE_PLAYBOOK', playbook: { ...state.playbook, intensityCeiling: 25 } })
    state = bodyProtocolReducer(state, { type: 'REVEAL_PROTOCOL' })
    expect(Math.max(...state.currentCards.map((card) => card.action.intensity))).toBeLessThanOrEqual(25)
  })

  it('runs a deterministic thirty-turn local session without model calls', () => {
    let state = bodyProtocolReducer(initialProtocolState(), { type: 'BEGIN_SESSION', sessionId: 'long', seed: 'long-session' })
    state = bodyProtocolReducer(state, { type: 'REVEAL_PROTOCOL' })
    for (let turn = 0; turn < 30 && state.phase !== 'aftercare'; turn += 1) {
      const action = state.currentCards[0].action
      state = bodyProtocolReducer(state, { type: 'ACTIONS_READY' })
      state = bodyProtocolReducer(state, { type: 'RESOLVE_ACTION', action })
    }
    expect(state.turnIndex).toBeGreaterThanOrEqual(20)
    expect(state.modelCalls).toBe(0)
    expect(state.estimatedTokens).toBe(0)
    expect(Object.values(state.body.zones).every((zone) => zone.zoneFatigue >= 0 && zone.zoneFatigue <= 100)).toBe(true)
  })
})
