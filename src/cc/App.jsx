import React from 'react'
import { ccApi, getCCToken, setCCToken, clearCCToken } from './api.js'

const STATUS_MAP = { running: ['运行中', '#c79a3a'], done: ['完成 ✓', '#3a7d44'], failed: ['失败 ✗', '#a7372a'], stopped: ['已停止', '#95897c'] }
function fmtTime(ms) { if (!ms) return ''; const d = new Date(ms); return d.toLocaleString('zh-CN', { hour12: false, month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) }

export default function App() {
  const [authed, setAuthed] = React.useState(getCCToken() ? true : false)
  const [tokenInput, setTokenInput] = React.useState('')
  const [authErr, setAuthErr] = React.useState('')
  const [projects, setProjects] = React.useState([])
  const [project, setProject] = React.useState(() => localStorage.getItem('cc_last_project') || '')
  const [task, setTask] = React.useState('')
  const [budget, setBudget] = React.useState(5)
  const [active, setActive] = React.useState(null)   // { id, status, log }
  const [jobs, setJobs] = React.useState([])
  const [running, setRunning] = React.useState(false)
  const esRef = React.useRef(null)
  const logRef = React.useRef(null)

  const loadProjects = () => ccApi.projects().then((d) => { setProjects(d.projects); if (!project && d.projects[0]) setProject(d.projects[0].id) }).catch((e) => { if (/unauth/i.test(e.message)) { clearCCToken(); setAuthed(false) } })
  const loadJobs = () => ccApi.jobs().then((d) => setJobs(d.jobs || [])).catch(() => {})
  React.useEffect(() => { if (authed) { loadProjects(); loadJobs() } }, [authed])
  React.useEffect(() => () => { if (esRef.current) esRef.current.close() }, [])
  React.useEffect(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight }, [active && active.log])

  const tryAuth = async () => {
    const t = tokenInput.trim(); if (!t) return; setCCToken(t)
    try { await ccApi.projects(); setAuthed(true); setAuthErr('') } catch (e) { clearCCToken(); setAuthErr('令牌无效') }
  }

  const streamJob = (id) => {
    if (esRef.current) esRef.current.close()
    setActive({ id, status: 'running', log: '' })
    const es = new EventSource(ccApi.streamUrl(id)); esRef.current = es
    es.addEventListener('log', (e) => { try { const o = JSON.parse(e.data); setActive((a) => a && a.id === id ? { ...a, log: (a.log || '') + o.t } : a) } catch {} })
    es.addEventListener('done', (e) => { try { const o = JSON.parse(e.data); setActive((a) => a && a.id === id ? { ...a, status: o.status } : a) } catch {} ; es.close(); setRunning(false); loadJobs() })
    es.onerror = () => { es.close() }
  }
  const run = async () => {
    if (running || !task.trim() || !project) return
    setRunning(true); localStorage.setItem('cc_last_project', project)
    try { const r = await ccApi.run(project, task.trim(), budget); streamJob(r.id); setTask('') }
    catch (e) { alert('启动失败：' + e.message); setRunning(false) }
  }
  const stop = async () => { if (!active) return; try { await ccApi.stop(active.id) } catch {} }
  const openJob = async (id) => { try { const d = await ccApi.job(id); setActive({ id, status: d.job.status, log: d.log }); if (d.job.status === 'running') streamJob(id) } catch {} }

  if (!authed) return (
    <div className="cc-app cc-auth">
      <div className="seal">⌘</div><h1>Echo · CC</h1><p className="sub">手机上控制 Claude Code</p>
      <input type="password" placeholder="CC 面板令牌" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && tryAuth()} autoFocus />
      <button onClick={tryAuth}>进入</button>{authErr && <div className="err">{authErr}</div>}
    </div>)

  const curProj = projects.find((p) => p.id === project)
  return (
    <div className="cc-app">
      <header className="cc-header"><span className="cc-logo">⌘</span><div><div className="cc-title">Echo · CC</div><div className="cc-sub">手机控制台</div></div>
        <button className="cc-refresh" onClick={() => { loadProjects(); loadJobs() }} title="刷新">↻</button></header>

      <div className="cc-card">
        <label className="cc-label">项目目录</label>
        <select className="cc-select" value={project} onChange={(e) => setProject(e.target.value)}>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <label className="cc-label">任务（给 Claude Code 的指令）</label>
        <textarea className="cc-task" rows={4} placeholder="例如：看看 server.js 有没有明显的 bug，列出来，先别改" value={task} onChange={(e) => setTask(e.target.value)} />
        <div className="cc-row">
          <label className="cc-label" style={{ margin: 0 }}>预算上限 $</label>
          <input className="cc-budget" type="number" min={0.5} max={20} step={0.5} value={budget} onChange={(e) => setBudget(+e.target.value)} />
          <button className="cc-run" onClick={run} disabled={running || !task.trim()}>{running ? '运行中…' : '▶ 启动'}</button>
        </div>
      </div>

      {active && (
        <div className="cc-card cc-job">
          <div className="cc-job-head">
            <span className="cc-status" style={{ color: (STATUS_MAP[active.status] || ['', '#888'])[1] }}>● {(STATUS_MAP[active.status] || [active.status])[0]}</span>
            <span className="cc-jobid">{active.id}</span>
            {active.status === 'running' && <button className="cc-stop" onClick={stop}>■ 停止</button>}
          </div>
          <pre className="cc-log" ref={logRef}>{active.log || '等待输出…'}</pre>
        </div>)}

      <div className="cc-card">
        <div className="cc-recent-head"><span>最近任务</span><button className="cc-refresh" onClick={loadJobs}>↻</button></div>
        {jobs.length === 0 ? <div className="cc-empty">还没有任务</div> :
          jobs.map((j) => (
            <button key={j.id} className="cc-jobrow" onClick={() => openJob(j.id)}>
              <span className="cc-dot" style={{ background: (STATUS_MAP[j.status] || ['', '#888'])[1] }} />
              <div className="cc-jobrow-main"><div className="cc-jobrow-task">{(j.task || '').slice(0, 50)}</div>
                <div className="cc-jobrow-meta">{j.projectLabel || j.project} · {fmtTime(j.startedAt)}</div></div>
              <span className="cc-jobrow-st" style={{ color: (STATUS_MAP[j.status] || ['', '#888'])[1] }}>{(STATUS_MAP[j.status] || [j.status])[0]}</span>
            </button>))}
      </div>
    </div>)
}
