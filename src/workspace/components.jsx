import React from 'react'
import { DECO_POOL, KAWAII_IMAGES, STICKER_IMAGES } from './assets.js'
import { Star, Heart, Sparkle, Squiggle, Wave, Flower, FlowerFace, StarFace, HeartLegs, Cloud, Rainbow, SpeechHeart, DashFly, Icon } from './doodles.jsx'
import { Rabbit, PinkBlobCrown, FuzzGreen, CupcakeCyclops, RunCloudGreen, GreenAlien, BearWave, PainterBlob, WriterPink, CatCamera, BlobTrio, SleepCloud } from './creatures.jsx'
/* components.jsx — crayon scrapbook UI primitives */

const TINT = {
  pink:  { fill: "var(--pink)",  ink: "var(--pink-ink)",  edge: "var(--pink-edge)" },
  sage:  { fill: "var(--sage)",  ink: "var(--sage-ink)",  edge: "var(--sage-edge)" },
  cream: { fill: "var(--cream)", ink: "var(--cream-ink)", edge: "var(--cream-edge)" },
  blue:  { fill: "var(--blue)",  ink: "var(--blue-ink)",  edge: "var(--blue-edge)" },
};
const CREATURE = {
  PinkBlobCrown, FuzzGreen, CupcakeCyclops, RunCloudGreen, GreenAlien, Rabbit,
  BearWave, PainterBlob, WriterPink, CatCamera, BlobTrio, SleepCloud,
};

/* ——— torn paper (deckled white note) ——— */
function TornCard({ children, className = "", style, onClick }) {
  return (
    <div className={"torn " + className} style={style} onClick={onClick}>
      <div className="torn-bg" />
      {children}
    </div>
  );
}

/* ——— crayon-filled colored card w/ wobbly hand border ——— */
function CrayonCard({ children, tint = "pink", edge, className = "", style, onClick, dbl = true }) {
  const t = TINT[tint] || TINT.pink;
  return (
    <div className={"crayon-card " + className} onClick={onClick}
      style={{ "--tint": t.fill, "--edge": edge ? (TINT[edge] || TINT.pink).edge : t.edge, ...style }}>
      <div className="crayon-bg" />
      <div className={"hand-border" + (dbl ? " dbl" : "")} />
      {children}
    </div>
  );
}

