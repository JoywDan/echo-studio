import React from 'react'
import { CoffeeCup, Heart, Star, Sparkle, Pin, Icon } from './doodles.jsx'
import { SectionHead, StickyNote, ConversationRow, TaskCard, QuickAction, ComingSoonCard, AppCard } from './components.jsx'
import { TASKS, QUICK_ACTIONS, COMING_SOON } from './data.jsx'
import { api } from '../api.js'
import NoteEditor from './NoteEditor.jsx'

export default function WorkspaceHome({ conversations = [], onOpenChat, onNewChat, onDeleteConv, onOpenSettings, loading }) {
  const [tasks, setTasks] = React.useState(TASKS)
  const [showAll, setShowAll] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const [notes, setNotes] = React.useState([])
  const [notesLoading, setNotesLoading] = React.useState(true)
  const [editingNote, setEditingNote] = React.useState(null) // null | 'new' | note object
  const [deletingId, setDeletingId] = React.useState(null)

  React.useEffect(() => {
    api.notes.list().then(setNotes).catch(() => setNotes([])).finally(() => setNotesLoading(false))
  }, [])

  const toggleTask = (id) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const q = query.trim().toLowerCase()
  const filtered = q ? conversations.filter((c) => (c.title + " " + c.preview).toLowerCase().includes(q)) : conversations
  const convs = showAll ? filtered : filtered.slice(0, 4)

  async function handleSaveNote(data) {
    if (editingNote === 'new') {
      const created = await api.notes.create(data)
      setNotes((ns) => [...ns, created])
    } else {
      const updated = await api.notes.update(editingNote.id, data)
      setNotes((ns) => ns.map((n) => n.id === updated.id ? updated : n))
    }
    setEditingNote(null)
  }

  async function handleDeleteNote(id) {
    setDeletingId(id)
    try {
      await api.notes.remove(id)
      setNotes((ns) => ns.filter((n) => n.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="panel workspace-panel paper-bg">
      <div className="panel-scroll">
        <div className="ws-inner">
          <header className="ws-header">
            <CoffeeCup size={66} style={{ flexShrink: 0, marginTop: 2 }} />
            <div className="ws-title-block">
              <h1 className="ws-title">Workspace
                <Heart size={20} color="var(--vermillion-l)" fill="var(--vermillion-l)" style={{ position: "absolute", top: -10, right: 26, opacity: 0.9 }} /></h1>
              <p className="ws-subtitle">history + notes<Heart size={15} color="var(--vermillion-l)" /></p>
            </div>
            <div className="ws-header-doodles" onClick={onOpenSettings} style={{ cursor: "pointer" }} title="点这颗星调主题 ✦">
              <Star size={15} color="var(--vermillion)" style={{ position: "absolute", top: 0, left: 6 }} />
              <div className="ws-stamp"><Star size={26} color="#f7ede4" fill="#f7ede4" /></div>
            </div>
          </header>

          <div className="search-wrap">
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}><Icon name="search" size={19} color="var(--ink-faint)" /></span>
            <input className="search-box" placeholder="Search chats, notes, tasks..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)" }}><Icon name="filter" size={19} color="var(--ink-soft)" /></button>
          </div>

          <SectionHead title="Pinned notes" doodle={<Pin size={17} />}
            action={<><Icon name="plus" size={14} color="var(--vermillion)" /> Add note</>}
            onAction={() => setEditingNote('new')} />
          <div className="pinned-row">
            {notesLoading
              ? <span className="muted" style={{ fontSize: 13, padding: '8px 4px' }}>loading…</span>
              : notes.length === 0
                ? <span className="muted" style={{ fontSize: 13, padding: '8px 4px' }}>还没有便签，点 + Add note 新建</span>
                : notes.map((n) => (
                  <StickyNote
                    key={n.id}
                    note={n}
                    variant="tape"
                    onEdit={() => setEditingNote(n)}
                    onDelete={() => handleDeleteNote(n.id)}
                    deleting={deletingId === n.id}
                  />
                ))
            }
          </div>

          <SectionHead title="Conversations"
            action={<span className="chip" style={{ pointerEvents: "none" }}><Icon name="sort" size={14} color="var(--ink-soft)" />Recent</span>} />
          <div className="conv-list">
            {loading && convs.length === 0 ? (<div className="muted" style={{ padding: "20px 12px", fontSize: 14 }}>载入对话…</div>)
              : convs.length === 0 ? (<div className="muted" style={{ padding: "20px 12px", fontSize: 14 }}>{q ? "没找到相关对话" : "还没有对话，点右下角新建 ✏️"}</div>)
              : convs.map((c) => (<ConversationRow key={c.id} conv={c} onClick={() => onOpenChat(c)} onDelete={() => onDeleteConv && onDeleteConv(c)} />))}
          </div>
          {filtered.length > 4 && (<button className="show-more" onClick={() => setShowAll((s) => !s)}>
            {showAll ? "收起" : "Show more"} <Icon name="chevron" size={15} color="var(--ink-soft)" style={{ transform: showAll ? "rotate(180deg)" : "none" }} /></button>)}

          <hr className="divider-hand" />

          <SectionHead title="Tasks" doodle={<Icon name="task" size={18} color="var(--ink)" />}
            action={<><Icon name="plus" size={14} color="var(--vermillion)" /> New task</>} />
          <div className="task-grid">{tasks.map((t) => (<TaskCard key={t.id} task={t} onToggle={() => toggleTask(t.id)} />))}</div>

          <SectionHead title="Quick actions" doodle={<Sparkle size={17} color="var(--vermillion)" />} />
          <div className="qa-grid">{QUICK_ACTIONS.map((qa) => (<QuickAction key={qa.id} qa={qa} onClick={() => qa.id === "qa1" && onNewChat()} />))}</div>

          <SectionHead title="Studio" doodle={<Heart size={15} color="var(--vermillion-l)" />}
            action={<span className="muted" style={{ fontFamily: "var(--font-hand)", fontSize: 15 }}>陆续上线 ✦</span>} />
          <div className="coming-grid" style={{ marginBottom: 12 }}>{LIVE_APPS.map((a) => (<AppCard key={a.id} app={a} />))}</div>
          <div className="coming-grid">{COMING_SOON.map((m) => (<ComingSoonCard key={m.id} mod={m} />))}</div>
        </div>
      </div>
      <button className="fab" onClick={onNewChat} aria-label="新建"><Icon name="pencil" size={26} color="#faf3ec" stroke={1.8} /></button>

      {editingNote !== null && (
        <NoteEditor
          note={editingNote === 'new' ? null : editingNote}
          onSave={handleSaveNote}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  )
}
