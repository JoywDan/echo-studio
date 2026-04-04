import React, { useState, useEffect } from 'react'
import { api } from '../api'
import ProviderSwitcher from './ProviderSwitcher'

export default function VoicePanel() {
  const [config, setConfig] = useState(null)
  const [state, setState] = useState(null)
  const [logs, setLogs] = useState('')
  const [tab, setTab] = useState('config')
  const [saving, setSaving] = useState(false)
  const [restarting, setRestarting] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.voice.getConfig().then(setConfig).catch(() => {})
    api.voice.getState().then(setState).catch(() => {})
  }, [])

  function update(section, key, val) {
    setConfig(c => ({ ...c, [section]: { ...c[section], [key]: val } }))
  }

  async function save() {
    setSaving(true); setMsg('')
    try { await api.voice.setConfig(config); setMsg('saved · restarting') }
    catch (e) { setMsg('error: ' + e.message) }
    finally { setSaving(false) }
  }

  async function restart() {
    setRestarting(true)
    try { await api.vps.restart('echo-voice'); setMsg('restarted') }
    catch (e) { setMsg('error: ' + e.message) }
    finally { setRestarting(false) }
  }

  async function loadLogs() {
    setTab('logs')
    try { const d = await api.voice.getLogs(); setLogs(d.logs || '') }
    catch (e) { setLogs('error: ' + e.message) }
  }

  const COLOR = 'pink'

  return (
    <div className="space-y-4">
      {state && (
        <div className="card p-3 flex gap-6">
          <div>
            <div className="text-xs text-muted tracking-widest uppercase mb-1">今日发推</div>
            <div className="text-2xl font-bold neon-pink">{state.todayCount ?? 0}</div>
          </div>
          <div>
            <div className="text-xs text-muted tracking-widest uppercase mb-1">最后发推</div>
            <div className="text-sm">{state.lastPostTime ? new Date(state.lastPostTime).toLocaleString('zh-CN') : '—'}</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="tab-bar flex-1">
          {[['config','配置'],['provider','API/模型'],['logs','日志']].map(([t,l]) => (
            <button key={t} onClick={() => t==='logs' ? loadLogs() : setTab(t)}
              className={`tab ${tab===t ? `active-${COLOR}` : ''}`}>{l}</button>
          ))}
        </div>
        <button className="btn btn-ghost text-xs ml-2" onClick={restart} disabled={restarting}>
          {restarting ? '…' : '重启'}
        </button>
      </div>

      {tab === 'config' && config && (
        <div className="space-y-3">
          <CyberCard title="发推规则">
            <Field label="每日上限" type="number" value={config.trigger?.dailyLimit}
              onChange={v => update('trigger','dailyLimit',+v)} />
            <Field label="冷却时间（小时）" type="number" step="0.5"
              value={(config.trigger?.cooldownMs||0)/3600000}
              onChange={v => update('trigger','cooldownMs',+v*3600000)} />
            <div className="grid grid-cols-2 gap-2">
              <Field label="静默开始 (PST)" type="number" value={config.trigger?.quietStart}
                onChange={v => update('trigger','quietStart',+v)} />
              <Field label="静默结束 (PST)" type="number" value={config.trigger?.quietEnd}
                onChange={v => update('trigger','quietEnd',+v)} />
            </div>
          </CyberCard>
          <CyberCard title="回复规则">
            <Field label="回复 Joy 的概率" type="number" step="0.05" min="0" max="1"
              value={config.responder?.replyProbability}
              onChange={v => update('responder','replyProbability',+v)} />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={config.responder?.alwaysLike||false}
                onChange={e => update('responder','alwaysLike',e.target.checked)}
                style={{ width:'auto' }} />
              <span>总是点赞 Joy 的推文</span>
            </label>
          </CyberCard>
          <div className="flex items-center gap-3">
            <button className="btn btn-pink" onClick={save} disabled={saving}>{saving ? 'saving…' : '保存并重启'}</button>
            {msg && <span className="text-xs" style={{ color: msg.includes('error') ? 'var(--pink)' : 'var(--cyan)' }}>{msg}</span>}
          </div>
        </div>
      )}

      {tab === 'provider' && <ProviderSwitcher service="voice" color="pink" />}

      {tab === 'logs' && <div className="log-box">{logs || 'loading…'}</div>}
    </div>
  )
}

function CyberCard({ title, children }) {
  return (
    <div className="card p-3 space-y-3">
      <div className="text-xs tracking-widest uppercase text-muted">{title}</div>
      {children}
    </div>
  )
}

function Field({ label, onChange, ...props }) {
  return (
    <div>
      <label className="text-xs text-muted block mb-1">{label}</label>
      <input {...props} onChange={e => onChange(e.target.value)} />
    </div>
  )
}
