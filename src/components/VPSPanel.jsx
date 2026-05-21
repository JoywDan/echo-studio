import React, { useState, useEffect } from 'react'
import { api } from '../api'

function parseRam(str) {
  const line = str?.split('\n').find(l => l.startsWith('Mem:'))
  if (!line) return null
  const [, total, used] = line.trim().split(/\s+/).map(Number)
  return { total, used, pct: Math.round(used / total * 100) }
}

function parseDisk(str) {
  const line = str?.split('\n').find(l => l.includes('/dev/'))
  if (!line) return null
  const p = line.trim().split(/\s+/)
  return { size: p[1], used: p[2], avail: p[3], pct: parseInt(p[4]) || 0, pctStr: p[4] }
}

const RESTARTABLE = ['echo-voice','echo-bot-v2','echo-studio-api','memory-gateway','exec-mcp']

export default function VPSPanel() {
  const [health, setHealth] = useState(null)
  const [procs, setProcs] = useState([])
  const [echoStatus, setEchoStatus] = useState(null)
  const [restarting, setRestarting] = useState({})
  const [msg, setMsg] = useState('')

  async function load() {
    api.vps.health().then(setHealth).catch(() => {})
    api.vps.echoStatus().then(setEchoStatus).catch(() => {})
    api.vps.pm2().then(setProcs).catch(() => {})
  }

  useEffect(() => { load() }, [])

  async function restart(name) {
    setRestarting(r => ({ ...r, [name]: true })); setMsg('')
    try { await api.vps.restart(name); setMsg(`${name} restarted`); setTimeout(load, 1500) }
    catch (e) { setMsg('error: ' + e.message) }
    finally { setRestarting(r => ({ ...r, [name]: false })) }
  }

  const ram = parseRam(health?.free)
  const disk = parseDisk(health?.df)

  function barColor(pct) {
    if (pct > 85) return 'var(--pink)'
    if (pct > 70) return 'var(--orange)'
    return 'var(--cyan)'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted tracking-widest uppercase">System Status</span>
        <button className="btn btn-ghost text-xs" onClick={load}>刷新</button>
      </div>

      {msg && <div className="text-xs" style={{ color: msg.includes('error') ? 'var(--pink)' : 'var(--cyan)' }}>{msg}</div>}

      {echoStatus && (
        <div className="card p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">Echo Status</div>
              <div className="text-xs text-muted">{new Date(echoStatus.at).toLocaleString()}</div>
            </div>
            <span className="text-xs" style={{ color: echoStatus.ok ? 'var(--cyan)' : 'var(--pink)' }}>
              {echoStatus.ok ? 'OK' : 'Needs attention'}
            </span>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {['bot','voice','studioApi'].map(key => {
              const s = echoStatus.services?.[key]
              return <div key={key} className="rounded-md p-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--border)' }}>
                <div className="text-xs text-muted uppercase tracking-widest">{key}</div>
                <div className="text-sm">{s?.status || 'unknown'} · ↺{s?.restarts ?? '—'}</div>
                <div className="text-xs text-muted">{s?.memory_mb ? String(s.memory_mb) + 'MB' : '—'}</div>
              </div>
            })}
          </div>
          <div className="text-xs" style={{ color: echoStatus.wechat?.stale ? 'var(--orange)' : 'var(--muted)' }}>
            WeChat: {echoStatus.wechat?.has_session ? 'session saved' : 'no session'}
            {echoStatus.wechat?.stale ? ' · stale · ' + Math.ceil((echoStatus.wechat.retry_after_s || 0) / 60) + 'm pause' : ''}
            {echoStatus.wechat?.last_inbound_age_s != null ? ' · inbound ' + Math.round(echoStatus.wechat.last_inbound_age_s / 60) + 'm ago' : ''}
          </div>
          <div className="text-xs text-muted">
            Voice: today {echoStatus.voice?.today_count || 0} · last tweet {echoStatus.voice?.last_tweet_age_s != null ? Math.round(echoStatus.voice.last_tweet_age_s / 60) + 'm ago' : '—'}
          </div>
          {(echoStatus.recentErrors?.bot?.length || echoStatus.recentErrors?.voice?.length) ? (
            <details className="text-xs text-muted">
              <summary>recent error tails</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">{[...(echoStatus.recentErrors?.bot || []), ...(echoStatus.recentErrors?.voice || [])].slice(-8).join('\n')}</pre>
            </details>
          ) : null}
        </div>
      )}

      {(ram || disk) && (
        <div className="card p-4 space-y-4">
          {ram && (
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted tracking-widest uppercase">Memory</span>
                <span style={{ color: barColor(ram.pct) }}>{ram.used}MB / {ram.total}MB · {ram.pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${ram.pct}%`, background: barColor(ram.pct), boxShadow: `0 0 6px ${barColor(ram.pct)}` }} />
              </div>
            </div>
          )}
          {disk && (
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted tracking-widest uppercase">Disk</span>
                <span className="neon-cyan">{disk.used} / {disk.size} · {disk.pctStr}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${disk.pct}%`, background: 'var(--cyan)', boxShadow: '0 0 6px var(--cyan)' }} />
              </div>
            </div>
          )}
          {health?.uptime && <div className="text-xs text-muted">{health.uptime}</div>}
        </div>
      )}

      <div className="space-y-2">
        {procs.map(p => {
          const status = p.pm2_env?.status
          const mem = p.monit?.memory ? Math.round(p.monit.memory / 1024 / 1024) : null
          const canRestart = RESTARTABLE.includes(p.name)
          const isOnline = status === 'online'
          return (
            <div key={p.pm2_env?.pm_id} className="card p-3 flex items-center gap-3">
              <div className={isOnline ? 'dot-online' : 'dot-stopped'} style={{ flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{p.name}</div>
                <div className="text-xs text-muted">
                  {status} · {mem != null ? `${mem}MB` : '—'} · ↺{p.pm2_env?.restart_time}
                </div>
              </div>
              {canRestart && (
                <button className="btn btn-ghost text-xs" onClick={() => restart(p.name)} disabled={restarting[p.name]}>
                  {restarting[p.name] ? '…' : '重启'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
