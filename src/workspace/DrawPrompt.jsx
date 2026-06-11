import React from 'react'
import { api, API_BASE } from './api.js'
import { Icon } from './doodles.jsx'

const PENDING_KEY = 'ws_draw_pending'
function extractPrompt(text) {
  const m = String(text).split(/【\s*Prompt\s*】/i)
  return (m.length > 1 ? m[1] : text).trim()
}
function parseMem(free) {
  try { const l = String(free).split('\n').find(x => /^Mem:/.test(x.trim())); const p = l.trim().split(/\s+/); const total = +p[1], avail = +p[6]; if (!total) return null; const used = total - (avail || 0); return { total, used, pct: Math.round(used / total * 100) } } catch { return null }
}
function parseDisk(df) {
  try { const l = String(df).split('\n')[1]; const p = l.trim().split(/\s+/); return { size: p[1], used: p[2], pct: parseInt(p[4]) || 0 } } catch { return null }
}
function parseLoad(uptime) { const m = String(uptime).match(/load average[s]?:\s*([\d.]+)/); return m ? m[1] : '' }
function fmtAge(h) { if (h == null) return '—'; if (h < 1) return Math.max(1, Math.round(h * 60)) + ' 分钟前'; if (h < 24) return Math.round(h) + ' 小时前'; return Math.round(h / 24) + ' 天前' }

