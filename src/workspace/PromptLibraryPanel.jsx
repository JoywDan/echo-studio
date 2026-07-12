import React from 'react'
import { api } from '../api.js'
import { Heart, Sparkle } from './doodles.jsx'
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
  character: () => import('./assets/prompt-parlour-character.json').then((m) => m.default),
  scene: () => import('./assets/prompt-parlour-scene.json').then((m) => m.default),
  camera: () => import('./assets/prompt-parlour-camera.json').then((m) => m.default),
}

const STARTER = [{ id: 'subject-joy', label: 'Joy', en: 'Joy' }, { id: 'subject-dan', label: 'Dan', en: 'Dan' }]
const ACTIVE_JOB_KEY = 'prompt_parlour_active_job'
const SLOT_LABELS = Object.fromEntries(SHELVES.flatMap((s) => s.slots.map((slot) => [slot.id, slot.label])))
const tokens = (text) => String(text || '').toLowerCase().match(/[a-z0-9\u4e00-\u9fff]+/g) || []
const composePrompt = (parts) => parts.map((item) => item.en).filter(Boolean).join(', ') || 'Joy and Dan'

function scoreChoice(choice, suggestion) {
  let score = 0
  if (choice.major === suggestion.major) score += 60
  if (choice.minor === suggestion.minor) score += 80
  const wanted = new Set(tokens(`${suggestion.phrase} ${suggestion.labelZh}`))
  for (const token of tokens(`${choice.en} ${choice.label}`)) if (wanted.has(token)) score += token.length > 3 ? 5 : 2
  return score
}

