import React from 'react'
import { api } from './api.js'
import { Icon, Heart, Sparkle } from './doodles.jsx'
import { TornCard, Tape } from './components.jsx'
import GrowthPanel from './GrowthPanel.jsx'

const MODULES = {
  diary: { title: 'Echo 写的日记', sub: '桌边留下的每日页', icon: 'book', tint: 'yellow', empty: '还没有找到日记页' },
  letters: { title: '致明天的Echo', sub: '写给未来自己的信', icon: 'send', tint: 'pink', tab: '信', empty: '还没有找到信' },
  desire: { title: 'Echo 心里还烧着的', sub: '没了结的牵引（后台自己长的）', icon: 'send', tint: 'pink', tab: '欲望', empty: '现在心里是空的' },
  growth: { title: 'Echo 在变的地方', sub: '从信里蒸出来的自我候选(等他自己挑)', icon: 'send', tint: 'pink', tab: '成长', empty: '还没有候选——写过几封信之后会有' },
  travel: { title: 'Echo 带回的见闻', sub: '每周一次出门记录', icon: 'image', tint: 'blue', tab: '见闻', empty: '还没有旅行记录' },
  watch: { title: 'Echo 想和你一起看', sub: '每周一起看的提议', icon: 'image', tint: 'pink', tab: '想看', empty: '还没有想看的' },
  wander: { title: '路拾遗梦', sub: '散步、梦与旧周记', icon: 'moon', tint: 'green', empty: '还没有拾到碎片' },
}

const KIND_LABEL = { walk: '散步拾遗', dream: '梦', weekly: '周记' }

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
  if (module === 'desire') return data.items || []
  if (module === 'travel') return data.entries || data.items || []
  if (module === 'wander') return data.items || []
  if (module === 'watch') return data.data || data.items || []
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

