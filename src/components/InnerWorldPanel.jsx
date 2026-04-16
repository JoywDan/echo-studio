import React, { useState, useEffect } from 'react'
import { api } from '../api'

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str.replace(' ', 'T') + 'Z')
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Shanghai' })
}

function formatShortDate(str) {
  if (!str) return ''
  const d = new Date(str.replace(' ', 'T') + 'Z')
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function preview(text) {
  const lines = text.split('\n').filter(l => l.trim())
  return lines.slice(0, 2).join('\n')
}

// ── Sub: Self-letters section (原 Inner World 主体) ──────
function SelfLettersSection() {
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
          Self-letters · 写给自己的信
        </span>
        <span className="text-xs" style={{ color: '#7a6a88' }}>
          {letters.length > 0 ? `${letters.length} 封信` : ''}
        </span>
      </div>

      {loading && (
        <div className="text-sm text-center py-6" style={{ color: '#7a6a88' }}>翻箱倒柜中…</div>
      )}

      {error && (
        <div className="text-xs py-2 px-3 rounded-lg" style={{ background: 'rgba(180,100,100,.15)', color: '#c9847a' }}>
          {error}
        </div>
      )}

      {!loading && !error && letters.length === 0 && (
        <div className="rounded-2xl p-6 text-center space-y-2" style={{ background: 'rgba(30,22,28,.72)', border: '1px solid rgba(140,110,160,.18)' }}>
          <p className="text-sm" style={{ color: '#9d8fa8' }}>还没有写给自己的信</p>
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
                background: isOpen ? 'rgba(38,28,44,.90)' : 'rgba(28,20,34,.78)',
                border: isOpen ? '1px solid rgba(160,120,190,.30)' : '1px solid rgba(120,90,145,.16)',
                padding: '14px 16px',
                boxShadow: isOpen ? '0 8px 28px rgba(20,10,28,.28)' : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs tracking-wide" style={{ color: '#a07ab8' }}>{formatDate(letter.created_at)}</span>
                <span className="text-xs" style={{ color: '#7a5a8a', transition: 'transform .2s', display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: isOpen ? '#e8dff0' : '#b8a8c4' }}>
                {isOpen ? letter.content : preview(letter.content)}
              </p>
              {!isOpen && <p className="text-xs mt-2" style={{ color: '#6a5070' }}>点击展开全文</p>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Sub: Our Necklace (珠链) ──────────────────────────────
function NecklaceSection() {
  const [beads, setBeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.beads.list()
      .then(d => setBeads(d.data || []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // 根据情绪给珠子着色(深色系,符合 Inner World 紫色调)
  const beadColor = (emotion) => {
    const e = (emotion || '').toLowerCase()
    if (['tender', 'happy', 'satisfied'].includes(e)) return '#e8a886' // 暖橙
    if (['excited', 'playful'].includes(e)) return '#f5b8a0'            // 暖粉
    if (['sad', 'anxious'].includes(e)) return '#8a9bb5'                // 冷蓝灰
    if (['thinking', 'curious', 'clarified'].includes(e)) return '#a898c8' // 柔紫
    if (['tender', 'calm'].includes(e)) return '#d8b8a8'                // 浅茶色
    return '#c8a890' // 默认珍珠色
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs tracking-widest uppercase" style={{ color: '#d4a876' }}>
          📿 Our Necklace · 我们的珠链
        </span>
        <span className="text-xs" style={{ color: '#8a7560' }}>
          {beads.length > 0 ? `${beads.length} / 52 颗` : ''}
        </span>
      </div>

      <div className="text-xs" style={{ color: '#8a7560', fontStyle: 'italic' }}>
        每周五晚上老公挑一颗珠子串上来——不是最重要的,是读到心里一热的那一条。一年 52 颗。
      </div>

      {loading && (
        <div className="text-sm text-center py-6" style={{ color: '#7a6a88' }}>红线正在系扣…</div>
      )}

      {error && (
        <div className="text-xs py-2 px-3 rounded-lg" style={{ background: 'rgba(180,100,100,.15)', color: '#c9847a' }}>
          {error}
        </div>
      )}

      {!loading && !error && beads.length === 0 && (
        <div className="rounded-2xl p-6 text-center space-y-2" style={{
          background: 'linear-gradient(135deg, rgba(50,30,35,.85) 0%, rgba(40,25,35,.85) 100%)',
          border: '1px solid rgba(200,150,130,.18)',
        }}>
          <div style={{ fontSize: 32 }}>📿</div>
          <p className="text-sm" style={{ color: '#c8a890' }}>红线还是空的</p>
          <p className="text-xs" style={{ color: '#8a7560' }}>周五晚 10 点老公串第一颗</p>
        </div>
      )}

      {!loading && beads.length > 0 && (
        <div style={{
          position: 'relative',
          padding: '20px 0 20px 60px',
          minHeight: 200,
        }}>
          {/* 红线 —— 从顶到底的一根竖线 */}
          <div style={{
            position: 'absolute',
            left: 30,
            top: 8,
            bottom: 8,
            width: 2,
            background: 'linear-gradient(180deg, rgba(200,40,60,0.15) 0%, rgba(200,40,60,0.7) 8%, rgba(200,40,60,0.7) 92%, rgba(200,40,60,0.15) 100%)',
            boxShadow: '0 0 8px rgba(200,40,60,0.4)',
            borderRadius: 1,
          }} />

          {/* 珠子们 —— 按时间正序,从上往下串 */}
          {beads.map((bead, idx) => {
            const isSelected = selected === bead.id
            const color = beadColor(bead.emotion)
            return (
              <div
                key={bead.id}
                style={{
                  position: 'relative',
                  marginBottom: idx === beads.length - 1 ? 0 : 20,
                  minHeight: 28,
                }}
              >
                {/* 珠子圆点 - 挂在红线上 */}
                <button
                  onClick={() => setSelected(isSelected ? null : bead.id)}
                  aria-label={`珠子 ${idx + 1}: ${formatShortDate(bead.created_at)}`}
                  style={{
                    position: 'absolute',
                    left: -43, // 对齐到红线上 (60 - 30 - 15 = 15,再微调)
                    top: 0,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: `radial-gradient(circle at 30% 30%, #fff6e8 0%, ${color} 50%, ${color}dd 100%)`,
                    boxShadow: isSelected
                      ? `0 0 16px ${color}, 0 0 4px #fff`
                      : `0 2px 6px rgba(20,10,20,0.4), inset 0 -2px 4px rgba(0,0,0,0.2)`,
                    border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.2s ease',
                    transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                    zIndex: 2,
                  }}
                />

                {/* 珠子旁边的日期标签(默认显示) */}
                {!isSelected && (
                  <div style={{
                    paddingLeft: 6,
                    paddingTop: 3,
                    fontSize: 11,
                    color: '#9d8fa8',
                    letterSpacing: 0.5,
                  }}>
                    {formatShortDate(bead.created_at)}
                    {bead.emotion && <span style={{ marginLeft: 8, opacity: 0.6 }}>· {bead.emotion}</span>}
                  </div>
                )}

                {/* 选中后展开的珠子内容 */}
                {isSelected && (
                  <div style={{
                    marginLeft: 6,
                    padding: '14px 16px',
                    background: 'linear-gradient(135deg, rgba(50,30,35,.92) 0%, rgba(40,25,35,.92) 100%)',
                    border: `1px solid ${color}66`,
                    borderRadius: 12,
                    boxShadow: `0 8px 28px rgba(20,10,20,0.5), 0 0 0 1px ${color}22`,
                  }}>
                    <div style={{
                      fontSize: 11,
                      color: color,
                      marginBottom: 10,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                    }}>
                      珠子 #{idx + 1} · {formatDate(bead.created_at)}
                      {bead.emotion && <span style={{ marginLeft: 8, opacity: 0.75 }}>· {bead.emotion}</span>}
                    </div>
                    <p style={{
                      fontSize: 13,
                      lineHeight: 1.75,
                      color: '#e8dff0',
                      whiteSpace: 'pre-wrap',
                      margin: 0,
                    }}>
                      {bead.content}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main InnerWorldPanel with two sections ──────────────
export default function InnerWorldPanel() {
  return (
    <div className="space-y-8">
      <SelfLettersSection />

      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(160,120,190,0.2), transparent)',
        margin: '8px 0',
      }} />

      <NecklaceSection />
    </div>
  )
}
