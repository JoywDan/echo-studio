import { beforeAll, describe, expect, it } from 'vitest'
import { webcrypto } from 'node:crypto'
import { decryptVault, encryptVault, VaultSession } from '../store/privateVault'
import { makeSave } from '../store/persistence'
import { createInitialBodyState } from '../engine/bodySimulator'
import { migrateSave } from '../store/migrations'

beforeAll(() => { if (!globalThis.crypto) Object.defineProperty(globalThis, 'crypto', { value: webcrypto }) })

describe('Private Vault', () => {
  it('encrypts and decrypts a save without storing plaintext in the record', async () => {
    const save = makeSave('vault-test', createInitialBodyState())
    const record = await encryptVault(save, 'correct horse battery staple')
    expect(record.ciphertext).not.toContain('vault-test')
    expect(await decryptVault(record, 'correct horse battery staple')).toEqual(save)
  })

  it('rejects a wrong password', async () => {
    const record = await encryptVault(makeSave('wrong-password', createInitialBodyState()), 'correct horse battery staple')
    await expect(decryptVault(record, 'wrong password')).rejects.toThrow('incorrect')
  })

  it('drops unlocked state on lock', () => {
    const session = new VaultSession()
    expect(session.isUnlocked()).toBe(false)
    session.unlock(); expect(session.isUnlocked()).toBe(true)
    session.lock(); expect(session.isUnlocked()).toBe(false)
  })

  it('keeps migrated save data compatible with the Vault payload', async () => {
    const legacy = migrateSave({ sessionId: 'legacy-vault', bodyState: createInitialBodyState() })
    const record = await encryptVault(legacy, 'correct horse battery staple')
    expect((await decryptVault(record, 'correct horse battery staple')).schemaVersion).toBe(1)
  })
})
