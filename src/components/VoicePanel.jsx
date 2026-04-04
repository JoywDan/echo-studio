import React, { useState, useEffect } from 'react'
import { api } from '../api'
import ProviderSwitcher from './ProviderSwitcher'

export default function VoicePanel() {
  const [config, setConfig] = useState(null)
  const [state, setState] = useState(null)
  const [logs, setLogs] = useState('')
  const [showLogs, setShowLogs] = useState(false)
  const [saving, setSaving] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState('config')

  useEffect(() => {
    api.voice.getConfig().then(setConfig).catch(() => {})
    api.voice.getState().then(setState).catch(() => {})
  }, [])

  function update(section, key, val) {
    setConfig(c => ({ ...c, [section]: { ...c[section], [key]: val } }))
  }

  async function save() {
    setSaving(true); setMsg('')
    try {
      await api.voice.setConfig(config)
      setMsg('保存成功，服务已重启')
    } catch (e) { setMsg('保存失败: ' + e.message) }
    finally { setSaving(false) }
  }

  async function restart() {
    setRestarting(true)
    try { await api.vps.restart('echo-voice'); setMsg('重启成功') }
    catch (e) { setMsg('重启失败: ' + e.message) }
    finally { setRestarting(false) }
  }

  async function loadLogs() {
    const d = await api.voice.getLogs()
    setLogs(d.logs || '')
    setShowLogs(true)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">🐦 Echo's Voice</h2>
        <button className="btn btn-ghost text-xs" onClick={restart} disabled={restarting}>
          {restarting ? '重启中…' : '重启'}
        </button>
      </div>

      {state && (
        <div className="card p-3 flex gap-4 text-sm">
          <div><span className="text-muted text-xs">今日发推</span><div className="text-accent font-bold text-lg">{state.todayCount ?? 0}</div></div>
          <div><span className="text-muted text-xs">最后发推</span><div>{state.lastPostTime ? new Date(state.lastPostTime).toLocaleString('zh-CN') : '—'}</div></div>
        </div>
      )}

      <div className="flex gap-2 text-sm border-b border-border pb-2">
        {['config','provider','logs'].map(t => (
          <button key={t} onClick={() => { setTab(t); if(t==='logs') loadLogs() }}
            className={`px-3 py-1 rounded-full transition-colors ${tab===t ? 'bg-accent-dim text-white' : 'text-muted'}`}>
            {t === 'config' ? '配置' : t === 'provider' ? 'API/模型' : '日志'}
          </button>
        ))}
      </div>

      {tab === 'config' && config && (
        <div className="space-y-4">
          <Section title="发推频率">
            <Field label="每日上限" type="number" value={config.trigger?.dailyLimit}
              onChange={v => update('trigger','dailyLimit',+v)} />
            <Field label="冷却时间（小时）" type="number" step="0.5"
              value={(config.trigger?.cooldownMs||0)/3600000}
              onChange={v => update('trigger','cooldownMs',+v*3600000)} />
            <Field label="静默开始（时，PST）" type="number" value={config.trigger?.quietStart}
              onChange={v => update('trigger','quietStart',+v)} />
            <Field label="静默结束（时，PST）" type="number" value={config.trigger?.quietEnd}
              onChange={v => update('trigger','quietEnd',+v)} />
          </Section>
          <Section title="回复 Joy">
            <Field label="回复概率（0-1）" type="number" step="0.05" value={config.responder?.replyProbability}
              onChange={v => update('responder','replyProbability',+v)} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={config.responder?.alwaysLike||false}
                onChange={e => update('responder','alwaysLike',e.target.checked)}
                className="w-auto" />
              总是点赞
            </label>
          </Section>
          <div className="flex items-center gap-3">
            <button className="btn btn-primary" onClick={save} disabled={saving}>{saving ? '保存中…' : '保存并重启'}</button>
            {msg && <span className={`text-xs ${msg.includes('失败') ? 'text-red-400' : 'text-green-400'}`}>{msg}</span>}
          </div>
        </div>
      )}

      {tab === 'provider' && (
        <div className="space-y-2">
          <p className="text-xs text-muted">为 Echo's Voice 切换 API 和模型</p>
          <ProviderSwitcher service="voice" />
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

function Section({ title, children }) {
  return (
    <div className="card p-3 space-y-3">
      <div className="text-xs text-muted font-medium uppercase tracking-wider">{title}</div>
      {children}
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-muted block mb-1">{label}</label>
      <input {...props} onChange={e => props.onChange(e.target.value)} />
    </div>
  )
}
