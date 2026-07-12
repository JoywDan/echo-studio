import { describe, expect, it } from 'vitest'
import { bodyProtocolReducer, initialProtocolState } from '../store/bodyProtocolReducer'

describe('body protocol reducer', () => {
  it('keeps the main phase explicit', () => {
    let state = initialProtocolState()
    state = bodyProtocolReducer(state, { type: 'BEGIN_SESSION', sessionId: 'golden', seed: 'seed-1' })
    expect(state.phase).toBe('protocol_reveal')
    state = bodyProtocolReducer(state, { type: 'REVEAL_PROTOCOL' })
    expect(state.phase).toBe('turn_generate')
    state = bodyProtocolReducer(state, { type: 'ACTIONS_READY' })
    expect(state.phase).toBe('action_resolve')
    state = bodyProtocolReducer(state, { type: 'RESOLVE_ACTION', action: { id: 'pause', technique: 'pause', targets: ['chest'], intensity: 20, rhythm: 'still', durationSec: 3 } })
    expect(state.phase).toBe('turn_generate')
    expect(state.turnIndex).toBe(1)
  })

  it('enters aftercare immediately from any active phase', () => {
    let state = bodyProtocolReducer(initialProtocolState(), { type: 'BEGIN_SESSION', sessionId: 'safety', seed: 'seed' })
    state = bodyProtocolReducer(state, { type: 'PAUSE' })
    expect(state.phase).toBe('aftercare')
  })
})