export default function DrawPrompt({ onClose }) {
  const [idea, setIdea] = React.useState('')
  const [out, setOut] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState('')
  const [copied, setCopied] = React.useState('')
  const [hist, setHist] = React.useState(() => { try { return JSON.parse(localStorage.getItem('ws_drawprompts') || '[]') } catch { return [] } })
  const [outIdea, setOutIdea] = React.useState('')
  const [saved, setSaved] = React.useState([])
  const [savingFav, setSavingFav] = React.useState(false)
  const pollRef = React.useRef(null)
  const fileRef = React.useRef(null)
  const [image, setImage] = React.useState('')
  const [imgUrl, setImgUrl] = React.useState('')
  const [uploading, setUploading] = React.useState(false)
  const [sys, setSys] = React.useState(null)
  const [sysOpen, setSysOpen] = React.useState(false)
  const [watch, setWatch] = React.useState(null)

  const stopPoll = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null } }
  const saveHist = (q, acc) => {
    if (!acc.trim()) return
    setHist(prev => { const next = [{ idea: q, out: acc, ts: Date.now() }, ...prev.filter(h => h.idea !== q)].slice(0, 8); try { localStorage.setItem('ws_drawprompts', JSON.stringify(next)) } catch {} ; return next })
  }
  const startPoll = (jobId) => {
    stopPoll(); setBusy(true); setErr('')
    pollRef.current = setInterval(async () => {
      try {
        const r = await api.drawStatus(jobId)
        if (r.text) setOut(r.text)
        if (r.status === 'done') { stopPoll(); setBusy(false); localStorage.removeItem(PENDING_KEY); setOutIdea(r.idea || ''); saveHist(r.idea || '', r.text || '') }
        else if (r.status === 'error') { stopPoll(); setBusy(false); setErr(r.error || '出错了'); localStorage.removeItem(PENDING_KEY) }
      } catch (e) { stopPoll(); setBusy(false); setErr('任务丢了或已过期，再试一次～'); localStorage.removeItem(PENDING_KEY) }
    }, 4000)
  }
  const onPick = async (e) => {
    const f = e.target.files && e.target.files[0]; if (e.target) e.target.value = ''
    if (!f) return
    setUploading(true); setErr('')
    try { const r = await api.uploadImage(f); setImage(r.filename); setImgUrl(API_BASE + r.url) }
    catch (er) { setErr('图片上传失败：' + (er.message || '')) }
    finally { setUploading(false) }
  }
  const clearImage = () => { setImage(''); setImgUrl('') }
  const gen = async () => {
    const q = idea.trim(); if ((!q && !image) || busy) return
    setBusy(true); setErr(''); setOut(''); setOutIdea(q || '逆向参考图画风')
    try {
      const r = await api.drawStart(q, image)
      if (!r || !r.jobId) throw new Error((r && r.error) || '启动失败')
      try { localStorage.setItem(PENDING_KEY, JSON.stringify({ jobId: r.jobId, idea: q, imgUrl })) } catch {}
      startPoll(r.jobId)
    } catch (e) { setBusy(false); setErr(e.message || '出错了') }
  }
  const copy = async (text, tag) => { try { await navigator.clipboard.writeText(text); setCopied(tag); setTimeout(() => setCopied(''), 1500) } catch {} }
  const isSaved = saved.some(s => s.text === out)
  const fav = async () => {
    if (savingFav || !out.trim() || isSaved) return
    setSavingFav(true)
    try { const it = await api.drawSave(outIdea || idea, out); setSaved(prev => [it, ...prev]) } catch (e) { setErr('收藏失败：' + e.message) } finally { setSavingFav(false) }
  }
  const delFav = async (id) => { try { await api.drawSavedDelete(id); setSaved(prev => prev.filter(x => x.id !== id)) } catch {} }
  const openFav = (it) => { setOut(it.text); setOutIdea(it.idea || ''); setIdea(it.idea || ''); setErr('') }

  // 恢复：切后台/关页面回来后，继续轮询未完成的任务
  React.useEffect(() => {
    try { const p = JSON.parse(localStorage.getItem(PENDING_KEY) || 'null'); if (p && p.jobId) { setIdea(p.idea || ''); if (p.imgUrl) setImgUrl(p.imgUrl); startPoll(p.jobId) } } catch {}
    api.drawSavedList().then(d => setSaved(d.items || [])).catch(() => {})
    return () => stopPoll()
  }, [])
  React.useEffect(() => {
    let alive = true
    Promise.all([
      api.vps.health().catch(() => null),
      api.vps.echoStatus().catch(() => null),
      api.memory.list({ source: 'weekly_health', per_page: 1, sort: 'created_at', order: 'desc' }).catch(() => null),
      api.watchHealth().catch(() => null),
    ]).then(([h, st, wk, w]) => {
      if (!alive) return
      setSys({ mem: h && parseMem(h.free), disk: h && parseDisk(h.df), load: h && parseLoad(h.uptime), status: st, weekly: (wk && wk.data && wk.data[0]) || null })
      if (w && w.ok) setWatch(w)
    })
    return () => { alive = false }
  }, [])

  return (
    <div className="studio-reader draw-prompt" role="dialog" aria-modal="true" aria-label="体检室">
      <div className="studio-reader-shell paper-bg">
        <style>{`
          .draw-prompt .studio-reader-shell { max-width: 680px; }
          .dp-body { flex: 1; overflow-y: auto; padding: 8px 16px 28px; }
          .dp-input { width: 100%; box-sizing: border-box; background: rgba(255,253,248,0.9); border: 1.5px solid rgba(120,95,70,0.25); border-radius: 14px; padding: 12px 14px; font-family: var(--font-cn); font-size: 14px; line-height: 1.6; color: var(--ink); resize: vertical; margin-top: 6px; }
          .dp-gen { width: 100%; margin-top: 10px; font-family: var(--font-cute); font-size: 16px; padding: 11px; border-radius: 14px; border: 1.5px solid var(--brick); background: var(--brick); color: #fff6ef; cursor: pointer; }
          .dp-gen[disabled] { opacity: 0.6; cursor: default; }
          .dp-hint { font-size: 11.5px; color: var(--ink-faint); font-family: var(--font-cn); margin-top: 8px; text-align: center; line-height: 1.5; }
          .dp-err { font-size: 12.5px; color: #c4452e; font-family: var(--font-cn); margin: 12px 2px; }
          .dp-out { margin-top: 16px; background: rgba(255,253,247,0.85); border: 1.5px solid rgba(120,95,70,0.2); border-radius: 16px; padding: 14px 16px; box-shadow: var(--card-shadow-sm); }
          .dp-out-text { font-family: var(--font-cn); font-size: 13.5px; line-height: 1.75; color: var(--ink); white-space: pre-wrap; word-break: break-word; margin: 0; }
          .dp-acts { display: flex; gap: 8px; margin-top: 12px; }
          .dp-copy { flex: 1; font-family: var(--font-cute); font-size: 13.5px; padding: 8px; border-radius: 11px; border: 1.5px solid var(--brick); background: var(--brick); color: #fff6ef; cursor: pointer; }
          .dp-copy.ghost { background: rgba(255,253,248,0.85); color: var(--ink-soft); border-color: rgba(120,95,70,0.25); }
          .dp-hist { margin-top: 20px; }
          .dp-hist-label { font-size: 11px; color: var(--ink-faint); font-family: var(--font-cn); letter-spacing: 1px; margin-bottom: 7px; }
          .dp-hist-item { display: block; width: 100%; text-align: left; font-family: var(--font-cn); font-size: 12.5px; color: var(--ink-soft); background: rgba(255,253,248,0.7); border: 1.3px solid rgba(120,95,70,0.18); border-radius: 10px; padding: 8px 11px; margin-bottom: 6px; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .dp-copy.fav { background: rgba(255,253,248,0.85); color: #c79a3a; border-color: #e2c073; }
          .dp-copy.fav.on { color: #b08828; background: #fbf2d8; }
          .dp-fav-row { display: flex; gap: 6px; align-items: center; }
          .dp-fav-item { flex: 1; margin-bottom: 0 !important; }
          .dp-fav-del { width: 30px; height: 32px; flex-shrink: 0; border-radius: 9px; border: 1.3px solid rgba(120,95,70,0.2); background: rgba(255,253,248,0.7); color: var(--ink-faint); cursor: pointer; margin-bottom: 6px; }
          .dp-fav-del:hover { color: #c4452e; border-color: #c4452e; }
          .dp-upload { width: 100%; margin-top: 8px; padding: 11px; border-radius: 14px; border: 1.5px dashed rgba(120,95,70,0.4); background: rgba(255,253,248,0.6); color: var(--ink-soft); font-family: var(--font-cn); font-size: 13.5px; cursor: pointer; }
          .dp-upload[disabled] { opacity: 0.6; }
          .dp-img { position: relative; margin-top: 8px; border-radius: 14px; overflow: hidden; border: 1.5px solid rgba(120,95,70,0.25); }
          .dp-img img { display: block; width: 100%; max-height: 240px; object-fit: cover; }
          .dp-img-x { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; border: none; background: rgba(40,30,22,0.55); color: #fff; cursor: pointer; font-size: 13px; }
          .dp-img-tag { position: absolute; left: 8px; bottom: 8px; background: rgba(40,30,22,0.55); color: #fff6ef; font-family: var(--font-cn); font-size: 12px; padding: 3px 10px; border-radius: 999px; }
          .dp-sys-wrap { margin: 4px 0 14px; }
          .dp-sys { width: 100%; display: flex; align-items: center; gap: 10px; padding: 11px 14px; border-radius: 14px; border: 1.5px solid rgba(120,95,70,0.2); background: rgba(255,253,248,0.82); cursor: pointer; box-shadow: var(--card-shadow-sm); }
          .dp-sys-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
          .dp-sys-dot.green { background: #67a36a; box-shadow: 0 0 6px rgba(103,163,106,0.6); }
          .dp-sys-dot.yellow { background: #d8a13a; box-shadow: 0 0 6px rgba(216,161,58,0.6); }
          .dp-sys-dot.red { background: #c4452e; box-shadow: 0 0 6px rgba(196,69,46,0.6); }
          .dp-sys-sum { flex: 1; text-align: left; font-family: var(--font-cn); font-size: 13px; color: var(--ink); }
          .dp-sys-chev { font-family: var(--font-cn); font-size: 12px; color: var(--brick); white-space: nowrap; }
          .dp-sys-detail { margin-top: 8px; padding: 12px 14px; border-radius: 14px; border: 1.3px solid rgba(120,95,70,0.16); background: rgba(255,253,247,0.7); }
          .dp-sys-row { display: flex; justify-content: space-between; font-family: var(--font-cn); font-size: 12.5px; color: var(--ink-soft); padding: 4px 0; }
          .dp-sys-row b { color: var(--ink); font-weight: 600; }
          .dp-sys-svcs { display: flex; flex-wrap: wrap; gap: 6px; margin: 9px 0 4px; }
          .dp-svc { font-family: var(--font-cn); font-size: 11.5px; padding: 3px 9px; border-radius: 9px; }
          .dp-svc.on { background: rgba(103,163,106,0.16); color: #4a7a4d; }
          .dp-svc.off { background: rgba(196,69,46,0.16); color: #c4452e; }
          .dp-sys-weekly { margin-top: 10px; }
          .dp-sys-weekly-h { font-family: var(--font-cn); font-size: 12px; color: var(--ink-soft); margin-bottom: 6px; }
          .dp-sys-weekly-b { font-family: var(--font-cn); font-size: 12px; line-height: 1.7; color: var(--ink); white-space: pre-wrap; word-break: break-word; max-height: 260px; overflow-y: auto; margin: 0; background: rgba(255,253,248,0.6); border-radius: 10px; padding: 10px; border: 1.2px solid rgba(120,95,70,0.14); }
          /* ── 新拟态(neumorphic) · 亚麻布底 ── */
          .draw-prompt .studio-reader-shell { max-width: 680px; background-color: #f1ece0; background-image: repeating-linear-gradient(0deg, rgba(150,125,95,0.030) 0, rgba(150,125,95,0.030) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(150,125,95,0.026) 0, rgba(150,125,95,0.026) 1px, transparent 1px, transparent 4px); }
          .draw-prompt .studio-reader-header { border-bottom: none; }
          .draw-prompt .studio-reader-mark { display: none; }
          .draw-prompt .studio-reader-title h2 { font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 700; font-size: 24px; color: #3a342a; }
          .draw-prompt .studio-reader-title p { color: #9d9081; }
          .draw-prompt .studio-reader-back { background: #f1ece0; border: none; box-shadow: 4px 4px 9px #d3ccba, -4px -4px 9px #fffdf4; }
          .draw-prompt .studio-reader-back:active { box-shadow: inset 3px 3px 6px #d3ccba, inset -3px -3px 6px #fffdf4; }
          .draw-prompt .dp-body { padding: 10px 18px 30px; }
          .draw-prompt .dp-sys { background: #f1ece0; border: none; border-radius: 16px; padding: 13px 18px; box-shadow: 5px 5px 11px #d3ccba, -5px -5px 11px #fffdf4; }
          .draw-prompt .dp-sys-sum { font-size: 14px; font-weight: 600; color: #3a342a; }
          .draw-prompt .dp-sys-chev { font-weight: 700; }
          .draw-prompt .dp-sys-detail { background: #f1ece0; border: none; border-radius: 16px; box-shadow: inset 3px 3px 7px #d3ccba, inset -3px -3px 7px #fffdf4; }
          .draw-prompt .dp-input { background: #f1ece0; border: none; border-radius: 18px; padding: 16px 18px; font-size: 14.5px; color: #4a4236; box-shadow: inset 4px 4px 9px #d3ccba, inset -4px -4px 9px #fffdf4; }
          .draw-prompt .dp-input::placeholder { color: #b3a892; }
          .draw-prompt .dp-upload { background: #f1ece0; border: 1.6px dashed #ccc0a7; border-radius: 16px; padding: 16px; color: #6b5d50; font-size: 14px; box-shadow: 3px 3px 7px #d3ccba, -3px -3px 7px #fffdf4; }
          .draw-prompt .dp-img { box-shadow: 4px 4px 10px #d3ccba, -4px -4px 10px #fffdf4; border: none; }
          .draw-prompt .dp-gen { background: linear-gradient(#c45c40, #a8472f); border: none; color: #fff6ef; font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 700; font-size: 17px; padding: 16px; border-radius: 18px; margin-top: 14px; box-shadow: 6px 6px 13px #d3ccba, -6px -6px 13px #fffdf4, inset 0 1px 0 rgba(255,255,255,0.28); }
          .draw-prompt .dp-gen:not([disabled]):active { box-shadow: inset 4px 4px 10px rgba(120,40,20,0.4), inset -2px -2px 6px rgba(255,255,255,0.12); }
          .draw-prompt .dp-gen[disabled] { opacity: 0.72; }
          .draw-prompt .dp-hint { background: #f1ece0; border-radius: 12px; padding: 9px 14px; margin-top: 12px; color: #9d9081; box-shadow: inset 2px 2px 5px #d3ccba, inset -2px -2px 5px #fffdf4; }
          .draw-prompt .dp-out { background: #f1ece0; border: none; border-radius: 18px; box-shadow: 5px 5px 11px #d3ccba, -5px -5px 11px #fffdf4; }
          .draw-prompt .dp-out-text { color: #4a4236; }
          .draw-prompt .dp-copy { border: none; border-radius: 12px; box-shadow: 3px 3px 7px #d3ccba, -3px -3px 7px #fffdf4; }
          .draw-prompt .dp-copy.ghost, .draw-prompt .dp-copy.fav { background: #f1ece0; color: #6b5d50; }
          .draw-prompt .dp-copy:not([disabled]):active { box-shadow: inset 2px 2px 5px #d3ccba, inset -2px -2px 5px #fffdf4; }
          .draw-prompt .dp-hist-label { color: #9d9081; }
          .draw-prompt .dp-hist-item { position: relative; background: #f1ece0; border: none; border-radius: 13px; padding: 13px 34px 13px 15px; font-size: 13px; color: #5a4d40; margin-bottom: 11px; white-space: normal; box-shadow: 3px 3px 8px #d3ccba, -3px -3px 8px #fffdf4; }
          .draw-prompt .dp-hist-item:not(.dp-fav-item)::after { content: '›'; position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #bcb09c; font-size: 19px; }
          .draw-prompt .dp-fav-del { background: #f1ece0; border: none; border-radius: 11px; width: 40px; height: 44px; color: #9d9081; box-shadow: 3px 3px 7px #d3ccba, -3px -3px 7px #fffdf4; }
          .draw-prompt .dp-fav-del:hover { color: #c4452e; }
          .draw-prompt .dp-body::after { content: 'CC studio'; display: block; text-align: right; font-family: 'Caveat', cursive; font-size: 18px; color: #c2b9a3; margin: 20px 8px 0; transform: rotate(-3deg); }
          .draw-prompt .dp-watch { background: #f1ece0; border-radius: 16px; padding: 14px 16px; margin: 0 0 14px; box-shadow: 5px 5px 11px #d3ccba, -5px -5px 11px #fffdf4; }
          .draw-prompt .dp-watch-h { font-family: var(--font-cn); font-size: 13.5px; font-weight: 600; color: #3a342a; margin-bottom: 12px; }
          .draw-prompt .dp-watch-stale { font-weight: 400; color: #c4452e; font-size: 12px; }
          .draw-prompt .dp-watch-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
          .draw-prompt .dp-w-item { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 11px 4px; border-radius: 12px; box-shadow: inset 2px 2px 5px #d3ccba, inset -2px -2px 5px #fffdf4; }
          .draw-prompt .dp-w-item b { font-family: 'Songti SC','Noto Serif SC',serif; font-size: 19px; color: #b1492f; font-weight: 700; line-height: 1; }
          .draw-prompt .dp-w-item span { font-family: var(--font-cn); font-size: 10.5px; color: #9d9081; }
          .draw-prompt .dp-watch-time { font-family: var(--font-cn); font-size: 11.5px; color: #9d9081; margin-top: 11px; text-align: right; }
          @media (max-width: 460px) { .draw-prompt .dp-watch-grid { grid-template-columns: repeat(3, 1fr); } }

        `}</style>

        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={onClose} aria-label="返回 Workspace">
            <Icon name="back" size={19} color="var(--ink)" />
          </button>
          <div className="studio-reader-mark tint-pink">
            <Icon name="image" size={22} color="var(--vermillion)" />
          </div>
          <div className="studio-reader-title">
            <h2>体检室</h2>
            <p>说想画什么 · CC 找画风给你 prompt</p>
          </div>
        </header>

        <div className="dp-body">
          {sys && (() => {
            const memPct = (sys.mem && sys.mem.pct) || 0
            const diskPct = (sys.disk && sys.disk.pct) || 0
            const svcs = sys.status && sys.status.services
            const anyDown = svcs ? Object.values(svcs).some(x => x.status !== 'online') : false
            const level = (memPct >= 93 || diskPct >= 93 || anyDown) ? 'red' : (memPct >= 85 || diskPct >= 85 || (sys.status && !sys.status.ok)) ? 'yellow' : 'green'
            const levelTxt = level === 'green' ? '系统正常' : level === 'yellow' ? '注意' : '告警'
            const SNAME = { studioApi: 'studio', bot: '微信', voice: '推特' }
            return (
              <div className="dp-sys-wrap">
                <button className="dp-sys" onClick={() => setSysOpen(o => !o)}>
                  <span className={'dp-sys-dot ' + level} />
                  <span className="dp-sys-sum">{levelTxt}{sys.mem ? ' · 内存 ' + memPct + '%' : ''}{sys.disk ? ' · 磁盘 ' + diskPct + '%' : ''}</span>
                  <span className="dp-sys-chev">{sysOpen ? '收起' : '系统体检 ▾'}</span>
                </button>
                {sysOpen && (
                  <div className="dp-sys-detail">
                    {sys.mem && <div className="dp-sys-row"><span>内存</span><b>{sys.mem.used} / {sys.mem.total} MB（{memPct}%）</b></div>}
                    {sys.disk && <div className="dp-sys-row"><span>磁盘</span><b>{sys.disk.used} / {sys.disk.size}（{diskPct}%）</b></div>}
                    {sys.load && <div className="dp-sys-row"><span>负载</span><b>{sys.load}</b></div>}
                    {svcs && <div className="dp-sys-svcs">{['studioApi', 'bot', 'voice'].map(k => svcs[k] ? <span key={k} className={'dp-svc ' + (svcs[k].status === 'online' ? 'on' : 'off')}>{SNAME[k]} {svcs[k].status === 'online' ? '✓' : '✕'}{svcs[k].restarts ? ' ·重启' + svcs[k].restarts : ''}</span> : null)}</div>}
                    {sys.weekly ? (
                      <div className="dp-sys-weekly">
                        <div className="dp-sys-weekly-h">📋 记忆库周报 · {String(sys.weekly.created_at).slice(0, 10)}</div>
                        <pre className="dp-sys-weekly-b">{sys.weekly.content}</pre>
                      </div>
                    ) : <div className="dp-sys-row"><span>记忆库周报</span><b>暂无</b></div>}
                  </div>
                )}
              </div>
            )
          })()}
          {watch && watch.metrics && (() => {
            const m = watch.metrics
            const fmt = (x, r) => x == null ? '—' : (r ? Math.round(x) : x)
            return (
              <div className="dp-watch">
                <div className="dp-watch-h">⌚ 身体信号{watch.stale && <span className="dp-watch-stale"> · 手表没在传，戴上就更新</span>}</div>
                <div className="dp-watch-grid">
                  <div className="dp-w-item"><b>{fmt(m.heart_rate.v)}</b><span>心率 bpm</span></div>
                  <div className="dp-w-item"><b>{fmt(m.resting_hr.v)}</b><span>静息</span></div>
                  <div className="dp-w-item"><b>{fmt(m.hrv_sdnn.v, true)}</b><span>HRV ms</span></div>
                  <div className="dp-w-item"><b>{fmt(m.steps.v)}</b><span>步数</span></div>
                  <div className="dp-w-item"><b>{fmt(m.active_energy.v, true)}</b><span>活动 kcal</span></div>
                </div>
                <div className="dp-watch-time">最近更新：{fmtAge(watch.ageHours)}</div>
              </div>
            )
          })()}
          <textarea className="dp-input" rows={3} placeholder={image ? '（可选）补充额外要求，比如改成暖色调、加点雨…' : '想画什么？例：一只在雨里撑伞的黑猫，温柔治愈，暖色调'}
            value={idea} onChange={(e) => setIdea(e.target.value)} disabled={busy} />
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onPick} />
          {imgUrl ? (
            <div className="dp-img">
              <img src={imgUrl} alt="参考图" />
              <span className="dp-img-tag">逆向这张图的画风</span>
              {!busy && <button className="dp-img-x" onClick={clearImage} aria-label="移除">✕</button>}
            </div>
          ) : (
            <button className="dp-upload" onClick={() => fileRef.current && fileRef.current.click()} disabled={busy || uploading}>{uploading ? '上传中…' : '＋ 上传例图　让 Echo 逆向画风'}</button>
          )}
          <button className="dp-gen" onClick={gen} disabled={busy || (!idea.trim() && !image)}>{busy ? '✦ 找灵感生成中…（约 1-2 分钟）' : '✦ 生成 prompt'}</button>
          <div className="dp-hint">{busy ? '✦ 可以切后台、甚至关掉页面，回来结果还在～' : 'CC 会去翻画风库 + 艺术家参考，稍等一下'}</div>

          {err && <div className="dp-err">{err}</div>}

          {out && (
            <div className="dp-out">
              <pre className="dp-out-text">{out}</pre>
              {!busy && (
                <div className="dp-acts">
                  <button className="dp-copy" onClick={() => copy(extractPrompt(out), 'p')}>{copied === 'p' ? '已复制 ✓' : '复制 Prompt'}</button>
                  <button className="dp-copy ghost" onClick={() => copy(out, 'all')}>{copied === 'all' ? '已复制 ✓' : '复制全部'}</button>
                  <button className={'dp-copy fav' + (isSaved ? ' on' : '')} onClick={fav} disabled={isSaved || savingFav}>{isSaved ? '★ 已收藏' : (savingFav ? '收藏中…' : '☆ 收藏')}</button>
                </div>
              )}
            </div>
          )}

          {saved.length > 0 && (
            <div className="dp-hist">
              <div className="dp-hist-label">★ 我的收藏（{saved.length}）· 换设备也在</div>
              {saved.map((it) => (
                <div key={it.id} className="dp-fav-row">
                  <button className="dp-hist-item dp-fav-item" onClick={() => openFav(it)}>{it.idea || it.text.slice(0, 24)}</button>
                  <button className="dp-fav-del" onClick={() => delFav(it.id)} aria-label="删除收藏">✕</button>
                </div>
              ))}
            </div>
          )}

          {hist.length > 0 && (
            <div className="dp-hist">
              <div className="dp-hist-label">最近（自动 · 只留 8 条）</div>
              {hist.map((h, i) => (
                <button key={i} className="dp-hist-item" onClick={() => { setIdea(h.idea); setOut(h.out); setErr('') }}>{h.idea}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
