import React from 'react'
import { api } from './api.js'
import { Icon } from './doodles.jsx'

const PLAYER = 'joy'
const SAVE_NAME = 'main'
const ROOM_PRESETS = {
  'cat-hotel': {
    icon: '🐈',
    eyebrow: 'CAT HOTEL',
    tone: 'blue',
    command: 'status',
    placeholder: '输入游戏命令，例如 look 大厅',
    quick: ['status', 'help', 'look 大厅', 'shop', 'check 房间', 'journal'],
    empty: '选择一个房间，然后发送 status 或 help。这里的 Web 存档和 GPT 存档是分开的。',
    blurb: '照顾猫猫、安排房间、喂食陪玩，把一间小旅馆慢慢经营成它们愿意回来的地方。',
  },
  'joy-kitchen': {
    icon: '🍳',
    eyebrow: 'JOY\'S PRIVATE KITCHEN',
    tone: 'rose',
    command: '状态',
    placeholder: '输入私厨命令，例如 菜场 / 记得 Joy 爱吃虾',
    quick: ['状态', '帮助', '菜场', '去 egg_1', '记得 Joy 爱吃虾', '私厨模式 开'],
    empty: '开一间 Joy 的私厨，买菜、做饭、记住她的口味。这里的 Web 存档和 GPT 存档是分开的。',
    blurb: '从菜市场挑今天的食材，做一顿只属于 Joy 和 Dan 的饭，也可以把她喜欢的口味交给这间厨房记住。',
  },
  'sese-board-game': {
    icon: '🎲',
    eyebrow: 'SESE BOARD GAME',
    tone: 'violet',
    command: 'status',
    placeholder: '输入走格棋命令，例如 roll / submit 你的回答',
    quick: ['status', 'help', 'new_game', 'roll', 'pass', 'end_game'],
    empty: '这是一局完整的成人向走格棋。网页入口会使用 Echo，GPT/MCP 入口会使用 Dan；两边存档分开。',
    blurb: '保留原作完整成人向规则：主题、掷骰、任务、卡牌、状态和终局小纸条。Joy 和当前 AI 伙伴各自拥有自己的房间存档。',
  },
  'mingyun-paizhen': {
    icon: '🃏',
    eyebrow: 'DESTINY SPREAD',
    tone: 'gold',
    command: '抽卡',
    placeholder: '输入命运牌阵命令，例如 抽卡 nsfw / 带去走格棋',
    quick: ['抽卡', '抽卡 nsfw', '抽卡 safe', '状态', '牌库', '带去走格棋'],
    empty: '抽一张时空坐标，再配上母题、身份和变数。喜欢这组设定，就把它带去涩涩走格棋。',
    blurb: '抽取一组穿越设定：地点、时代、母题、身份与意外变数。它可以独立成为灵感游戏，也可以把当前设定传给涩涩走格棋。',
  },
  'spicy-monopoly': {
    icon: '🎩',
    eyebrow: 'SPICY MONOPOLY',
    tone: 'brick',
    command: 'status',
    placeholder: '输入大富翁指令，例如 roll / done / skip / 404',
    quick: ['new', 'roll', 'status', 'done', 'skip', 'swap', 'help'],
    empty: '双人轮流掷骰的成人向棋盘游戏：占地、收租、身份卡、任务卡和真心话都由引擎保存。安全词：404。',
    blurb: 'Joy 和当前 AI 伙伴一起走 20 格棋盘。每回合掷骰，遇到任务可以完成、跳过或换掉；红线和安全词始终有效。',
  },
}

const DEFAULT_PRESET = ROOM_PRESETS['cat-hotel']

