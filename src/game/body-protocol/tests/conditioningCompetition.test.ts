import { describe, expect, it } from 'vitest'
import { updateConditioning } from '../engine/conditioningEngine'

const action = (id: string, rhythm: 'still' | 'slow') => ({ id, technique: 'pause' as const, targets: ['chest' as const], intensity: 30, rhythm, durationSec: 4 })

describe('conditioning competition and decay', () => {
  it('links same-route contexts as competitors', () => {
    const first = updateConditioning([], { action: action('a', 'still'), beforeArousal: 80, afterArousal: 81, events: ['near_edge'], zone: 'chest' })
    const second = updateConditioning(first.conditions, { action: { ...action('b', 'still'), targets: ['penis'] }, beforeArousal: 80, afterArousal: 81, events: ['near_edge'], zone: 'penis' })
    expect(second.conditions[0].competingResponseIds).toContain(second.conditions[1].id)
    expect(second.conditions[1].competingResponseIds).toContain(second.conditions[0].id)
  })

  it('resets extinction progress when a condition is reinforced', () => {
    const first = updateConditioning([], { action: action('a', 'still'), beforeArousal: 80, afterArousal: 81, events: ['near_edge'], zone: 'chest' })
    const stale = { ...first.conditions[0], extinctionProgress: 0.7 }
    const reinforced = updateConditioning([stale], { action: action('a', 'still'), beforeArousal: 80, afterArousal: 81, events: ['near_edge'], zone: 'chest' })
    expect(reinforced.conditions[0].extinctionProgress).toBe(0)
  })
})
