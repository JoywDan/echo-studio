import { describe, expect, it } from 'vitest'
import { createInitialBodyState } from '../engine/bodySimulator'
import { migrateSave } from '../store/migrations'

describe('save migrations', () => {
  it('normalizes a legacy unversioned save to schema version 1', () => {
    const migrated = migrateSave({ sessionId: 'legacy', bodyState: createInitialBodyState() })
    expect(migrated.schemaVersion).toBe(1)
    expect(migrated.engineVersion).toBe('0.1.0')
    expect(migrated.rulesetVersion).toBe('1')
  })

  it('rejects malformed saves instead of silently accepting them', () => {
    expect(() => migrateSave({ sessionId: 'missing-body' })).toThrow('Invalid BODY PROTOCOL save')
  })
})
