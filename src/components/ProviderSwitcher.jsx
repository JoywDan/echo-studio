import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function ProviderSwitcher({ service }) {
  const [providers, setProviders] = useState([])
  const [active, setActive] = useState(null)
  const [selected, setSelected] = useState({ provider: '', model: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.providers.list().then(setProviders).catch(() => {})
    api.providers.getActive(service).then(data => {
      setActive(data)
    }).catch(() => {})
  }, [service])

  const currentProvider = providers.find(p =>
    active?.baseURL?.includes(new URL(p.key ? p.baseURL : 'https://x.com').hostname)
  )

  async function doSwitch() {
    if (!selected.provider || !selected.model) return
    setSaving(true); setMsg('')
    try {
      await api.providers.switch(service, selected.provider, selected.model)
      setMsg('切换成功，服务已重启')
      const newActive = await api.providers.getActive(service)
      setActive(newActive)
    } catch (e) {
      setMsg('切换失败: ' + e.message)
    } finally { setSaving(false) }
  }

  const chosenProvider = providers.find(p => p.name === selected.provider)

  if (providers.length === 0) return (
    <div className="text-muted text-xs">暂无可用 Provider，请先添加</div>
  )

  return (
    <div className="space-y-3">
      {active && (
        <div className="text-xs text-muted">
          当前：<span className="text-accent">{active.model || active.hostname}</span>
        </div>
      )}
      <div className="flex gap-2">
        <select value={selected.provider} onChange={e => setSelected({ provider: e.target.value, model: '' })}>
          <option value="">选择 Provider</option>
          {providers.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </select>
        <select value={selected.model} onChange={e => setSelected(s => ({ ...s, model: e.target.value }))}
                disabled={!chosenProvider}>
          <option value="">选择模型</option>
          {chosenProvider?.models?.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <button className="btn btn-primary" onClick={doSwitch} disabled={saving || !selected.provider || !selected.model}>
          {saving ? '切换中…' : '切换'}
        </button>
        {msg && <span className={`text-xs ${msg.includes('失败') ? 'text-red-400' : 'text-green-400'}`}>{msg}</span>}
      </div>
    </div>
  )
}
