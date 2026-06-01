import React from 'react'
import { Icon } from './doodles.jsx'
import { TINT_MAP } from './components.jsx'
import { WASHIS, CLIPS, STICKERS as ASSET_STICKERS } from './assets.js'

const TINTS = [
  { key: 'cream', label: '旧纸白' },
  { key: 'pink', label: '灰粉' },
  { key: 'sage', label: '鼠尾草' },
  { key: 'blue', label: '蓝灰' },
  { key: 'yellow', label: '奶油黄' },
  { key: 'kraft', label: '牛皮纸' },
]
const TAPE_CHOICES = WASHIS.map((src, i) => ({ key: 'washi-' + i, label: '胶带 ' + (i + 1), src }))
const CLIP_CHOICES = [{ key: 'none', label: '不加夹子', src: null }, ...CLIPS.map((src, i) => ({ key: 'clip-' + i, label: '夹子 ' + (i + 1), src }))]
const STICKER_CHOICES = ASSET_STICKERS.slice(0, 12).map((src, i) => ({ key: 'sticker-' + i, label: '贴纸 ' + (i + 1), src }))
const EDGES = [
  { key: 'crayon', label: '蜡笔框' },
  { key: 'torn', label: '撕纸边' },
  { key: 'dashed', label: '虚线边' },
]
const ROTATES = [-3, -2, 0, 2, 3]

export default function NoteEditor({ note, onSave, onClose }) {
  const [title, setTitle] = React.useState(note?.title ?? '')
  const [itemsText, setItemsText] = React.useState(note?.items?.join('\n') ?? '')
  const [tint, setTint] = React.useState(note?.tint ?? 'cream')
  const [tapeAsset, setTapeAsset] = React.useState(note?.tapeAsset ?? 'washi-0')
  const [clipAsset, setClipAsset] = React.useState(note?.clipAsset ?? 'none')
  const [stickerAsset, setStickerAsset] = React.useState(note?.stickerAsset ?? 'sticker-3')
  const [edge, setEdge] = React.useState(note?.edge ?? 'crayon')
  const [rotate, setRotate] = React.useState(note?.rotate ?? -2)
  const [saving, setSaving] = React.useState(false)

  const [light] = TINT_MAP[tint] || TINT_MAP.cream

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      const items = itemsText.split('\n').map((s) => s.trim()).filter(Boolean)
      await onSave({ title: title.trim(), items, tint, tapeAsset, clipAsset, stickerAsset, tape: tapeAsset, doodle: stickerAsset, sticker: stickerAsset, edge, rotate })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="note-editor-backdrop" onClick={onClose}>
      <div className="note-editor scrapbook-editor" onClick={(e) => e.stopPropagation()}>
        <div className="note-editor-header" style={{ background: light }}>
          <span className="note-editor-title">{note ? '编辑便签' : '新建便签'}</span>
          <button className="note-editor-close" onClick={onClose}><Icon name="back" size={18} color="var(--ink)" /></button>
        </div>
        <form className="note-editor-body" onSubmit={handleSubmit}>
          <label className="ne-label">标题</label>
          <input
            className="ne-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给这张小纸片起个名字"
            autoFocus
            maxLength={60}
          />

          <label className="ne-label">内容 <span className="ne-hint">每行一条</span></label>
          <textarea
            className="ne-textarea"
            value={itemsText}
            onChange={(e) => setItemsText(e.target.value)}
            placeholder={"6/2 8:30\n护照、id、通知书\n记得买花"}
            rows={5}
          />

          <label className="ne-label">纸张颜色</label>
          <div className="ne-row ne-swatch-row">
            {TINTS.map((t) => {
              const [bg] = TINT_MAP[t.key] || TINT_MAP.cream
              return (
                <button key={t.key} type="button"
                  className={"ne-swatch" + (tint === t.key ? " sel" : "")}
                  style={{ background: bg }}
                  title={t.label}
                  onClick={() => setTint(t.key)}
                />
              )
            })}
          </div>

          <label className="ne-label">胶带花样</label>
          <div className="ne-asset-grid tape-asset-grid">
            {TAPE_CHOICES.map((k) => (
              <button key={k.key} type="button"
                className={"ne-asset-choice tape-asset-choice" + (tapeAsset === k.key ? " sel" : "")}
                onClick={() => setTapeAsset(k.key)}
                title={k.label}
              ><img src={k.src} alt="" /></button>
            ))}
          </div>

          <label className="ne-label">夹子 / 回形针</label>
          <div className="ne-asset-grid clip-asset-grid">
            {CLIP_CHOICES.map((k) => (
              <button key={k.key} type="button"
                className={"ne-asset-choice clip-asset-choice" + (clipAsset === k.key ? " sel" : "")}
                onClick={() => setClipAsset(k.key)}
                title={k.label}
              >{k.src ? <img src={k.src} alt="" /> : <span>无</span>}</button>
            ))}
          </div>

          <label className="ne-label">贴纸小生物</label>
          <div className="ne-asset-grid sticker-asset-grid">
            {STICKER_CHOICES.map((d) => (
              <button key={d.key} type="button"
                className={"ne-asset-choice sticker-asset-choice" + (stickerAsset === d.key ? " sel" : "")}
                onClick={() => setStickerAsset(d.key)}
                title={d.label}
              ><img src={d.src} alt="" /></button>
            ))}
          </div>

          <label className="ne-label">边框和歪斜</label>
          <div className="ne-row">
            {EDGES.map((e) => (
              <button key={e.key} type="button"
                className={"ne-chip" + (edge === e.key ? " sel" : "")}
                onClick={() => setEdge(e.key)}
              >{e.label}</button>
            ))}
            {ROTATES.map((r) => (
              <button key={r} type="button"
                className={"ne-chip" + (rotate === r ? " sel" : "")}
                onClick={() => setRotate(r)}
              >{r > 0 ? '+' : ''}{r}°</button>
            ))}
          </div>

          <div className="ne-actions">
            <button type="button" className="ne-btn-cancel" onClick={onClose}>取消</button>
            <button type="submit" className="ne-btn-save" disabled={saving || !title.trim()}>
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
