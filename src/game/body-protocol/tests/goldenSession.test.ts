import { describe, expect, it } from 'vitest'
import { goldenObservationLog, runGoldenSession, verifyGoldenReplay } from '../engine/goldenSession'

describe('Golden Session', () => {
  it('runs the agreed 30-turn scenario and emits observations', () => {
    const log = runGoldenSession(30)
    expect(log.turns).toHaveLength(30)
    expect(goldenObservationLog(log)[0]).toContain('30 turns')
    expect(goldenObservationLog(log).at(-1)).toContain('FINAL:')
  })

  it('replays the same 30-turn results', () => {
    expect(verifyGoldenReplay(runGoldenSession(30))).toBe(true)
  })
})
