import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function ProviderSwitcher({ service, color = 'cyan' }) {
  const [providers, setProviders] = useState([])
  const [active, setActive] = useState(null)
  const [sel, setSel] = useState({ provider: '', model: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.providers.list().then(setProviders).catch(() => {})
    api.providers.getActive(service).then(setActive).catch(() => {})
  }, [service])

  async function doSwitch() {
    if (!sel.provider || !sel.model) return
    setSaving(true); setMsg('')
    try {
      await api.providers.switch(service, sel.provider, sel.model)
      setMsg('切换成功 · 服务已重启')
      api.providers.getActive(service).then(setActive)
    } catch (e) { setMsg('error: ' + e.message) }
    finally { setSaving(false) }
  }

  const chosen = providers.find(p => p.name === sel.provider)

  if (providers.length === 0) return (
    <div className="text-xs text-muted">暂无 Provider</div>
  )

  return (
    <div className="space-y-4">
      {active && (
        <div className="card p-3">
          <div className="text-xs text-muted tracking-widest uppercase mb-1">当前</div>
          <div className={`text-sm neon-${color}`}>{active.model || active.hostname || '—'}</div>
          {active.baseURL && <div className="text-xs text-muted mt-0.5">{active.baseURL}</div>}
        </div>
      )}

      <div className="space-y-2">
        <select value={sel.provider} onChange={e => setSel({ provider: e.target.value, model: '' })}>
          <option value="">— 选择 Provider —</option>
          {providers.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>

        <select value={sel.model} onChange={e => setSel(s => ({ ...s, model: e.target.value }))}
          disabled={!chosen}>
          <option value="">— 选择模型 —</option>
          {chosen?.models?.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <button className={`btn btn-${color}`} onClick={doSwitch}
          disabled={saving || !sel.provider || !sel.model}>
          {saving ? 'switching…' : '切换'}
        </button>
        {msg && <span className="text-xs" style={{ color: msg.includes('error') ? 'var(--pink)' : 'var(--cyan)' }}>{msg}</span>}
      </div>
    </div>
  )
}
