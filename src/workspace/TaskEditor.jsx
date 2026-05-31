import React from 'react'
import { Icon } from './doodles.jsx'
import { Sticker, TINT_MAP } from './components.jsx'

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
const TAPES = [
  { key: 'gingham', label: '绿格子' },
  { key: 'polka', label: '粉圆点' },
  { key: 'stripe', label: '红斜纹' },
  { key: 'plain', label: '粉胶带' },
]
const STICKERS = [
  { key: 'star', label: '星星' },
  { key: 'heart', label: '心心' },
  { key: 'cloud', label: '小云' },
  { key: 'flower', label: '小花' },
  { key: 'panther', label: '黑豹' },
  { key: 'trio', label: '三小团' },
]
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
  const [tape, setTape] = React.useState(task?.tape ?? 'polka')
  const [sticker, setSticker] = React.useState(task?.sticker ?? task?.icon ?? 'star')
  const [edge, setEdge] = React.useState(task?.edge ?? 'crayon')
  const [saving, setSaving] = React.useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    try {
      let d = due.trim()
      if (!d) d = dueType === 'today' ? 'Today' : dueType === 'tomorrow' ? 'Tomorrow' : ''
      await onSave({ text: text.trim(), due: d, dueType, icon, tint, tape, sticker, edge })
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

          <label className="ne-label">胶带和贴纸</label>
          <div className="ne-row">
            {TAPES.map((k) => (
              <button key={k.key} type="button"
                className={"ne-chip tape-choice " + k.key + (tape === k.key ? " sel" : "")}
                onClick={() => setTape(k.key)}
              >{k.label}</button>
            ))}
          </div>
          <div className="ne-row sticker-choice-row">
            {STICKERS.map((d) => (
              <button key={d.key} type="button"
                className={"ne-chip sticker-choice" + (sticker === d.key ? " sel" : "")}
                onClick={() => setSticker(d.key)}
              ><Sticker name={d.key} size={20} />{d.label}</button>
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
