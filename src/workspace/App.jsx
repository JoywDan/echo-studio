import React from 'react'
import WorkspaceHome from './WorkspaceHome.jsx'
import ChatPage from './ChatPage.jsx'
import { api, getToken, setToken, clearToken } from './api.js'
import { AVATAR_CYCLE, AVATAR_TINTS } from './data.jsx'
import { useTheme } from './theme.js'
import Settings from './Settings.jsx'
import { MusicBar } from './music.jsx'

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
  const { t, set, reset, applyTheme, exportTheme, importTheme, cssVars, wallpaper, uploadWallpaper, clearWallpaper, customFont, uploadFont, clearFont } = useTheme()
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  // responsive
  React.useEffect(() => {
    const el = appRef.current; if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((entries) => setMode(entries[0].contentRect.width < 760 ? 'mobile' : 'wide'))
    ro.observe(el); return () => ro.disconnect()
  }, [authed])

  // auth check on mount
  React.useEffect(() => {
    setAuthed(getToken() ? true : false)  // trust saved token; only a real 401 logs out
  }, [])

  const on401 = React.useCallback((e) => { if (/unauth/i.test((e && e.message) || '')) { clearToken(); setAuthed(false) } }, [])
  const loadData = React.useCallback(() => {
    api.models().then((d) => setModels(d.models || [])).catch(on401)
    setLoadingSessions(true)
    api.sessions().then((d) => setSessions(d.sessions || [])).catch(on401).finally(() => setLoadingSessions(false))
  }, [on401])
  React.useEffect(() => { if (authed) loadData() }, [authed, loadData])

  const tryAuth = async () => {
    const t = tokenInput.trim(); if (!t) return
    setToken(t)
    try { await api.models(); setAuthed(true); setAuthErr('') }
    catch (e) {
      if (/unauth/i.test(e.message || '')) { clearToken(); setAuthErr('令牌无效') }
      else { setAuthed(true); setAuthErr('') }  // network hiccup but token saved — let her in
    }
  }

  const openChat = (conv) => { setActiveConv(conv); setView('chat') }
  const newChat = () => { setActiveConv({ id: genId(), title: '新对话', isNew: true }); setView('chat') }
  const renameConv = async (conv, nextTitle) => {
    const title = String(nextTitle || '').trim()
    if (!title) return null
    if (conv.isNew) {
      setActiveConv((cur) => cur && cur.id === conv.id ? { ...cur, title } : cur)
      return { ok: true, session_id: conv.id, title }
    }
    const r = await api.renameSession(conv.id, title)
    setSessions((items) => items.map((s) => s.session_id === conv.id ? { ...s, title: r.title } : s))
    setActiveConv((cur) => cur && cur.id === conv.id ? { ...cur, title: r.title, isNew: false } : cur)
    return r
  }
  const promptRenameConv = async (conv) => {
    const title = prompt('给这个窗口起个名字', conv.title || '')
    if (title === null) return
    try { await renameConv(conv, title) } catch (e) { alert('改名失败：' + e.message) }
  }
  const deleteConv = async (conv) => {
    if (!confirm('删除「' + conv.title + '」？这条对话会被永久删除。')) return
    try { await api.deleteSession(conv.id); setSessions((s) => s.filter((x) => x.session_id !== conv.id)) } catch (e) { alert('删除失败：' + e.message) }
  }
  // when a message is sent in a (possibly new) session, refresh the list
  const onSessionTouched = React.useCallback(() => {
    api.sessions().then((d) => {
      const items = d.sessions || []
      setSessions(items)
      setActiveConv((cur) => {
        if (!cur) return cur
        const found = items.find((s) => s.session_id === cur.id)
        return found ? { ...cur, title: found.title || found.last_user_msg || cur.title, isNew: false } : cur
      })
    }).catch(() => {})
  }, [])

  if (authed === null) return <div className="app is-wide paper-bg" style={{ display: 'grid', placeItems: 'center', ...cssVars }}><span className="muted">载入中…</span></div>
  if (authed === false) return (
    <div className="app is-wide paper-bg" style={cssVars}><div className="auth-screen">
      <div className="seal">私</div><h1>Echo Workspace</h1><p className="sub">与 Echo 的私人空间</p>
      <input type="password" placeholder="输入访问令牌" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && tryAuth()} autoFocus />
      <button onClick={tryAuth}>进入</button>{authErr && <div className="err">{authErr}</div>}
    </div></div>)

  const convs = sessionsToConvs(sessions, activeConv && activeConv.id)
  return (
    <div className={'app ' + (mode === 'mobile' ? 'is-mobile' : 'is-wide') + ' paper-' + (t.paperPreset || 'sandpaper') + (wallpaper ? ' has-wallpaper' : '') + ' decor-' + (t.decor || 'full')} ref={appRef} style={cssVars}>
      <div className="layout" data-view={view}>
        <WorkspaceHome conversations={convs} loading={loadingSessions} onOpenChat={openChat} onNewChat={newChat} onRenameConv={promptRenameConv} onDeleteConv={deleteConv} onOpenSettings={() => setSettingsOpen(true)} />
        <ChatPage conv={activeConv} models={models} onBack={() => { setView('home'); onSessionTouched() }} onSessionTouched={onSessionTouched} onRenameConv={renameConv} />
      </div>
      <MusicBar />
      <Settings t={t} set={set} reset={reset} open={settingsOpen} onClose={() => setSettingsOpen(false)} wallpaper={wallpaper} uploadWallpaper={uploadWallpaper} clearWallpaper={clearWallpaper} customFont={customFont} uploadFont={uploadFont} clearFont={clearFont} applyTheme={applyTheme} exportTheme={exportTheme} importTheme={importTheme} />
    </div>)
}
