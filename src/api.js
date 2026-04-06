const BASE = 'https://studio.echowjoy.uk'

function token() {
  return localStorage.getItem('studio_token') || ''
}

async function req(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token()
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

export const api = {
  ping: () => req('GET', '/api/ping'),

  voice: {
    getConfig: () => req('GET', '/api/voice/config'),
    setConfig: (d) => req('POST', '/api/voice/config', d),
    getState: () => req('GET', '/api/voice/state'),
    getLogs: (lines = 80) => req('GET', `/api/voice/logs?lines=${lines}`),
  },

  wechat: {
    getPrompt: () => req('GET', '/api/wechat/prompt'),
    setPrompt: (content) => req('POST', '/api/wechat/prompt', { content }),
    getLogs: (lines = 80) => req('GET', `/api/wechat/logs?lines=${lines}`),
  },

  providers: {
    list: () => req('GET', '/api/providers'),
    save: (d) => req('PUT', '/api/providers', d),
    getActive: (service) => req('GET', `/api/providers/active?service=${service}`),
    switch: (service, providerName, model) => req('POST', '/api/providers/switch', { service, providerName, model }),
  },

  memory: {
    recall: (query, context, emotion) => req('POST', '/api/memory/recall', { query, context, emotion }),
    byTime: (d) => req('POST', '/api/memory/by-time', d),
    moodTrend: (days = 7) => req('GET', `/api/memory/mood-trend?days=${days}`),
    byEntity: (d) => req('POST', '/api/memory/by-entity', d),
    stats: () => req('GET', '/api/memory/stats'),
    recent: (count = 10) => req('GET', `/api/memory/recent?count=${count}`),
    write: (d) => req('POST', '/api/memory/write', d),
    selfLetters: () => req('GET', '/api/memory/self-letters'),
    list: (params = {}) => {
      const q = new URLSearchParams()
      for (const [k, v] of Object.entries(params)) { if (v !== '' && v != null) q.set(k, v) }
      return req('GET', `/api/memory/list?${q}`)
    },
    update: (id, d) => req('PUT', `/api/memory/${id}`, d),
    remove: (id) => req('DELETE', `/api/memory/${id}`),
    categories: () => req('GET', '/api/memory/categories'),
  },

  vps: {
    health: () => req('GET', '/api/vps/health'),
    pm2: () => req('GET', '/api/vps/pm2'),
    restart: (name) => req('POST', '/api/pm2/restart', { name }),
    stop: (name) => req('POST', '/api/pm2/stop', { name }),
  },

  diary: {
    list: () => req('GET', '/api/diary'),
    get: (date) => req('GET', `/api/diary/${date}`),
    generate: () => req('POST', '/api/diary/generate', {}),
  },
}
