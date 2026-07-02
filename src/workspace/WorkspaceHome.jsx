import React from 'react'
import { StickyNote, ConversationRow, TaskCard, QuickAction, StudioCard, DecoLayer } from './components.jsx'
import { Crab, TreasureChest, WormCrown, Rabbit } from './creatures.jsx'
import { CHEST, PANTHER_HEAD, TITLE, PINNED_IMG, NEWNOTE_IMG, TAPE_LONG, WASHIS, CLIPS, PAPERCLIPS, PANTHER_AVATARS, TITLE_IMAGES, KAWAII_IMAGES, STICKER_IMAGES, stickerAt } from './assets.js'

const WASHI_POS = [
  { top: '-29px', left: '48px', transform: 'rotate(4deg)' },
  { top: '-30px', left: '36px', transform: 'rotate(-3deg)' },
  { top: '-27px', right: '48px', left: 'auto', transform: 'rotate(7deg)' },
  { top: '-26px', left: '54px', transform: 'rotate(-8deg)' },
]
const NOTE_STICKERS = [
  [
    { idx: 3, style: { left: '18px', bottom: '22px', width: '86px', transform: 'rotate(-8deg)' } },
    { idx: 1, style: { right: '22px', bottom: '18px', width: '88px', transform: 'rotate(5deg)' } },
    { idx: 2, style: { right: '18px', top: '44px', width: '38px', transform: 'rotate(14deg)' } },
  ],
  [
    { idx: 6, style: { right: '24px', bottom: '18px', width: '104px', transform: 'rotate(4deg)' } },
    { idx: 5, style: { right: '10px', top: '28px', width: '50px', transform: 'rotate(-8deg)' } },
  ],
  [
    { idx: 11, style: { right: '24px', bottom: '16px', width: '98px', transform: 'rotate(-4deg)' } },
    { idx: 5, style: { left: '18px', bottom: '24px', width: '56px', transform: 'rotate(-9deg)' } },
  ],
  [
    { idx: 2, style: { right: '22px', bottom: '18px', width: '78px', transform: 'rotate(8deg)' } },
    { idx: 0, style: { left: '14px', bottom: '20px', width: '58px', transform: 'rotate(-5deg)' } },
  ],
]
const STICKER_SLOTS = [
  { right: '20px', bottom: '18px', width: '92px', transform: 'rotate(5deg)' },
  { left: '20px', bottom: '22px', width: '78px', transform: 'rotate(-8deg)' },
  { right: '24px', bottom: '84px', width: '54px', transform: 'rotate(10deg)' },
  { left: '18px', bottom: '88px', width: '50px', transform: 'rotate(-6deg)' },
]
const TASK_STICKER_SLOTS = [
  { right: '8px', bottom: '44px', width: '40px', transform: 'rotate(9deg)' },
  { right: '52px', bottom: '46px', width: '34px', transform: 'rotate(-7deg)' },
  { right: '6px', bottom: '-12px', width: '38px', transform: 'rotate(6deg)' },
]
const assetIndex = (key, fallback = 0) => {
  const m = String(key || '').match(/-(\d+)$/)
  return m ? Number(m[1]) : fallback
}
const pick = (items, key, fallback = 0) => items.length ? items[((assetIndex(key, fallback) % items.length) + items.length) % items.length] : null
const stableShift = (value, fallback = 0) => {
  const s = String(value || fallback)
  return Array.from(s).reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
}
import { Star, Heart, Sparkle, Squiggle, Wave, Flower, HeartLegs, SpeechHeart, Icon } from './doodles.jsx'
import { STUDIO, QUICK_ACTIONS, CONV_CREATURES, NOTE_TINTS, TASK_TINTS } from './data.jsx'
import { api } from '../api.js'
import NoteEditor from './NoteEditor.jsx'
import TaskEditor from './TaskEditor.jsx'
import StudioReader from './StudioReader.jsx'
import MemoryRiver from './MemoryRiver.jsx'
import DrawPrompt from './DrawPrompt.jsx'
import DicePanel from './DicePanel.jsx'
import PhonePanel from './PhonePanel.jsx'
import MusicPanel from './MusicPanel.jsx'
import WanderPanel from './WanderPanel.jsx'
import GameRoomPanel from './GameRoomPanel.jsx'
const ForesightPanel = React.lazy(() => import('./ForesightPanel.jsx'))
const BookReader = React.lazy(() => import('./BookReader.jsx'))

