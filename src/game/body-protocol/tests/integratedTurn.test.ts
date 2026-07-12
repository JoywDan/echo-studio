import { describe, expect, it } from 'vitest'
import { bodyProtocolReducer, initialProtocolState } from '../store/bodyProtocolReducer'

describe('integrated turn pipeline', () => {
  it('updates body, conditioning, director and next cards in one resolve', () => {
    let state = bodyProtocolReducer(initialProtocolState(), { type: 'BEGIN_SESSION', sessionId: 'integrated', seed: 'integrated-seed' })
    state = bodyProtocolReducer(state, { type: 'REVEAL_PROTOCOL' })
    expect(state.currentCards).toHaveLength(8)
    state = bodyProtocolReducer(state, { type: 'ACTIONS_READY' })
    state = bodyProtocolReducer(state, { type: 'RESOLVE_ACTION', action: { id: 'integrated-pause', technique: 'pause', targets: ['penis'], intensity: 35, rhythm: 'still', durationSec: 5 } })
    expect(state.turnIndex).toBe(1)
    expect(state.lastResult).not.toBeNull()
    expect(state.director.phase).toBe('invitation')
    expect(state.currentCards).toHaveLength(8)
    expect(state.protocol.id).toBe('protocol_edge_three')
  })

  it('does not generate ordinary cards after safety enters aftercare', () => {
    let state = bodyProtocolReducer(initialProtocolState(), { type: 'BEGIN_SESSION', sessionId: 'aftercare', seed: 'aftercare-seed' })
    state = bodyProtocolReducer(state, { type: 'REVEAL_PROTOCOL' })
    state = { ...state, body: { ...state.body, global: { ...state.body.global, irritation: 60 } } }
    state = bodyProtocolReducer(state, { type: 'ACTIONS_READY' })
    state = bodyProtocolReducer(state, { type: 'RESOLVE_ACTION', action: { id: 'safe-pause', technique: 'pause', targets: ['chest'], intensity: 10, rhythm: 'still', durationSec: 2 } })
    expect(state.phase).toBe('aftercare')
    expect(state.currentCards.every((card) => card.tags.includes('pause') || card.tags.includes('withdraw'))).toBe(true)
  })
})
