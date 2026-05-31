import React from 'react'
import { Icon } from './doodles.jsx'
import { Sticker, TINT_MAP } from './components.jsx'

const TINTS = [
  { key: 'cream', label: '旧纸白' },
  { key: 'pink', label: '灰粉' },
  { key: 'sage', label: '鼠尾草' },
  { key: 'blue', label: '蓝灰' },
  { key: 'yellow', label: '奶油黄' },
  { key: 'kraft', label: '牛皮纸' },
]
const TAPES = [
  { key: 'gingham', label: '绿格子' },
  { key: 'polka', label: '粉圆点' },
  { key: 'stripe', label: '红斜纹' },
  { key: 'plain', label: '粉胶带' },
  { key: 'warm', label: '旧胶带' },
]
const STICKERS = [
  { key: 'sparkle', label: '闪闪' },
  { key: 'flower', label: '小花' },
  { key: 'heart', label: '心心' },
  { key: 'cloud', label: '小云' },
  { key: 'flowerface', label: '花脸' },
  { key: 'panther', label: '黑豹' },
]
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
  const [tape, setTape] = React.useState(note?.tape ?? 'gingham')
  const [sticker, setSticker] = React.useState(note?.sticker ?? note?.doodle ?? 'sparkle')
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
      await onSave({ title: title.trim(), items, tint, tape, doodle: sticker, sticker, edge, rotate })
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
          <div className="ne-row">
            {TAPES.map((k) => (
              <button key={k.key} type="button"
                className={"ne-chip tape-choice " + k.key + (tape === k.key ? " sel" : "")}
                onClick={() => setTape(k.key)}
              >{k.label}</button>
            ))}
          </div>

          <label className="ne-label">贴纸小生物</label>
          <div className="ne-row sticker-choice-row">
            {STICKERS.map((d) => (
              <button key={d.key} type="button"
                className={"ne-chip sticker-choice" + (sticker === d.key ? " sel" : "")}
                onClick={() => setSticker(d.key)}
              ><Sticker name={d.key} size={20} />{d.label}</button>
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
