import React from 'react'
import { api } from '../api.js'

const IDENTITIES = [
  { id: 'joy', name: 'Joy', mark: 'J' },
  { id: 'dan', name: 'Dan', mark: 'D' },
  { id: 'echo', name: 'Echo', mark: 'E' },
]

const SCENES = [
  ['random', '完全随机'],
  ['unnecessary_action', '莫名其妙的行动'],
  ['tiny_disaster', '微型灾难之后'],
  ['defeated_by_object', '被日用品打败'],
  ['wrong_scale', '尺寸严重不合'],
  ['solemn_triviality', '过度郑重的小事'],
  ['waiting_shutdown', '等待到灵魂关机'],
  ['calm_misuse', '错误但平静的使用方式'],
  ['animal_mismatch', '与动物的情绪错位'],
  ['exhausted_nothing', '什么也没做却筋疲力尽'],
]

const ABSURDITY = [
  ['light', '轻微'],
  ['medium', '中等'],
  ['heavy', '重度'],
]

const RATIOS = ['1:1', '3:4', '3:2']
const ACTIVE_JOB_KEY = 'prompt_soul_offline_active_job'

function extensionFor(blob) {
  if (blob.type.includes('png')) return 'png'
  if (blob.type.includes('webp')) return 'webp'
  return 'jpg'
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1200)
}

