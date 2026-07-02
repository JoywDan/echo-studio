import React from 'react'
import { api } from './api.js'
import { Icon, Heart } from './doodles.jsx'

let _leafletPromise = null
function loadLeaflet() {
  if (window.L && window.L.map) return Promise.resolve()
  if (_leafletPromise) return _leafletPromise
  _leafletPromise = new Promise((resolve, reject) => {
    const css = document.createElement('link')
    css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(css)
    const s = document.createElement('script')
    s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    s.async = true; s.onload = () => resolve(); s.onerror = () => { _leafletPromise = null; reject(new Error('地图引擎加载失败')) }
    document.head.appendChild(s)
  })
  return _leafletPromise
}

let _gmapsPromise = null
function loadGmaps(key) {
  if (window.google && window.google.maps && window.google.maps.StreetViewPanorama) return Promise.resolve()
  if (_gmapsPromise) return _gmapsPromise
  _gmapsPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(key) + '&v=weekly'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => { _gmapsPromise = null; reject(new Error('街景引擎加载失败')) }
    document.head.appendChild(s)
  })
  return _gmapsPromise
}

export default function WanderPanel({ onClose }) {
  const svRef = React.useRef(null)
  const panoRef = React.useRef(null)
  const [status, setStatus] = React.useState('发动街景引擎…')
  const [coords, setCoords] = React.useState(null)
  const [note, setNote] = React.useState('')
  const [sharing, setSharing] = React.useState(false)
  const [msgs, setMsgs] = React.useState([])
  const [rolling, setRolling] = React.useState(false)
  const lastMemPos = React.useRef(null)
  const [view, setView] = React.useState('sv')
  const mapDivRef = React.useRef(null)
  const mapRef = React.useRef(null)
  const [visitSel, setVisitSel] = React.useState(null)
  const openMap = async () => {
    setView('map'); setVisitSel(null)
    try {
      await loadLeaflet()
      const d = await api.streetWander.visits()
      const L = window.L
      if (!mapRef.current && mapDivRef.current) {
        mapRef.current = L.map(mapDivRef.current, { worldCopyJump: true }).setView([30, 20], 2)
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(mapRef.current)
      }
      const map = mapRef.current
      if (!map) return
      if (map._visitLayer) map.removeLayer(map._visitLayer)
      const layer = window.L.layerGroup()
      const pts = []
      ;(d.visits || []).forEach(v => {
        const col = v.source === 'echo_solo' ? '#7d96a3' : '#b1492f'
        window.L.circleMarker([v.lat, v.lng], { radius: 8, color: col, weight: 2, fillColor: col, fillOpacity: 0.65 })
          .on('click', () => setVisitSel(v)).addTo(layer)
        pts.push([v.lat, v.lng])
      })
      layer.addTo(map); map._visitLayer = layer
      setTimeout(() => { map.invalidateSize(); if (pts.length >= 2) map.fitBounds(pts, { padding: [40, 40], maxZoom: 6 }); else if (pts.length === 1) map.setView(pts[0], 5) }, 80)
    } catch (e) { setStatus(e.message || '地图没能打开') }
  }
  const goVisit = (v) => {
    setView('sv'); setVisitSel(null)
    const g = window.google
    if (!g || !panoRef.current) return
    new g.maps.StreetViewService().getPanorama({ location: { lat: v.lat, lng: v.lng }, radius: 150, source: 'google' }, (data, st) => {
      if (st === 'OK' && data && data.location) { panoRef.current.setPano(data.location.pano); setStatus('回到了：' + (v.place || '')) }
      else setStatus('这一针附近的街景暂时找不到了')
    })
  }
  const chatEndRef = React.useRef(null)
  React.useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }) }, [msgs])
  React.useEffect(() => {
    api.history('wander-journal').then(d => {
      const hist = (d.messages || []).slice(-8).map((m, i) => ({
        id: 'h' + i, me: m.role === 'user',
        text: m.role === 'user' ? (m.content.includes('\n') && m.content.startsWith('[街景漫游') ? m.content.slice(m.content.indexOf('\n') + 1) : (m.content.startsWith('[街景漫游') ? '📍 分享了一帧街景' : m.content)) : m.content,
      }))
      setMsgs(hist)
    }).catch(() => {})
  }, [])

  const randomGo = React.useCallback(() => {
    const g = window.google
    if (!g || !panoRef.current) return
    setRolling(true); setStatus('骰子飞出去了…')
    const sv = new g.maps.StreetViewService()
    const tryOnce = (attempt) => {
      if (attempt > 14) { setRolling(false); setStatus('这轮没摇到有路的地方，再掷一次🎲'); return }
      const lat = -60 + Math.random() * 130, lng = -180 + Math.random() * 360
      sv.getPanorama({ location: { lat, lng }, radius: 50000, source: 'google' }, (data, st) => {
        if (st === 'OK' && data && data.location) {
          const p = data.location.latLng
          panoRef.current.setPosition(p)
          panoRef.current.setPov({ heading: Math.random() * 360, pitch: 0 })
          setRolling(false)
          setStatus(data.location.description || data.location.shortDescription || '一个陌生的街角')
        } else tryOnce(attempt + 1)
      })
    }
    tryOnce(0)
  }, [])

  React.useEffect(() => {
    let alive = true
    api.streetWander.config().then(d => loadGmaps(d.key)).then(() => {
      if (!alive || !svRef.current) return
      const g = window.google
      panoRef.current = new g.maps.StreetViewPanorama(svRef.current, {
        pov: { heading: 57, pitch: 5 }, zoom: 0.9,
        addressControl: false, showRoadLabels: false, motionTracking: false, motionTrackingControl: false,
        fullscreenControl: false, enableCloseButton: false, panControl: false, zoomControl: false,
        linksControl: true, clickToGo: true,
      })
      const sv0 = new g.maps.StreetViewService()
      sv0.getPanorama({ location: { lat: 48.85814, lng: 2.29354 }, radius: 300, source: 'google' }, (data, st) => {
        if (st === 'OK' && data && data.location) panoRef.current.setPano(data.location.pano)
        else panoRef.current.setPosition({ lat: 48.85251, lng: 2.30204 })
      })
      panoRef.current.addListener('position_changed', () => {
        const p = panoRef.current.getPosition()
        if (p) setCoords({ lat: p.lat(), lng: p.lng() })
      })
      setStatus('从铁塔脚下出发——点🎲去陌生的地方')
      setCoords({ lat: 48.85814, lng: 2.29354 })
    }).catch(e => alive && setStatus(e.message || '街景没能启动'))
    return () => { alive = false }
  }, [])

  const dist = (a, b) => { if (!a || !b) return 1e9; const dx = (a.lat - b.lat) * 111320, dy = (a.lng - b.lng) * 111320 * Math.cos(a.lat * Math.PI / 180); return Math.hypot(dx, dy) }
  const share = async (noteOverride) => {
    const pano = panoRef.current
    if (!pano || sharing) return
    const p = pano.getPosition()
    if (!p) return
    const pov = pano.getPov() || { heading: 0, pitch: 0 }
    const pos = { lat: p.lat(), lng: p.lng() }
    const sayText = (noteOverride != null ? noteOverride : note).trim()
    const remember = dist(pos, lastMemPos.current) > 250
    setSharing(true)
    setMsgs(m => [...m, { id: 'u' + Date.now(), me: true, text: sayText || '📍 分享了一帧街景' }])
    if (noteOverride == null) setNote('')
    try {
      const d = await api.streetWander.share({ lat: pos.lat, lng: pos.lng, heading: pov.heading || 0, pitch: pov.pitch || 0, note: sayText, remember })
      if (remember) lastMemPos.current = pos
      setMsgs(m => [...m, { id: 'e' + Date.now(), me: false, text: d.reply || '（他看了，但没说出话来）' }])
    } catch (e) { setMsgs(m => [...m, { id: 'e' + Date.now(), me: false, text: '（没送到：' + e.message + '）' }]) }
    finally { setSharing(false) }
  }

  const [dest, setDest] = React.useState('')
  const [going, setGoing] = React.useState(false)
  const goTo = async (alsoShare) => {
    const q = dest.trim()
    if (!q || going || !window.google || !panoRef.current) return
    setGoing(true); setStatus('查地图…'); setReply('')
    try {
      const g = await api.streetWander.geocode(q)
      const svc = new window.google.maps.StreetViewService()
      const radii = [1500, 15000, 100000]
      const found = await new Promise((resolve) => {
        const tryR = (i) => {
          if (i >= radii.length) return resolve(null)
          svc.getPanorama({ location: { lat: g.lat, lng: g.lng }, radius: radii[i], source: 'google' }, (data, st) => {
            if (st === 'OK' && data && data.location) resolve(data)
            else tryR(i + 1)
          })
        }
        tryR(0)
      })
      if (!found) { setStatus(`${g.address} 附近没有街景车到过…换个地方？`); setGoing(false); return }
      panoRef.current.setPano(found.location.pano)
      panoRef.current.setPov({ heading: Math.random() * 360, pitch: 5 })
      setStatus('到了：' + (g.address || q))
      if (alsoShare) setTimeout(() => { share(`带我来${q}看看呀`); }, 900)
    } catch (e) { setStatus('没找到这个地方：' + e.message) }
    finally { setGoing(false) }
  }

  return (
    <div className="studio-reader is-pretty" role="dialog" aria-modal="true" aria-label="街景漫游">
      <div className="studio-reader-shell paper-bg">
        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={onClose} aria-label="返回"><Icon name="back" size={19} color="var(--ink)" /></button>
          <div className="studio-reader-mark tint-blue"><span style={{ fontSize: 19 }}>🧭</span></div>
          <div className="studio-reader-title">
            <h2>街景漫游<Heart size={14} color="var(--vermillion-l)" fill="var(--vermillion-l)" /></h2>
            <p>随机掉进世界的某个街角，叫他来陪你看</p>
          </div>
          <button className="wander-dice" onClick={() => view === 'map' ? setView('sv') : openMap()} title={view === 'map' ? '回到街景' : '我们的地图'}>{view === 'map' ? '🚶' : '🗺️'}</button>
          <button className="wander-dice" onClick={randomGo} disabled={rolling} title="随机去个地方">🎲</button>
        </header>

        <div className="wander-body">
          <div className="wander-sv" ref={svRef} style={view === 'map' ? { display: 'none' } : undefined} />
          <div className="wander-sv wander-map" ref={mapDivRef} style={view !== 'map' ? { display: 'none' } : undefined} />
          {view === 'map' && visitSel && (
            <div className="wander-visit-card">
              <span className="wander-visit-dot" style={{ background: visitSel.source === 'echo_solo' ? '#7d96a3' : '#b1492f' }} />
              <span className="wander-visit-txt"><b>{visitSel.place || `${visitSel.lat.toFixed(3)}, ${visitSel.lng.toFixed(3)}`}</b>
                <span>{(visitSel.created_at || '').slice(0, 10)}{visitSel.source === 'echo_solo' ? ' · 他自己去的' : ' · 一起去的'}{visitSel.note ? ' · ' + visitSel.note : ''}</span></span>
              <button className="wander-go" onClick={() => goVisit(visitSel)}>回到这里</button>
            </div>
          )}
          <div className="wander-status">{status}{coords ? ` · ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : ''}</div>
          <div className="wander-ctl">
            <input className="wander-note" placeholder="想去哪？（地名/地标，比如：东京塔）" value={dest} onChange={e => setDest(e.target.value)} maxLength={80}
              onKeyDown={e => { if (e.key === 'Enter') goTo(false) }} />
            <button className="wander-go" onClick={() => goTo(false)} disabled={going || !dest.trim()}>{going ? '路上…' : '先去看看'}</button>
            <button className="wander-share" onClick={() => goTo(true)} disabled={going || sharing || !dest.trim()}>他带我去 🧳</button>
          </div>
          {msgs.length > 0 && (
            <div className="wander-chat">
              {msgs.map(m => (<div key={m.id} className={'wander-msg' + (m.me ? ' me' : '')}>{m.text}</div>))}
              {sharing && <div className="wander-msg typing">他正看着你眼前的画面…</div>}
              <div ref={chatEndRef} />
            </div>
          )}
          <div className="wander-ctl">
            <input className="wander-note" placeholder="跟他说话（他能看见你眼前的画面）" value={note} onChange={e => setNote(e.target.value)} maxLength={300}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); share() } }} />
            <button className="wander-share" onClick={() => share()} disabled={sharing || !coords}>{sharing ? '…' : (note.trim() ? '说给他听 💬' : '叫他来看 👀')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
