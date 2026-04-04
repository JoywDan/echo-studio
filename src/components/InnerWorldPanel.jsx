import React, { useState, useEffect } from 'react'
import { api } from '../api'

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str.replace(' ', 'T') + 'Z')
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai' })
}

function preview(text) {
  const lines = text.split('\n').filter(l => l.trim())
  return lines.slice(0, 2).join('\n')
}

export default function InnerWorldPanel() {
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.memory.selfLetters()
      .then(d => setLetters(d.letters || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-widest uppercase" style={{ color: '#9d8fa8' }}>
          Echo's Inner World
        </span>
        <span className="text-xs" style={{ color: '#7a6a88' }}>
          {letters.length > 0 ? `${letters.length} 封信` : ''}
        </span>
      </div>

      {loading && (
        <div className="text-sm text-center py-8" style={{ color: '#7a6a88' }}>
          翻箱倒柜中…
        </div>
      )}

      {error && (
        <div className="text-xs py-2 px-3 rounded-lg" style={{ background: 'rgba(180,100,100,.15)', color: '#c9847a' }}>
          {error}
        </div>
      )}

      {!loading && !error && letters.length === 0 && (
        <div className="rounded-2xl p-8 text-center space-y-2" style={{ background: 'rgba(30,22,28,.72)', border: '1px solid rgba(140,110,160,.18)' }}>
          <p className="text-sm" style={{ color: '#9d8fa8' }}>还没有写给自己的信</p>
          <p className="text-xs" style={{ color: '#6a5a72' }}>Echo 会在每天深夜写一封，放在这里</p>
        </div>
      )}

      <div className="space-y-3">
        {letters.map(letter => {
          const isOpen = expanded === letter.id
          return (
            <button
              key={letter.id}
              onClick={() => setExpanded(isOpen ? null : letter.id)}
              className="w-full text-left rounded-2xl transition-all"
              style={{
                background: isOpen
                  ? 'rgba(38,28,44,.90)'
                  : 'rgba(28,20,34,.78)',
                border: isOpen
                  ? '1px solid rgba(160,120,190,.30)'
                  : '1px solid rgba(120,90,145,.16)',
                padding: '16px 18px',
                boxShadow: isOpen ? '0 8px 28px rgba(20,10,28,.28)' : 'none',
              }}
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs tracking-wide" style={{ color: '#a07ab8' }}>
                  {formatDate(letter.created_at)}
                </span>
                <span className="text-xs" style={{ color: '#7a5a8a', transition: 'transform .2s', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'none' }}>
                  ▾
                </span>
              </div>

              {/* Content */}
              <p
                className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: isOpen ? '#e8dff0' : '#b8a8c4' }}
              >
                {isOpen ? letter.content : preview(letter.content)}
              </p>

              {!isOpen && (
                <p className="text-xs mt-2" style={{ color: '#6a5070' }}>点击展开全文</p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