export default function SoulOfflinePanel({ onClose }) {
  const [identities, setIdentities] = React.useState([])
  const [cast, setCast] = React.useState([])
  const [sceneType, setSceneType] = React.useState('random')
  const [absurdity, setAbsurdity] = React.useState('medium')
  const [ratio, setRatio] = React.useState('1:1')
  const [activeJobId, setActiveJobId] = React.useState(() => localStorage.getItem(ACTIVE_JOB_KEY) || '')
  const [working, setWorking] = React.useState(Boolean(activeJobId))
  const [uploading, setUploading] = React.useState('')
  const [result, setResult] = React.useState(null)
  const [history, setHistory] = React.useState([])
  const [error, setError] = React.useState('')
  const [copied, setCopied] = React.useState(false)
  const [exporting, setExporting] = React.useState(false)

  const refreshIdentities = React.useCallback(async () => {
    const data = await api.promptParlour.identities()
    setIdentities(data.identities || [])
    return data.identities || []
  }, [])

  const refreshHistory = React.useCallback(async () => {
    const data = await api.promptParlour.history(40)
    setHistory((data.jobs || []).filter((job) => job.type === 'soul_offline' && job.status === 'done').slice(0, 8))
  }, [])

  React.useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const next = await refreshIdentities()
        if (!cancelled) setCast((current) => current.length ? current : next.filter((item) => item.status === 'ready').slice(0, 1).map((item) => item.id))
        await refreshHistory()
      } catch (nextError) {
        if (!cancelled) setError(nextError.message || '角色衣帽间暂时打不开')
      }
    }
    load()
    return () => { cancelled = true }
  }, [refreshHistory, refreshIdentities])

  React.useEffect(() => {
    if (!identities.some((identity) => identity.status === 'analyzing')) return undefined
    const timer = setInterval(() => refreshIdentities().catch(() => {}), 2400)
    return () => clearInterval(timer)
  }, [identities, refreshIdentities])

  React.useEffect(() => {
    if (!activeJobId) return undefined
    let cancelled = false
    let timer
    const poll = async () => {
      try {
        const job = await api.promptParlour.job(activeJobId)
        if (cancelled) return
        if (job.status === 'done') {
          localStorage.removeItem(ACTIVE_JOB_KEY)
          setActiveJobId('')
          setWorking(false)
          setResult(job.result)
          setCopied(false)
          await refreshHistory()
          return
        }
        if (job.status === 'error') {
          localStorage.removeItem(ACTIVE_JOB_KEY)
          setActiveJobId('')
          setWorking(false)
          setError(job.error || '这次坏得不够好，再试一次')
          return
        }
        timer = setTimeout(poll, 1800)
      } catch (nextError) {
        if (!cancelled) {
          setWorking(false)
          setError(nextError.message || '任务状态读取失败')
        }
      }
    }
    poll()
    const resume = () => { if (document.visibilityState === 'visible') { clearTimeout(timer); poll() } }
    document.addEventListener('visibilitychange', resume)
    window.addEventListener('focus', resume)
    return () => {
      cancelled = true
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', resume)
      window.removeEventListener('focus', resume)
    }
  }, [activeJobId, refreshHistory])

  const toggleCast = (id) => {
    setCast((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id].slice(0, 3))
    setResult(null)
    setCopied(false)
  }

  const uploadAnchor = async (id, file) => {
    if (!file) return
    setUploading(id)
    setError('')
    try {
      await api.promptParlour.uploadIdentity(id, file)
      await refreshIdentities()
    } catch (nextError) {
      setError(nextError.message || '锚点图上传失败')
    } finally {
      setUploading('')
    }
  }

  const removeAnchor = async (id, imageId) => {
    setError('')
    try {
      await api.promptParlour.removeIdentityImage(id, imageId)
      setCast((current) => current.filter((item) => item !== id))
      await refreshIdentities()
    } catch (nextError) {
      setError(nextError.message || '锚点图删除失败')
    }
  }

  const generate = async () => {
    if (!cast.length) { setError('先选至少一位角色'); return }
    const unavailable = cast.map((id) => identities.find((item) => item.id === id)).filter((item) => item?.status !== 'ready')
    if (unavailable.length) { setError(`${unavailable.map((item) => item.name).join('、')} 的人设锚点还没准备好`); return }
    setWorking(true)
    setError('')
    setResult(null)
    setCopied(false)
    try {
      const started = await api.promptParlour.startSoulOffline({ cast, sceneType, absurdity, ratio })
      localStorage.setItem(ACTIVE_JOB_KEY, started.jobId)
      setActiveJobId(started.jobId)
    } catch (nextError) {
      setWorking(false)
      setError(nextError.message || '灵魂暂时没有成功离线')
    }
  }

  const copyPrompt = async () => {
    if (!result?.prompt) return
    const text = `${result.prompt}\n\nNEGATIVE PROMPT — ${result.negativePrompt || ''}`
    try { await navigator.clipboard.writeText(text); setCopied(true) } catch { setCopied(false) }
  }

  const exportPack = async () => {
    if (!result?.prompt) return
    setExporting(true)
    setError('')
    try {
      const chosen = identities.filter((identity) => result.cast?.includes(identity.id) || cast.includes(identity.id))
      const files = [new File([`${result.prompt}\n\nNEGATIVE PROMPT — ${result.negativePrompt || ''}`], 'soul-offline-prompt.txt', { type: 'text/plain' })]
      for (const identity of chosen) {
        for (let index = 0; index < identity.images.length; index += 1) {
          const image = identity.images[index]
          const blob = await api.promptParlour.identityImageBlob(identity.id, image.id)
          files.push(new File([blob], `${identity.name}-reference-${index + 1}.${extensionFor(blob)}`, { type: blob.type || 'image/jpeg' }))
        }
      }
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files }))) {
        await navigator.share({ title: '灵魂离线生图包', files })
      } else {
        for (const file of files) downloadBlob(file, file.name)
      }
    } catch (nextError) {
      if (nextError.name !== 'AbortError') setError(nextError.message || '生图包导出失败')
    } finally {
      setExporting(false)
    }
  }

  const loadHistory = (job) => {
    setCast(job.input?.cast || [])
    setSceneType(job.input?.sceneType || 'random')
    setAbsurdity(job.input?.absurdity || 'medium')
    setRatio(job.input?.ratio || '1:1')
    setResult(job.result)
    setCopied(false)
  }

  return <section className="soul-offline-sheet" aria-label="灵魂离线模式">
    <header className="soul-offline-head">
      <div><small>虚無ちび化</small><h3>灵魂离线模式</h3></div>
      <button onClick={onClose} aria-label="关闭灵魂离线模式">×</button>
    </header>

    <div className="soul-section soul-identities">
      <div className="soul-section-title"><b>角色衣帽间</b><span>选 1～3 位</span></div>
      <div className="soul-identity-grid">
        {IDENTITIES.map((base) => {
          const identity = identities.find((item) => item.id === base.id) || { ...base, status: 'empty', images: [] }
          const selected = cast.includes(base.id)
          return <article key={base.id} className={`soul-identity ${selected ? 'is-selected' : ''}`}>
            <button className="soul-identity-main" onClick={() => toggleCast(base.id)} disabled={identity.status !== 'ready'}>
              <span className="soul-identity-mark">{base.mark}</span>
              <b>{base.name}</b>
              <small>{identity.status === 'ready' ? identity.profile?.summaryZh || '身份已锁定' : identity.status === 'analyzing' ? '正在读取锚点…' : identity.status === 'error' ? '分析失败' : '还没有锚点'}</small>
            </button>
            <div className="soul-anchor-strip">
              {(identity.images || []).map((image) => <span key={image.id} className="soul-anchor-thumb"><img src={image.thumbnail} alt={`${base.name} 锚点`} /><button onClick={() => removeAnchor(base.id, image.id)} aria-label="删除锚点">×</button></span>)}
              {(identity.images || []).length < 3 && <label className="soul-anchor-add"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { uploadAnchor(base.id, event.target.files?.[0]); event.target.value = '' }} /><span>{uploading === base.id ? '…' : '+'}</span></label>}
            </div>
          </article>
        })}
      </div>
    </div>

    <div className="soul-section">
      <div className="soul-section-title"><b>坏掉方式</b><span>{SCENES.find(([id]) => id === sceneType)?.[1]}</span></div>
      <div className="soul-scene-chips">{SCENES.map(([id, label]) => <button key={id} className={sceneType === id ? 'is-active' : ''} onClick={() => setSceneType(id)}>{label}</button>)}</div>
    </div>

    <div className="soul-control-row">
      <fieldset><legend>荒诞程度</legend><div>{ABSURDITY.map(([id, label]) => <button type="button" key={id} className={absurdity === id ? 'is-active' : ''} onClick={() => setAbsurdity(id)}>{label}</button>)}</div></fieldset>
      <fieldset><legend>画面比例</legend><div>{RATIOS.map((value) => <button type="button" key={value} className={ratio === value ? 'is-active' : ''} onClick={() => setRatio(value)}>{value}</button>)}</div></fieldset>
    </div>

    {error && <p className="soul-error">{error}</p>}
    <button className="soul-generate" onClick={generate} disabled={working}>{working ? '灵魂正在慢慢离线，切走也没关系…' : result ? '换一种坏掉方式' : '让她暂时失去灵魂'}</button>

    {result && <section className="soul-result">
      <div className="soul-result-title"><div><small>{result.sceneMeta?.modeLabel}</small><h4>{result.titleZh}</h4></div><span>{result.ratio}</span></div>
      <p>{result.explanationZh}</p>
      <div className="soul-result-meta"><span>{result.sceneMeta?.propCategory}</span><span>{result.sceneMeta?.prop}</span><span>{result.sceneMeta?.pose}</span><span>{result.sceneMeta?.compositionPosition}</span></div>
      <pre>{result.prompt}</pre>
      <div className="soul-result-actions"><button onClick={copyPrompt}>{copied ? '已经复制' : '复制 Prompt'}</button><button onClick={exportPack} disabled={exporting}>{exporting ? '正在整理…' : '导出生图包'}</button></div>
    </section>}

    {history.length > 0 && <section className="soul-history"><div className="soul-section-title"><b>最近坏掉记录</b><span>{history.length}/8</span></div><div>{history.map((job) => <button key={job.id} onClick={() => loadHistory(job)}><b>{job.result?.titleZh || '无题'}</b><small>{(job.input?.cast || []).map((id) => IDENTITIES.find((item) => item.id === id)?.name).filter(Boolean).join(' + ')}</small></button>)}</div></section>}
  </section>
}
