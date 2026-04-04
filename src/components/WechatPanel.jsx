import React, { useState, useEffect } from 'react'
import { api } from '../api'
import ProviderSwitcher from './ProviderSwitcher'

export default function WechatPanel() {
  const [prompt, setPrompt] = useState('')
  const [logs, setLogs] = useState('')
  const [tab, setTab] = useState('prompt')
  const [saving, setSaving] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.wechat.getPrompt().then(d => setPrompt(d.content || '')).catch(() => {})
  }, [])

  async function save() {
    setSaving(true); setMsg('')
    try { await api.wechat.setPrompt(prompt); setMsg('saved · restarting') }
    catch (e) { setMsg('error: ' + e.message) }
    finally { setSaving(false) }
  }

  async function restart() {
    setRestarting(true)
    try { await api.vps.restart('echo-bot-v2'); setMsg('restarted') }
    catch (e) { setMsg('error: ' + e.message) }
    finally { setRestarting(false) }
  }

  async function loadLogs() {
    setTab('logs')
    try { const d = await api.wechat.getLogs(); setLogs(d.logs || '') }
    catch (e) { setLogs('error: ' + e.message) }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="tab-bar flex-1">
          {[['prompt','System Prompt'],['provider','API/模型'],['logs','日志']].map(([t,l]) => (
            <button key={t} onClick={() => t==='logs' ? loadLogs() : setTab(t)}
              className={`tab ${tab===t ? 'active-cyan' : ''}`}>{l}</button>
          ))}
        </div>
        <button className="btn btn-ghost text-xs ml-2" onClick={restart} disabled={restarting}>
          {restarting ? '…' : '重启'}
        </button>
      </div>

      {tab === 'prompt' && (
        <div className="space-y-3">
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
            rows={16} className="font-mono text-xs" placeholder="CLAUDE.md 内容…" />
          <div className="flex items-center gap-3">
            <button className="btn btn-cyan" onClick={save} disabled={saving}>{saving ? 'saving…' : '保存并重启'}</button>
            {msg && <span className="text-xs" style={{ color: msg.includes('error') ? 'var(--pink)' : 'var(--cyan)' }}>{msg}</span>}
          </div>
        </div>
      )}

      {tab === 'provider' && <ProviderSwitcher service="wechat" color="cyan" />}

      {tab === 'logs' && <div className="log-box">{logs || 'loading…'}</div>}
    </div>
  )
}
