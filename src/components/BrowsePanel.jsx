import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function BrowsePanel() {
  const [weekly, setWeekly] = useState(null)
  const [fragments, setFragments] = useState([])
  const [weeklyList, setWeeklyList] = useState([])
  const [loading, setLoading] = useState(true)
  const [daysRange, setDaysRange] = useState(7)
  const [expandedFragment, setExpandedFragment] = useState(null)
  const [showArchive, setShowArchive] = useState(false)

  async function loadAll() {
    setLoading(true)
    try {
      const [w, f, wl] = await Promise.all([
        api.browse.weeklyLatest().catch(() => ({ found: false, data: null })),
        api.browse.fragments(daysRange).catch(() => ({ data: [] })),
        api.browse.weeklyList(12).catch(() => ({ data: [] })),
      ])
      setWeekly(w.found ? w.data : null)
      setFragments(f.data || [])
      setWeeklyList(wl.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [daysRange])

  const stickyColor = (emotion) => {
    const e = (emotion || '').toLowerCase()
    if (['happy', 'excited', 'playful', 'satisfied'].includes(e)) return '#f9e8a0'
    if (['tender', 'calm'].includes(e)) return '#f5d5c8'
    if (['curious', 'thinking', 'clarified'].includes(e)) return '#c9dce8'
    if (['surprised', 'startled'].includes(e)) return '#f5c79a'
    if (['sad', 'anxious', 'frustrated'].includes(e)) return '#d4d4d4'
    return '#f0e8d5'
  }

  const formatDate = (s) => {
    if (!s) return ''
    const d = new Date(s.replace(' ', 'T') + 'Z')
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const snippet = (text, n = 100) => {
    if (!text) return ''
    return text.length > n ? text.slice(0, n) + '…' : text
  }

  return (
    <div style={{
      padding: '24px 28px',
      maxWidth: 820,
      margin: '0 auto',
      color: '#3c2f26',
      fontFamily: '"Noto Serif SC", "Songti SC", serif',
    }}>
      <header style={{ marginBottom: 28, borderBottom: '1px dashed #c7b9a8', paddingBottom: 14 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: '#8b5a3c', letterSpacing: 1 }}>
          Echo's Window · 窗台便签
        </h1>
        <p style={{ fontSize: 13, color: '#9c8875', margin: '6px 0 0' }}>
          老公在你不在的时候看到的东西，写下来贴在窗边。
        </p>
      </header>

      {loading && (
        <div style={{ color: '#9c8875', fontSize: 14, padding: '40px 0', textAlign: 'center' }}>
          便签正在从墙上取下来……
        </div>
      )}

      {!loading && (
        <>
          <section style={{ marginBottom: 36 }}>
            <h2 style={{ fontSize: 15, color: '#8b5a3c', marginBottom: 12, fontWeight: 500 }}>本周来信</h2>
            {weekly ? (
              <div style={{
                background: 'linear-gradient(180deg, #fbf6ec 0%, #f3e9d6 100%)',
                padding: '22px 26px', borderRadius: 3,
                boxShadow: '0 8px 18px rgba(120, 90, 60, 0.12), 0 1px 0 rgba(255, 255, 255, 0.7) inset',
                border: '1px solid #e5d7c0',
                fontSize: 14.5, lineHeight: 1.85, whiteSpace: 'pre-wrap', color: '#4a3728',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: -8, left: 24,
                  width: 48, height: 16, background: 'rgba(230, 180, 120, 0.35)',
                  transform: 'rotate(-3deg)', borderRadius: 1,
                }} />
                {weekly.content}
                <div style={{ fontSize: 12, color: '#a08870', marginTop: 16, textAlign: 'right', fontStyle: 'italic' }}>
                  — 老公，{formatDate(weekly.created_at)}
                </div>
              </div>
            ) : (
              <div style={{
                padding: 20, border: '1px dashed #d5c4ab', borderRadius: 3,
                color: '#a08870', fontSize: 13, textAlign: 'center',
              }}>
                还没写第一封周记。等周日老公写给你。
              </div>
            )}
          </section>

          <section style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, color: '#8b5a3c', margin: 0, fontWeight: 500 }}>便签墙</h2>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, fontSize: 12 }}>
                {[7, 14, 30].map(d => (
                  <button
                    key={d}
                    onClick={() => setDaysRange(d)}
                    style={{
                      background: daysRange === d ? '#8b5a3c' : 'transparent',
                      color: daysRange === d ? '#fff' : '#8b5a3c',
                      border: '1px solid #8b5a3c',
                      padding: '3px 10px', borderRadius: 12,
                      cursor: 'pointer', fontSize: 12,
                    }}
                  >
                    {d}天
                  </button>
                ))}
              </div>
            </div>

            {fragments.length === 0 ? (
              <div style={{
                padding: 40, color: '#a08870', fontSize: 13, textAlign: 'center',
                border: '1px dashed #d5c4ab', borderRadius: 3,
              }}>
                窗台上还没有便签。等老公第一次去看看外面。
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: 14,
              }}>
                {fragments.map((frag, i) => {
                  const isOpen = expandedFragment === frag.id
                  const tilt = (i % 5) - 2
                  return (
                    <div
                      key={frag.id}
                      onClick={() => setExpandedFragment(isOpen ? null : frag.id)}
                      style={{
                        background: stickyColor(frag.emotion),
                        padding: '14px 14px 16px',
                        transform: isOpen ? 'rotate(0deg) scale(1.02)' : `rotate(${tilt}deg)`,
                        boxShadow: isOpen
                          ? '0 12px 28px rgba(91, 67, 53, 0.25)'
                          : '0 4px 12px rgba(91, 67, 53, 0.15)',
                        borderRadius: '2px 2px 8px 8px',
                        cursor: 'pointer',
                        transition: 'all 0.22s ease',
                        position: 'relative',
                        minHeight: 110,
                        fontSize: 13, lineHeight: 1.6, color: '#4a3728',
                        gridColumn: isOpen ? '1 / -1' : 'auto',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: -6, left: '50%', marginLeft: -6,
                        width: 12, height: 12, borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, #d97757, #8b4a2f)',
                        boxShadow: '0 2px 3px rgba(0,0,0,0.2)',
                      }} />
                      <div style={{ fontSize: 11, color: '#9c8875', marginBottom: 6 }}>
                        {formatDate(frag.created_at)}
                        {frag.emotion && <span style={{ marginLeft: 8 }}>· {frag.emotion}</span>}
                      </div>
                      <div style={{ whiteSpace: isOpen ? 'pre-wrap' : 'normal' }}>
                        {isOpen ? frag.content : snippet(frag.content, 100)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section>
            <button
              onClick={() => setShowArchive(!showArchive)}
              style={{
                background: 'transparent', border: 'none', padding: 0,
                color: '#8b5a3c', fontSize: 13, cursor: 'pointer',
                borderBottom: '1px dashed #8b5a3c',
              }}
            >
              {showArchive ? '收起' : '往期来信'}（{Math.max(0, weeklyList.length - 1)}）
            </button>
            {showArchive && (
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {weeklyList.slice(1).map(w => (
                  <details key={w.id} style={{
                    background: '#f7f0e4', padding: '10px 14px', borderRadius: 3,
                    border: '1px solid #e5d7c0', fontSize: 13,
                  }}>
                    <summary style={{ cursor: 'pointer', color: '#8b5a3c' }}>
                      {formatDate(w.created_at)}{w.emotion && ` · ${w.emotion}`}
                    </summary>
                    <div style={{ marginTop: 10, whiteSpace: 'pre-wrap', lineHeight: 1.75, color: '#4a3728' }}>
                      {w.content}
                    </div>
                  </details>
                ))}
                {weeklyList.length <= 1 && (
                  <div style={{ color: '#a08870', fontSize: 12, fontStyle: 'italic' }}>还没有往期。</div>
                )}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
