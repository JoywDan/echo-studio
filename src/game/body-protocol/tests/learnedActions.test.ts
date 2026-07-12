import { describe, expect, it } from 'vitest'
import { bodyProtocolReducer, initialProtocolState } from '../store/bodyProtocolReducer'

describe('learned actions', () => {
  it('promotes a confirmed wildcard after three uses', () => {
    let state = bodyProtocolReducer(initialProtocolState(), { type: 'BEGIN_SESSION', sessionId: 'test', seed: 'seed' })
    state = bodyProtocolReducer(state, { type: 'REVEAL_PROTOCOL' })
    for (let i = 0; i < 3; i += 1) {
      state = bodyProtocolReducer(state, { type: 'SUBMIT_WILDCARD', input: 'slow touch on chest' })
      state = bodyProtocolReducer(state, { type: 'CONFIRM_WILDCARD' })
    }
    expect(state.learnedActions[0].confirmedUses).toBe(3)
    expect(state.learnedActions[0].status).toBe('learned')
    expect(state.currentCards.some((card) => card.source === 'learned')).toBe(true)
  })
})
