import React from 'react'
import { Crab, TreasureChest, Heart, Star, Sparkle, Pin, CloudFace, HeartLegs, Icon } from './doodles.jsx'
import { SectionHead, StickyNote, ConversationRow, TaskCard, QuickAction, ComingSoonCard, AppCard } from './components.jsx'
import { QUICK_ACTIONS, COMING_SOON, LIVE_APPS, STUDIO_LINKS } from './data.jsx'
import { api } from '../api.js'
import NoteEditor from './NoteEditor.jsx'
import TaskEditor from './TaskEditor.jsx'
import StudioReader from './StudioReader.jsx'

export default function WorkspaceHome({ conversations = [], onOpenChat, onNewChat, onRenameConv, onDeleteConv, onOpenSettings, loading }) {
  const [tasks, setTasks] = React.useState([])
  const [tasksLoading, setTasksLoading] = React.useState(true)
  const [editingTask, setEditingTask] = React.useState(null)
  const [showAll, setShowAll] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const [notes, setNotes] = React.useState([])
  const [notesLoading, setNotesLoading] = React.useState(true)
  const [editingNote, setEditingNote] = React.useState(null)
  const [deletingId, setDeletingId] = React.useState(null)
  const [studioModule, setStudioModule] = React.useState(null)

  React.useEffect(() => {
    api.notes.list().then(setNotes).catch(() => setNotes([])).finally(() => setNotesLoading(false))
    api.tasks.list().then(setTasks).catch(() => setTasks([])).finally(() => setTasksLoading(false))
  }, [])

  const toggleTask = (id) => {
    const cur = tasks.find((t) => t.id === id)
    if (!cur) return
    const next = !cur.done
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: next } : t)))
    api.tasks.update(id, { done: next }).catch(() => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, done: cur.done } : t))))
  }

  async function handleSaveTask(data) {
    if (editingTask === 'new') {
      const created = await api.tasks.create(data)
      setTasks((ts) => [...ts, created])
    } else {
      const updated = await api.tasks.update(editingTask.id, data)
      setTasks((ts) => ts.map((t) => t.id === updated.id ? updated : t))
    }
    setEditingTask(null)
  }

  async function handleDeleteTask(id) {
    await api.tasks.remove(id)
    setTasks((ts) => ts.filter((t) => t.id !== id))
  }

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
          <header className="ws-header ws-hero">
            <Crab size={72} className="hero-crab" />
            <div className="ws-title-block">
              <h1 className="ws-title">
                <span>Every</span>
                <span>version,</span>
                <span>yours</span>
                <Heart size={20} color="var(--vermillion-l)" fill="var(--vermillion-l)" style={{ position: "absolute", top: 6, right: 56, opacity: 0.9 }} />
              </h1>
            </div>
            <div className="ws-header-doodles" onClick={onOpenSettings} style={{ cursor: "pointer" }} title="点这颗星调主题 ✦">
              <Star size={15} color="var(--vermillion)" style={{ position: "absolute", top: 0, left: 6 }} />
              <TreasureChest size={70} className="hero-chest" />
            </div>
          </header>

          <div className="search-wrap">
            <div className="search-border" />
            <span className="search-ico"><Icon name="search" size={19} color="var(--ink-faint)" /></span>
            <input className="search-box" placeholder="搜索聊天、笔记、任务..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button className="search-end"><Icon name="filter" size={19} color="var(--ink-soft)" /></button>
          </div>

          <SectionHead title="置顶笔记" doodle={<><Pin size={17} /><Star size={14} fill="var(--note-yellow)" /></>}
            action={<><Icon name="plus" size={14} color="var(--vermillion)" /> Add note</>}
            onAction={() => setEditingNote('new')} />
          <div className="notes-grid pinned-row">
            {notesLoading
              ? <span className="muted" style={{ fontSize: 13, padding: '8px 4px' }}>loading...</span>
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

          <div className="doodle-strip">
            <CloudFace size={38} />
            <Sparkle size={18} color="var(--note-yellow-d)" />
            <Heart size={17} color="var(--vermillion-l)" />
            <HeartLegs size={34} />
          </div>

          <SectionHead title="Conversations"
            action={<span className="chip" style={{ pointerEvents: "none" }}><Icon name="sort" size={14} color="var(--ink-soft)" />Recent</span>} />
          <div className="conv-list">
            {loading && convs.length === 0 ? (<div className="muted" style={{ padding: "20px 12px", fontSize: 14 }}>载入对话...</div>)
              : convs.length === 0 ? (<div className="muted" style={{ padding: "20px 12px", fontSize: 14 }}>{q ? "没找到相关对话" : "还没有对话，点右下角新建 ✏"}</div>)
              : convs.map((c) => (<ConversationRow key={c.id} conv={c} onClick={() => onOpenChat(c)} onRename={() => onRenameConv && onRenameConv(c)} onDelete={() => onDeleteConv && onDeleteConv(c)} />))}
          </div>
          {filtered.length > 4 && (<button className="show-more" onClick={() => setShowAll((s) => !s)}>
            {showAll ? "收起" : "Show more"} <Icon name="chevron" size={15} color="var(--ink-soft)" style={{ transform: showAll ? "rotate(180deg)" : "none" }} /></button>)}

          <hr className="divider-hand" />

          <SectionHead title="Tasks" doodle={<Icon name="task" size={18} color="var(--ink)" />}
            action={<><Icon name="plus" size={14} color="var(--vermillion)" /> New task</>}
            onAction={() => setEditingTask('new')} />
          <div className="task-grid">
            {tasksLoading
              ? <span className="muted" style={{ fontSize: 13, padding: '8px 4px' }}>loading...</span>
              : tasks.length === 0
                ? <span className="muted" style={{ fontSize: 13, padding: '8px 4px' }}>还没有任务，点 + New task 新建</span>
                : tasks.map((t) => (<TaskCard key={t.id} task={t} onToggle={() => toggleTask(t.id)} onEdit={() => setEditingTask(t)} onDelete={() => handleDeleteTask(t.id)} />))}
          </div>

          <div className="doodle-strip center-strip">
            <Sparkle size={17} color="var(--note-yellow-d)" />
            <HeartLegs size={32} />
            <Sparkle size={17} color="var(--note-green-d)" />
          </div>

          <SectionHead title="Quick actions" doodle={<Sparkle size={17} color="var(--vermillion)" />} />
          <div className="qa-grid">{QUICK_ACTIONS.map((qa) => {
            const act = { qa1: () => onNewChat(), qa2: () => setEditingNote('new'), qa3: () => setEditingTask('new'), qa4: () => onNewChat() }[qa.id]
            return (<QuickAction key={qa.id} qa={qa} onClick={act || (() => {})} />)
          })}</div>

          <SectionHead title="Studio" doodle={<><Heart size={15} color="var(--vermillion-l)" /><CloudFace size={34} /></>}
            action={<span className="muted" style={{ fontFamily: "var(--font-hand)", fontSize: 15 }}>只读手账 ✦</span>} />
          <div className="studio-grid coming-grid" style={{ marginBottom: 12 }}>{LIVE_APPS.map((a) => (<AppCard key={a.id} app={a} />))}</div>
          <div className="studio-grid coming-grid">{COMING_SOON.map((m) => (<ComingSoonCard key={m.id} mod={m} onClick={() => setStudioModule(m.module)} />))}</div>
          <div className="studio-grid coming-grid" style={{ marginTop: 12 }}>{STUDIO_LINKS.map((a) => (<AppCard key={a.id} app={a} />))}</div>
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

      {editingTask !== null && (
        <TaskEditor
          task={editingTask === 'new' ? null : editingTask}
          onSave={handleSaveTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {studioModule && (
        <StudioReader module={studioModule} onClose={() => setStudioModule(null)} />
      )}
    </div>
  )
}
