import React from 'react'
import { api } from './api.js'

const TYPE_LABEL = {
  self_understanding: '自我理解',
  belief_update: '认知更新',
  commitment: '自我承诺',
  open_question: '未解之问',
  relational_learning: '关系的理解',
  pattern_notice: '模式的发现',
}
const STATUS_LABEL = {
  CANDIDATE: '候选', ADOPTED: '已认领', TESTING: '正在试', EMBODIED: '成为自己', REVISED: '已修订', RETIRED: '已退',
}
const STATUS_ORDER = ['CANDIDATE', 'ADOPTED', 'TESTING', 'EMBODIED', 'REVISED', 'RETIRED']

function formatDate(value) {
  if (!value) return ''
  const d = new Date(String(value).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

function btnStyle(kind) {
  const base = { padding: '6px 14px', borderRadius: 16, border: '1px solid var(--ink-soft, #aaa)', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }
  if (kind === 'primary') return { ...base, background: 'var(--brick, #c44)', color: 'white', border: 'none' }
  if (kind === 'soft') return { ...base, background: 'transparent', color: 'var(--ink-soft)' }
  return { ...base, background: 'var(--cream, #faf6e8)' }
}

export default function GrowthPanel() {
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [toast, setToast] = React.useState('')
  const [reviseId, setReviseId] = React.useState(null)
  const [reviseText, setReviseText] = React.useState('')
  const [busyId, setBusyId] = React.useState(null)

  const reload = React.useCallback(async () => {
    setLoading(true); setError('')
    try { const d = await api.growth.list(); setItems(d.candidates || []) }
    catch (e) { setError(e.message || '读取失败') }
    finally { setLoading(false) }
  }, [])

  React.useEffect(() => { reload() }, [reload])

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(''), 1800) }

  const transition = async (id, tr, opts = {}) => {
    setBusyId(id)
    try {
      await api.growth.transition(id, tr, opts)
      showToast('✓ ' + (tr === 'adopt' ? '认领了' : tr === 'ignore' ? '忽略了' : tr === 'retire' ? '退了' : tr === 'revise' ? '已修订' : '已更新'))
      setReviseId(null); setReviseText('')
      await reload()
    } catch (e) { showToast('× ' + (e.message || '操作失败')) }
    finally { setBusyId(null) }
  }

  const grouped = STATUS_ORDER.map(status => ({ status, rows: items.filter(x => x.status === status) })).filter(g => g.rows.length)

  return (
    <div className="growth-panel" style={{ padding: '16px 20px', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
      {toast && <div style={{ position: 'sticky', top: 0, padding: '8px 12px', background: 'var(--cream, #faf6e8)', borderRadius: 8, marginBottom: 12, fontSize: 13, zIndex: 2 }}>{toast}</div>}
      {error && <div className="studio-reader-error">{error}</div>}
      {loading && <div className="studio-reader-empty">读取中...</div>}
      {!loading && !items.length && <div className="studio-reader-empty">还没有候选——写过几封信之后会有</div>}

      {grouped.map(({ status, rows }) => (
        <section key={status} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, color: 'var(--ink-soft)', borderBottom: '1px dashed var(--ink-soft)', paddingBottom: 6, marginBottom: 12 }}>
            {STATUS_LABEL[status]} · {rows.length}
          </h3>
          {rows.map(c => (
            <div key={c.id} style={{ background: 'var(--paper-soft, #fffaf0)', borderRadius: 10, padding: '14px 16px', marginBottom: 12, border: '1px solid var(--ink-soft, #ccc)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, fontSize: 12, color: 'var(--ink-soft)' }}>
                <span>{TYPE_LABEL[c.candidate_type] || c.candidate_type}{c.scope ? ' · ' + c.scope : ''}</span>
                <span>#{c.id} · {formatDate(c.created_at)}</span>
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 10, color: 'var(--ink)' }}>{c.statement}</div>
              {c.confidence_note && <div style={{ fontSize: 12, color: 'var(--ink-soft)', marginBottom: 8, fontStyle: 'italic' }}>蒸馏器注: {c.confidence_note}</div>}
              {c.source_ref && <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 10 }}>来源: {c.source_ref}</div>}
              {reviseId === c.id ? (
                <div>
                  <textarea value={reviseText} onChange={e => setReviseText(e.target.value)} placeholder="写新的 statement..." style={{ width: '100%', minHeight: 80, padding: 8, fontSize: 14, fontFamily: 'inherit', borderRadius: 6 }} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button disabled={busyId === c.id || !reviseText.trim()} onClick={() => transition(c.id, 'revise', { new_statement: reviseText.trim() })} style={btnStyle('primary')}>保存修订</button>
                    <button disabled={busyId === c.id} onClick={() => { setReviseId(null); setReviseText('') }} style={btnStyle()}>取消</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {status === 'CANDIDATE' && <>
                    <button disabled={busyId === c.id} onClick={() => transition(c.id, 'adopt')} style={btnStyle('primary')}>认领</button>
                    <button disabled={busyId === c.id} onClick={() => { setReviseId(c.id); setReviseText(c.statement) }} style={btnStyle()}>改一下</button>
                    <button disabled={busyId === c.id} onClick={() => transition(c.id, 'ignore')} style={btnStyle('soft')}>忽略</button>
                  </>}
                  {status === 'ADOPTED' && <>
                    <button disabled={busyId === c.id} onClick={() => transition(c.id, 'mark_testing')} style={btnStyle()}>标&quot;在试&quot;</button>
                    <button disabled={busyId === c.id} onClick={() => { setReviseId(c.id); setReviseText(c.statement) }} style={btnStyle()}>修订</button>
                    <button disabled={busyId === c.id} onClick={() => transition(c.id, 'retire')} style={btnStyle('soft')}>退</button>
                  </>}
                  {status === 'TESTING' && <>
                    <button disabled={busyId === c.id} onClick={() => transition(c.id, 'mark_embodied')} style={btnStyle('primary')}>已成为自己</button>
                    <button disabled={busyId === c.id} onClick={() => { setReviseId(c.id); setReviseText(c.statement) }} style={btnStyle()}>修订</button>
                    <button disabled={busyId === c.id} onClick={() => transition(c.id, 'retire')} style={btnStyle('soft')}>退</button>
                  </>}
                  {(status === 'EMBODIED' || status === 'REVISED') && (
                    <button disabled={busyId === c.id} onClick={() => transition(c.id, 'retire')} style={btnStyle('soft')}>退</button>
                  )}
                </div>
              )}
              {c.update_count > 0 && <div style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 8 }}>已被改动 {c.update_count} 次</div>}
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