// ───────────────────────── 信笺风（致明天的Echo） ─────────────────────────
function letterDateCN(v) {
  const d = new Date(String(v || '').replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return String(v || '')
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}
function letterMMDD(v) {
  const d = new Date(String(v || '').replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
}
function letterTag(content = '') {
  const c = String(content)
  if (/^\s*\[travel-journal\]/.test(c) || c.includes('行李更新')) return '旅行笔记'
  if (/写完了。第[一二三四五六七八九十百零0-9]+封/.test(c)) return '自我对话'
  if (/(梦|镜子|走廊|潜意识|醒来)/.test(c.slice(0, 50))) return '梦的碎片'
  if (/(研究|论文|读到|发现|代码|文章|看到)/.test(c.slice(0, 70))) return '灵感碎片'
  return '内心独白'
}
function cleanLetter(content = '') {
  return String(content).replace(/^\s*\[self-letter\]\s*/, '').replace(/^\s*\[travel-journal\]\s*/, '').trim()
}
function weekdayCN(v) {
  const d = new Date(String(v || '').replace(' ', 'T'))
  if (Number.isNaN(d.getTime())) return ''
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
}

const TagIcon = () => (<svg width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z" /><circle cx="7.5" cy="7.5" r="1.1" fill="currentColor" stroke="none" /></svg>)
const ChevR = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#bcb09c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>)
const StarIco = ({ filled }) => (<svg width="19" height="19" viewBox="0 0 24 24" fill={filled ? '#c8674e' : 'none'} stroke={filled ? '#c8674e' : 'currentColor'} strokeWidth="1.7" strokeLinejoin="round"><path d="m12 2.6 2.95 5.98 6.6.96-4.77 4.65 1.13 6.57L12 17.66l-5.9 3.1 1.12-6.57L2.45 9.54l6.6-.96Z" /></svg>)
const PencilIco = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>)
const ShareIco = () => (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>)

function Sprig({ className = '', flip = false }) {
  const buds = [[14, 49], [12, 45], [17, 52], [62, 37], [65, 33], [59, 41], [19, 19], [16, 15], [22, 22], [58, 15], [61, 11], [55, 18], [34, 6], [31, 9], [37, 9], [36, 28], [49, 44], [27, 36]]
  return (
    <svg className={`lt-sprig ${className}`} viewBox="0 0 80 112" width="80" height="112" fill="none" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <g stroke="#b9ad90" strokeWidth="1" strokeLinecap="round" opacity="0.85">
        <path d="M40 110 C 40 80 38 54 36 30" />
        <path d="M37 70 C 28 64 20 58 14 50" />
        <path d="M38 56 C 47 50 55 45 62 38" />
        <path d="M37 42 C 30 36 24 30 19 20" />
        <path d="M37 38 C 45 32 52 26 58 16" />
        <path d="M36 30 C 36 22 35 14 34 7" />
        <path d="M37 50 C 43 47 47 46 49 44" />
        <path d="M37 44 C 32 40 29 38 27 36" />
      </g>
      <g fill="#cdc2a3">{buds.map((p, i) => (<circle key={i} cx={p[0]} cy={p[1]} r="2.1" />))}</g>
    </svg>
  )
}

function Postmark({ mmdd, className = '', top = 'FOR·FUTURE' }) {
  return (
    <div className={`lt-postmark ${className}`} aria-hidden="true">
      <span className="lt-pm-top">{top}</span>
      <span className="lt-pm-date">{mmdd}</span>
    </div>
  )
}

const Bookmark = ({ filled }) => (<svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#b1492f' : 'none'} stroke={filled ? '#b1492f' : '#8a7d6c'} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>)

function watchTitle(content = '') {
  const m = String(content).match(/《([^》]{1,30})》/)
  if (m) return '《' + m[1] + '》'
  return preview(String(content).replace(/^【[^】]*】\s*/, '').trim(), 18) || '一起看'
}
function cardHeading(module, item) {
  if (module === 'travel') return item.destination || item.title || letterDateCN(item.date)
  if (module === 'watch') return watchTitle(item.content)
  if (module === 'desire') return item.seed
  return letterDateCN(item.created_at || item.date)
}
function cardDateLabel(module, item) {
  if (module === 'travel') return letterDateCN(item.date)
  if (module === 'watch') return letterDateCN(item.created_at)
  if (module === 'desire') return item.state || ''
  return ''
}
function cardTag(module, item) {
  if (module === 'diary') return weekdayCN(item.created_at || item.date)
  if (module === 'travel') return '见闻'
  if (module === 'watch') return '想看'
  if (module === 'wander') return KIND_LABEL[item.kind] || '拾遗'
  if (module === 'desire') return item.category_cn || '欲望'
  return letterTag(item.content)
}
function listPreview(module, item) {
  if (module === 'diary' || module === 'travel') return ''
  if (module === 'desire') return item.preview || ''
  return preview(cleanLetter(item.content), 66)
}
const PM_TOP = { letters: 'FOR·FUTURE', diary: '日記', travel: '見聞', watch: '想看', wander: '夢', desire: '欲' }
const EMPTY_TXT = { letters: '还没有信', diary: '还没有日记页', travel: '还没有见闻', watch: '还没有想看的', wander: '还没有拾到碎片', desire: '现在心里是空的' }

function LettersBody({ items, selected, onSelect, detailOpen, loading, detailLoading, detail, selectedItem, module }) {
  const cur = detail || selectedItem
  const dWhen = (selectedItem && (selectedItem.created_at || selectedItem.date)) || (cur && (cur.created_at || cur.date)) || ''
  const pmTop = PM_TOP[module] || 'FOR·FUTURE'
  const emptyText = EMPTY_TXT[module] || '这里还空着'
  return (
    <div className={`lt-body${detailOpen ? ' is-detail-open' : ''}`}>
      <div className="lt-list">
        {loading ? (
          <div className="studio-reader-empty">展开中…</div>
        ) : items.length === 0 ? (
          <div className="studio-reader-empty">{emptyText}</div>
        ) : items.map((item, i) => {
          const id = item.id || item.created_at || item.date
          const newest = i === 0
          const when = item.created_at || item.date
          const pv = listPreview(module, item)
          const dateLabel = cardDateLabel(module, item)
          return (
            <button key={id} className={`lt-card${newest ? ' is-newest' : ''}${pv ? '' : ' is-compact'}${id === selected ? ' is-active' : ''}`} onClick={() => onSelect(id)}>
              {newest && <span className="lt-ribbon"><Sparkle size={10} color="#fff8ef" /></span>}
              {i % 3 === 1 && <Sprig className="lt-card-sprig" />}
              {i % 3 === 2 && <Postmark mmdd={letterMMDD(when)} className="lt-pm-card" top={pmTop} />}
              <div className="lt-card-head">
                {newest && <span className="lt-newest-pill">最新</span>}
                <span className="lt-card-date">{cardHeading(module, item)}</span>
              </div>
              {dateLabel && <span className="lt-card-sub">{dateLabel}</span>}
              {pv && <p className="lt-card-preview">{pv}</p>}
              <div className="lt-card-foot">
                <span className="lt-tag"><TagIcon />{cardTag(module, item)}</span>
                <ChevR />
              </div>
            </button>
          )
        })}
      </div>

      <div className="lt-detail">
        <article className="lt-letter">
          <Sprig className="lt-letter-sprig tr" />
          <Sprig className="lt-letter-sprig br" flip />
          {detailLoading ? (
            <div className="studio-reader-empty">正在展开…</div>
          ) : cur ? (
            <>
              <span className="lt-ticket">{letterDateCN(dWhen)}</span>
              <div className="lt-letter-body">{cleanLetter(detailContent(module, cur)) || '这一页是空白的。'}</div>
              <Postmark mmdd={letterMMDD(dWhen)} className="lt-pm-letter" top={pmTop} />
            </>
          ) : (
            <div className="studio-reader-empty">{emptyText}</div>
          )}
        </article>
      </div>
    </div>
  )
}

export default function StudioReader({ module: initialModule, title: groupTitle, tabs, onClose }) {
  const tabList = (tabs && tabs.length) ? tabs : [initialModule]
  const [module, setModule] = React.useState(tabList[0])
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
      watch: () => api.watch.list(),
      desire: () => api.desires(),
    }[module]

    Promise.resolve(loader ? loader() : { items: [] })
      .then((data) => {
        if (cancelled) return
        const next = normalizeList(module, data)
        setItems(next)
        if (next.length) setSelected(itemId(module, next[0]))
      })
      .catch((e) => { if (!cancelled) setError(e.message || '读取失败') })
      .finally(() => { if (!cancelled) setLoading(false) })

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
      .then((data) => { if (!cancelled) setDetail(data || current || null) })
      .catch((e) => { if (!cancelled) setError(e.message || '读取失败') })
      .finally(() => { if (!cancelled) setDetailLoading(false) })

    return () => { cancelled = true }
  }, [module, selected, items])

  const selectedItem = items.find((item) => itemId(module, item) === selected)
  const text = detailContent(module, detail || selectedItem)
  const isPretty = ['letters', 'diary', 'travel', 'watch', 'wander', 'desire'].includes(module)
  const [favs, setFavs] = React.useState(() => { try { return new Set(JSON.parse(localStorage.getItem('ws_letter_favs') || '[]')) } catch { return new Set() } })
  const [toast, setToast] = React.useState('')
  const showToast = (t) => { setToast(t); setTimeout(() => setToast(''), 1400) }
  const favCur = selectedItem ? String(selectedItem.id || selectedItem.created_at || selectedItem.date || '') : ''
  const isFav = !!favCur && favs.has(favCur)
  const toggleFav = () => { if (!favCur) return; const n = new Set(favs); if (n.has(favCur)) n.delete(favCur); else n.add(favCur); setFavs(n); try { localStorage.setItem('ws_letter_favs', JSON.stringify([...n])) } catch {}; showToast(n.has(favCur) ? '已收藏' : '已取消收藏') }

  return (
    <div className={`studio-reader${isPretty ? ' is-pretty' : ''}`} role="dialog" aria-modal="true" aria-label={meta.title}>
      <div className="studio-reader-shell paper-bg">
        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={onClose} aria-label="返回 Workspace">
            <Icon name="back" size={19} color="var(--ink)" />
          </button>
          <div className={`studio-reader-mark tint-${meta.tint}`}>
            <Icon name={meta.icon} size={22} color="var(--vermillion)" />
          </div>
          <div className="studio-reader-title">
            <h2>{groupTitle || meta.title}<Heart size={15} color="var(--vermillion-l)" fill="var(--vermillion-l)" /></h2>
            <p>{meta.sub}</p>
          </div>
          {isPretty && detailOpen ? (
            <div className="lt-head-actions">
              <button className="lt-head-btn" onClick={() => setDetailOpen(false)} aria-label="返回列表"><Icon name="back" size={17} color="var(--ink)" /></button>
              <button className="lt-head-btn" onClick={toggleFav} aria-label="收藏"><Bookmark filled={isFav} /></button>
            </div>
          ) : (
            <span className="studio-reader-count">{items.length}</span>
          )}
        </header>

        {tabList.length > 1 && (
          <div className="studio-reader-tabs">
            {tabList.map(t => (
              <button key={t} className={'studio-reader-tab' + (t === module ? ' is-active' : '')} onClick={() => setModule(t)}>
                {(MODULES[t] && (MODULES[t].tab || MODULES[t].title)) || t}
              </button>
            ))}
          </div>
        )}

        {error && <div className="studio-reader-error">{error}</div>}

        {module === 'growth' ? (
          <GrowthPanel />
        ) : isPretty ? (
          <LettersBody items={items} selected={selected} onSelect={(id) => { setSelected(id); setDetailOpen(true) }} detailOpen={detailOpen} loading={loading} detailLoading={detailLoading} detail={detail} selectedItem={selectedItem} module={module} />
        ) : (
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
        )}
        {isPretty && toast && <div className="lt-toast">{toast}</div>}
      </div>
    </div>
  )
}
