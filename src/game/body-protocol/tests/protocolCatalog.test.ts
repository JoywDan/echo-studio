import { describe, expect, it } from 'vitest'
import { PROTOCOL_CATALOG, protocolForSeed } from '../models/protocolCatalog'

describe('protocol catalog', () => {
  it('selects deterministically from multiple protocols', () => {
    expect(PROTOCOL_CATALOG.length).toBeGreaterThanOrEqual(3)
    expect(protocolForSeed('same-seed').id).toBe(protocolForSeed('same-seed').id)
    expect(PROTOCOL_CATALOG.map((item) => item.id)).toContain(protocolForSeed('same-seed').id)
  })
})
