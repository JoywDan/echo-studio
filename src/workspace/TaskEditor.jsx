import React from 'react'
import { Icon } from './doodles.jsx'
import { TINT_MAP } from './components.jsx'
import { WASHIS, CLIPS, PAPERCLIPS, STICKERS as ASSET_STICKERS } from './assets.js'

const ICONS = ['note', 'pencil', 'send', 'image', 'star']
const DUE_TYPES = [
  { key: 'today', label: '今天' },
  { key: 'tomorrow', label: '明天' },
  { key: 'date', label: '日期' },
]
const TINTS = [
  { key: 'cream', label: '旧纸白' },
  { key: 'pink', label: '灰粉' },
  { key: 'sage', label: '鼠尾草' },
  { key: 'blue', label: '蓝灰' },
  { key: 'yellow', label: '奶油黄' },
]
const FASTENER_CHOICES = [
  ...WASHIS.map((src, i) => ({ key: 'washi-' + i, label: '胶带 ' + (i + 1), src, kind: 'tape' })),
  ...CLIPS.map((src, i) => ({ key: 'clip-' + i, label: '夹子 ' + (i + 1), src, kind: 'clip' })),
  ...PAPERCLIPS.map((src, i) => ({ key: 'paperclip-' + i, label: '回形针 ' + (i + 1), src, kind: 'paperclip' })),
  { key: 'none', label: '不加固定物', src: null, kind: 'none' },
]
const STICKER_CHOICES = ASSET_STICKERS
  .filter((src) => !String(src).includes('pack_'))
  .slice(0, 12)
  .map((src, i) => ({ key: 'sticker-' + i, label: '贴纸 ' + (i + 1), src }))
const EDGES = [
  { key: 'crayon', label: '蜡笔框' },
  { key: 'torn', label: '撕纸边' },
  { key: 'dashed', label: '虚线边' },
]

export default function TaskEditor({ task, onSave, onClose }) {
  const [text, setText] = React.useState(task?.text ?? '')
  const [due, setDue] = React.useState(task?.due ?? '')
  const [dueType, setDueType] = React.useState(task?.dueType ?? 'today')
  const [icon, setIcon] = React.useState(task?.icon ?? 'note')
  const [tint, setTint] = React.useState(task?.tint ?? 'pink')
  const initialFastener = task?.accessoryAsset ?? (task?.clipAsset && task.clipAsset !== 'none' ? task.clipAsset : task?.tapeAsset) ?? 'washi-0'
  const initialStickers = Array.isArray(task?.stickerAssets)
    ? task.stickerAssets
    : (task?.stickerAsset ? [task.stickerAsset] : ['sticker-2'])
  const [fastenerAsset, setFastenerAsset] = React.useState(initialFastener)
  const [stickerAssets, setStickerAssets] = React.useState(initialStickers)
  const [edge, setEdge] = React.useState(task?.edge ?? 'crayon')
  const [saving, setSaving] = React.useState(false)

  const tapeAsset = fastenerAsset.startsWith('washi-') ? fastenerAsset : 'none'
  const clipAsset = fastenerAsset.startsWith('clip-') || fastenerAsset.startsWith('paperclip-') ? fastenerAsset : 'none'
  const primarySticker = stickerAssets[0] || ''

  function toggleSticker(key) {
    setStickerAssets((cur) => {
      if (cur.includes(key)) return cur.filter((v) => v !== key)
      return [...cur, key].slice(0, 4)
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    try {
      let d = due.trim()
      if (!d) d = dueType === 'today' ? 'Today' : dueType === 'tomorrow' ? 'Tomorrow' : ''
      await onSave({
        text: text.trim(),
        due: d,
        dueType,
        icon,
        tint,
        accessoryAsset: fastenerAsset,
        tapeAsset,
        clipAsset,
        stickerAssets,
        stickerAsset: primarySticker,
        tape: tapeAsset,
        sticker: primarySticker,
        edge,
      })
    } finally {
      setSaving(false)
    }
  }

  const [light] = TINT_MAP[tint] || TINT_MAP.pink

  return (
    <div className="note-editor-backdrop" onClick={onClose}>
      <div className="note-editor scrapbook-editor task-editor" onClick={(e) => e.stopPropagation()}>
        <div className="note-editor-header" style={{ background: light }}>
          <span className="note-editor-title">{task ? '编辑任务' : '新建任务'}</span>
          <button className="note-editor-close" onClick={onClose}><Icon name="back" size={18} color="var(--ink)" /></button>
        </div>
        <form className="note-editor-body" onSubmit={handleSubmit}>
          <label className="ne-label">任务</label>
          <input className="ne-input" value={text} onChange={(e) => setText(e.target.value)}
            placeholder="要做的事" autoFocus maxLength={80} />

          <label className="ne-label">什么时候</label>
          <div className="ne-row">
            {DUE_TYPES.map((d) => (
              <button key={d.key} type="button"
                className={"ne-chip" + (dueType === d.key ? " sel" : "")}
                onClick={() => setDueType(d.key)}>{d.label}</button>
            ))}
          </div>
          <input className="ne-input" value={due} onChange={(e) => setDue(e.target.value)}
            placeholder={dueType === 'date' ? '比如 May 31 / 周末' : '留空就用上面的时间'} maxLength={20} />

          <label className="ne-label">纸张颜色</label>
          <div className="ne-row ne-swatch-row">
            {TINTS.map((t) => {
              const [bg] = TINT_MAP[t.key] || TINT_MAP.pink
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

          <label className="ne-label">顶部固定物 <span className="ne-hint">胶带 / 夹子只能选一个</span></label>
          <div className="ne-asset-grid fastener-asset-grid">
            {FASTENER_CHOICES.map((k) => (
              <button key={k.key} type="button"
                className={"ne-asset-choice " + (k.kind === 'tape' ? 'tape-asset-choice' : 'clip-asset-choice') + (fastenerAsset === k.key ? " sel" : "")}
                onClick={() => setFastenerAsset(k.key)}
                title={k.label}
              >{k.src ? <img src={k.src} alt="" /> : <span>无</span>}</button>
            ))}
          </div>

          <label className="ne-label">贴纸小生物 <span className="ne-hint">可多选，最多 4 个</span></label>
          <div className="ne-asset-grid sticker-asset-grid">
            {STICKER_CHOICES.map((d) => (
              <button key={d.key} type="button"
                className={"ne-asset-choice sticker-asset-choice" + (stickerAssets.includes(d.key) ? " sel" : "")}
                onClick={() => toggleSticker(d.key)}
                title={d.label}
              ><img src={d.src} alt="" /></button>
            ))}
          </div>

          <label className="ne-label">边框和小图标</label>
          <div className="ne-row">
            {EDGES.map((e) => (
              <button key={e.key} type="button"
                className={"ne-chip" + (edge === e.key ? " sel" : "")}
                onClick={() => setEdge(e.key)}
              >{e.label}</button>
            ))}
            {ICONS.map((ic) => (
              <button key={ic} type="button"
                className={"ne-chip" + (icon === ic ? " sel" : "")}
                onClick={() => setIcon(ic)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Icon name={ic} size={15} color="var(--ink-soft)" />
              </button>
            ))}
          </div>

          <div className="ne-actions">
            <button type="button" className="ne-btn-cancel" onClick={onClose}>取消</button>
            <button type="submit" className="ne-btn-save" disabled={saving || !text.trim()}>
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
