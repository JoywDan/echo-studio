import React from 'react'
import { api } from './api.js'

// 歌卡标记: [[music|hash|album_id|歌名|歌手]] —— 后端 CHAT_TOOLS_DESCRIPTION 与此同步
export const MUSIC_MARK = /\[\[music\|([0-9A-Fa-f]{8,})\|([^|\]]*)\|([^|\]]*)\|([^|\]]*)\]\]/g

// ═══ 全局单例播放器 ═══
// 音频对象活在模块级, 不随任何 React 组件卸载而死——关面板、切页面、进聊天, 歌都不断。
const player = { audio: null, song: null, source: 'chat', err: '', hb: null }
function ensureAudio() {
  if (player.audio || typeof Audio === 'undefined') return
  const a = new Audio()
  a.addEventListener('play', () => { reportNow('playing'); startHb(); emit() })
  a.addEventListener('pause', () => { if (player.song && !a.ended) reportNow('paused'); stopHb(); emit() })
  a.addEventListener('ended', () => { reportNow('ended'); stopHb(); emit() })
  a.addEventListener('timeupdate', emit)
  a.addEventListener('durationchange', emit)
  player.audio = a
}
function emit() { try { window.dispatchEvent(new CustomEvent('echo-music-state')) } catch {} }
function reportNow(state) {
  if (!player.song) return
  api.music.now({ name: player.song.name, singer: player.song.singer, state }).catch(() => {})
}
function startHb() { stopHb(); player.hb = setInterval(() => { if (player.audio && !player.audio.paused) reportNow('playing') }, 240000) }
function stopHb() { if (player.hb) { clearInterval(player.hb); player.hb = null } }

export function playSong(song, source = 'chat') {
  ensureAudio()
  if (!player.audio) return
  player.song = { hash: song.hash, albumId: song.albumId || song.album_id || '', name: song.name || '', singer: song.singer || '' }
  player.source = source; player.err = ''
  emit()
  api.music.url(player.song.hash, player.song.albumId).then(d => {
    if (!player.song || player.song.hash !== song.hash) return
    player.audio.src = d.url
    player.audio.play().catch(() => {})
    api.music.played({ name: player.song.name, singer: player.song.singer, hash: player.song.hash, source }).catch(() => {})
  }).catch(e => { player.err = (e && e.message) || '拿不到播放链接'; emit() })
}
export function stopSong() {
  if (!player.audio || !player.song) return
  reportNow('stopped')
  try { player.audio.pause(); player.audio.removeAttribute('src'); player.audio.load() } catch {}
  player.song = null; stopHb(); emit()
}
export function currentSongHash() { return player.song ? player.song.hash : '' }

export function MusicCard({ hash, albumId, name, singer }) {
  return (<span className="music-card" onClick={() => playSong({ hash, albumId, name, singer }, 'chat')} role="button" title="点了就一起听">
    <span className="music-card-disc">♪</span>
    <span className="music-card-txt"><span className="music-card-name">{name || "未知曲目"}</span><span className="music-card-singer">{singer}</span></span>
    <span className="music-card-play">▶ 播放</span>
  </span>)
}

// 全局唯一播放条: 挂在 App 层, 浮在右下, 有歌才现身。关掉=停止播放。
export function MusicBar() {
  const [, force] = React.useReducer(x => x + 1, 0)
  React.useEffect(() => {
    const h = () => force()
    window.addEventListener('echo-music-state', h)
    return () => window.removeEventListener('echo-music-state', h)
  }, [])
  const a = player.audio, song = player.song
  if (!song) return null
  const playing = a && !a.paused && !a.ended
  const prog = a ? a.currentTime || 0 : 0
  const dur = a ? a.duration || 0 : 0
  const fmt = (x) => { const v = Math.floor(x || 0); return Math.floor(v / 60) + ":" + String(v % 60).padStart(2, "0") }
  return (<div className="music-bar music-bar-global">
    <button className="music-bar-btn" onClick={() => { if (!a) return; if (a.paused) a.play().catch(() => {}); else a.pause() }} aria-label={playing ? "暂停" : "播放"}>{playing ? "❚❚" : "▶"}</button>
    <div className="music-bar-mid">
      <div className="music-bar-title">{song.name}<span className="music-bar-singer"> · {song.singer}</span>{player.err && <span className="music-bar-err">（{player.err}）</span>}</div>
      <input className="music-bar-range" type="range" min={0} max={dur || 1} step={0.1} value={Math.min(prog, dur || 1)}
        onChange={(e) => { if (a) a.currentTime = Number(e.target.value) }} aria-label="进度" />
    </div>
    <span className="music-bar-time">{fmt(prog)}/{fmt(dur)}</span>
    <button className="music-bar-close" onClick={stopSong} aria-label="停止并收起">✕</button>
  </div>)
}
