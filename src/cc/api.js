const API = 'https://studio.echowjoy.uk'
export function getCCToken() { return localStorage.getItem('cc_panel_token') || '' }
export function setCCToken(t) { localStorage.setItem('cc_panel_token', t) }
export function clearCCToken() { localStorage.removeItem('cc_panel_token') }
async function call(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getCCToken() } }
  if (body) opts.body = JSON.stringify(body)
  const r = await fetch(API + path, opts)
  if (!r.ok) { const e = await r.json().catch(() => ({ error: r.statusText })); throw new Error(e.error || r.statusText) }
  return r.json()
}
export const ccApi = {
  projects: () => call('GET', '/api/cc/projects'),
  run: (project, task, budget) => call('POST', '/api/cc/run', { project, task, budget }),
  jobs: () => call('GET', '/api/cc/jobs'),
  job: (id) => call('GET', '/api/cc/job/' + encodeURIComponent(id)),
  stop: (id) => call('POST', '/api/cc/job/' + encodeURIComponent(id) + '/stop'),
  streamUrl: (id) => API + '/api/cc/job/' + encodeURIComponent(id) + '/stream?token=' + encodeURIComponent(getCCToken()),
}
