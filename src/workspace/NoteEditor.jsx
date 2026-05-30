import React from 'react'
import { Icon } from './doodles.jsx'
import { TINT_MAP } from './components.jsx'

const TINTS = ['yellow', 'blue', 'pink', 'green']
const TAPES = ['warm', 'stripe', 'pink']
const DOODLES = ['sparkle', 'flower', 'bowl']
const ROTATES = [-3, -2, 0, 2, 3]

export default function NoteEditor({ note, onSave, onClose }) {
  const [title, setTitle] = React.useState(note?.title ?? '')
  const [itemsText, setItemsText] = React.useState(note?.items?.join('\n') ?? '')
  const [tint, setTint] = React.useState(note?.tint ?? 'yellow')
  const [tape, setTape] = React.useState(note?.tape ?? 'warm')
  const [doodle, setDoodle] = React.useState(note?.doodle ?? 'sparkle')
  const [rotate, setRotate] = React.useState(note?.rotate ?? -2)
  const [saving, setSaving] = React.useState(false)

  const [light] = TINT_MAP[tint] || TINT_MAP.yellow

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      const items = itemsText.split('\n').map(s => s.trim()).filter(Boolean)
      await onSave({ title: title.trim(), items, tint, tape, doodle, rotate })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="note-editor-backdrop" onClick={onClose}>
      <div className="note-editor" onClick={(e) => e.stopPropagation()}>
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
            placeholder="便签标题"
            autoFocus
            maxLength={60}
          />

          <label className="ne-label">内容 <span className="ne-hint">每行一条</span></label>
          <textarea
            className="ne-textarea"
            value={itemsText}
            onChange={(e) => setItemsText(e.target.value)}
            placeholder={"番茄海鲜意面\n南瓜浓汤\n饭后小蛋糕"}
            rows={5}
          />

          <label className="ne-label">颜色</label>
          <div className="ne-row">
            {TINTS.map(t => {
              const [bg] = TINT_MAP[t]
              return (
                <button key={t} type="button"
                  className={"ne-swatch" + (tint === t ? " sel" : "")}
                  style={{ background: bg }}
                  onClick={() => setTint(t)}
                />
              )
            })}
          </div>

          <label className="ne-label">胶带</label>
          <div className="ne-row">
            {TAPES.map(k => (
              <button key={k} type="button"
                className={"ne-chip" + (tape === k ? " sel" : "")}
                onClick={() => setTape(k)}
              >{k}</button>
            ))}
          </div>

          <label className="ne-label">装饰</label>
          <div className="ne-row">
            {DOODLES.map(d => (
              <button key={d} type="button"
                className={"ne-chip" + (doodle === d ? " sel" : "")}
                onClick={() => setDoodle(d)}
              >{d}</button>
            ))}
          </div>

          <div className="ne-actions">
            <button type="button" className="ne-btn-cancel" onClick={onClose}>取消</button>
            <button type="submit" className="ne-btn-save" disabled={saving || !title.trim()}>
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
