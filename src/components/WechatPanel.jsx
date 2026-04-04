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
    try { await api.wechat.setPrompt(prompt); setMsg('保存成功，服务已重启') }
    catch (e) { setMsg('保存失败: ' + e.message) }
    finally { setSaving(false) }
  }

  async function restart() {
    setRestarting(true)
    try { await api.vps.restart('echo-bot-v2'); setMsg('重启成功') }
    catch (e) { setMsg('重启失败: ' + e.message) }
    finally { setRestarting(false) }
  }

  async function loadLogs() {
    try { const d = await api.wechat.getLogs(); setLogs(d.logs || '') }
    catch (e) { setLogs('加载失败: ' + e.message) }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">💬 微信 Echo</h2>
        <button className="btn btn-ghost text-xs" onClick={restart} disabled={restarting}>
          {restarting ? '重启中…' : '重启'}
        </button>
      </div>

      <div className="flex gap-2 text-sm border-b border-border pb-2">
        {['prompt','provider','logs'].map(t => (
          <button key={t} onClick={() => { setTab(t); if(t==='logs') loadLogs() }}
            className={`px-3 py-1 rounded-full transition-colors ${tab===t ? 'bg-accent-dim text-white' : 'text-muted'}`}>
            {t === 'prompt' ? 'System Prompt' : t === 'provider' ? 'API/模型' : '日志'}
          </button>
        ))}
      </div>

      {tab === 'prompt' && (
        <div className="space-y-3">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={16}
            className="font-mono text-xs"
            placeholder="CLAUDE.md 内容…"
          />
          <div className="flex items-center gap-3">
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? '保存中…' : '保存并重启'}</button>
            {msg && <span className={`text-xs ${msg.includes('失败') ? 'text-red-400' : 'text-green-400'}`}>{msg}</span>}
          </div>
        </div>
      )}

      {tab === 'provider' && (
        <div className="space-y-2">
          <p className="text-xs text-muted">为微信 Echo 切换 API 和模型</p>
          <ProviderSwitcher service="wechat" />
        </div>
      )}

      {tab === 'logs' && (
        <pre className="text-xs text-gray-400 bg-black/30 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
          {logs || '加载中…'}
        </pre>
      )}
    </div>
  )
}