export default function WorkspaceHome({ conversations = [], onOpenChat, onNewChat, onDeleteConv, onOpenSettings, loading }) {
  const [showAll, setShowAll] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [notes, setNotes] = React.useState([]); const [notesLoading, setNotesLoading] = React.useState(true)
  const [tasks, setTasks] = React.useState([]); const [tasksLoading, setTasksLoading] = React.useState(true)
  const [editingNote, setEditingNote] = React.useState(null)
  const [editingTask, setEditingTask] = React.useState(null)
  const [reader, setReader] = React.useState(null)
  const [foresightOpen, setForesightOpen] = React.useState(false)
  const [memOpen, setMemOpen] = React.useState(false)
  const [drawOpen, setDrawOpen] = React.useState(false)
  const [bookOpen, setBookOpen] = React.useState(false)
  const [diceOpen, setDiceOpen] = React.useState(false)
  const [phoneOpen, setPhoneOpen] = React.useState(false)
  const [musicOpen, setMusicOpen] = React.useState(false)
  const [wanderOpen, setWanderOpen] = React.useState(false)
  const [gameRoomOpen, setGameRoomOpen] = React.useState(false)

  React.useEffect(() => {
    api.notes.list().then(setNotes).catch(() => setNotes([])).finally(() => setNotesLoading(false))
    api.tasks.list().then(setTasks).catch(() => setTasks([])).finally(() => setTasksLoading(false))
  }, [])

  const q = query.trim().toLowerCase()
  const filtered = q ? conversations.filter(c => (c.title + " " + (c.preview || "")).toLowerCase().includes(q)) : conversations
  const convs = (showAll ? filtered : filtered.slice(0, 3)).map((c, i) => ({
    ...c,
    creature: c.creature || CONV_CREATURES[i % CONV_CREATURES.length],
    avatarUrl: PANTHER_AVATARS.length ? PANTHER_AVATARS[stableShift(c.id || c.title, i) % PANTHER_AVATARS.length] : null,
  }))
  const noteCards = notes.map((n, i) => {
    let deco = {}
    try { if (n.doodle && String(n.doodle)[0] === '{') deco = JSON.parse(n.doodle) } catch {}
    const fastener = n.accessoryAsset ?? deco.f ?? (n.clipAsset && n.clipAsset !== 'none' ? n.clipAsset : n.tapeAsset)
    const fastenerKey = String(fastener || '')
    const chosenTape = fastener === 'none' ? null : (fastenerKey.startsWith('clip-') || fastenerKey.startsWith('paperclip-') ? null : pick(WASHIS, fastener || ('washi-' + (i % WASHIS.length)), i))
    const chosenClip = fastenerKey.startsWith('clip-') ? pick(CLIPS, fastener, i) : (fastenerKey.startsWith('paperclip-') ? pick(PAPERCLIPS, fastener, i) : null)
    const _stk = (Array.isArray(n.stickerAssets) && n.stickerAssets.length) ? n.stickerAssets
      : (Array.isArray(deco.s) && deco.s.length) ? deco.s
      : (n.stickerAsset ? [n.stickerAsset] : null)
    const chosenStickerKeys = _stk ? _stk.slice(0, 4) : null
    const slotShift = stableShift(n.id || n.title, i) % STICKER_SLOTS.length
    const chosenStickers = chosenStickerKeys
      ? chosenStickerKeys.map((key, si) => ({
          src: stickerAt(assetIndex(key, 3 + si)),
          style: STICKER_SLOTS[(slotShift + si) % STICKER_SLOTS.length],
        }))
      : null
    return { ...n, layout: i % 4, tint: n.tint || NOTE_TINTS[i % NOTE_TINTS.length], items: n.items || [], washiUrl: chosenTape, washiStyle: WASHI_POS[i % WASHI_POS.length],
      clipUrl: chosenClip,
      clipStyle: chosenClip ? { left: '50%', right: 'auto', top: '-42px', width: i % 2 ? '96px' : '88px', transform: `translateX(-50%) rotate(${i % 2 ? 7 : -6}deg)` } : null,
      stickers: chosenStickers
        ? chosenStickers
        : NOTE_STICKERS[i % NOTE_STICKERS.length].map(s => ({ src: stickerAt(s.idx + i), style: s.style }))
    }
  })
  const taskCards = tasks.map((t, i) => {
    const fastener = t.accessoryAsset ?? (t.clipAsset && t.clipAsset !== 'none' ? t.clipAsset : t.tapeAsset)
    const fastenerKey = String(fastener || '')
    const chosenTape = fastener === 'none' ? null : (fastenerKey.startsWith('clip-') || fastenerKey.startsWith('paperclip-') ? null : pick(WASHIS, fastener || ('washi-' + (i % WASHIS.length)), i))
    const chosenClip = fastenerKey.startsWith('clip-') ? pick(CLIPS, fastener, i) : (fastenerKey.startsWith('paperclip-') ? pick(PAPERCLIPS, fastener, i) : null)
    const stickerKeys = Array.isArray(t.stickerAssets) && t.stickerAssets.length ? t.stickerAssets.slice(0, 3) : (t.stickerAsset ? [t.stickerAsset] : null)
    return {
      ...t,
      layout: i % 4,
      tint: t.tint || TASK_TINTS[i % TASK_TINTS.length],
      icon: t.icon || "file",
      washiUrl: chosenTape,
      washiStyle: chosenTape ? { left: '50%', top: '-68px', width: '172px', transform: `translateX(-50%) rotate(${i % 2 ? 4 : -5}deg)` } : null,
      clipUrl: chosenClip,
      clipStyle: chosenClip ? { left: '50%', top: '-48px', width: fastenerKey.startsWith('paperclip-') ? '56px' : '76px', transform: `translateX(-50%) rotate(${i % 2 ? 8 : -7}deg)` } : null,
      stickers: stickerKeys ? stickerKeys.map((key, si) => ({
        src: stickerAt(assetIndex(key, 2 + si)),
        style: TASK_STICKER_SLOTS[(i + si) % TASK_STICKER_SLOTS.length],
      })) : null,
    }
  })

  async function saveNote(d) { if (editingNote === 'new') { const r = await api.notes.create(d); setNotes(n => [...n, r]) } else { const r = await api.notes.update(editingNote.id, d); setNotes(n => n.map(x => x.id === r.id ? r : x)) } setEditingNote(null) }
  async function delNote(id) { await api.notes.remove(id); setNotes(n => n.filter(x => x.id !== id)) }
  const toggleTask = (id) => { const cur = tasks.find(t => t.id === id); if (!cur) return; const nx = !cur.done; setTasks(ts => ts.map(t => t.id === id ? { ...t, done: nx } : t)); api.tasks.update(id, { done: nx }).catch(() => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: cur.done } : t))) }
  async function saveTask(d) { if (editingTask === 'new') { const r = await api.tasks.create(d); setTasks(t => [...t, r]) } else { const r = await api.tasks.update(editingTask.id, d); setTasks(t => t.map(x => x.id === r.id ? r : x)) } setEditingTask(null) }
  async function delTask(id) { await api.tasks.remove(id); setTasks(t => t.filter(x => x.id !== id)) }
  function openStudio(m) { if (m.module === 'book') { setBookOpen(true) } else if (m.module === 'drawprompt') { setDrawOpen(true) } else if (m.module === 'memory') { setMemOpen(true) } else if (m.module === 'ao3dice') { setDiceOpen(true) } else if (m.module === 'phone') { setPhoneOpen(true) } else if (m.module === 'game-room') { setGameRoomOpen(true) } else if (m.module === 'foresight') { setForesightOpen(true) } else if (m.module === 'music') { setMusicOpen(true) } else if (m.module === 'street-wander') { setWanderOpen(true) } else if (m.url) { window.open(m.url, '_blank') } else if (m.module) { setReader({ module: m.module, title: m.title, tabs: m.tabs }) } }

  return (
    <div className="panel workspace-panel">
      <div className="panel-scroll">
        <div className="ws-inner">
          <DecoLayer />
          <header className="ws-header">
            <img className="ws-title-img" src={TITLE} alt="Every version, yours" />
            <img className="ws-mascot-l" src={PANTHER_HEAD} alt="" />
            <img className="ws-mascot-r" src={CHEST} alt="美化面板" onClick={onOpenSettings} title="打开美化面板 ✨" />
            <img className="hdr-sticker" src={stickerAt(2)} style={{ position: "absolute", right: 92, top: -6, width: 32 }} alt="" />
            <img className="hdr-sticker" src={stickerAt(8)} style={{ position: "absolute", left: 86, top: 2, width: 28 }} alt="" />
            <img className="hdr-sticker" src={stickerAt(14)} style={{ position: "absolute", right: 4, top: 72, width: 30 }} alt="" />
          </header>

          <div className="search-wrap">
            <div className="search-border" />
            <span className="search-ico"><Icon name="search" size={20} color="var(--ink-soft)" /></span>
            <input className="search-box" placeholder="搜聊天、笔记、任务…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Squiggle w={120} color="#e0b15f" style={{ margin: "10px 0 0 6px", display: "block" }} />

          <div className="section-head note-section-head">
            <img className="pinned-img" src={PINNED_IMG} alt="Pinned notes" />
            <img className="head-sticker" src={stickerAt(1)} style={{ width: 28, marginLeft: 8, verticalAlign: "middle" }} alt="" />
            <button className="head-action" onClick={() => setEditingNote('new')}><img className="newnote-img" src={NEWNOTE_IMG} alt="New note" /></button>
          </div>
          <div className="notes-grid">
            {notesLoading ? <span className="muted" style={{ fontSize: 13, padding: "8px 4px" }}>载入便签…</span>
              : noteCards.length === 0 ? <span className="muted" style={{ fontSize: 13, padding: "8px 4px" }}>还没有便签，点 + 新建</span>
              : noteCards.map(n => <StickyNote key={n.id} note={n} onClick={() => setEditingNote(n)} onEdit={() => setEditingNote(n)} onDelete={() => delNote(n.id)} />)}
          </div>

          <div className="doodle-strip notes-doodle-strip">
            <WormCrown size={58} />
            <img className="ds-sticker ds-heart" src={stickerAt(3)} alt="" />
            <SpeechHeart size={30} />
            <Wave w={46} color="#cda98c" />
            <img className="ds-sticker ds-bug" src={stickerAt(5)} alt="" />
            <img className="ds-sticker" src={stickerAt(9)} alt="" />
          </div>
          <img className="ws-section-tape" src={TAPE_LONG[0]} alt="" />

          <div className="section-head conv-section-head">
            <img className="title-img title-conversations-img" src={TITLE_IMAGES.conversations} alt="Conversations" />
            <img className="head-sticker" src={stickerAt(6)} style={{ width: 26, marginLeft: 6, verticalAlign: "middle" }} alt="" />
            <button className="head-action recent-pill title-recent-pill" onClick={() => setShowAll(s => !s)}>
              <img className="title-recent-img" src={TITLE_IMAGES.recent} alt="Recent" />
            </button>
          </div>
          <div className="conv-list">
            {loading && convs.length === 0 ? <div className="muted" style={{ padding: "20px 12px", fontSize: 14 }}>载入对话…</div>
              : convs.length === 0 ? <div className="muted" style={{ padding: "20px 12px", fontSize: 14 }}>{q ? "没找到相关对话" : "还没有对话，点 New chat 新建"}</div>
              : convs.map((c, i) => <ConversationRow key={c.id} conv={c} last={i === convs.length - 1} onClick={() => onOpenChat(c)} onDelete={() => onDeleteConv && onDeleteConv(c)} />)}
          </div>
          {filtered.length > 3 && <button className="show-more" onClick={() => setShowAll(s => !s)}>{showAll ? "收起" : "展开更多"} <Icon name="chevron" size={15} color="var(--ink-soft)" style={{ transform: showAll ? "rotate(180deg)" : "none" }} /></button>}

          <div className="section-head task-section-head">
            <img className="title-img title-tasks-img" src={TITLE_IMAGES.tasks} alt="Tasks" />
            <span className="tasks-check"><Icon name="check" size={16} color="var(--brick)" /></span>
            <button className="head-action task-new-action" onClick={() => setEditingTask('new')}>
              <img className="title-new-task-img" src={TITLE_IMAGES.new_task} alt="New task" />
            </button>
          </div>
          <div className="task-grid">
            {tasksLoading ? <span className="muted" style={{ fontSize: 13, padding: "8px 4px" }}>载入任务…</span>
              : taskCards.length === 0 ? <span className="muted" style={{ fontSize: 13, padding: "8px 4px" }}>还没有任务，点 + New task</span>
              : taskCards.map(t => <TaskCard key={t.id} task={t} onToggle={() => toggleTask(t.id)} onEdit={() => setEditingTask(t)} onDelete={() => delTask(t.id)} />)}
          </div>
          <div className="doodle-strip center-strip task-doodle-strip"><Squiggle w={50} color="#e0b15f" /><img className="ds-sticker" src={stickerAt(3)} alt="" /><HeartLegs size={36} /><img className="ds-sticker" src={stickerAt(7)} alt="" /><img className="ds-sticker" src={stickerAt(11)} alt="" /><Squiggle w={50} color="#cdd6b8" /></div>
          <img className="ws-section-tape task-section-tape" src={TAPE_LONG[1] || TAPE_LONG[0]} alt="" />

          <div className="section-head quick-section-head"><h2>Quick actions</h2>
            <img className="quick-heart-sticker" src={STICKER_IMAGES["04_heart"] || stickerAt(3)} alt="" />
          </div>
          <div className="qa-grid">
            {QUICK_ACTIONS.map(qa => { const act = { qa1: onNewChat, qa2: () => setEditingNote('new'), qa3: () => setEditingTask('new'), qa4: onNewChat }[qa.id]; return <QuickAction key={qa.id} qa={qa} onClick={act || (() => {})} /> })}
          </div>

          <div className="section-head studio-section-head">
            <h2>Studio</h2><img className="head-sticker" src={stickerAt(4)} style={{ width: 28, marginLeft: 8, verticalAlign: "middle" }} alt="" /><Squiggle w={120} color="#d99a92" style={{ marginLeft: 12, marginBottom: 4 }} />
            <img className="studio-peek-bunny" src={KAWAII_IMAGES.kawaii_bunny_peeking_over_a_ledge} alt="" />
          </div>
          <div className="studio-grid">{STUDIO.map(m => <StudioCard key={m.id} mod={m} onClick={() => openStudio(m)} />)}</div>

          <div className="doodle-strip end-strip"><Wave w={40} color="#e0b15f" /><img className="ds-sticker" src={stickerAt(10)} alt="" /><img className="ds-sticker" src={stickerAt(15)} alt="" /><img className="ds-sticker" src={stickerAt(18)} alt="" /></div>
        </div>
      </div>
      {editingNote !== null && <NoteEditor note={editingNote === 'new' ? null : editingNote} onSave={saveNote} onClose={() => setEditingNote(null)} />}
      {editingTask !== null && <TaskEditor task={editingTask === 'new' ? null : editingTask} onSave={saveTask} onClose={() => setEditingTask(null)} />}
      {reader && <StudioReader module={reader.module} title={reader.title} tabs={reader.tabs} onClose={() => setReader(null)} />}
      {memOpen && <MemoryRiver onClose={() => setMemOpen(false)} />}
      {drawOpen && <DrawPrompt onClose={() => setDrawOpen(false)} />}
      {diceOpen && <DicePanel onClose={() => setDiceOpen(false)} />}
      {phoneOpen && <PhonePanel onClose={() => setPhoneOpen(false)} />}
      {musicOpen && <MusicPanel onClose={() => setMusicOpen(false)} />}
      {wanderOpen && <WanderPanel onClose={() => setWanderOpen(false)} />}
      {gameRoomOpen && <GameRoomPanel onClose={() => setGameRoomOpen(false)} />}
      {foresightOpen && <React.Suspense fallback={<div className="book-loading">翻找约定…</div>}><ForesightPanel onClose={() => setForesightOpen(false)} /></React.Suspense>}
      {bookOpen && <React.Suspense fallback={<div className="book-loading">载入阅读器…</div>}><BookReader onClose={() => setBookOpen(false)} /></React.Suspense>}
    </div>
  )
}
