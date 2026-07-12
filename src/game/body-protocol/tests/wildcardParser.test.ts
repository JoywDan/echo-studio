import { describe, expect, it } from 'vitest'
import { parseWildcard } from '../engine/wildcardParser'

describe('wildcard parser', () => {
  it('normalizes a clear custom action and requires confirmation', () => {
    const result = parseWildcard('slow touch on chest')
    expect(result.accepted).toBe(true)
    expect(result.needsConfirmation).toBe(true)
    expect(result.action?.targets).toEqual(['chest'])
    expect(result.action?.rhythm).toBe('slow')
  })

  it('rejects ambiguous input instead of guessing a zone', () => {
    const result = parseWildcard('do something interesting')
    expect(result.accepted).toBe(false)
    expect(result.reason).toContain('target zone')
  })
})
