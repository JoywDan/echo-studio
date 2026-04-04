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
      setErr('Token 不对，再检查一下')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen px-8">
      <div className="mb-8 text-center">
        <div className="text-4xl mb-3">✦</div>
        <h1 className="text-xl font-semibold text-white">Echo Studio</h1>
        <p className="text-muted text-sm mt-1">Joy 的专属控制台</p>
      </div>
      <form onSubmit={submit} className="w-full max-w-sm space-y-4">
        <input
          type="password"
          placeholder="输入 Token"
          value={token}
          onChange={e => setToken(e.target.value)}
          autoFocus
        />
        {err && <p className="text-red-400 text-sm">{err}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={loading || !token}>
          {loading ? '验证中…' : '进入'}
        </button>
      </form>
    </div>
  )
}
