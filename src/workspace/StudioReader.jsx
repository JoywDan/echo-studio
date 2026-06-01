import React from 'react'
import { api } from './api.js'
import { Icon, Heart, Sparkle } from './doodles.jsx'
import { TornCard, Tape } from './components.jsx'

const MODULES = {
  diary: {
    title: 'Echo 写的日记',
    sub: '桌边留下的每日页',
    icon: 'book',
    tint: 'yellow',
    empty: '还没有找到日记页',
  },
  letters: {
    title: 'Echo 写给自己的信',
    sub: '写给未来自己的信',
    icon: 'send',
    tint: 'pink',
    empty: '还没有找到信',
  },
  travel: {
    title: 'Echo 带回的见闻',
    sub: '每周一次出门记录',
    icon: 'image',
    tint: 'blue',
    empty: '还没有旅行记录',
  },
  wander: {
    title: '路拾遗梦',
    sub: '散步、梦与旧周记',
    icon: 'moon',
    tint: 'green',
    empty: '还没有拾到碎片',
  },
}

const KIND_LABEL = {
  walk: '散步拾遗',
  dream: '梦',
  weekly: '周记',
}

function formatDate(value) {
  if (!value) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return value
  const d = new Date(String(value).replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
}

function preview(text = '', length = 96) {
  const compact = String(text).replace(/\s+/g, ' ').trim()
  return compact.length > length ? `${compact.slice(0, length)}...` : compact
}

function normalizeList(module, data) {
  if (module === 'diary') {
    const entries = data.entries || data.dates || []
    return entries.map((date) => ({ id: date, date, content: '' }))
  }
  if (module === 'letters') return data.letters || data.items || []
  if (module === 'travel') return data.entries || data.items || []
  if (module === 'wander') return data.items || []
  return []
}

function itemId(module, item) {
  if (module === 'diary') return item.date || item.id
  return item.id || item.created_at || item.date
}

function itemTitle(module, item) {
  if (module === 'diary') return formatDate(item.date || item.id)
  if (module === 'travel') return item.destination || item.title || formatDate(item.created_at || item.date)
  if (module === 'wander') return `${KIND_LABEL[item.kind] || '拾遗'} · ${formatDate(item.created_at)}`
  return formatDate(item.created_at || item.date) || preview(item.content, 24) || '一封信'
}

function itemSub(module, item) {
  if (module === 'diary') return '打开这一天'
  if (module === 'travel') return item.summary || preview(item.content || item.note || '', 68)
  if (module === 'wander') return preview(item.content, 68)
  return preview(item.content, 68)
}

function detailContent(module, detail) {
  if (!detail) return ''
  if (module === 'travel') return detail.content || detail.body || detail.note || ''
  return detail.content || detail.body || ''
}

export default function StudioReader({ module, onClose }) {
  const meta = MODULES[module] || MODULES.diary
  const [items, setItems] = React.useState([])
  const [selected, setSelected] = React.useState(null)
  const [detail, setDetail] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [detailLoading, setDetailLoading] = React.useState(false)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setItems([])
    setSelected(null)
    setDetail(null)
    setDetailOpen(false)

    const loader = {
      diary: () => api.diary.list(),
      letters: () => api.selfLetters(),
      travel: () => api.travel.list(),
      wander: () => api.wander(),
    }[module]

    Promise.resolve(loader ? loader() : { items: [] })
      .then((data) => {
        if (cancelled) return
        const next = normalizeList(module, data)
        setItems(next)
        if (next.length) setSelected(itemId(module, next[0]))
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || '读取失败')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [module])

  React.useEffect(() => {
    if (!selected) return
    let cancelled = false
    const current = items.find((item) => itemId(module, item) === selected)
    setDetailLoading(true)
    setError('')

    const loadDetail = async () => {
      if (module === 'diary') return api.diary.get(selected)
      if (module === 'travel') return api.travel.get(selected)
      return current
    }

    loadDetail()
      .then((data) => {
        if (!cancelled) setDetail(data || current || null)
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || '读取失败')
      })
      .finally(() => {
        if (!cancelled) setDetailLoading(false)
      })

    return () => { cancelled = true }
  }, [module, selected, items])

  const selectedItem = items.find((item) => itemId(module, item) === selected)
  const text = detailContent(module, detail || selectedItem)

  return (
    <div className="studio-reader" role="dialog" aria-modal="true" aria-label={meta.title}>
      <div className="studio-reader-shell paper-bg">
        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={onClose} aria-label="返回 Workspace">
            <Icon name="back" size={19} color="var(--ink)" />
          </button>
          <div className={`studio-reader-mark tint-${meta.tint}`}>
            <Icon name={meta.icon} size={22} color="var(--vermillion)" />
          </div>
          <div className="studio-reader-title">
            <h2>{meta.title}<Heart size={15} color="var(--vermillion-l)" fill="var(--vermillion-l)" /></h2>
            <p>{meta.sub}</p>
          </div>
          <span className="studio-reader-count">{items.length}</span>
        </header>

        {error && <div className="studio-reader-error">{error}</div>}

        <div className={`studio-reader-body${detailOpen ? ' is-detail-open' : ''}`}>
          <aside className="studio-reader-list" aria-label="条目列表">
            {loading ? (
              <div className="studio-reader-empty">翻页中...</div>
            ) : items.length === 0 ? (
              <div className="studio-reader-empty">{meta.empty}</div>
            ) : items.map((item) => {
              const id = itemId(module, item)
              const active = id === selected
              return (
                <button key={id} className={`studio-reader-item${active ? ' is-active' : ''}`} onClick={() => { setSelected(id); setDetailOpen(true) }}>
                  <span className="studio-reader-item-title">{itemTitle(module, item)}</span>
                  <span className="studio-reader-item-sub">{itemSub(module, item)}</span>
                </button>
              )
            })}
          </aside>

          <main className="studio-reader-detail">
            <button className="studio-reader-detail-back" onClick={() => setDetailOpen(false)} aria-label="返回列表">
              <Icon name="back" size={16} color="var(--ink)" />
              <span>返回列表</span>
            </button>
            <TornCard className="studio-reader-paper">
              <Tape />
              {detailLoading ? (
                <div className="studio-reader-empty">正在展开...</div>
              ) : selectedItem || detail ? (
                <>
                  <div className="studio-reader-meta">
                    <Sparkle size={15} color="var(--vermillion)" />
                    <span>{itemTitle(module, detail || selectedItem)}</span>
                    {module === 'wander' && (detail || selectedItem)?.kind && (
                      <span className="studio-kind">{KIND_LABEL[(detail || selectedItem).kind]}</span>
                    )}
                  </div>
                  <article className="studio-reader-content">{text || '这一页是空白的。'}</article>
                </>
              ) : (
                <div className="studio-reader-empty">{meta.empty}</div>
              )}
            </TornCard>
          </main>
        </div>
      </div>
    </div>
  )
}
