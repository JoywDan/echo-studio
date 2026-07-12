import { BodyProtocolSave } from './persistence'

export interface EncryptedVaultRecord { format: 'echo-body-vault'; version: 1; salt: string; iv: string; ciphertext: string; createdAt: string }

const encoder = new TextEncoder()
const decoder = new TextDecoder()
function bytesToBase64(bytes: Uint8Array): string { let text = ''; for (const byte of bytes) text += String.fromCharCode(byte); return btoa(text) }
function base64ToBytes(value: string): Uint8Array { const text = atob(value); return Uint8Array.from(text, (char) => char.charCodeAt(0)) }
function cryptoApi(): Crypto { if (!globalThis.crypto?.subtle) throw new Error('Web Crypto is unavailable') ; return globalThis.crypto }
function bufferSource(bytes: Uint8Array): BufferSource { return bytes as unknown as BufferSource }

export async function deriveVaultKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  if (!password || password.length < 8) throw new Error('Vault password must be at least 8 characters')
  const crypto = cryptoApi()
  const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: bufferSource(salt), iterations: 210_000, hash: 'SHA-256' }, material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])
}

export async function encryptVault(save: BodyProtocolSave, password: string): Promise<EncryptedVaultRecord> {
  const crypto = cryptoApi()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveVaultKey(password, salt)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(JSON.stringify(save)))
  return { format: 'echo-body-vault', version: 1, salt: bytesToBase64(salt), iv: bytesToBase64(iv), ciphertext: bytesToBase64(new Uint8Array(ciphertext)), createdAt: new Date().toISOString() }
}

export async function decryptVault(record: EncryptedVaultRecord, password: string): Promise<BodyProtocolSave> {
  if (record?.format !== 'echo-body-vault' || record.version !== 1) throw new Error('Unsupported Vault format')
  const crypto = cryptoApi()
  const key = await deriveVaultKey(password, base64ToBytes(record.salt))
  try {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: bufferSource(base64ToBytes(record.iv)) }, key, bufferSource(base64ToBytes(record.ciphertext)))
    return JSON.parse(decoder.decode(plain)) as BodyProtocolSave
  } catch { throw new Error('Vault password is incorrect or data is damaged') }
}

/** Keeps the unlocked key only in this object; calling lock drops the reference. */
export class VaultSession {
  private unlocked = false
  unlock(): void { this.unlocked = true }
  lock(): void { this.unlocked = false }
  isUnlocked(): boolean { return this.unlocked }
}
