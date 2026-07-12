import { EncryptedVaultRecord } from './privateVault'

const DB_NAME = 'echo_body_protocol_vault'
const DB_VERSION = 1
const STORE_NAME = 'vault'
const RECORD_KEY = 'private-save'

function openVaultDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE_NAME)) request.result.createObjectStore(STORE_NAME) }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Unable to open Vault storage'))
  })
}

export async function writeEncryptedVault(record: EncryptedVaultRecord): Promise<void> {
  const db = await openVaultDb()
  await new Promise<void>((resolve, reject) => { const tx = db.transaction(STORE_NAME, 'readwrite'); tx.objectStore(STORE_NAME).put(record, RECORD_KEY); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error || new Error('Unable to write Vault')) })
  db.close()
}

export async function readEncryptedVault(): Promise<EncryptedVaultRecord | null> {
  const db = await openVaultDb()
  return new Promise((resolve, reject) => { const tx = db.transaction(STORE_NAME, 'readonly'); const request = tx.objectStore(STORE_NAME).get(RECORD_KEY); request.onsuccess = () => { db.close(); resolve((request.result as EncryptedVaultRecord | undefined) || null) }; request.onerror = () => { db.close(); reject(request.error || new Error('Unable to read Vault')) } })
}

export async function deleteEncryptedVault(): Promise<void> {
  const db = await openVaultDb()
  await new Promise<void>((resolve, reject) => { const tx = db.transaction(STORE_NAME, 'readwrite'); tx.objectStore(STORE_NAME).delete(RECORD_KEY); tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error || new Error('Unable to delete Vault')) })
  db.close()
}
