import { describe, expect, it } from 'vitest'
import { generateActionCards } from '../engine/actionCardGenerator'
import { updateConditioning } from '../engine/conditioningEngine'
import { advanceDirector, initialDirector } from '../engine/sessionDirector'
import { createInitialBodyState } from '../engine/bodySimulator'
import { GOLDEN_PROTOCOL } from '../models/protocol'

describe('Director, conditioning and cards', () => {
  it('moves from invitation to buildup and pressure', () => {
    const body = createInitialBodyState()
    const invitation = initialDirector()
    expect(advanceDirector(invitation, body, 3, GOLDEN_PROTOCOL).phase).toBe('buildup')
    expect(advanceDirector(invitation, body, 8, GOLDEN_PROTOCOL).phase).toBe('pressure')
  })

  it('forms a suspected condition after a near-edge observation', () => {
    const result = updateConditioning([], { action: { id: 'pause', technique: 'pause', targets: ['penis'], intensity: 30, rhythm: 'still', durationSec: 4 }, beforeArousal: 80, afterArousal: 81, events: ['near_edge'], zone: 'penis' })
    expect(result.conditions[0].status).toBe('suspected')
    expect(result.triggeredIds).toEqual(['cond_1'])
  })

  it('generates eight distinct cards and preserves a pause option', () => {
    const cards = generateActionCards(createInitialBodyState(), initialDirector(), GOLDEN_PROTOCOL)
    expect(cards).toHaveLength(8)
    expect(new Set(cards.map((item) => item.action.id)).size).toBe(8)
    expect(cards.some((item) => item.tags.includes('pause'))).toBe(true)
  })
})
