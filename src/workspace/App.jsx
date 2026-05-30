import React from 'react'
import WorkspaceHome from './WorkspaceHome.jsx'
import ChatPage from './ChatPage.jsx'
import { api, getToken, setToken, clearToken } from './api.js'
import { AVATAR_CYCLE, AVATAR_TINTS } from './data.jsx'

function genId() { return 'chat-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) }
function relTime(s) {
  if (!s) return ''
  const t = s.length <= 16 ? s.slice(11, 16) : s.slice(5, 16)
  return t || ''
}
function sessionsToConvs(sessions, activeId) {
  return (sessions || []).map((s, i) => ({
    id: s.session_id, title: s.title || s.last_user_msg || '未命名对话',
    preview: s.last_user_msg || '', time: relTime(s.updated_at || s.created_at),
    avatar: AVATAR_CYCLE[i % AVATAR_CYCLE.length], tint: AVATAR_TINTS[i % AVATAR_TINTS.length],
    active: s.session_id === activeId,
  }))
}

export default function App() {
  const [authed, setAuthed] = React.useState(null) // null=checking, false=need login, true=ok
  const [tokenInput, setTokenInput] = React.useState('')
  const [authErr, setAuthErr] = React.useState('')
  const [models, setModels] = React.useState([])
  const [sessions, setSessions] = React.useState([])
  const [loadingSessions, setLoadingSessions] = React.useState(true)
  const [view, setView] = React.useState('home')
  const [activeConv, setActiveConv] = React.useState(null)
  const [mode, setMode] = React.useState(() => (window.innerWidth < 760 ? 'mobile' : 'wide'))
  const appRef = React.useRef(null)

  // responsive
  React.useEffect(() => {
    const el = appRef.current; if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => setMode(entries[0].contentRect.width < 760 ? 'mobile' : 'wide'))
    ro.observe(el); return () => ro.disconnect()
  }, [authed])

  // auth check on mount
  React.useEffect(() => {
    if (!getToken()) { setAuthed(false); return }
    api.ping().then(() => setAuthed(true)).catch(() => { clearToken(); setAuthed(false) })
  }, [])

  const loadData = React.useCallback(() => {
    api.models().then((d) => setModels(d.models || [])).catch(() => {})
    setLoadingSessions(true)
    api.sessions().then((d) => setSessions(d.sessions || [])).catch(() => {}).finally(() => setLoadingSessions(false))
  }, [])
  React.useEffect(() => { if (authed) loadData() }, [authed, loadData])

  const tryAuth = async () => {
    const t = tokenInput.trim(); if (!t) return
    setToken(t)
    try { await api.ping(); setAuthed(true); setAuthErr('') }
    catch { clearToken(); setAuthErr('令牌无效') }
  }

  const openChat = (conv) => { setActiveConv(conv); setView('chat') }
  const newChat = () => { setActiveConv({ id: genId(), title: '新对话', isNew: true }); setView('chat') }
  const deleteConv = async (conv) => {
    if (!confirm('删除「' + conv.title + '」？这条对话会被永久删除。')) return
    try { await api.deleteSession(conv.id); setSessions((s) => s.filter((x) => x.session_id !== conv.id)) } catch (e) { alert('删除失败：' + e.message) }
  }
  // when a message is sent in a (possibly new) session, refresh the list
  const onSessionTouched = React.useCallback(() => { api.sessions().then((d) => setSessions(d.sessions || [])).catch(() => {}) }, [])

  if (authed === null) return <div className="app is-wide paper-bg" style={{ display: 'grid', placeItems: 'center' }}><span className="muted">载入中…</span></div>
  if (authed === false) return (
    <div className="app is-wide paper-bg"><div className="auth-screen">
      <div className="seal">私</div><h1>Echo Workspace</h1><p className="sub">与 Echo 的私人空间</p>
      <input type="password" placeholder="输入访问令牌" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && tryAuth()} autoFocus />
      <button onClick={tryAuth}>进入</button>{authErr && <div className="err">{authErr}</div>}
    </div></div>)

  const convs = sessionsToConvs(sessions, activeConv && activeConv.id)
  return (
    <div className={'app ' + (mode === 'mobile' ? 'is-mobile' : 'is-wide')} ref={appRef}>
      <div className="layout" data-view={view}>
        <WorkspaceHome conversations={convs} loading={loadingSessions} onOpenChat={openChat} onNewChat={newChat} onDeleteConv={deleteConv} />
        <ChatPage conv={activeConv} models={models} onBack={() => { setView('home'); onSessionTouched() }} onSessionTouched={onSessionTouched} />
      </div>
    </div>)
}
