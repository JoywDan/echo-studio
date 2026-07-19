import React from 'react'
import { api } from '../api.js'
import { Heart, Sparkle } from './doodles.jsx'
import { TornCard, Tape } from './components.jsx'
import visualCatalog from './assets/prompt-parlour-visual.json'
import { summarizePromptChoice, summarizePromptText } from './promptKeywords.js'
import SoulOfflinePanel from './SoulOfflinePanel.jsx'

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
let allCatalogsPromise
const loadAllCatalogs = () => allCatalogsPromise ||= Promise.all(Object.values(CATALOG_LOADERS).map((load) => load()))

function scoreChoice(choice, suggestion) {
  let score = 0
  if (choice.major === suggestion.major) score += 60
  if (choice.minor === suggestion.minor) score += 80
  const wanted = new Set(tokens(`${suggestion.phrase} ${suggestion.labelZh}`))
  const summary = summarizePromptChoice(choice)
  for (const token of tokens(`${choice.en} ${choice.label} ${summary.keywords.join(' ')}`)) if (wanted.has(token)) score += token.length > 3 ? 5 : 2
  return score
}

function jobVariants(result) {
  return Array.isArray(result?.variants) ? result.variants : result ? [result] : []
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
  const [variantCount, setVariantCount] = React.useState(3)
  const [variants, setVariants] = React.useState([])
  const [variantIndex, setVariantIndex] = React.useState(0)
  const [matched, setMatched] = React.useState([])
  const [lockedSlots, setLockedSlots] = React.useState(new Set())
  const [working, setWorking] = React.useState(false)
  const [error, setError] = React.useState('')
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [history, setHistory] = React.useState([])
  const [choiceSearch, setChoiceSearch] = React.useState('')
  const draft = variants[variantIndex] || null
  const shelf = SHELVES.find((item) => item.id === activeShelf) || SHELVES[0]
  const slot = shelf.slots.find((item) => item.id === activeSlot) || shelf.slots[0]
  const choices = catalog.slots?.[slot.id] || []
  const choiceViews = React.useMemo(() => choices.map((choice) => ({ choice, summary: summarizePromptChoice(choice, slot.id) })), [choices, slot.id])
  const visibleChoices = React.useMemo(() => {
    const query = choiceSearch.trim().toLowerCase()
    if (!query) return choiceViews
    return choiceViews.filter(({ choice, summary }) => `${choice.label} ${choice.major} ${choice.minor} ${summary.searchText}`.toLowerCase().includes(query))
  }, [choiceViews, choiceSearch])

  React.useEffect(() => {
    let active = true
    setActiveSlot(shelf.slots[0].id)
    CATALOG_LOADERS[shelf.id]().then((next) => { if (active) setCatalog(next) })
    return () => { active = false }
  }, [shelf.id])

  React.useEffect(() => { setChoiceSearch('') }, [activeSlot])

  const matchDraft = React.useCallback(async (nextDraft) => {
    if (!nextDraft) { setMatched([]); return }
    const catalogs = await loadAllCatalogs()
    const results = []
    for (const [slotId, suggestion] of Object.entries(nextDraft.suggestions || {})) {
      const pool = catalogs.flatMap((item) => item.slots?.[slotId] || [])
      const best = pool.map((choice) => ({ choice, score: scoreChoice(choice, suggestion) })).sort((a, b) => b.score - a.score)[0]
      results.push({ slotId, suggestion, choice: best?.score >= 60 ? best.choice : null })
    }
    setMatched(results)
  }, [])

  const showResult = React.useCallback(async (result, index = 0) => {
    const nextVariants = jobVariants(result)
    setVariants(nextVariants)
    setVariantIndex(Math.min(index, Math.max(0, nextVariants.length - 1)))
    setLockedSlots(new Set())
    await matchDraft(nextVariants[index] || nextVariants[0])
  }, [matchDraft])

  const finishJob = React.useCallback(async (job) => {
    if (job.status === 'queued' || job.status === 'working') return false
    localStorage.removeItem(ACTIVE_JOB_KEY)
    setWorking(false)
    if (job.status === 'error') { setError(job.error || '这次没有配好，再试一次'); return true }
    await showResult(job.result)
    return true
  }, [showResult])

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
      } catch (e) { setWorking(false); setError(e.message || '任务状态读取失败') }
    }
    const resume = () => { if (document.visibilityState === 'visible') { clearTimeout(timer); poll() } }
    poll()
    document.addEventListener('visibilitychange', resume)
    window.addEventListener('focus', resume)
    return () => { active = false; clearTimeout(timer); document.removeEventListener('visibilitychange', resume); window.removeEventListener('focus', resume) }
  }, [finishJob])

  React.useEffect(() => { matchDraft(draft) }, [draft, matchDraft])

  const toggleChoice = (choice) => {
    setSelected((current) => current.some((item) => item.id === choice.id) ? current.filter((item) => item.id !== choice.id) : [...current, choice])
    setCopied(false)
  }

  const startPolling = async (jobId) => {
    localStorage.setItem(ACTIVE_JOB_KEY, jobId)
    const check = async () => {
      try {
        const job = await api.promptParlour.job(jobId)
        if (await finishJob(job)) return
        setTimeout(check, 1800)
      } catch (e) {
        setWorking(false)
        setError(e.message || '任务状态读取失败，回到页面后会自动续查')
      }
    }
    check()
  }

  const runAssistant = async ({ remix = false } = {}) => {
    setWorking(true); setError('')
    if (!remix) { setVariants([]); setMatched([]); setLockedSlots(new Set()) }
    try {
      const locks = Object.fromEntries(matched.filter((item) => lockedSlots.has(item.slotId)).map((item) => [item.slotId, item.choice?.en || item.suggestion.phrase]))
      const options = { count: variantCount, locks, previous: remix ? draft : undefined }
      const description = intent.trim() || draft?.subjectZh || draft?.subject || ''
      const started = assistantMode === 'image' && !remix
        ? await api.promptParlour.startReverse(imageFile, intent, options)
        : await api.promptParlour.startCompose(description, options)
      await startPolling(started.jobId)
    } catch (e) { setWorking(false); setError(e.message || '这次没有配好，再试一次') }
  }

  const openHistory = async () => {
    setHistoryOpen(true); setError('')
    try { setHistory(((await api.promptParlour.history(30)).jobs || []).filter((job) => job.type !== 'soul_offline').slice(0, 20)) }
    catch (e) { setError(e.message || '历史读取失败') }
  }

  const loadHistoryJob = async (job) => {
    if (job.status !== 'done') return
    setIntent(job.input?.intent || job.input?.focus || '')
    setVariantCount(job.input?.count || 3)
    setAssistantMode(job.type === 'reverse' ? 'image' : 'text')
    setHistoryOpen(false)
    await showResult(job.result)
  }

  const switchVariant = async (index) => { setVariantIndex(index); setLockedSlots(new Set()); await matchDraft(variants[index]) }
  const toggleLock = (slotId) => setLockedSlots((current) => { const next = new Set(current); next.has(slotId) ? next.delete(slotId) : next.add(slotId); return next })

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
      <header className="prompt-parlour-header"><span className="prompt-dial" aria-hidden="true"><i /></span><div className="prompt-parlour-title"><span className="prompt-parlour-kicker">JOY'S LITTLE</span><h2>Prompt Parlour <Heart size={16} color="#b45f91" fill="#e6aac8" /></h2><p>把画面慢慢挑出来</p></div><div className="prompt-window-controls"><span className="prompt-window-min" aria-hidden="true">−</span><button className="prompt-window-close" onClick={onClose} aria-label="返回 Studio">×</button></div></header>

      <div className="prompt-parlour-scroll">
        <div className="prompt-ai-actions prompt-ai-actions-v3"><button onClick={() => { setAssistantMode('image'); setVariants([]); setError('') }}>▣ 看图反推</button><button onClick={() => { setAssistantMode('text'); setVariants([]); setError('') }}>✦ 一句话创作</button><button onClick={() => { setAssistantMode('soul'); setVariants([]); setError('') }}>○ 灵魂离线</button><button onClick={openHistory}>⌛ 历史</button></div>

        {historyOpen && <section className="prompt-ai-sheet prompt-history-sheet"><div className="prompt-ai-sheet-head"><div><small>saved forever</small><h3>配方历史</h3></div><button onClick={() => setHistoryOpen(false)}>×</button></div><div className="prompt-history-list">{history.length ? history.map((job) => <button key={job.id} disabled={job.status !== 'done'} onClick={() => loadHistoryJob(job)}><b>{job.result?.variants?.[0]?.titleZh || job.result?.titleZh || job.input?.intent || (job.type === 'compose' ? '自由灵感' : '看图反推')}</b><span>{job.status === 'done' ? `${job.result?.variants?.length || 1} 套方案` : job.status === 'error' ? '失败' : '仍在制作'}</span><small>{new Date(job.createdAt).toLocaleString('zh-CN')}</small></button>) : <p>还没有历史配方</p>}</div></section>}

        {assistantMode === 'soul' && <SoulOfflinePanel onClose={() => setAssistantMode('')} />}

        {assistantMode && assistantMode !== 'soul' && <section className="prompt-ai-sheet">
          <div className="prompt-ai-sheet-head"><div><small>{assistantMode === 'image' ? 'reverse a picture' : 'tell me the scene'}</small><h3>{assistantMode === 'image' ? '看图反推' : '一句话创作'}</h3></div><button onClick={() => setAssistantMode('')} aria-label="关闭">×</button></div>
          {assistantMode === 'image' && !draft && <label className="prompt-ai-upload"><input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} /><span>{imageFile ? imageFile.name : '选择一张参考图'}</span></label>}
          {!draft && <textarea value={intent} onChange={(e) => setIntent(e.target.value)} placeholder={assistantMode === 'image' ? '可选：想重点分析画风、光影或构图…' : '写一句你的画面；留空则让系统为 Joy 和 Dan 天马行空…'} />}
          <div className="prompt-variant-count"><span>给我几套</span>{[3, 5, 8].map((count) => <button key={count} className={variantCount === count ? 'is-active' : ''} onClick={() => setVariantCount(count)}>{count}</button>)}</div>
          {!draft && <button className="prompt-ai-run" disabled={working || (assistantMode === 'image' && !imageFile)} onClick={() => runAssistant()}>{working ? 'VPS 正在后台做多套配方，切走也没关系…' : assistantMode === 'text' && !intent.trim() ? `随机灵感 ${variantCount} 套` : `帮我配 ${variantCount} 套`}</button>}
          {error && <p className="prompt-ai-error">{error}</p>}

          {draft && <div className="prompt-ai-result">
            {variants.length > 1 && <div className="prompt-variant-tabs">{variants.map((item, index) => <button key={index} className={variantIndex === index ? 'is-active' : ''} onClick={() => switchVariant(index)}>{index + 1}. {item.titleZh || `方案 ${index + 1}`}</button>)}</div>}
            <h4>{draft.titleZh || draft.subjectZh || '这幅画'}</h4><p>{draft.subjectZh}</p><p>{draft.notesZh}</p>
            <div className="prompt-ai-match-list">{matched.map(({ slotId, suggestion, choice }) => { const fallback = summarizePromptText(suggestion.phrase, slotId); return <div key={slotId} className={(choice ? '' : 'is-unmatched') + (lockedSlots.has(slotId) ? ' is-locked' : '')}><button className="prompt-slot-lock" onClick={() => toggleLock(slotId)} aria-label={lockedSlots.has(slotId) ? `解锁${SLOT_LABELS[slotId]}` : `锁定${SLOT_LABELS[slotId]}`}>{lockedSlots.has(slotId) ? '●' : '○'}</button><b>{SLOT_LABELS[slotId] || slotId}</b><span>{suggestion.labelZh}</span><small>{choice ? choice.en : `关键词：${fallback.keywords.join(' · ')}`}</small></div> })}</div>
            <div className="prompt-result-actions"><button onClick={() => runAssistant({ remix: true })} disabled={working}>{working ? '后台重配中…' : `只重配未锁定 (${lockedSlots.size} 项已锁)`}</button><button className="prompt-ai-apply" onClick={applyDraft}>应用这一套</button></div>
          </div>}
        </section>}

        <TornCard className="prompt-preview-card"><span className="prompt-paperclip" aria-hidden="true" /><Tape kind="pink" style={{ top: -12, right: '7%', transform: 'rotate(-9deg)' }} /><div className="prompt-preview-label"><Sparkle size={15} color="#9b5b8a" /> 今日的小配方</div><div className="prompt-preview-text">{composePrompt(selected)}</div><span className="prompt-preview-doodles" aria-hidden="true">☆ ♡</span></TornCard>
        <div className="prompt-shelf-tabs" role="tablist" aria-label="Prompt 分类">{SHELVES.map((item) => <button key={item.id} className={'prompt-shelf-tab ' + item.color + (activeShelf === item.id ? ' is-active' : '')} onClick={() => setActiveShelf(item.id)} role="tab" aria-selected={activeShelf === item.id}><span>{item.label}</span><small>{item.note}</small></button>)}</div>
        <section className={'prompt-choice-paper ' + shelf.color}>
          <div className="prompt-choice-heading"><div><span>选一点</span><h3>{slot.label}</h3></div><Sparkle size={21} color="#b45f91" /></div>
          <div className="prompt-subslot-tabs">{shelf.slots.map((item) => <button key={item.id} className={activeSlot === item.id ? 'is-active' : ''} onClick={() => setActiveSlot(item.id)}>{item.label}</button>)}</div>
          <label className="prompt-choice-search"><span>⌕</span><input value={choiceSearch} onChange={(event) => setChoiceSearch(event.target.value)} placeholder={`搜索${slot.label}关键词…`} /></label>
          <div className="prompt-choice-list">{visibleChoices.map(({ choice, summary }) => { const active = selected.some((item) => item.id === choice.id); return <button key={choice.id} className={'prompt-choice ' + (active ? 'is-selected' : '') + (summary.unclassified ? ' is-keyword-summary' : '')} onClick={() => toggleChoice(choice)} title={`${choice.major} > ${choice.minor}\n${choice.en}`}><span>{active ? '✓' : '○'}</span><b>{summary.unclassified ? summary.title : choice.label}</b>{summary.unclassified && <em>{summary.keywords.slice(0, 6).map((keyword) => <i key={keyword}>{keyword}</i>)}</em>}<small>{choice.en}</small></button> })}</div>
          {!visibleChoices.length && <p className="prompt-choice-empty">没有找到这个关键词</p>}
        </section>
      </div>
      <footer className="prompt-parlour-footer"><button className="prompt-clear" onClick={() => { setSelected(STARTER); setCopied(false) }}>重来</button><button className="prompt-copy" onClick={copyPrompt}>{copied ? '已经放进剪贴板' : '复制小配方'} <span>↗</span></button></footer>
    </section>
  </div>
}
