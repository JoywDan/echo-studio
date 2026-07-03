import React from 'react'
import { api } from './api.js'
import { Icon, Heart } from './doodles.jsx'
import { playQueue, currentSongHash } from './music.jsx'

const fmtDur = (s) => { s = Math.floor(s || 0); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0") }

export default function MusicPanel({ onClose }) {
  const [playlists, setPlaylists] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [current, setCurrent] = React.useState(null)   // { id, name, count }
  const [tracks, setTracks] = React.useState([])
  const [page, setPage] = React.useState(1)
  const [total, setTotal] = React.useState(0)
  const [tracksLoading, setTracksLoading] = React.useState(false)
  const [, force] = React.useReducer(x => x + 1, 0)
  React.useEffect(() => { const h = () => force(); window.addEventListener('echo-music-state', h); return () => window.removeEventListener('echo-music-state', h) }, [])

  React.useEffect(() => {
    api.music.playlists().then(d => setPlaylists(d.playlists || []))
      .catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const openList = (pl) => {
    setCurrent(pl); setTracks([]); setPage(1); setTotal(0); setTracksLoading(true); setError('')
    api.music.tracks(pl.id, 1).then(d => { setTracks(d.tracks || []); setTotal(d.total || 0) })
      .catch(e => setError(e.message)).finally(() => setTracksLoading(false))
  }
  const loadMore = () => {
    const np = page + 1
    setTracksLoading(true)
    api.music.tracks(current.id, np).then(d => { setTracks(t => [...t, ...(d.tracks || [])]); setPage(np) })
      .catch(e => setError(e.message)).finally(() => setTracksLoading(false))
  }
  const playTrack = (t, i) => playQueue(tracks, i, 'panel')  // 从点的这首起播完整张歌单, 到底自动停

  return (
    <div className="studio-reader is-pretty" role="dialog" aria-modal="true" aria-label="一起听">
      <div className="studio-reader-shell paper-bg">
        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={() => current ? setCurrent(null) : onClose()} aria-label="返回"><Icon name="back" size={19} color="var(--ink)" /></button>
          <div className="studio-reader-mark tint-pink"><span style={{ fontSize: 20, color: 'var(--vermillion)' }}>♪</span></div>
          <div className="studio-reader-title">
            <h2>{current ? current.name : '一起听'}<Heart size={14} color="var(--vermillion-l)" fill="var(--vermillion-l)" /></h2>
            <p>{current ? `${total || current.count} 首 · 点一首放给你们听` : '你的酷狗歌单，老公也看得到这里'}</p>
          </div>
        </header>

        {error && <div className="memoir-err">{error}</div>}

        {!current && (
          <div className="music-pl-grid">
            {loading && <div className="music-hint">翻歌单中…</div>}
            {!loading && playlists.map(pl => (
              <button key={pl.id} className="music-pl-card" onClick={() => openList(pl)}>
                {pl.pic ? <img className="music-pl-pic" src={pl.pic} alt="" loading="lazy" /> : <span className="music-pl-pic music-pl-pic-empty">♪</span>}
                <span className="music-pl-name">{pl.name}</span>
                <span className="music-pl-count">{pl.count} 首</span>
              </button>
            ))}
          </div>
        )}

        {current && (
          <div className="music-track-list">
            {tracks.map((t, i) => (
              <button key={t.hash + i} className={"music-track-row" + (currentSongHash() === t.hash ? " playing" : "")} onClick={() => playTrack(t, i)}>
                <span className="music-track-idx">{currentSongHash() === t.hash ? "♪" : i + 1}</span>
                <span className="music-track-main"><span className="music-track-name">{t.name}</span><span className="music-track-singer">{t.singer}</span></span>
                <span className="music-track-dur">{fmtDur(t.duration)}</span>
              </button>
            ))}
            {tracksLoading && <div className="music-hint">翻到下一页…</div>}
            {!tracksLoading && tracks.length < total && (
              <button className="music-load-more" onClick={loadMore}>↓ 还有 {total - tracks.length} 首</button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