function DestinyChat({ settingText, gameId = 'mingyun-paizhen', gameTitle = '命运牌阵', intro = '' }) {
  const sessionId = `game-${gameId}-web-joy-main`
  const [messages, setMessages] = React.useState([])
  const [draft, setDraft] = React.useState('')
  const [sending, setSending] = React.useState(false)
  const [started, setStarted] = React.useState(false)
  const [err, setErr] = React.useState('')
  const [modelLabel, setModelLabel] = React.useState('Echo 默认模型')

  React.useEffect(() => {
    let alive = true
    api.history(sessionId).then((data) => {
      if (!alive) return
      const history = (data.messages || []).map((item) => ({
        from: item.role === 'user' ? 'joy' : 'echo',
        text: item.content || '',
      })).filter((item) => item.text)
      setMessages(history)
      setStarted(history.length > 0)
    }).catch(() => {})
    return () => { alive = false }
  }, [])

  const start = async () => {
    if (sending) return
    setSending(true); setErr('')
    const isDestiny = gameId === 'mingyun-paizhen'
    const prompt = [
      `开始${gameTitle}独立陪玩。`,
      isDestiny
        ? '你是 Echo，Joy 的成年伴侣。请把下面的牌阵当作本局世界设定，直接进入场景，用沉浸式叙事和 Joy 互动。'
        : `你是 Echo，正在陪 Joy 玩「${gameTitle}」。请根据下面的当前游戏状态陪她聊天、解释结果、给出下一步建议。不要只复述状态，要像真正一起玩。${intro}`,
      isDestiny
        ? '这是虚构的成人向剧情空间，所有角色必须明确成年，互动保持自愿和可停止。不要解释规则，不要只做总结；先描写 Joy 和 Echo 此刻身处的地方，然后问 Joy 想怎么做。'
        : 'Joy 可以用自然语言告诉你想做什么；如果某个动作必须改变游戏存档，请提醒她使用上方按钮或命令，不要假装已经执行。',
      '',
      '本局命运牌阵：',
      settingText || '请先抽一组命运牌阵。',
    ].join('\n')
    const userText = '我准备好了，带我进入这组命运牌阵。'
    setMessages([{ from: 'joy', text: userText }])
    try {
      const meta = await api.stream({ session_id: sessionId, session_title: `游戏陪玩 · ${gameTitle}`, messages: [{ role: 'user', content: prompt }], thinking: false, tools: true, web_tools: false, coding_tools: false }, {
        onDelta: (text) => setMessages((items) => {
          const next = [...items]
          const last = next[next.length - 1]
          if (last?.from === 'echo' && last.streaming) last.text += text
          else next.push({ from: 'echo', text, streaming: true })
          return next
        }),
      })
      setModelLabel(meta.actual_model || meta.model || meta.provider_label || 'Echo 默认模型')
      setMessages((items) => items.map((item) => ({ ...item, streaming: false })))
      setStarted(true)
    } catch (e) {
      setErr(e.message || 'Echo 没有回应')
    } finally { setSending(false) }
  }

  const send = async (e) => {
    e?.preventDefault()
    const text = draft.trim()
    if (!text || sending) return
    setDraft(''); setSending(true); setErr('')
    setMessages((items) => [...items, { from: 'joy', text }])
    try {
      const meta = await api.stream({ session_id: sessionId, messages: [{ role: 'user', content: text }], thinking: false, tools: true, web_tools: false, coding_tools: false }, {
        onDelta: (delta) => setMessages((items) => {
          const next = [...items]
          const last = next[next.length - 1]
          if (last?.from === 'echo' && last.streaming) last.text += delta
          else next.push({ from: 'echo', text: delta, streaming: true })
          return next
        }),
      })
      setModelLabel(meta.actual_model || meta.model || meta.provider_label || modelLabel)
      setMessages((items) => items.map((item) => ({ ...item, streaming: false })))
    } catch (e) {
      setErr(e.message || '发送失败')
    } finally { setSending(false) }
  }

  return (
    <section className="gr-play">
      <div className="gr-play-heading">
        <div>
          <span className="gr-card-eyebrow">PLAY WITH ECHO · {modelLabel}</span>
          <h4>直接和 Echo 玩</h4>
          <p>{gameId === 'mingyun-paizhen' ? '不用输入游戏指令，像聊天一样告诉 Echo 你想做什么。' : '可以自然聊天；需要改变游戏存档时，使用上方按钮或指令。'}</p>
        </div>
        {!started && <button className="gr-primary" onClick={start} disabled={sending}>开始进入</button>}
      </div>
      {messages.length > 0 && <div className="gr-chat-log">
        {messages.map((message, index) => <div key={index} className={'gr-chat-line ' + message.from}>
          <span className="gr-chat-label">{message.from === 'joy' ? 'Joy' : 'Echo'}</span>
          <p>{message.text}{message.streaming && <span className="gr-chat-cursor" />}</p>
        </div>)}
      </div>}
      {err && <div className="gr-error">{err}</div>}
      {started && <form className="gr-play-input" onSubmit={send}>
        <textarea value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="告诉 Echo 你要做什么……" rows={2} disabled={sending} />
        <button className="gr-primary" disabled={sending || !draft.trim()}>{sending ? '回应中…' : '发送'}</button>
      </form>}
    </section>
  )
}

