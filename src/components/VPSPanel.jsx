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
  const [restarting, setRestarting] = useState({})
  const [msg, setMsg] = useState('')

  async function load() {
    api.vps.health().then(setHealth).catch(() => {})
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
