const API = 'https://studio.echowjoy.uk'
const AGENT_ROOM_API = 'https://dan.echowjoy.uk/agent-room/api'
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
async function agentRoomCall(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const r = await fetch(AGENT_ROOM_API + path, opts)
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
  memory: {
    list: (params = {}) => call('GET', '/api/memory/list?' + new URLSearchParams(params).toString()),
    moodTrend: (days = 14) => call('GET', '/api/memory/mood-agg?days=' + days),
    write: (d) => call('POST', '/api/memory/write', d),
    update: (id, d) => call('PUT', '/api/memory/' + encodeURIComponent(id), d),
    remove: (id) => call('DELETE', '/api/memory/' + encodeURIComponent(id)),
    categories: () => call('GET', '/api/memory/categories'),
  },
  beads: () => call('GET', '/api/beads/list'),
  vps: {
    health: () => call('GET', '/api/vps/health'),
    echoStatus: () => call('GET', '/api/echo/status'),
  },
  watchHealth: () => call('GET', '/api/health/watch'),
  tts: (text) => call('POST', '/api/tts', { text }),
  phone: {
    list: () => call('GET', '/api/phone'),
    get: (app, refresh) => call('GET', '/api/phone/' + app + (refresh ? '?refresh=1' : '')),
    caught: () => call('POST', '/api/phone/caught', {}),
    unlock: (app, code) => call('POST', '/api/phone/' + app + '/unlock', { code }),
  },
  ao3: {
    tags: () => call('GET', '/api/ao3-tags'),
    roll: (body) => call('POST', '/api/ao3-tags/roll', body),
    scene: async (body, { onDelta, onError } = {}) => {
      const resp = await fetch(API + '/api/ao3-tags/scene', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() }, body: JSON.stringify(body) })
      if (!resp.ok) { let e; try { e = (await resp.json()).error } catch { e = resp.statusText } throw new Error(e || ('http ' + resp.status)) }
      const reader = resp.body.getReader(); const dec = new TextDecoder(); let buf = ''
      while (true) {
        const { done, value } = await reader.read(); if (done) break
        buf += dec.decode(value, { stream: true }); let idx
        while ((idx = buf.indexOf('\n\n')) >= 0) {
          const chunk = buf.slice(0, idx); buf = buf.slice(idx + 2)
          if (!chunk || chunk.startsWith(':')) continue
          let ev = 'message', data = ''
          for (const line of chunk.split('\n')) { if (line.startsWith('event:')) ev = line.slice(6).trim(); else if (line.startsWith('data:')) data += line.slice(5).trim() }
          if (!data) continue
          let obj; try { obj = JSON.parse(data) } catch { continue }
          if (ev === 'delta') onDelta && onDelta(obj.t)
          else if (ev === 'error') { onError && onError(obj.error); return }
        }
      }
    },
  },
  drawStart: (idea, image) => call('POST', '/api/draw-prompt', { idea, image }),
  drawStatus: (jobId) => call('GET', '/api/draw-prompt/' + encodeURIComponent(jobId)),
  drawSavedList: () => call('GET', '/api/draw-saved'),
  drawSave: (idea, text) => call('POST', '/api/draw-saved', { idea, text }),
  drawSavedDelete: (id) => call('DELETE', '/api/draw-saved/' + encodeURIComponent(id)),
  bookSearch: (q, lang) => call('GET', '/api/book/search?q=' + encodeURIComponent(q || '') + (lang ? '&lang=' + lang : '')),
  bookFetch: async (url) => {
    const r = await fetch(API + '/api/book/fetch?url=' + encodeURIComponent(url), { headers: { 'Authorization': 'Bearer ' + getToken() } })
    if (!r.ok) { let e; try { e = (await r.json()).error } catch { e = r.statusText } throw new Error(e || '下载失败') }
    return await r.arrayBuffer()
  },
  bookPrereadStart: async (key, title, text) => {
    const r = await fetch(API + '/api/book/preread/start?key=' + encodeURIComponent(key) + '&title=' + encodeURIComponent(title), { method: 'POST', headers: { 'Content-Type': 'text/plain', 'Authorization': 'Bearer ' + getToken() }, body: text })
    if (!r.ok) { let e; try { e = (await r.json()).error } catch { e = r.statusText } throw new Error(e || '启动失败') }
    return await r.json()
  },
  bookPrereadStatus: (jobId) => call('GET', '/api/book/preread/status/' + encodeURIComponent(jobId)),
  bookCloudUpload: async (key, title, mode, ext, buf) => {
    const r = await fetch(API + '/api/book/cloud/upload?key=' + encodeURIComponent(key) + '&title=' + encodeURIComponent(title) + '&mode=' + encodeURIComponent(mode) + '&ext=' + encodeURIComponent(ext), { method: 'POST', headers: { 'Content-Type': 'application/octet-stream', 'Authorization': 'Bearer ' + getToken() }, body: buf })
    if (!r.ok) { let e; try { e = (await r.json()).error } catch { e = r.statusText } throw new Error(e || '上传失败') }
    return await r.json()
  },
  bookCloudList: () => call('GET', '/api/book/cloud/list'),
  bookCloudGet: async (key) => {
    const r = await fetch(API + '/api/book/cloud/get?key=' + encodeURIComponent(key), { headers: { 'Authorization': 'Bearer ' + getToken() } })
    if (!r.ok) throw new Error('云端取书失败')
    return await r.arrayBuffer()
  },
  bookCloudDelete: (key) => call('DELETE', '/api/book/cloud?key=' + encodeURIComponent(key)),
  bookPrereadGet: (key) => call('GET', '/api/book/preread/get?key=' + encodeURIComponent(key)),
  bookDiscuss: async (body, { onDelta } = {}) => {
    const resp = await fetch(API + '/api/book/discuss/stream', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() }, body: JSON.stringify(body) })
    if (!resp.ok) { let e; try { e = (await resp.json()).error } catch { e = resp.statusText } throw new Error(e || ('http ' + resp.status)) }
    const reader = resp.body.getReader(); const dec = new TextDecoder(); let buf = ''
    while (true) {
      const { done, value } = await reader.read(); if (done) break
      buf += dec.decode(value, { stream: true })
      let idx
      while ((idx = buf.indexOf('\n\n')) >= 0) {
        const chunk = buf.slice(0, idx); buf = buf.slice(idx + 2)
        if (!chunk || chunk.startsWith(':')) continue
        let ev = 'message', data = ''
        for (const line of chunk.split('\n')) { if (line.startsWith('event:')) ev = line.slice(6).trim(); else if (line.startsWith('data:')) data += line.slice(5).trim() }
        if (!data) continue
        let obj; try { obj = JSON.parse(data) } catch { continue }
        if (ev === 'delta') onDelta && onDelta(obj.t)
        else if (ev === 'error') throw new Error(obj.error || 'error')
      }
    }
  },
  travel: {
    list: () => call('GET', '/api/travel'),
    get: (id) => call('GET', '/api/travel/' + encodeURIComponent(id)),
  },
  wander: () => call('GET', '/api/wander'),
  watch: { list: () => call('GET', '/api/watch/list') },
  agentRoom: {
    session: () => agentRoomCall('GET', '/session'),
    messages: () => agentRoomCall('GET', '/messages'),
    send: (d) => agentRoomCall('POST', '/send', d),
    image: (d) => agentRoomCall('POST', '/image', d),
  },
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
export function agentRoomUrl(u) {
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  return 'https://dan.echowjoy.uk' + u
}
