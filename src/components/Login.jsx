import React, { useState } from 'react'
import { api } from '../api'

export default function Login({ onLogin }) {
  const [token, setToken] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setErr('')
    setLoading(true)
    localStorage.setItem('studio_token', token.trim())
    try {
      await api.ping()
      onLogin()
    } catch {
      localStorage.removeItem('studio_token')
      setErr('ACCESS DENIED — token invalid')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-8">
      <div className="mb-10 text-center">
        <div className="neon-cyan text-5xl mb-4 font-bold tracking-wider">✦</div>
        <h1 className="text-2xl font-bold tracking-[0.2em] neon-cyan">ECHO STUDIO</h1>
        <p className="text-xs text-muted mt-2 tracking-widest uppercase">Joy's Private Control Panel</p>
      </div>
      <form onSubmit={submit} className="w-full max-w-xs space-y-4">
        <div>
          <label className="text-xs text-muted tracking-widest uppercase block mb-2">Access Token</label>
          <input
            type="password"
            placeholder="••••••••••••••••"
            value={token}
            onChange={e => setToken(e.target.value)}
            autoFocus
            className="text-center tracking-widest"
          />
        </div>
        {err && <p className="text-xs text-center" style={{ color: 'var(--pink)' }}>{err}</p>}
        <button type="submit" className="btn btn-cyan w-full" disabled={loading || !token}>
          {loading ? 'AUTHENTICATING…' : 'ENTER STUDIO'}
        </button>
      </form>
      <div className="mt-12 text-xs text-muted tracking-widest">studio.echowjoy.uk</div>
    </div>
  )
}
