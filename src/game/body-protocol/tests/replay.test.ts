import { describe, expect, it } from 'vitest'
import { createInitialBodyState } from '../engine/bodySimulator'
import { replaySession, ReplayLog } from '../engine/replay'
import { NormalizedAction } from '../models/bodyState'

describe('deterministic replay', () => {
  it('reproduces the same structured result for the same seed and action sequence', () => {
    const action: NormalizedAction = { id: 'pause', technique: 'pause', targets: ['penis'], intensity: 30, rhythm: 'stop_start', durationSec: 4 }
    const source: ReplayLog = { seed: 'golden-001', engineVersion: '0.1.0', rulesetVersion: '1', initialState: createInitialBodyState(), turns: [{ action, result: {} as never }, { action, result: {} as never }] }
    const one = replaySession(source)
    const two = replaySession(source)
    expect(two.turns.map((turn) => turn.result.stateAfter)).toEqual(one.turns.map((turn) => turn.result.stateAfter))
    expect(two.turns.map((turn) => turn.result.rngDraws)).toEqual(one.turns.map((turn) => turn.result.rngDraws))
  })
})