/* ——— tape / clips ——— */
function Tape({ kind = "plain", className = "", style }) {
  return <span className={"tape " + kind + " " + className} style={style} aria-hidden="true" />;
}
function BinderClip({ size = 26, style }) {
  return (
    <svg className="clip" width={size} height={size * 1.15} viewBox="0 0 26 30" style={style} aria-hidden="true">
      <rect x="6" y="2" width="14" height="8" rx="2" fill="#b85c4a" stroke="#8f3a25" strokeWidth="1.2" />
      <path d="M9 10v14a4 4 0 0 0 8 0V10" fill="none" stroke="#6b5d50" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 4h6" stroke="#d98c7a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function Paperclip({ size = 30, color = "#b39a86", style }) {
  return (
    <svg className="clip" width={size} height={size} viewBox="0 0 30 30" style={style} aria-hidden="true">
      <path d="M9 22V11a4 4 0 0 1 8 0v12a6 6 0 0 1-12 0V12"
        fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ——— small studio icons ——— */
function MiniIcon({ name, size = 30, style }) {
  const I = "#5a4e42";
  const s = { stroke: I, strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };
  const m = {
    monitor: <><rect x="4" y="4" width="20" height="15" rx="2" {...s} fill="#cfd8de" /><path d="M10 12l3 3 5-6" {...s} stroke="#b1492f" /><path d="M11 19h6M9 23h10" {...s} /><path d="M21 2l1 2.5 2.5 .5-2 1.8.5 2.5L21 8l-2.5 1.3.5-2.5-2-1.8 2.5-.5z" fill="#e6c45f" stroke="#d6a83e" strokeWidth="0.8" /></>,
    pic: <><rect x="4" y="5" width="20" height="15" rx="2" {...s} fill="#cdd8de" /><circle cx="9" cy="10" r="1.6" fill="#e8c45f" stroke="none" /><path d="M5 18l5-5 3 3 4-4 6 6" {...s} /><circle cx="13" cy="12" r="1" fill="#3a3027" stroke="none" /></>,
    book: <><path d="M14 6c-3-2-7-2-10 0v16c3-2 7-2 10 0M14 6c3-2 7-2 10 0v16c-3-2-7-2-10 0M14 6v16" {...s} fill="#f1e6c4" /></>,
    envelope: <><rect x="4" y="6" width="20" height="14" rx="2" {...s} fill="#f3ece0" /><path d="M4 8l10 7 10-7" {...s} /><path d="M14 14.5c.5-.8 1.8-.5 1.8.4 0 .8-1.8 1.9-1.8 1.9s-1.8-1.1-1.8-1.9c0-.9 1.3-1.2 1.8-.4z" fill="#b1492f" stroke="none" /></>,
    moon: <><path d="M21 15A8 8 0 0 1 10 4 8.5 8.5 0 1 0 21 15z" {...s} fill="#f1e2b0" /></>,
    river: <><path d="M6 4c-3 4 4 7 1 11s2 7-1 11" {...s} stroke="#8fa6c0" fill="none" /><path d="M11 4c-3 4 4 7 1 11s2 7-1 11" {...s} stroke="#a7bcc6" fill="none" /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 28 28" style={style} aria-hidden="true">{m[name] || null}</svg>;
}

/* ——— section header ——— */
function SectionHead({ en, zh, underline = "#e6b4ac", action, onAction, doodle }) {
  return (
    <div className="section-head">
      <h2>{en}{zh && <span className="he-zh"> {zh}</span>}</h2>
      {doodle}
      {action && <button className="head-action" onClick={onAction}>{action}</button>}
    </div>
  );
}

/* ——— pinned sticky note ——— */
function StickyNote({ note, onClick, onEdit, onDelete }) {
  const t = TINT[note.tint] || TINT.pink;
  const Creature = CREATURE[note.creature];
  return (
    <div className={"sticky sticky-layout-" + (note.layout || 0)} style={{ "--rot": (note.rotate || 0) + "deg" }} onClick={onClick}>
      {(onEdit || onDelete) && <div className="sticky-acts">
        {onEdit && <button className="round-btn sm" onClick={(e) => { e.stopPropagation(); onEdit() }} aria-label="编辑"><Icon name="edit" size={13} color="var(--ink-soft)" /></button>}
        {onDelete && <button className="round-btn sm" onClick={(e) => { e.stopPropagation(); onDelete() }} aria-label="删除"><Icon name="trash" size={13} color="var(--brick)" /></button>}
      </div>}
      {note.washiUrl ? <img className={"washi-tape washi-layout-" + (note.layout || 0)} src={note.washiUrl} alt="" style={note.washiStyle} /> : <Tape kind={note.tape} style={{ top: -13, left: 26, transform: "rotate(-8deg)", width: 70, height: 30 }} />}
      {note.clipUrl && <img className="note-clip-asset" src={note.clipUrl} alt="" style={note.clipStyle} />}
      <CrayonCard tint={note.tint} className="sticky-card">
        <div className="sticky-body">
          <div className="sticky-title-row">
            <span className="sticky-title" style={{ color: "var(--ink)" }}>{note.title}</span>
            {note.crown && <StarFace size={24} color="#e8c45f" style={{ flexShrink: 0 }} />}
            {note.sticker === "flower" && <FlowerFace size={26} style={{ flexShrink: 0 }} />}
          </div>
          <span className="sticky-rule" style={{ background: t.edge }} />
          {note.numbered ? (
            <ol className="sticky-ol">{note.items.map((it, i) => <li key={i}><span className="num">{i + 1}.</span>{it}</li>)}</ol>
          ) : (
            <ul className="sticky-ul">{note.items.map((it, i) => <li key={i}><span className="bull" style={{ background: t.ink }} />{it}</li>)}</ul>
          )}
          {note.stickers ? note.stickers.map((s, si) => <img key={si} className="note-sticker" src={s.src} alt="" style={s.style} />) : (Creature && <Creature size={40} style={{ position: "absolute", left: 12, bottom: 10 }} />)}
        </div>
      </CrayonCard>
    </div>
  );
}

/* ——— conversation row ——— */
function ConversationRow({ conv, onClick, last, onDelete }) {
  const Creature = CREATURE[conv.creature] || RunCloudGreen;
  const stop = (e) => e.stopPropagation();
  return (
    <div className={"conv-row" + (conv.active ? " active" : "")} onClick={onClick}>
      {conv.active && <span className="wash conv-wash" />}
      <span className="conv-av">{conv.avatarUrl ? <img className="conv-panther-avatar" src={conv.avatarUrl} alt="" /> : <Creature size={48} />}</span>
      <div className="conv-main">
        <div className="conv-top">
          <span className="conv-title">{conv.title}</span>
          <span className="conv-time">{conv.time}</span>
        </div>
        <div className="conv-preview">{conv.preview}</div>
      </div>
      <div className="conv-actions">
        <button className="round-btn" onClick={stop} aria-label="编辑"><Icon name="edit" size={15} color="var(--ink-soft)" /></button>
        <button className="round-btn" onClick={(e) => { stop(e); onDelete && onDelete() }} aria-label="删除"><Icon name="trash" size={15} color="var(--brick)" /></button>
      </div>
      {!last && <span className="conv-divider" aria-hidden="true" />}
    </div>
  );
}

/* ——— task card ——— */
function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const t = TINT[task.tint] || TINT.cream;
  const stop = (e) => e.stopPropagation();
  return (
    <div className="task-wrap" style={{ "--rot": (task.rot || 0) + "deg" }}>
      {task.washiUrl ? <img className={"task-washi-tape task-washi-layout-" + (task.layout || 0)} src={task.washiUrl} alt="" style={task.washiStyle} /> : (task.tape && <Tape kind={task.tape} style={{ top: -12, left: -6, transform: "rotate(-24deg)", width: 62, height: 26 }} />)}
      {task.clipUrl ? <img className="task-clip-asset" src={task.clipUrl} alt="" style={task.clipStyle} /> : (task.clip && <BinderClip size={26} style={{ top: -16, left: "50%", marginLeft: -13 }} />)}
      <CrayonCard tint={task.tint} className={"task-card" + (task.punch ? " punch" : "") + (task.receipt ? " receipt" : "")}>
        <div className="task-inner">
          <button className={"task-check" + (task.done ? " done" : "")} onClick={onToggle} aria-label="完成">
            {task.done && <Icon name="check" size={14} color="#fff" />}
          </button>
          <div className="task-text">{task.text}</div>
        </div>
        <div className="task-foot">
          <span className="task-due" style={{ color: "var(--brick)" }}>{task.due}</span>
          <span className="task-foot-icons">
            <Icon name={task.icon} size={17} color="var(--ink-faint)" />
            <button className="round-btn sm" onClick={(e) => { stop(e); onEdit && onEdit() }}><Icon name="edit" size={13} color="var(--ink-soft)" /></button>
            <button className="round-btn sm" onClick={(e) => { stop(e); onDelete && onDelete() }}><Icon name="trash" size={13} color="var(--brick)" /></button>
          </span>
        </div>
        {task.stickers ? task.stickers.map((s, si) => <img key={si} className="task-sticker-img" src={s.src} alt="" style={s.style} />) : null}
        {!task.stickers && task.sticker === "star" && <StarFace size={26} style={{ position: "absolute", right: 14, bottom: -6 }} />}
        {!task.stickers && task.sticker === "flower" && <Flower size={22} color="#d98c84" style={{ position: "absolute", right: 14, bottom: 8 }} />}
        {!task.stickers && task.sticker === "heartlegs" && <HeartLegs size={34} style={{ position: "absolute", right: 8, bottom: -4 }} />}
        {task.cloud && <Cloud size={26} style={{ position: "absolute", right: 14, top: 10 }} />}
        {task.stamp && <span className="task-stamp" />}
      </CrayonCard>
    </div>
  );
}

/* ——— quick action ——— */
function QuickAction({ qa, onClick }) {
  const mainSticker = KAWAII_IMAGES[qa.sticker];
  const accent = STICKER_IMAGES[qa.accent];
  return (
    <button className="quick-action" onClick={onClick}>
      <CrayonCard tint="pink" edge={qa.edge} className="qa-card" dbl={false}
        style={{ "--tint": "rgba(255,253,247,0.55)" }}>
        {mainSticker && <img className="qa-main-sticker" src={mainSticker} alt="" />}
        {accent && <img className="qa-accent-sticker" src={accent} alt="" />}
        <span className="qa-icon"><SmileIcon name={qa.icon} /></span>
        <span className="qa-label">{qa.label}</span>
      </CrayonCard>
      {qa.flower && <Flower size={20} color="#e6a6ab" style={{ position: "absolute", left: -8, bottom: 18 }} />}
      <Heart size={12} color="var(--brick)" style={{ position: "absolute", right: 8, top: 6 }} />
    </button>
  );
}
/* line icon with a tiny smile face */
function SmileIcon({ name }) {
  return (
    <span style={{ position: "relative", display: "grid", placeItems: "center" }}>
      <Icon name={name} size={28} color="var(--ink)" stroke={1.7} />
    </span>
  );
}

/* ——— studio card ——— */
function StudioCard({ mod, onClick }) {
  const Creature = CREATURE[mod.creature];
  const studioStickers = {
    s1: [
      ["kawaii_computer_monitor_with_checkmark_face", "studio-kai monitor"],
      ["kawaii_teddy_bear_waving_sticker", "studio-kai bear"],
      ["03_star", "studio-st star"],
      ["04_heart", "studio-st heart"],
    ],
    s2: [
      ["cute_girl_drawing_in_notebook", "studio-kai girl"],
      ["05_flower", "studio-st flower"],
      ["03_star", "studio-st star small"],
    ],
    s3: [
      ["cute_girl_drawing_in_notebook", "studio-kai writer"],
      ["04_heart", "studio-st heart big"],
      ["05_flower", "studio-st flower"],
    ],
    s4: [
      ["smiling_kawaii_envelope_with_heart_seal", "studio-kai envelope"],
      ["04_heart", "studio-st heart"],
      ["09_lightning", "studio-st spark"],
    ],
    s5: [
      ["kawaii_paper_sheet_with_smile", "studio-kai pic"],
      ["05_flower", "studio-st flower"],
      ["03_star", "studio-st star"],
    ],
    s6: [
      ["sleepy_cloud_and_starry_night", "studio-kai cloud"],
      ["08_moon", "studio-st moon"],
      ["03_star", "studio-st star"],
    ],
    s7: [
      ["01_bear", "studio-st blob a"],
      ["02_bunny", "studio-st blob b"],
      ["04_heart", "studio-st heart"],
    ],
    s8: [
      ["05_flower", "studio-st flower river"],
      ["07_cloud", "studio-st cloud"],
      ["03_star", "studio-st star river"],
    ],
  }[mod.id] || [];
  return (
    <button className="studio-card" onClick={onClick}>
      {mod.clip && <Paperclip size={28} color="#b39a86" style={{ top: -14, right: 22, transform: "rotate(12deg)" }} />}
      <CrayonCard tint="pink" edge={mod.edge} dbl={false} className="studio-inner" style={{ "--tint": "rgba(255,253,247,0.5)" }}>
        <span className="studio-deco-fill" style={{ "--scol": (TINT[mod.edge] || TINT.pink).edge }} />
        {mod.icon && <span className="studio-icon"><MiniIcon name={mod.icon} size={34} /></span>}
        <span className={"studio-title" + (mod.english ? " en" : "")}>{mod.title}</span>
        {Creature && <Creature size={mod.creature === "BlobTrio" ? 56 : 40} style={{ position: "absolute", left: 12, bottom: 10 }} />}
        <span className="studio-asset-stickers">
          {studioStickers.map(([name, cls]) => {
            const src = KAWAII_IMAGES[name] || STICKER_IMAGES[name];
            return src ? <img key={name + cls} className={cls} src={src} alt="" /> : null;
          })}
        </span>
        <span className="studio-doodles">
          {(mod.deco || []).includes("heart") && <Heart size={16} color="var(--brick)" fill="same" style={{ position: "absolute", right: 14, top: 12 }} />}
          {(mod.deco || []).includes("star") && <Star size={15} fill="same" style={{ position: "absolute", right: 16, top: 30 }} />}
          {(mod.deco || []).includes("flower") && <Flower size={16} color="#d98c84" style={{ position: "absolute", right: 18, top: 16 }} />}
          {(mod.deco || []).includes("arrow") && <span className="studio-arrow">↗</span>}
          {(mod.deco || []).includes("plane") && <span className="studio-plane">✈</span>}
          {(mod.deco || []).includes("flowerface") && <FlowerFace size={26} style={{ position: "absolute", right: 12, bottom: 12 }} />}
        </span>
      </CrayonCard>
    </button>
  );
}

export { TornCard, CrayonCard, Tape, BinderClip, Paperclip, MiniIcon, SectionHead, StickyNote, ConversationRow, TaskCard, QuickAction, StudioCard, TINT };

/* 兼容旧 NoteEditor/TaskEditor（[fill, edge] 数组 + Sticker 占位）*/
export const TINT_MAP = {
  yellow: ['var(--cream)', 'var(--cream-edge)'],
  blue:   ['var(--blue)',  'var(--blue-edge)'],
  pink:   ['var(--pink)',  'var(--pink-edge)'],
  green:  ['var(--sage)',  'var(--sage-edge)'],
  sage:   ['var(--sage)',  'var(--sage-edge)'],
  cream:  ['var(--cream)', 'var(--cream-edge)'],
}
export function Sticker() { return null }

export function DecoLayer() {
  const N = 42
  const items = Array.from({ length: N }, (_, i) => {
    const r = (s) => { const x = Math.sin(i * 12.9898 + s * 7.233) * 43758.5453; return x - Math.floor(x) }
    const onLeft = i % 2 === 0
    const left = onLeft ? r(1) * 11 : 87 + r(2) * 11
    const top = (i + 0.5) / N * 100 + (r(3) - 0.5) * 8
    const size = 22 + r(4) * 32
    const rot = (r(5) - 0.5) * 48
    return { src: DECO_POOL[(i * 5 + 2) % DECO_POOL.length], left, top, size, rot }
  })
  return (<div className="deco-layer" aria-hidden="true">
    {items.map((it, i) => <img key={i} src={it.src} alt="" style={{ position: "absolute", left: it.left + "%", top: it.top + "%", width: it.size, transform: "rotate(" + it.rot + "deg)" }} />)}
  </div>)
}
