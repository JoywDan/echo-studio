import React from 'react'
import { uploadsUrl } from './api.js'


const PAGE_SIZE = 36

export default function StickerPicker({ catalog, loading, error, onClose, onSelect }) {
  const [activePack, setActivePack] = React.useState('')
  const [query, setQuery] = React.useState('')
  const [limit, setLimit] = React.useState(PAGE_SIZE)

  const packs = catalog?.packs || []
  const stickers = catalog?.stickers || []

  React.useEffect(() => {
    if (!activePack && packs.length) setActivePack(packs[0].id)
  }, [activePack, packs])

  React.useEffect(() => { setLimit(PAGE_SIZE) }, [activePack, query])
  React.useEffect(() => {
    const onKey = event => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const needle = query.trim().toLowerCase()
  const filtered = stickers.filter(sticker => {
    if (!needle && activePack && sticker.pack !== activePack) return false
    if (!needle) return true
    return `${sticker.name} ${sticker.pack_label}`.toLowerCase().includes(needle)
  })

  return (
    <section className="sticker-picker" aria-label="表情包">
      <div className="sticker-picker-head">
        <strong>挑一张表情</strong>
        <span>{catalog?.count ? `${catalog.count} 张 · 私人表情库` : '私人表情库'}</span>
        <button type="button" onClick={onClose} aria-label="关闭表情面板">✕</button>
      </div>
      {loading ? <div className="sticker-picker-state">正在把表情拿过来…</div> : error ? <div className="sticker-picker-state error">{error}</div> : <>
        <div className="sticker-pack-tabs" role="tablist">
          {packs.map(pack => <button type="button" role="tab" aria-selected={activePack === pack.id} className={activePack === pack.id ? 'active' : ''} key={pack.id} onClick={() => { setActivePack(pack.id); setQuery('') }}>{pack.label}<small>{pack.count}</small></button>)}
        </div>
        <input className="sticker-search" value={query} onChange={event => setQuery(event.target.value)} placeholder="搜：委屈、摸摸、无语…" aria-label="搜索表情" />
        <div className="sticker-grid">
          {filtered.slice(0, limit).map(sticker => <button type="button" className="sticker-option" key={sticker.id} title={sticker.name} onClick={() => onSelect(sticker)}>
            <img src={uploadsUrl(sticker.thumb_url)} alt={sticker.name} loading="lazy" decoding="async" />
            <span>{sticker.name}</span>
          </button>)}
          {!filtered.length && <div className="sticker-empty">这套里没有搜到，再换个词试试。</div>}
        </div>
        {limit < filtered.length && <button type="button" className="sticker-more" onClick={() => setLimit(value => value + PAGE_SIZE)}>再看一些 · 还有 {filtered.length - limit} 张</button>}
      </>}
    </section>
  )
}
