import React from 'react'
import { Icon } from './doodles.jsx'

const ICONS = ['note', 'pencil', 'send', 'image', 'star']
const DUE_TYPES = [
  { key: 'today', label: '今天' },
  { key: 'tomorrow', label: '明天' },
  { key: 'date', label: '日期' },
]

export default function TaskEditor({ task, onSave, onClose }) {
  const [text, setText] = React.useState(task?.text ?? '')
  const [due, setDue] = React.useState(task?.due ?? '')
  const [dueType, setDueType] = React.useState(task?.dueType ?? 'today')
  const [icon, setIcon] = React.useState(task?.icon ?? 'note')
  const [saving, setSaving] = React.useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setSaving(true)
    try {
      let d = due.trim()
      if (!d) d = dueType === 'today' ? 'Today' : dueType === 'tomorrow' ? 'Tomorrow' : ''
      await onSave({ text: text.trim(), due: d, dueType, icon })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="note-editor-backdrop" onClick={onClose}>
      <div className="note-editor" onClick={(e) => e.stopPropagation()}>
        <div className="note-editor-header" style={{ background: 'var(--note-blue)' }}>
          <span className="note-editor-title">{task ? '编辑任务' : '新建任务'}</span>
          <button className="note-editor-close" onClick={onClose}><Icon name="back" size={18} color="var(--ink)" /></button>
        </div>
        <form className="note-editor-body" onSubmit={handleSubmit}>
          <label className="ne-label">任务</label>
          <input className="ne-input" value={text} onChange={(e) => setText(e.target.value)}
            placeholder="要做的事" autoFocus maxLength={80} />

          <label className="ne-label">什么时候</label>
          <div className="ne-row">
            {DUE_TYPES.map(d => (
              <button key={d.key} type="button"
                className={"ne-chip" + (dueType === d.key ? " sel" : "")}
                onClick={() => setDueType(d.key)}>{d.label}</button>
            ))}
          </div>
          <input className="ne-input" value={due} onChange={(e) => setDue(e.target.value)}
            placeholder={dueType === 'date' ? '比如 May 31 / 周末' : '留空就用上面的'} maxLength={20} />

          <label className="ne-label">图标</label>
          <div className="ne-row">
            {ICONS.map(ic => (
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
              {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
