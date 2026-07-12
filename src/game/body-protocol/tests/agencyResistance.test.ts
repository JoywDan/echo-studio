import { describe, expect, it } from 'vitest'
import { decideAgency, initialAgency } from '../models/agency'
import { createInitialBodyState } from '../engine/bodySimulator'

describe('agency resistance token', () => {
  it('can reduce one high-intensity action and consumes exactly one token', () => {
    const agency = { ...initialAgency(), defiance: 50 }
    const action = { id: 'high', technique: 'stroke' as const, targets: ['penis' as const], intensity: 70, rhythm: 'steady' as const, durationSec: 8 }
    const first = decideAgency(agency, action, createInitialBodyState())
    expect(first.event).toBe('agency_resistance_used')
    expect(first.agency.resistanceTokens).toBe(0)
    expect(first.action.intensity).toBeLessThan(action.intensity)
    const second = decideAgency(first.agency, action, createInitialBodyState())
    expect(second.event).toBeUndefined()
    expect(second.action.intensity).toBe(action.intensity)
  })
})
