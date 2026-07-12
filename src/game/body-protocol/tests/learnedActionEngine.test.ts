import { describe, expect, it } from 'vitest'
import { learnedActionActivity, rankLearnedActions } from '../engine/learnedActionEngine'
import { createInitialBodyState } from '../engine/bodySimulator'
import { initialDirector } from '../engine/sessionDirector'
import { LearnedAction } from '../models/learnedAction'

const learned: LearnedAction = { id: 'x', label: 'slow chest', action: { id: 'x', technique: 'touch', targets: ['chest'], intensity: 30, rhythm: 'slow', durationSec: 8 }, observations: 3, confirmedUses: 3, status: 'learned', createdAt: '2026-01-01T00:00:00.000Z', lastUsedAt: '2026-07-11T00:00:00.000Z' }

describe('learned action activity', () => {
  it('decays with age and ranks active preferences', () => {
    const body = createInitialBodyState()
    const director = initialDirector()
    const now = Date.parse('2026-07-11T00:00:00.000Z')
    expect(learnedActionActivity(learned, body, director, now)).toBeGreaterThan(0.25)
    expect(learnedActionActivity(learned, body, director, now + 20 * 86_400_000)).toBeLessThan(learnedActionActivity(learned, body, director, now))
    expect(rankLearnedActions([learned], body, director, now)).toHaveLength(1)
  })
})
