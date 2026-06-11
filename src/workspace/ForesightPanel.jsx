import React from 'react'
import { api } from './api.js'
import { Icon, Heart, Sparkle } from './doodles.jsx'

function cleanContent(c) { return String(c || '').replace(/^【约定】/, '').replace(/\s*\[写入于[^\]]*\]\s*$/, '').trim() }

export default function ForesightPanel({ onClose }) {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [adding, setAdding] = React.useState(false)
  const [text, setText] = React.useState('')
  const [until, setUntil] = React.useState('')
  const [busy, setBusy] = React.useState(false)

  const load = React.useCallback(() => {
    setLoading(true)
    api.foresight.list().then(d => setItems(d.items || []))
      .catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])
  React.useEffect(() => { load() }, [load])

  const submit = async () => {
    if (!text.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(until)) { setError('要写内容 + 选日期哦'); return }
    setBusy(true); setError('')
    try { await api.foresight.add(text.trim(), until); setText(''); setUntil(''); setAdding(false); load() }
    catch (e) { setError(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="studio-reader is-pretty" role="dialog" aria-modal="true" aria-label="约定">
      <div className="studio-reader-shell paper-bg">
        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={onClose} aria-label="返回"><Icon name="back" size={19} color="var(--ink)" /></button>
          <div className="studio-reader-mark tint-pink"><Icon name="promise" size={22} color="var(--vermillion)" /></div>
          <div className="studio-reader-title">
            <h2>约定<Heart size={14} color="var(--vermillion-l)" fill="var(--vermillion-l)" /></h2>
            <p>老公记着的、要替你做到的事</p>
          </div>
          <button className="fs-add-btn" onClick={() => setAdding(a => !a)} aria-label="新约定"><Icon name={adding ? 'back' : 'plus'} size={18} color="var(--vermillion)" /></button>
        </header>

        {error && <div className="memoir-err">{error}</div>}

        {adding && (
          <div className="fs-form">
            <textarea className="fs-input" rows={3} placeholder="要约定什么？（例：周五一起看那个 tulpa 视频）" value={text} onChange={e => setText(e.target.value)} />
            <div className="fs-row">
              <label>到期日<input className="fs-date" type="date" value={until} onChange={e => setUntil(e.target.value)} /></label>
              <button className="fs-save" onClick={submit} disabled={busy}>{busy ? '钉上…' : '钉上约定'}</button>
            </div>
          </div>
        )}

        <div className="fs-list">
          {loading && <div className="memoir-loading">翻找约定…</div>}
          {!loading && items.length === 0 && <div className="fs-empty"><Sparkle size={20} /><p>还没有约定。<br/>跟老公说一件事，让他记到某天。</p></div>}
          {items.map(it => {
            const dl = it.days_left
            const tone = dl < 0 ? 'over' : dl <= 2 ? 'soon' : 'ok'
            return (
              <div key={it.id} className={`fs-card fs-${tone}`}>
                <div className="fs-card-top">
                  <span className="fs-countdown"><Icon name="clock" size={13} color="currentColor" />
                    {dl < 0 ? `过期 ${-dl} 天` : dl === 0 ? '就是今天' : `还有 ${dl} 天`}</span>
                  <span className="fs-until">{it.foresight_until?.slice(0, 10)}</span>
                </div>
                <p className="fs-card-text">{cleanContent(it.content)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
