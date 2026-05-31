const API = 'https://studio.echowjoy.uk'
export function getToken() { return localStorage.getItem('studio_token') || '' }
export function setToken(t) { localStorage.setItem('studio_token', t) }
export function clearToken() { localStorage.removeItem('studio_token') }

async function call(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() } }
  if (body) opts.body = JSON.stringify(body)
  const r = await fetch(API + path, opts)
  if (!r.ok) { const e = await r.json().catch(() => ({ error: r.statusText })); throw new Error(e.error || r.statusText) }
  return r.json()
}
export const api = {
  ping: () => call('GET', '/api/ping'),
  models: () => call('GET', '/api/chat/models'),
  sessions: () => call('GET', '/api/chat/sessions'),
  history: (sid) => call('GET', '/api/chat/history?session_id=' + encodeURIComponent(sid)),
  renameSession: (sid, title) => call('PUT', '/api/chat/sessions/' + encodeURIComponent(sid), { title }),
  deleteSession: (sid) => call('DELETE', '/api/chat/sessions/' + encodeURIComponent(sid)),
  codingAction: (id, decision) => call('POST', '/api/chat/coding-action/' + encodeURIComponent(id), { decision }),
  diary: {
    list: () => call('GET', '/api/diary'),
    get: (date) => call('GET', '/api/diary/' + encodeURIComponent(date)),
  },
  selfLetters: () => call('GET', '/api/memory/self-letters'),
  travel: {
    list: () => call('GET', '/api/travel'),
    get: (id) => call('GET', '/api/travel/' + encodeURIComponent(id)),
  },
  wander: () => call('GET', '/api/wander'),
  uploadImage: async (file) => {
    const r = await fetch(API + '/api/chat/upload-image', { method: 'POST', headers: { 'Authorization': 'Bearer ' + getToken(), 'Content-Type': file.type }, body: file })
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || 'upload failed') }
    return r.json()
  },
  uploadFile: async (file) => {
    const r = await fetch(API + '/api/chat/upload-file', { method: 'POST', headers: { 'Authorization': 'Bearer ' + getToken(), 'Content-Type': 'application/octet-stream', 'X-Filename': encodeURIComponent(file.name) }, body: file })
    if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || 'upload failed') }
    return r.json()
  },
  // streaming chat: calls onDelta(text) per chunk, returns final meta {tool_calls, pending_actions, thinking_content, ...}
  stream: async (body, { onDelta, onError } = {}) => {
    const resp = await fetch(API + '/api/chat/stream', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() }, body: JSON.stringify(body) })
    if (!resp.ok) { let e; try { e = (await resp.json()).error } catch { e = resp.statusText } throw new Error(e || ('http ' + resp.status)) }
    const reader = resp.body.getReader(); const dec = new TextDecoder()
    let buf = '', meta = null
    while (true) {
      const { done, value } = await reader.read(); if (done) break
      buf += dec.decode(value, { stream: true })
      let idx
      while ((idx = buf.indexOf('\n\n')) >= 0) {
        const chunk = buf.slice(0, idx); buf = buf.slice(idx + 2)
        if (!chunk || chunk.startsWith(':')) continue
        let ev = 'message', data = ''
        for (const line of chunk.split('\n')) {
          if (line.startsWith('event:')) ev = line.slice(6).trim()
          else if (line.startsWith('data:')) data += line.slice(5).trim()
        }
        if (!data) continue
        let obj; try { obj = JSON.parse(data) } catch { continue }
        if (ev === 'delta') onDelta && onDelta(obj.t)
        else if (ev === 'done') meta = obj
        else if (ev === 'error') { if (onError) onError(obj.error); throw new Error(obj.error || 'stream error') }
      }
    }
    return meta || {}
  },
}
export const API_BASE = API
export function uploadsUrl(u, filename) { return API + (u && u !== '/x' ? u : ('/api/chat/uploads/' + filename)) }