export default function GameRoomPanel({ onClose }) {
  const [rooms, setRooms] = React.useState([])
  const [activeId, setActiveId] = React.useState('')
  const [view, setView] = React.useState('lobby')
  const [command, setCommand] = React.useState('status')
  const [output, setOutput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [err, setErr] = React.useState('')

  const activeRoom = rooms.find((room) => room.id === activeId) || rooms[0]
  const preset = ROOM_PRESETS[activeRoom?.id || activeId] || DEFAULT_PRESET

  React.useEffect(() => {
    let alive = true
    api.gameRoom.rooms()
      .then((data) => {
        if (!alive) return
        const nextRooms = data.rooms || []
        setRooms(nextRooms)
        if (nextRooms.length && !nextRooms.some((room) => room.id === activeId)) {
          setActiveId(nextRooms[0].id)
          setCommand((ROOM_PRESETS[nextRooms[0].id] || DEFAULT_PRESET).command)
        }
      })
      .catch((e) => setErr(e.message || '读取房间失败'))
    return () => { alive = false }
  }, [])

  const selectRoom = (id) => {
    setActiveId(id)
    setCommand((ROOM_PRESETS[id] || DEFAULT_PRESET).command)
    setOutput('')
    setErr('')
    setView('room')
  }

  const goBack = () => {
    if (view === 'room') {
      setView('lobby')
      setOutput('')
      setErr('')
      return
    }
    onClose()
  }

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

  return (
    <div className="studio-reader game-room-panel" role="dialog" aria-modal="true" aria-label="小游戏房间">
      <div className="studio-reader-shell paper-bg">
        <style>{GAME_ROOM_CSS}</style>
        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={goBack} aria-label={view === 'room' ? '返回游戏大厅' : '返回 Workspace'}>
            <Icon name="back" size={19} color="var(--ink)" />
          </button>
          <div className="studio-reader-mark tint-blue"><Icon name="monitor" size={22} color="var(--ink)" /></div>
          <div className="studio-reader-title">
            <h2>{view === 'room' && activeRoom ? activeRoom.name : '游戏室'}</h2>
            <p>{view === 'room' ? '房间内 · Web / GPT 各自保存' : '一个入口，很多小房间'}</p>
          </div>
        </header>

        <div className="gr-body">
          {err && <div className="gr-error">{err}</div>}
          {view === 'lobby' ? <section className="gr-lobby">
            <div className="gr-lobby-heading">
              <div>
                <span className="gr-kicker">JOY &amp; DAN / GAME HUB</span>
                <h3>选择一间房</h3>
                <p>每个房间都是一个独立小游戏。点进去，才开始玩。</p>
              </div>
              <span className="gr-room-count">{rooms.length || 0} 间房</span>
            </div>
            <div className="gr-cards" aria-label="游戏列表">
              {rooms.length === 0 ? <div className="gr-muted">读取房间中…</div> : rooms.map((room) => {
                const item = ROOM_PRESETS[room.id] || DEFAULT_PRESET
                return (
                  <button key={room.id} className={'gr-card gr-' + item.tone} onClick={() => selectRoom(room.id)}>
                    <span className="gr-card-icon" aria-hidden="true">{item.icon}</span>
                    <span className="gr-card-copy">
                      <span className="gr-card-eyebrow">{item.eyebrow}</span>
                      <strong>{room.name}</strong>
                      <small>{room.description}</small>
                    </span>
                    <span className="gr-card-arrow" aria-hidden="true">→</span>
                  </button>
                )
              })}
            </div>
          </section> : activeRoom && <section className={'gr-detail gr-detail-' + preset.tone}>
            <div className="gr-detail-top">
              <div className="gr-detail-icon" aria-hidden="true">{preset.icon}</div>
              <div>
                <span className="gr-card-eyebrow">{preset.eyebrow}</span>
                <h3>{activeRoom.name}</h3>
                <p>{preset.blurb}</p>
              </div>
            </div>
            <div className="gr-actions">
              <button className="gr-primary" onClick={newGame} disabled={loading}>新开一局</button>
              <button onClick={() => run(preset.command)} disabled={loading}>继续游戏</button>
              <button onClick={scenePrompt} disabled={loading}>画面提示</button>
            </div>
            <form className="gr-command" onSubmit={(e) => { e.preventDefault(); run(command) }}>
              <input value={command} onChange={(e) => setCommand(e.target.value)} placeholder={preset.placeholder} disabled={loading} />
              <button className="gr-primary" disabled={loading || !command.trim()}>{loading ? '执行中…' : '发送'}</button>
            </form>
            <div className="gr-quick">
              {preset.quick.map((cmd) => <button key={cmd} onClick={() => run(cmd)} disabled={loading}>{cmd}</button>)}
            </div>
            <pre className="gr-output">{output || preset.empty}</pre>
            {activeRoom.id === 'mingyun-paizhen'
              ? <DestinyChat settingText={output} />
              : <DestinyChat settingText={output || preset.empty} gameId={activeRoom.id} gameTitle={activeRoom.name} intro={preset.blurb} />}
          </section>}
        </div>
      </div>
    </div>
  )
}

const GAME_ROOM_CSS = `
  .game-room-panel .studio-reader-shell { max-width: 760px; }
  .game-room-panel .gr-body { flex: 1; overflow-y: auto; padding: 14px 18px 30px; }
  .game-room-panel .gr-lobby { min-height:100%; display:flex; flex-direction:column; justify-content:center; }
  .game-room-panel .gr-lobby-heading { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; padding:4px 2px 18px; }
  .game-room-panel .gr-kicker, .game-room-panel .gr-card-eyebrow { display:block; font-size:10px; letter-spacing:1.5px; color:var(--ink-faint); font-family:var(--font-cn); }
  .game-room-panel .gr-lobby-heading h3 { margin:5px 0 4px; font-family:var(--font-cute); font-size:24px; font-weight:500; color:var(--ink); }
  .game-room-panel .gr-lobby-heading p { margin:0; max-width:530px; color:var(--ink-soft); font:13px/1.6 var(--font-cn); }
  .game-room-panel .gr-room-count { white-space:nowrap; color:var(--ink-soft); font:12px var(--font-cn); padding-top:7px; }
  .game-room-panel .gr-error { color:#b1492f; background:rgba(177,73,47,.1); border:1px solid rgba(177,73,47,.25); border-radius:12px; padding:10px 12px; margin-bottom:12px; font:13px var(--font-cn); }
  .game-room-panel .gr-cards { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-bottom:14px; }
  .game-room-panel .gr-card { min-width:0; display:flex; align-items:flex-start; gap:11px; text-align:left; border:1.5px solid rgba(120,95,70,.2); background:rgba(255,253,247,.78); border-radius:14px; padding:13px; cursor:pointer; color:var(--ink); box-shadow:var(--card-shadow-sm); transition:transform .15s,border-color .15s,background .15s; }
  .game-room-panel .gr-card:hover { transform:translateY(-1px); }
  .game-room-panel .gr-card.on { border-color:#8fa6c0; background:rgba(233,243,248,.86); }
  .game-room-panel .gr-card.gr-rose.on { border-color:#d89a95; background:rgba(251,236,231,.9); }
  .game-room-panel .gr-card-icon, .game-room-panel .gr-detail-icon { display:grid; place-items:center; flex:0 0 auto; width:44px; height:44px; border-radius:12px; background:rgba(143,166,192,.2); font-size:25px; }
  .game-room-panel .gr-rose .gr-card-icon, .game-room-panel .gr-detail-rose .gr-detail-icon { background:rgba(217,140,132,.2); }
  .game-room-panel .gr-violet .gr-card-icon, .game-room-panel .gr-detail-violet .gr-detail-icon { background:rgba(159,137,190,.2); }
  .game-room-panel .gr-gold .gr-card-icon, .game-room-panel .gr-detail-gold .gr-detail-icon { background:rgba(216,169,63,.22); }
  .game-room-panel .gr-brick .gr-card-icon, .game-room-panel .gr-detail-brick .gr-detail-icon { background:rgba(177,73,47,.18); }
  .game-room-panel .gr-card-copy { min-width:0; flex:1; }
  .game-room-panel .gr-card-copy strong { display:block; margin:3px 0 4px; font:500 17px var(--font-cute); }
  .game-room-panel .gr-card-copy small { display:block; color:var(--ink-soft); font:12px/1.45 var(--font-cn); }
  .game-room-panel .gr-card-arrow { color:var(--ink-faint); font-size:20px; line-height:1; }
  .game-room-panel .gr-detail { border:1.5px solid rgba(120,95,70,.18); border-radius:16px; padding:16px; background:rgba(255,253,247,.72); }
  .game-room-panel .gr-detail-rose { background:rgba(255,248,244,.78); }
  .game-room-panel .gr-detail-violet { background:rgba(248,245,252,.8); }
  .game-room-panel .gr-detail-gold { background:rgba(255,250,238,.82); }
  .game-room-panel .gr-detail-top { display:flex; gap:13px; align-items:flex-start; }
  .game-room-panel .gr-detail-icon { width:50px; height:50px; font-size:29px; }
  .game-room-panel .gr-detail h3 { margin:3px 0 4px; font:500 21px var(--font-cute); color:var(--ink); }
  .game-room-panel .gr-detail p { margin:0; color:var(--ink-soft); font:13px/1.65 var(--font-cn); }
  .game-room-panel .gr-actions, .game-room-panel .gr-quick { display:flex; flex-wrap:wrap; gap:8px; margin:14px 0 10px; }
  .game-room-panel button { font-family:var(--font-cn); }
  .game-room-panel .gr-actions button, .game-room-panel .gr-quick button, .game-room-panel .gr-command button { border:1.4px solid rgba(120,95,70,.24); background:rgba(255,253,247,.86); color:var(--ink); border-radius:11px; padding:8px 12px; cursor:pointer; }
  .game-room-panel .gr-actions .gr-primary, .game-room-panel .gr-command .gr-primary { background:var(--brick); border-color:var(--brick); color:#fff6ef; }
  .game-room-panel button[disabled] { opacity:.58; cursor:default; }
  .game-room-panel .gr-command { display:grid; grid-template-columns:1fr auto; gap:8px; margin:12px 0 0; }
  .game-room-panel .gr-command input { min-width:0; border:1.5px solid rgba(120,95,70,.24); background:rgba(255,253,247,.9); color:var(--ink); border-radius:11px; padding:10px 12px; font:14px var(--font-cn); }
  .game-room-panel .gr-output { min-height:180px; white-space:pre-wrap; word-break:break-word; border:1.5px solid rgba(120,95,70,.18); background:rgba(255,253,247,.82); color:var(--ink); border-radius:13px; padding:14px; margin:12px 0 0; font:13.5px/1.7 var(--font-cn); overflow-x:auto; box-shadow:var(--card-shadow-sm); }
  .game-room-panel .gr-play { margin-top:14px; padding:15px; border:1.5px solid rgba(120,95,70,.18); border-radius:14px; background:rgba(255,253,247,.82); }
  .game-room-panel .gr-play-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
  .game-room-panel .gr-play h4 { margin:4px 0 3px; font:500 19px var(--font-cute); color:var(--ink); }
  .game-room-panel .gr-play-heading p { margin:0; color:var(--ink-soft); font:12.5px/1.5 var(--font-cn); }
  .game-room-panel .gr-chat-log { display:flex; flex-direction:column; gap:10px; max-height:360px; overflow-y:auto; margin-top:13px; padding-top:12px; border-top:1px solid rgba(120,95,70,.14); }
  .game-room-panel .gr-chat-line { max-width:88%; font:13.5px/1.65 var(--font-cn); }
  .game-room-panel .gr-chat-line.joy { align-self:flex-end; text-align:right; }
  .game-room-panel .gr-chat-line.echo { align-self:flex-start; }
  .game-room-panel .gr-chat-label { display:block; margin-bottom:2px; color:var(--ink-faint); font:10px var(--font-cn); letter-spacing:1px; }
  .game-room-panel .gr-chat-line p { margin:0; padding:9px 11px; border-radius:12px; background:rgba(233,243,248,.75); color:var(--ink); white-space:pre-wrap; }
  .game-room-panel .gr-chat-line.joy p { background:rgba(251,236,231,.85); }
  .game-room-panel .gr-chat-cursor { display:inline-block; width:6px; height:15px; margin-left:3px; vertical-align:-2px; background:var(--brick); animation:gr-blink 1s steps(1) infinite; }
  .game-room-panel .gr-play-input { display:grid; grid-template-columns:1fr auto; gap:8px; margin-top:12px; }
  .game-room-panel .gr-play-input textarea { min-width:0; resize:vertical; border:1.5px solid rgba(120,95,70,.24); background:rgba(255,253,247,.9); color:var(--ink); border-radius:11px; padding:10px 12px; font:14px/1.5 var(--font-cn); }
  @keyframes gr-blink { 50% { opacity:0; } }
  .game-room-panel .gr-muted { grid-column:1/-1; padding:12px; color:var(--ink-faint); font:13px var(--font-cn); }
  @media (max-width:520px) { .game-room-panel .gr-lobby-heading h3 { font-size:21px; } .game-room-panel .gr-cards { grid-template-columns:1fr; } .game-room-panel .gr-command { grid-template-columns:1fr; } .game-room-panel .gr-actions button { flex:1 1 auto; } .game-room-panel .gr-play-heading { flex-direction:column; } .game-room-panel .gr-play-input { grid-template-columns:1fr; } }
`
