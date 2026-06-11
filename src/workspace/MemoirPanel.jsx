import React from 'react'
import { api } from './api.js'
import { Icon, Heart, Sparkle, Star } from './doodles.jsx'

const MONTH_CN = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
function ymLabel(ym) { const [y, m] = ym.split('-'); return `${y}年${MONTH_CN[+m]}` }
function densityHue(d) { if (d == null) return 'var(--paper-2,#efe6d2)'; const t = Math.max(0, Math.min(1, d)); return `hsl(${18 + (1 - t) * 28} ${50 + t * 30}% ${88 - t * 14}%)` }

export default function MemoirPanel({ onClose }) {
  const [months, setMonths] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [open, setOpen] = React.useState(null)        // ym 展开
  const [tab, setTab] = React.useState('chapter')      // chapter | days
  const [chapter, setChapter] = React.useState('')
  const [days, setDays] = React.useState([])
  const [inner, setInner] = React.useState(false)

  React.useEffect(() => {
    let c = false
    api.memoir.overview().then(d => { if (!c) { setMonths((d.months || []).reverse()) } })
      .catch(e => !c && setError(e.message)).finally(() => !c && setLoading(false))
    return () => { c = true }
  }, [])

  const openMonth = async (ym) => {
    setOpen(ym); setInner(true); setTab('chapter'); setChapter(''); setDays([])
    try {
      const c = await api.memoir.chapter(ym).catch(() => null)
      setChapter(c?.content || '')
      const d = await api.memoir.days(ym)
      setDays(d.days || [])
    } catch (e) { setError(e.message) }
  }

  return (
    <div className="studio-reader is-pretty" role="dialog" aria-modal="true" aria-label="回忆录">
      <div className="studio-reader-shell paper-bg">
        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={() => inner ? setInner(false) : onClose()} aria-label="返回">
            <Icon name="back" size={19} color="var(--ink)" />
          </button>
          <div className="studio-reader-mark tint-cream"><Icon name="scroll" size={22} color="var(--vermillion)" /></div>
          <div className="studio-reader-title">
            <h2>{inner ? ymLabel(open) : '回忆录'}<Heart size={14} color="var(--vermillion-l)" fill="var(--vermillion-l)" /></h2>
            <p>{inner ? '我们的故事，一章一章' : '把日子织成的书'}</p>
          </div>
        </header>

        {error && <div className="memoir-err">{error}</div>}
        {loading && <div className="memoir-loading">翻开书页…</div>}

        {!inner && !loading && (
          <div className="memoir-shelf">
            {months.map(m => (
              <button key={m.ym} className="memoir-spine" onClick={() => openMonth(m.ym)}
                style={{ background: densityHue(m.month_summary ? 0.6 : 0.35) }}>
                <div className="memoir-spine-ym">{ymLabel(m.ym)}</div>
                <div className="memoir-spine-meta">
                  {m.has_chapter && <span className="memoir-badge"><Sparkle size={11} /> 章节</span>}
                  <span className="memoir-days">{m.days} 天</span>
                </div>
                {m.month_summary && <p className="memoir-spine-sum">{m.month_summary.slice(0, 54)}…</p>}
              </button>
            ))}
          </div>
        )}

        {inner && (
          <>
            <div className="memoir-tabs">
              <button className={tab === 'chapter' ? 'on' : ''} onClick={() => setTab('chapter')} disabled={!chapter}>📖 章节</button>
              <button className={tab === 'days' ? 'on' : ''} onClick={() => setTab('days')}>📅 逐日</button>
            </div>
            <div className="memoir-body">
              {tab === 'chapter' && (chapter
                ? <article className="memoir-chapter">{chapter.split('\n').filter(Boolean).map((p, i) =>
                    p.startsWith('#') ? null : <p key={i}>{p}</p>)}</article>
                : <div className="memoir-loading">这个月还没有成章…</div>)}
              {tab === 'days' && (
                <div className="memoir-days-list">
                  {days.length === 0 && <div className="memoir-loading">没有日摘要</div>}
                  {days.map(d => (
                    <div key={d.date} className="memoir-day">
                      <div className="memoir-day-dot" style={{ background: densityHue(d.emotion_density) }} />
                      <div className="memoir-day-c">
                        <div className="memoir-day-date">{d.date.slice(5)}</div>
                        <p>{d.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
