import React from 'react'
import { api } from './api.js'

// 歌卡标记: [[music|hash|album_id|歌名|歌手]] —— 后端 CHAT_TOOLS_DESCRIPTION 与此同步
export const MUSIC_MARK = /\[\[music\|([0-9A-Fa-f]{8,})\|([^|\]]*)\|([^|\]]*)\|([^|\]]*)\]\]/g

// ═══ 全局单例播放器 ═══
// 音频对象活在模块级, 不随任何 React 组件卸载而死——关面板、切页面、进聊天, 歌都不断。
const player = { audio: null, song: null, source: 'chat', err: '', hb: null, queue: [], queueIndex: -1 }
function ensureAudio() {
  if (player.audio || typeof Audio === 'undefined') return
  const a = new Audio()
  a.addEventListener('play', () => { reportNow('playing'); startHb(); emit() })
  a.addEventListener('pause', () => { if (player.song && !a.ended) reportNow('paused'); stopHb(); emit() })
  a.addEventListener('ended', () => { reportNow('ended'); stopHb(); if (!playNext()) emit() })
  a.addEventListener('timeupdate', emit)
  a.addEventListener('durationchange', emit)
  player.audio = a
}
function emit() { try { window.dispatchEvent(new CustomEvent('echo-music-state')) } catch {} }
function reportNow(state) {
  if (!player.song) return
  // 护栏: 上报绝不能抛错拖累播放控制(曾漏 api.music.now 致 ✕ 停不了歌)
  try { const r = api.music.now && api.music.now({ name: player.song.name, singer: player.song.singer, state }); if (r && r.catch) r.catch(() => {}) } catch {}
}
function startHb() { stopHb(); player.hb = setInterval(() => { if (player.audio && !player.audio.paused) reportNow('playing') }, 240000) }
function stopHb() { if (player.hb) { clearInterval(player.hb); player.hb = null } }

function _norm(t) { return { hash: t.hash, albumId: t.albumId || t.album_id || '', name: t.name || '', singer: t.singer || '' } }

// 播完自动接下一首靠这支队列：playSong 放的是长度 1 的队列；playQueue 放整份歌单从点的那首起。
export function playSong(song, source = 'chat') {
  playQueue([song], 0, source)
}

// tracks: 歌单曲目数组；startIndex: 从第几首开始放（其余排在后面，播完自动接上）。
export function playQueue(tracks, startIndex = 0, source = 'panel') {
  ensureAudio()
  if (!player.audio || !tracks || !tracks.length) return
  player.queue = tracks.map(_norm)
  player.queueIndex = Math.min(Math.max(startIndex, 0), player.queue.length - 1)
  player.source = source
  _playCurrent()
}

function _playCurrent() {
  const song = player.queue[player.queueIndex]
  if (!song) return
  player.song = song; player.err = ''
  emit()
  const hashAtCall = song.hash
  api.music.url(song.hash, song.albumId).then(d => {
    if (!player.song || player.song.hash !== hashAtCall) return
    player.audio.src = d.url
    player.audio.play().catch(() => {})
    api.music.played({ name: song.name, singer: song.singer, hash: song.hash, source: player.source }).catch(() => {})
  }).catch(e => { player.err = (e && e.message) || '拿不到播放链接'; emit() })
}

// 自动/手动前进到下一首；返回是否真的往前走了（队列到底了就 false，调用方决定是否收起播放条）。
export function playNext() {
  if (player.queueIndex < 0 || player.queueIndex + 1 >= player.queue.length) return false
  player.queueIndex += 1
  _playCurrent()
  return true
}
export function playPrev() {
  if (player.queueIndex <= 0) return false
  player.queueIndex -= 1
  _playCurrent()
  return true
}
export function hasNext() { return player.queueIndex >= 0 && player.queueIndex + 1 < player.queue.length }
export function hasPrev() { return player.queueIndex > 0 }
export function stopSong() {
  if (!player.audio || !player.song) return
  // 先把歌停掉+条收起(不依赖上报成功)，上报放最后当尽力而为
  try { player.audio.pause(); player.audio.removeAttribute('src'); player.audio.load() } catch {}
  const snapshot = player.song
  player.song = null; player.queue = []; player.queueIndex = -1; stopHb(); emit()
  try { if (api.music.now) { const r = api.music.now({ name: snapshot.name, singer: snapshot.singer, state: 'stopped' }); if (r && r.catch) r.catch(() => {}) } } catch {}
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
    <button className="music-bar-btn music-bar-btn-sm" onClick={playPrev} disabled={!hasPrev()} aria-label="上一首">⏮</button>
    <button className="music-bar-btn" onClick={() => { if (!a) return; if (a.paused) a.play().catch(() => {}); else a.pause() }} aria-label={playing ? "暂停" : "播放"}>{playing ? "❚❚" : "▶"}</button>
    <button className="music-bar-btn music-bar-btn-sm" onClick={playNext} disabled={!hasNext()} aria-label="下一首">⏭</button>
    <div className="music-bar-mid">
      <div className="music-bar-title">{song.name}<span className="music-bar-singer"> · {song.singer}</span>{player.err && <span className="music-bar-err">（{player.err}）</span>}</div>
      <input className="music-bar-range" type="range" min={0} max={dur || 1} step={0.1} value={Math.min(prog, dur || 1)}
        onChange={(e) => { if (a) a.currentTime = Number(e.target.value) }} aria-label="进度" />
    </div>
    <span className="music-bar-time">{fmt(prog)}/{fmt(dur)}</span>
    <button className="music-bar-close" onClick={stopSong} aria-label="停止并收起">✕</button>
  </div>)
}
