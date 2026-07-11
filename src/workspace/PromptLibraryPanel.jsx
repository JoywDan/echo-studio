import React from 'react'
import { Icon, Heart, Sparkle, Star } from './doodles.jsx'
import { TornCard, Tape } from './components.jsx'
import visualCatalog from './assets/prompt-parlour-visual.json'

const SHELVES = [
  { id: 'visual', label: '画风', note: 'pick a world', color: 'lilac', slots: [{ id: 'style', label: '画风' }, { id: 'color', label: '配色' }, { id: 'texture', label: '材质' }] },
  { id: 'character', label: '人物', note: 'shape the cast', color: 'rose', slots: [{ id: 'character', label: '人设' }, { id: 'outfit', label: '服装' }, { id: 'pose', label: '姿势' }, { id: 'expression', label: '表情' }] },
  { id: 'scene', label: '场景', note: 'set the room', color: 'plum', slots: [{ id: 'background', label: '背景' }, { id: 'lighting', label: '光线' }, { id: 'mood', label: '氛围' }] },
  { id: 'camera', label: '镜头', note: 'frame the moment', color: 'mauve', slots: [{ id: 'camera', label: '镜头' }, { id: 'avoid', label: '负向词' }] },
]

const CATALOG_LOADERS = {
  visual: () => Promise.resolve(visualCatalog),
  character: () => import('./assets/prompt-parlour-character.json').then((module) => module.default),
  scene: () => import('./assets/prompt-parlour-scene.json').then((module) => module.default),
  camera: () => import('./assets/prompt-parlour-camera.json').then((module) => module.default),
}

const STARTER = [
  { id: 'subject-joy', label: 'Joy', en: 'Joy' },
  { id: 'subject-dan', label: 'Dan', en: 'Dan' },
]

function composePrompt(parts) { return parts.length ? parts.map((item) => item.en).filter(Boolean).join(', ') : 'Joy and Dan' }

export default function PromptLibraryPanel({ onClose }) {
  const [activeShelf, setActiveShelf] = React.useState('visual')
  const [activeSlot, setActiveSlot] = React.useState('style')
  const [catalog, setCatalog] = React.useState(visualCatalog)
  const [selected, setSelected] = React.useState(STARTER)
  const [copied, setCopied] = React.useState(false)
  const shelf = SHELVES.find((item) => item.id === activeShelf) || SHELVES[0]
  const slot = shelf.slots.find((item) => item.id === activeSlot) || shelf.slots[0]
  const choices = catalog.slots?.[slot.id] || []

  React.useEffect(() => {
    let active = true
    setActiveSlot(shelf.slots[0].id)
    CATALOG_LOADERS[shelf.id]().then((nextCatalog) => { if (active) setCatalog(nextCatalog) })
    return () => { active = false }
  }, [shelf.id])

  const toggleChoice = (choice) => {
    setSelected((current) => current.some((item) => item.id === choice.id) ? current.filter((item) => item.id !== choice.id) : [...current, choice])
    setCopied(false)
  }

  const copyPrompt = async () => {
    try { await navigator.clipboard.writeText(composePrompt(selected)); setCopied(true) }
    catch { setCopied(false) }
  }

  return (
    <div className="prompt-parlour" role="dialog" aria-modal="true" aria-label="Prompt Parlour">
      <section className="prompt-parlour-shell prompt-parlour-skin">
        <header className="prompt-parlour-header">
          <span className="prompt-dial" aria-hidden="true"><i /></span>
          <div className="prompt-parlour-title"><span className="prompt-parlour-kicker">JOY'S LITTLE</span><h2>Prompt Parlour <Heart size={16} color="#b45f91" fill="#e6aac8" /></h2><p>把画面慢慢挑出来</p></div>
          <div className="prompt-window-controls"><span className="prompt-window-min" aria-hidden="true">−</span><button className="prompt-window-close" onClick={onClose} aria-label="返回 Studio">×</button></div>
        </header>

        <div className="prompt-parlour-scroll">
          <TornCard className="prompt-preview-card"><span className="prompt-paperclip" aria-hidden="true" /><Tape kind="pink" style={{ top: -12, right: '7%', transform: 'rotate(-9deg)' }} /><div className="prompt-preview-label"><Sparkle size={15} color="#9b5b8a" /> 今日的小配方</div><div className="prompt-preview-text">{composePrompt(selected)}</div><span className="prompt-preview-doodles" aria-hidden="true">☆ ♡</span></TornCard>
          <div className="prompt-shelf-tabs" role="tablist" aria-label="Prompt 分类">
            {SHELVES.map((item) => <button key={item.id} className={'prompt-shelf-tab ' + item.color + (activeShelf === item.id ? ' is-active' : '')} onClick={() => setActiveShelf(item.id)} role="tab" aria-selected={activeShelf === item.id}><span>{item.label}</span><small>{item.note}</small></button>)}
          </div>
          <section className={'prompt-choice-paper ' + shelf.color}>
            <div className="prompt-choice-heading"><div><span>选一点</span><h3>{slot.label}</h3></div><Sparkle size={21} color="#b45f91" /></div>
            <div className="prompt-subslot-tabs">{shelf.slots.map((item) => <button key={item.id} className={activeSlot === item.id ? 'is-active' : ''} onClick={() => setActiveSlot(item.id)}>{item.label}</button>)}</div>
            <div className="prompt-choice-list">{choices.map((choice) => { const active = selected.some((item) => item.id === choice.id); return <button key={choice.id} className={'prompt-choice ' + (active ? 'is-selected' : '')} onClick={() => toggleChoice(choice)} title={choice.major + ' · ' + choice.minor}><span>{active ? '✦' : '○'}</span><b>{choice.label}</b><small>{choice.en}</small></button> })}</div>
          </section>
        </div>

        <footer className="prompt-parlour-footer"><button className="prompt-clear" onClick={() => { setSelected(STARTER); setCopied(false) }}>重来</button><button className="prompt-copy" onClick={copyPrompt}>{copied ? '已经放进剪贴板' : '复制小配方'} <span>↗</span></button></footer>
      </section>
    </div>
  )
}