export default function PromptLibraryPanel({ onClose }) {
  const [activeShelf, setActiveShelf] = React.useState('visual')
  const [activeSlot, setActiveSlot] = React.useState('style')
  const [catalog, setCatalog] = React.useState(visualCatalog)
  const [selected, setSelected] = React.useState(STARTER)
  const [copied, setCopied] = React.useState(false)
  const [assistantMode, setAssistantMode] = React.useState('')
  const [intent, setIntent] = React.useState('')
  const [imageFile, setImageFile] = React.useState(null)
  const [draft, setDraft] = React.useState(null)
  const [matched, setMatched] = React.useState([])
  const [working, setWorking] = React.useState(false)
  const [error, setError] = React.useState('')
  const shelf = SHELVES.find((item) => item.id === activeShelf) || SHELVES[0]
  const slot = shelf.slots.find((item) => item.id === activeSlot) || shelf.slots[0]
  const choices = catalog.slots?.[slot.id] || []

  React.useEffect(() => {
    let active = true
    setActiveSlot(shelf.slots[0].id)
    CATALOG_LOADERS[shelf.id]().then((next) => { if (active) setCatalog(next) })
    return () => { active = false }
  }, [shelf.id])

  const finishJob = React.useCallback(async (job) => {
    if (job.status === 'working') return false
    localStorage.removeItem(ACTIVE_JOB_KEY)
    setWorking(false)
    if (job.status === 'error') { setError(job.error || '这次没有配好，再试一次'); return true }
    setDraft(job.result)
    await matchDraft(job.result)
    return true
  }, [])

  React.useEffect(() => {
    let active = true
    let timer
    const poll = async () => {
      const jobId = localStorage.getItem(ACTIVE_JOB_KEY)
      if (!jobId || !active) return
      setWorking(true)
      try {
        const job = await api.promptParlour.job(jobId)
        if (!(await finishJob(job)) && active) timer = setTimeout(poll, 1800)
      } catch (e) {
        if (e.message?.includes('过期')) localStorage.removeItem(ACTIVE_JOB_KEY)
        setWorking(false); setError(e.message || '任务状态读取失败')
      }
    }
    const resume = () => { if (document.visibilityState === 'visible') { clearTimeout(timer); poll() } }
    poll()
    document.addEventListener('visibilitychange', resume)
    window.addEventListener('focus', resume)
    return () => { active = false; clearTimeout(timer); document.removeEventListener('visibilitychange', resume); window.removeEventListener('focus', resume) }
  }, [finishJob])

  const toggleChoice = (choice) => {
    setSelected((current) => current.some((item) => item.id === choice.id) ? current.filter((item) => item.id !== choice.id) : [...current, choice])
    setCopied(false)
  }

  const matchDraft = async (nextDraft) => {
    const catalogs = await Promise.all(Object.values(CATALOG_LOADERS).map((load) => load()))
    const results = []
    for (const [slotId, suggestion] of Object.entries(nextDraft.suggestions || {})) {
      const pool = catalogs.flatMap((item) => item.slots?.[slotId] || [])
      const best = pool.map((choice) => ({ choice, score: scoreChoice(choice, suggestion) })).sort((a, b) => b.score - a.score)[0]
      results.push({ slotId, suggestion, choice: best?.score >= 60 ? best.choice : null })
    }
    setMatched(results)
  }

  const runAssistant = async () => {
    setWorking(true); setError(''); setDraft(null); setMatched([])
    try {
      const started = assistantMode === 'image' ? await api.promptParlour.startReverse(imageFile, intent) : await api.promptParlour.startCompose(intent)
      localStorage.setItem(ACTIVE_JOB_KEY, started.jobId)
      const check = async () => {
        const job = await api.promptParlour.job(started.jobId)
        if (await finishJob(job)) return
        setTimeout(check, 1800)
      }
      check()
    } catch (e) { setError(e.message || '这次没有配好，再试一次') }
  }

  const applyDraft = () => {
    const additions = matched.filter((item) => item.choice).map((item) => item.choice)
    const subject = draft?.subject ? [{ id: `ai-subject-${Date.now()}`, label: draft.subjectZh || '画面主体', en: draft.subject }] : []
    const traits = draft?.styleAnchor?.traits?.length ? [{ id: `ai-anchor-${Date.now()}`, label: '风格锚点', en: draft.styleAnchor.traits.join(', ') }] : []
    setSelected((current) => [...current.filter((item) => !additions.some((add) => add.id === item.id)), ...subject, ...traits, ...additions])
    setAssistantMode(''); setCopied(false)
  }

  const copyPrompt = async () => {
    try { await navigator.clipboard.writeText(composePrompt(selected)); setCopied(true) } catch { setCopied(false) }
  }

  return <div className="prompt-parlour" role="dialog" aria-modal="true" aria-label="Prompt Parlour">
    <section className="prompt-parlour-shell prompt-parlour-skin">
      <header className="prompt-parlour-header">
        <span className="prompt-dial" aria-hidden="true"><i /></span>
        <div className="prompt-parlour-title"><span className="prompt-parlour-kicker">JOY'S LITTLE</span><h2>Prompt Parlour <Heart size={16} color="#b45f91" fill="#e6aac8" /></h2><p>把画面慢慢挑出来</p></div>
        <div className="prompt-window-controls"><span className="prompt-window-min" aria-hidden="true">−</span><button className="prompt-window-close" onClick={onClose} aria-label="返回 Studio">×</button></div>
      </header>

      <div className="prompt-parlour-scroll">
        <div className="prompt-ai-actions"><button onClick={() => { setAssistantMode('image'); setDraft(null); setError('') }}>▣ 看图反推</button><button onClick={() => { setAssistantMode('text'); setDraft(null); setError('') }}>✦ 一句话创作</button></div>
        {assistantMode && <section className="prompt-ai-sheet">
          <div className="prompt-ai-sheet-head"><div><small>{assistantMode === 'image' ? 'reverse a picture' : 'tell me the scene'}</small><h3>{assistantMode === 'image' ? '看图反推' : '一句话创作'}</h3></div><button onClick={() => setAssistantMode('')} aria-label="关闭">×</button></div>
          {assistantMode === 'image' && <label className="prompt-ai-upload"><input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} /><span>{imageFile ? imageFile.name : '选择一张参考图'}</span></label>}
          <textarea value={intent} onChange={(e) => setIntent(e.target.value)} placeholder={assistantMode === 'image' ? '可选：想重点分析画风、光影或构图…' : '例如：Joy 穿家居服，在窗边喝咖啡…'} />
          <button className="prompt-ai-run" disabled={working || (assistantMode === 'text' ? !intent.trim() : !imageFile)} onClick={runAssistant}>{working ? 'VPS 正在后台配图，切走也没关系…' : '帮我配一版'}</button>
          {error && <p className="prompt-ai-error">{error}</p>}
          {draft && <div className="prompt-ai-result"><h4>{draft.subjectZh || '这幅画'}</h4><p>{draft.notesZh}</p><div className="prompt-ai-match-list">{matched.map(({ slotId, suggestion, choice }) => <div key={slotId} className={choice ? '' : 'is-unmatched'}><b>{SLOT_LABELS[slotId] || slotId}</b><span>{suggestion.labelZh}</span><small>{choice ? choice.en : `素材库暂无精确匹配：${suggestion.phrase}`}</small></div>)}</div><button className="prompt-ai-apply" onClick={applyDraft}>应用已匹配的配方</button></div>}
        </section>}

        <TornCard className="prompt-preview-card"><span className="prompt-paperclip" aria-hidden="true" /><Tape kind="pink" style={{ top: -12, right: '7%', transform: 'rotate(-9deg)' }} /><div className="prompt-preview-label"><Sparkle size={15} color="#9b5b8a" /> 今日的小配方</div><div className="prompt-preview-text">{composePrompt(selected)}</div><span className="prompt-preview-doodles" aria-hidden="true">☆ ♡</span></TornCard>
        <div className="prompt-shelf-tabs" role="tablist" aria-label="Prompt 分类">{SHELVES.map((item) => <button key={item.id} className={'prompt-shelf-tab ' + item.color + (activeShelf === item.id ? ' is-active' : '')} onClick={() => setActiveShelf(item.id)} role="tab" aria-selected={activeShelf === item.id}><span>{item.label}</span><small>{item.note}</small></button>)}</div>
        <section className={'prompt-choice-paper ' + shelf.color}><div className="prompt-choice-heading"><div><span>选一点</span><h3>{slot.label}</h3></div><Sparkle size={21} color="#b45f91" /></div><div className="prompt-subslot-tabs">{shelf.slots.map((item) => <button key={item.id} className={activeSlot === item.id ? 'is-active' : ''} onClick={() => setActiveSlot(item.id)}>{item.label}</button>)}</div><div className="prompt-choice-list">{choices.map((choice) => { const active = selected.some((item) => item.id === choice.id); return <button key={choice.id} className={'prompt-choice ' + (active ? 'is-selected' : '')} onClick={() => toggleChoice(choice)} title={`${choice.major} > ${choice.minor}`}><span>{active ? '✓' : '○'}</span><b>{choice.label}</b><small>{choice.en}</small></button> })}</div></section>
      </div>
      <footer className="prompt-parlour-footer"><button className="prompt-clear" onClick={() => { setSelected(STARTER); setCopied(false) }}>重来</button><button className="prompt-copy" onClick={copyPrompt}>{copied ? '已经放进剪贴板' : '复制小配方'} <span>↗</span></button></footer>
    </section>
  </div>
}
