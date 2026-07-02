import React from 'react'
import { api } from './api.js'

// 歌卡标记: [[music|hash|album_id|歌名|歌手]] —— 后端 CHAT_TOOLS_DESCRIPTION 与此同步
export const MUSIC_MARK = /\[\[music\|([0-9A-Fa-f]{8,})\|([^|\]]*)\|([^|\]]*)\|([^|\]]*)\]\]/g

export function MusicCard({ hash, albumId, name, singer }) {
  const play = () => window.dispatchEvent(new CustomEvent("echo-play-music", { detail: { hash, albumId, name, singer } }))
  return (<span className="music-card" onClick={play} role="button" title="点了就一起听">
    <span className="music-card-disc">♪</span>
    <span className="music-card-txt"><span className="music-card-name">{name || "未知曲目"}</span><span className="music-card-singer">{singer}</span></span>
    <span className="music-card-play">▶ 播放</span>
  </span>)
}

export function MusicBar({ song, onClose, source = "chat" }) {
  const aRef = React.useRef(null)
  const [playing, setPlaying] = React.useState(false)
  const [prog, setProg] = React.useState(0)
  const [dur, setDur] = React.useState(0)
  const [err, setErr] = React.useState("")
  const closeTimer = React.useRef(null)
  const reportedRef = React.useRef("")
  const cancelAutoClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null } }
  React.useEffect(() => () => cancelAutoClose(), [])
  React.useEffect(() => {
    cancelAutoClose()
    if (!song) return
    let alive = true
    setErr(""); setProg(0); setDur(0)
    api.music.url(song.hash, song.albumId).then(d => {
      if (!alive || !aRef.current) return
      aRef.current.src = d.url
      aRef.current.play().catch(() => {})
    }).catch(e => { if (alive) setErr(e.message || "拿不到播放链接") })
    return () => { alive = false }
  }, [song && song.hash])
  if (!song) return null
  const fmt = (x) => { const v = Math.floor(x || 0); return Math.floor(v / 60) + ":" + String(v % 60).padStart(2, "0") }
  const onPlayEv = () => {
    setPlaying(true); cancelAutoClose()
    if (reportedRef.current !== song.hash) {
      reportedRef.current = song.hash
      api.music.played({ name: song.name, singer: song.singer, hash: song.hash, source }).catch(() => {})
    }
  }
  return (<div className="music-bar">
    <audio ref={aRef} onPlay={onPlayEv} onPause={() => setPlaying(false)}
      onEnded={() => { setPlaying(false); closeTimer.current = setTimeout(() => onClose && onClose(), 1600) }}
      onTimeUpdate={(e) => setProg(e.target.currentTime)} onDurationChange={(e) => setDur(e.target.duration || 0)} />
    <button className="music-bar-btn" onClick={() => { const a = aRef.current; if (!a) return; if (a.paused) a.play().catch(() => {}); else a.pause() }} aria-label={playing ? "暂停" : "播放"}>{playing ? "❚❚" : "▶"}</button>
    <div className="music-bar-mid">
      <div className="music-bar-title">{song.name}<span className="music-bar-singer"> · {song.singer}</span>{err && <span className="music-bar-err">（{err}）</span>}</div>
      <input className="music-bar-range" type="range" min={0} max={dur || 1} step={0.1} value={Math.min(prog, dur || 1)}
        onChange={(e) => { if (aRef.current) aRef.current.currentTime = Number(e.target.value) }} aria-label="进度" />
    </div>
    <span className="music-bar-time">{fmt(prog)}/{fmt(dur)}</span>
    <button className="music-bar-close" onClick={onClose} aria-label="收起播放条">✕</button>
  </div>)
}
