import { describe, expect, it } from 'vitest'
import { bodyProtocolReducer, initialProtocolState } from '../store/bodyProtocolReducer'
describe('agency projection and compact context', () => {
  it('keeps only the latest three turn summaries', () => {
    let state = bodyProtocolReducer(initialProtocolState(), { type: 'BEGIN_SESSION', sessionId: 'ctx', seed: 'ctx-seed' })
    state = bodyProtocolReducer(state, { type: 'REVEAL_PROTOCOL' })
    for (let i = 0; i < 5; i++) { state = bodyProtocolReducer(state, { type: 'ACTIONS_READY' }); state = bodyProtocolReducer(state, { type: 'RESOLVE_ACTION', action: { id: `ctx-${i}`, technique: 'pause', targets: ['chest'], intensity: 20, rhythm: 'still', durationSec: 3 } }) }
    expect(state.recentTurnSummary).toHaveLength(3)
    expect(state.agency.currentWant).toBeTypeOf('string')
  })
})
