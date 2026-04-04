import React, { useState, useEffect } from 'react'
import { api } from '../api'

function parseRam(freeOutput) {
  const line = freeOutput?.split('\n').find(l => l.startsWith('Mem:'))
  if (!line) return null
  const [, total, used, free] = line.trim().split(/\s+/).map(Number)
  return { total, used, free, pct: Math.round(used / total * 100) }
}

function parseDisk(dfOutput) {
  const line = dfOutput?.split('\n').find(l => l.includes('/dev/'))
  if (!line) return null
  const parts = line.trim().split(/\s+/)
  return { size: parts[1], used: parts[2], avail: parts[3], pct: parts[4] }
}

const RESTARTABLE = ['echo-voice', 'echo-bot-v2', 'echo-studio-api', 'memory-gateway', 'exec-mcp']

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
    try { await api.vps.restart(name); setMsg(`${name} 已重启`); setTimeout(load, 1500) }
    catch (e) { setMsg('重启失败: ' + e.message) }
    finally { setRestarting(r => ({ ...r, [name]: false })) }
  }

  const ram = parseRam(health?.free)
  const disk = parseDisk(health?.df)

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">🖥️ VPS</h2>
        <button className="btn btn-ghost text-xs" onClick={load}>刷新</button>
      </div>

      {msg && <div className="text-xs text-green-400">{msg}</div>}

      {(ram || disk) && (
        <div className="card p-3 space-y-3">
          {ram && (
            <div>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>内存</span>
                <span>{ram.used}MB / {ram.total}MB ({ram.pct}%)</span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${ram.pct}%`, background: ram.pct > 85 ? '#f87171' : ram.pct > 70 ? '#fb923c' : '#4ade80' }} />
              </div>
            </div>
          )}
          {disk && (
            <div>
              <div className="flex justify-between text-xs text-muted mb-1">
                <span>磁盘</span><span>{disk.used} / {disk.size} ({disk.pct})</span>
              </div>
              <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-purple-400 transition-all"
                  style={{ width: disk.pct }} />
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
          return (
            <div key={p.pm2_env?.pm_id} className="card p-3 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status === 'online' ? 'bg-green-400' : 'bg-red-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{p.name}</div>
                <div className="text-xs text-muted">
                  {status} · {mem != null ? `${mem}MB` : '—'} · 重启{p.pm2_env?.restart_time}次
                </div>
              </div>
              {canRestart && (
                <button className="btn btn-ghost text-xs flex-shrink-0"
                  onClick={() => restart(p.name)} disabled={restarting[p.name]}>
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
