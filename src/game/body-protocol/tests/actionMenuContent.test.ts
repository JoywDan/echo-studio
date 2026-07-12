import { describe, expect, it } from 'vitest'
import { actionMenu, contentCardToAction } from '../content/actionMenuAdapter'

describe('V3 action menu content', () => {
  it('loads twelve categories and 180 unique cards', () => {
    const cards = actionMenu.categories.flatMap((category) => category.cards)
    expect(actionMenu.categories).toHaveLength(12)
    expect(cards).toHaveLength(180)
    expect(new Set(cards.map((card) => card.id)).size).toBe(180)
    expect(cards.every((card) => card.title && card.teaser && card.description && card.mechanicId)).toBe(true)
  })

  it('normalizes every content card into a simulator action', () => {
    const actions = actionMenu.categories.flatMap((category) => category.cards.map(contentCardToAction))
    expect(actions.every((action) => action.targets.length > 0 && action.intensity >= 10 && action.durationSec >= 3)).toBe(true)
  })
})
