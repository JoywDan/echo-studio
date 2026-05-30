const DB = 'echo_ws', STORE = 'assets'
function open() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1)
    r.onupgradeneeded = () => { r.result.createObjectStore(STORE) }
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error)
  })
}
export async function idbPut(key, blob) {
  const db = await open()
  return new Promise((res, rej) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(blob, key); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error) })
}
export async function idbGet(key) {
  const db = await open()
  return new Promise((res, rej) => { const tx = db.transaction(STORE, 'readonly'); const g = tx.objectStore(STORE).get(key); g.onsuccess = () => res(g.result || null); g.onerror = () => rej(g.error) })
}
export async function idbDel(key) {
  const db = await open()
  return new Promise((res) => { const tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).delete(key); tx.oncomplete = () => res() })
}
