import React from 'react'
import { api } from './api.js'
import { Icon } from './doodles.jsx'

const PLAYER = 'joy'
const SAVE_NAME = 'main'
const QUICK_COMMANDS = ['status', 'help', 'look 大厅', 'shop', 'check 房间', 'journal']

export default function GameRoomPanel({ onClose }) {
  const [rooms, setRooms] = React.useState([])
  const [activeId, setActiveId] = React.useState('cat-hotel')
  const [command, setCommand] = React.useState('status')
  const [output, setOutput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [err, setErr] = React.useState('')

  const activeRoom = rooms.find((room) => room.id === activeId) || rooms[0]

  React.useEffect(() => {
    let alive = true
    api.gameRoom.rooms()
      .then((data) => {
        if (!alive) return
        const nextRooms = data.rooms || []
        setRooms(nextRooms)
        if (nextRooms.length && !nextRooms.some((room) => room.id === activeId)) setActiveId(nextRooms[0].id)
      })
      .catch((e) => setErr(e.message || '读取房间失败'))
    return () => { alive = false }
  }, [])

  const run = async (nextCommand = command) => {
    const gameId = activeRoom?.id || activeId
    const clean = String(nextCommand || '').trim()
    if (!gameId || !clean || loading) return
    setLoading(true); setErr('')
    try {
      const data = await api.gameRoom.cmd({ gameId, command: clean, player: PLAYER, saveName: SAVE_NAME })
      setOutput(data.text || '')
      setCommand(clean)
    } catch (e) {
      setErr(e.message || '命令失败')
    } finally {
      setLoading(false)
    }
  }

  const newGame = async () => {
    const gameId = activeRoom?.id || activeId
    if (!gameId || loading) return
    setLoading(true); setErr('')
    try {
      const data = await api.gameRoom.newGame({ gameId, player: PLAYER, saveName: SAVE_NAME })
      setOutput(data.text || '')
    } catch (e) {
      setErr(e.message || '开新存档失败')
    } finally {
      setLoading(false)
    }
  }

  const scenePrompt = async () => {
    const gameId = activeRoom?.id || activeId
    if (!gameId || loading) return
    setLoading(true); setErr('')
    try {
      const data = await api.gameRoom.scenePrompt({ gameId, player: PLAYER, saveName: SAVE_NAME })
      setOutput(data.text || '')
    } catch (e) {
      setErr(e.message || '生成画面提示失败')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    run(command)
  }

  return (
    <div className="studio-reader game-room-panel" role="dialog" aria-modal="true" aria-label="小游戏房间">
      <div className="studio-reader-shell paper-bg">
        <style>{GAME_ROOM_CSS}</style>
        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={onClose} aria-label="返回 Workspace">
            <Icon name="back" size={19} color="var(--ink)" />
          </button>
          <div className="studio-reader-mark tint-blue">
            <Icon name="monitor" size={22} color="var(--ink)" />
          </div>
          <div className="studio-reader-title">
            <h2>小游戏房间</h2>
            <p>一个入口，很多小房间 · 当前先接猫猫旅馆</p>
          </div>
        </header>

        <div className="gr-body">
          {err && <div className="gr-error">{err}</div>}

          <div className="gr-rooms">
            {rooms.length === 0 ? <span className="gr-muted">读取房间中…</span> : rooms.map((room) => (
              <button
                key={room.id}
                className={'gr-room' + (room.id === activeId ? ' on' : '')}
                onClick={() => { setActiveId(room.id); setOutput('') }}
              >
                <span>{room.name}</span>
                <small>{room.description}</small>
              </button>
            ))}
          </div>

          <div className="gr-actions">
            <button onClick={newGame} disabled={loading || !activeRoom}>新开</button>
            <button onClick={() => run('status')} disabled={loading || !activeRoom}>状态</button>
            <button onClick={scenePrompt} disabled={loading || !activeRoom}>画面提示</button>
          </div>

          <form className="gr-command" onSubmit={onSubmit}>
            <input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="输入游戏命令，例如 look 大厅"
              disabled={loading || !activeRoom}
            />
            <button disabled={loading || !activeRoom || !command.trim()}>{loading ? '执行中…' : '发送'}</button>
          </form>

          <div className="gr-quick">
            {QUICK_COMMANDS.map((cmd) => <button key={cmd} onClick={() => run(cmd)} disabled={loading || !activeRoom}>{cmd}</button>)}
          </div>

          <pre className="gr-output">{output || '选择一个房间，然后发送 status 或 help。Web 存档和 GPT 存档是分开的。'}</pre>
        </div>
      </div>
    </div>
  )
}

const GAME_ROOM_CSS = `
  .game-room-panel .studio-reader-shell { max-width: 720px; }
  .game-room-panel .gr-body { flex: 1; overflow-y: auto; padding: 12px 18px 28px; }
  .game-room-panel .gr-error { color: #b1492f; background: rgba(177,73,47,0.1); border: 1px solid rgba(177,73,47,0.25); border-radius: 12px; padding: 10px 12px; margin-bottom: 12px; font-family: var(--font-cn); font-size: 13px; }
  .game-room-panel .gr-rooms { display: grid; gap: 10px; margin-bottom: 14px; }
  .game-room-panel .gr-room { text-align: left; border: 1.5px solid rgba(120,95,70,0.22); background: rgba(255,253,247,0.78); border-radius: 16px; padding: 12px 14px; cursor: pointer; box-shadow: var(--card-shadow-sm); }
  .game-room-panel .gr-room.on { border-color: #8fa6c0; background: rgba(233,243,248,0.82); }
  .game-room-panel .gr-room span { display: block; font-family: var(--font-cute); font-size: 17px; color: var(--ink); margin-bottom: 4px; }
  .game-room-panel .gr-room small { display: block; font-family: var(--font-cn); font-size: 12.5px; line-height: 1.5; color: var(--ink-soft); }
  .game-room-panel .gr-muted { font-family: var(--font-cn); color: var(--ink-faint); font-size: 13px; }
  .game-room-panel .gr-actions, .game-room-panel .gr-quick { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }
  .game-room-panel button { font-family: var(--font-cn); }
  .game-room-panel .gr-actions button, .game-room-panel .gr-quick button, .game-room-panel .gr-command button { border: 1.4px solid rgba(120,95,70,0.24); background: rgba(255,253,247,0.86); color: var(--ink); border-radius: 12px; padding: 8px 12px; cursor: pointer; }
  .game-room-panel .gr-actions button:first-child, .game-room-panel .gr-command button { background: var(--brick); border-color: var(--brick); color: #fff6ef; }
  .game-room-panel button[disabled] { opacity: 0.58; cursor: default; }
  .game-room-panel .gr-command { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin: 12px 0; }
  .game-room-panel .gr-command input { min-width: 0; border: 1.5px solid rgba(120,95,70,0.24); background: rgba(255,253,247,0.9); color: var(--ink); border-radius: 13px; padding: 10px 12px; font-family: var(--font-cn); font-size: 14px; }
  .game-room-panel .gr-output { min-height: 220px; white-space: pre-wrap; word-break: break-word; border: 1.5px solid rgba(120,95,70,0.18); background: rgba(255,253,247,0.82); color: var(--ink); border-radius: 16px; padding: 14px; font-family: var(--font-cn); font-size: 13.5px; line-height: 1.7; overflow-x: auto; box-shadow: var(--card-shadow-sm); }
  @media (max-width: 520px) {
    .game-room-panel .gr-command { grid-template-columns: 1fr; }
    .game-room-panel .gr-actions button, .game-room-panel .gr-quick button { flex: 1 1 auto; }
  }
`
