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
    empty: '默认 heavy 重口盘：双人轮流掷骰、占地、收租、成人身份卡、任务卡和真心话。安全词：404。',
    blurb: 'Joy 和当前 AI 伙伴一起走 20 格棋盘。默认 heavy 重口强度，不再把前两回合强制压成热身；安全词、跳过和红线过滤始终有效。',
  },
  'daily-protocol': {
    icon: '🗝️',
    eyebrow: 'DAILY PROTOCOL',
    tone: 'night',
    command: 'status',
    placeholder: '这是可直接点击的任务面板',
    quick: [],
    empty: '打开一张只属于今天的私密任务面板。Web 和 GPT 的故事日、任务与结算各自保存。',
    blurb: '每日约定、密封指令、限时挑战、待结算事项与成就都在这一张面板里。你掌握开始、暂停和停止的权利。',
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

function protocolCountdown(seconds) {
  if (seconds == null) return '未开始'
  const safe = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(safe / 60)
  const remaining = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

function protocolContext(data) {
  if (!data) return '每日协议面板仍在读取。'
  const tasks = (data.tasks || []).map((task) => `${task.state === 'done' ? '已完成' : task.state === 'skipped' ? '已跳过' : '待完成'}：${task.title}`).join('；')
  return [
    `故事日：${data.storyDate}，昨日总评：${data.previousScore}，进度：${data.progress?.completed || 0}/${data.progress?.total || 0}。`,
    `任务：${tasks || '暂无'}。`,
    `限时挑战：${data.challenge?.title || '未开启'}，状态：${data.challenge?.state || '未知'}。`,
    `密封卡：${data.sealedCard?.state || 'sealed'}。`,
    `私人批注：${data.privateNote || ''}`,
  ].join('\n')
}

function DailyProtocolPanel() {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [notice, setNotice] = React.useState('')
  const [, setClock] = React.useState(Date.now())

  const load = React.useCallback(async () => {
    const response = await api.gameRoom.dashboard({ gameId: 'daily-protocol', player: PLAYER, saveName: SAVE_NAME })
    setData(response.data || null)
  }, [])

  React.useEffect(() => {
    load().catch((err) => setError(err.message || '读取每日协议失败'))
  }, [load])

  React.useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const act = async (command) => {
    if (loading) return
    setLoading(true); setError(''); setNotice('')
    try {
      const response = await api.gameRoom.cmd({ gameId: 'daily-protocol', command, player: PLAYER, saveName: SAVE_NAME })
      setNotice(response.text || '')
      await load()
    } catch (err) {
      setError(err.message || '更新面板失败')
    } finally {
      setLoading(false)
    }
  }

  const startFresh = async () => {
    if (loading) return
    setLoading(true); setError(''); setNotice('')
    try {
      const response = await api.gameRoom.newGame({ gameId: 'daily-protocol', player: PLAYER, saveName: SAVE_NAME })
      setNotice(response.text || '新的故事日已经开启。')
      await load()
    } catch (err) {
      setError(err.message || '开启新面板失败')
    } finally {
      setLoading(false)
    }
  }

  if (!data) return <div className="dp-loading">{error || '正在打开今日面板…'}</div>

  const challenge = data.challenge || {}
  const activeChallenge = challenge.state === 'active'
  const canStartChallenge = ['ready', 'paused'].includes(challenge.state) && data.safetyState !== 'red'
  const cardOpen = data.sealedCard?.state !== 'sealed'

  return <section className="daily-protocol">
    <div className="dp-topline">
      <span>{data.storyDate}</span>
      <span>YESTERDAY <b>{data.previousScore}</b></span>
    </div>
    <header className="dp-header">
      <div>
        <span className="dp-eyebrow">JOY'S DAILY PROTOCOL</span>
        <h4>今天也要把期待放在你手里。</h4>
        <p>{data.partner} 的私人面板 · 连胜 {data.streak || 0} 天</p>
      </div>
      <button className="dp-reset" onClick={startFresh} disabled={loading} title="重新开启这一局">↻</button>
    </header>

    {error && <div className="gr-error">{error}</div>}
    <section className="dp-section dp-progress-section">
      <div className="dp-section-heading"><span>DAILY QUESTS</span><b>{data.progress.completed}/{data.progress.total}</b></div>
      <div className="dp-progress"><i style={{ width: `${data.progress.percent}%` }} /></div>
      <div className="dp-tasks">
        {data.tasks.map((task) => <article key={task.id} className={'dp-task ' + task.state}>
          <button className="dp-check" onClick={() => act(task.state === 'done' ? `undo ${task.id}` : `complete ${task.id}`)} disabled={loading || data.settled || data.safetyState === 'red'} aria-label={task.state === 'done' ? `撤销 ${task.title}` : `完成 ${task.title}`}>
            {task.state === 'done' ? '✓' : task.state === 'skipped' ? '—' : ''}
          </button>
          <div className="dp-task-copy">
            <strong>{task.title}</strong>
            <p>{task.detail}</p>
            <small>完成：{task.reward} · 跳过：{task.consequence}</small>
          </div>
          {task.state === 'open' && <button className="dp-skip" onClick={() => act(`skip ${task.id}`)} disabled={loading || data.settled}>跳过</button>}
        </article>)}
      </div>
    </section>

    <div className="dp-grid">
      <section className="dp-section dp-challenge">
        <div className="dp-section-heading"><span>TIMED CHALLENGE</span><em className={'dp-state ' + challenge.state}>{challenge.state}</em></div>
        <h5>{challenge.title}</h5>
        <p>{challenge.detail}</p>
        <div className="dp-clock">{activeChallenge ? protocolCountdown(challenge.remainingSeconds) : challenge.state === 'ready' ? 'READY' : challenge.state === 'completed' ? 'DONE' : challenge.state === 'stopped' ? 'STOPPED' : 'LOCKED'}</div>
        <div className="dp-inline-actions">
          {canStartChallenge && <button onClick={() => act('challenge start')} disabled={loading}>开始挑战</button>}
          {activeChallenge && <button onClick={() => act('challenge complete')} disabled={loading}>我来结算</button>}
          {challenge.state === 'locked' && <span>先完成信号灯检查</span>}
        </div>
      </section>

      <section className={'dp-section dp-card ' + (cardOpen ? 'open' : '')}>
        <div className="dp-section-heading"><span>SEALED DIRECTIVE</span><em>{data.sealedCard.state}</em></div>
        <h5>{data.sealedCard.title}</h5>
        <p>{cardOpen ? data.sealedCard.message : data.sealedCard.teaser}</p>
        <div className="dp-inline-actions">
          {!cardOpen && <button onClick={() => act('card reveal')} disabled={loading}>翻开密封卡</button>}
          {data.sealedCard.state === 'revealed' && <button onClick={() => act('card accept')} disabled={loading}>收进今晚</button>}
          {data.sealedCard.state === 'accepted' && <span>已收进私人抽屉</span>}
        </div>
      </section>
    </div>

    <section className="dp-section dp-queue">
      <div className="dp-section-heading"><span>PENALTY QUEUE</span><b>{data.unresolved || 0}</b></div>
      {data.penalties.length === 0 ? <p className="dp-empty">—— 当前无待清算事项 ——</p> : data.penalties.map((item) => <div className="dp-penalty" key={item.id}>
        <div><em className={'dp-penalty-state ' + item.state}>{item.state === 'settled' ? '✓ 已结算' : '⌛ 等待执行'}</em><strong>{item.title}</strong><p>{item.detail}</p></div>
        {item.state !== 'settled' && <button onClick={() => act(`penalty settle ${item.id}`)} disabled={loading}>结算</button>}
      </div>)}
    </section>

    <section className="dp-section dp-badges">
      <div className="dp-section-heading"><span>ACHIEVEMENT WALL</span><b>{data.achievements.filter((item) => item.unlocked).length}/{data.achievements.length}</b></div>
      <div className="dp-badge-grid">{data.achievements.map((item) => <div className={'dp-badge ' + (item.unlocked ? 'unlocked' : 'locked')} key={item.id}>
        <span>{item.unlocked ? item.icon : '▣'}</span><strong>{item.unlocked ? item.name : '???'}</strong><small>{item.unlocked ? item.hint : '尚未解锁'}</small>
      </div>)}</div>
    </section>

    <footer className="dp-note">
      <span>{data.partner.toUpperCase()} · PRIVATE NOTE</span>
      <p>{data.privateNote}</p>
    </footer>
    <div className="dp-safety">
      <button onClick={() => act('yellow')} disabled={loading || data.safetyState === 'red'}>黄灯 · 放缓</button>
      <button onClick={() => act('red')} disabled={loading || data.safetyState === 'red'}>红灯 · 停止</button>
      <button className="dp-settle" onClick={() => act(data.settled ? 'next' : 'settle')} disabled={loading}>{data.settled ? '开启下一天' : '结算今日'}</button>
    </div>
    {notice && <pre className="dp-notice">{notice}</pre>}
    <DestinyChat settingText={protocolContext(data)} gameId="daily-protocol" gameTitle="Joy 的每日协议" intro="陪她查看今天的任务、尊重她的信号灯和选择，并在她需要时给出有角色感的结算与鼓励。" />
  </section>
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
            {activeRoom.id === 'daily-protocol' ? <DailyProtocolPanel /> : <>
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
            </>}
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
  .game-room-panel .gr-night .gr-card-icon, .game-room-panel .gr-detail-night .gr-detail-icon { background:rgba(70,87,118,.2); }
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
  .game-room-panel .daily-protocol { max-width:540px; margin:18px auto 0; padding:16px; color:#e9edf5; background:#121722; border:1px solid rgba(129,153,191,.38); border-radius:8px; box-shadow:0 18px 36px rgba(32,39,56,.26); font-family:var(--font-cn); }
  .game-room-panel .dp-topline, .game-room-panel .dp-section-heading { display:flex; align-items:center; justify-content:space-between; gap:10px; font:10px/1 var(--font-cn); letter-spacing:1.25px; color:#8190a9; }
  .game-room-panel .dp-topline { padding-bottom:12px; border-bottom:1px solid rgba(128,150,185,.2); }
  .game-room-panel .dp-topline b { color:#ffd36a; font-size:13px; }
  .game-room-panel .dp-header { display:flex; justify-content:space-between; gap:12px; padding:15px 0 14px; }
  .game-room-panel .dp-eyebrow { display:block; color:#75d9bd; font:10px/1 var(--font-cn); letter-spacing:1.4px; }
  .game-room-panel .dp-header h4 { margin:6px 0 4px; color:#f5f7fb; font:500 20px/1.25 var(--font-cute); }
  .game-room-panel .dp-header p { margin:0; color:#9aa8bc; font:12px/1.5 var(--font-cn); }
  .game-room-panel .dp-reset { width:34px; height:34px; border:1px solid rgba(128,150,185,.4); border-radius:8px; background:transparent; color:#c9d3e5; cursor:pointer; font:20px/1 var(--font-cn); }
  .game-room-panel .dp-section { margin-top:12px; border:1px solid rgba(128,150,185,.24); border-radius:8px; background:#171e2b; padding:12px; }
  .game-room-panel .dp-section-heading b { color:#cbd6e8; font-weight:500; letter-spacing:0; }
  .game-room-panel .dp-progress { height:5px; overflow:hidden; margin:10px 0 12px; background:#30394a; border-radius:3px; }
  .game-room-panel .dp-progress i { display:block; height:100%; min-width:0; background:linear-gradient(90deg,#71d8bd,#f2c66c,#ee8069); transition:width .2s ease; }
  .game-room-panel .dp-tasks { display:flex; flex-direction:column; gap:8px; }
  .game-room-panel .dp-task { display:grid; grid-template-columns:26px minmax(0,1fr) auto; gap:9px; align-items:start; padding:9px 0; border-top:1px solid rgba(128,150,185,.15); }
  .game-room-panel .dp-task:first-child { border-top:0; padding-top:0; }
  .game-room-panel .dp-check { width:22px; height:22px; margin:1px 0 0; border:1px solid #6d7d96; border-radius:4px; background:#131923; color:#7ce2c7; cursor:pointer; font:16px/1 var(--font-cn); }
  .game-room-panel .dp-task.done .dp-check { border-color:#70d4b8; background:rgba(84,196,166,.14); }
  .game-room-panel .dp-task.skipped .dp-check { color:#ffc671; border-color:#b8894f; }
  .game-room-panel .dp-task.done strong { color:#91dfca; }
  .game-room-panel .dp-task-copy { min-width:0; }
  .game-room-panel .dp-task-copy strong { color:#eef2f8; font:500 14px var(--font-cn); }
  .game-room-panel .dp-task-copy p { margin:3px 0; color:#bcc6d6; font:12px/1.45 var(--font-cn); }
  .game-room-panel .dp-task-copy small { display:block; color:#77869d; font:10px/1.4 var(--font-cn); }
  .game-room-panel .dp-skip, .game-room-panel .dp-inline-actions button, .game-room-panel .dp-penalty button { border:1px solid rgba(128,150,185,.42); border-radius:6px; background:transparent; color:#c3cddd; padding:5px 7px; cursor:pointer; font:11px var(--font-cn); }
  .game-room-panel .dp-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
  .game-room-panel .dp-grid .dp-section { min-width:0; }
  .game-room-panel .dp-section h5 { margin:9px 0 5px; color:#f0f3f8; font:500 15px var(--font-cn); }
  .game-room-panel .dp-section > p { margin:0; color:#aeb9cb; font:12px/1.5 var(--font-cn); }
  .game-room-panel .dp-state { color:#f4c46b; font-style:normal; }
  .game-room-panel .dp-state.active { color:#72dfc2; }
  .game-room-panel .dp-state.completed { color:#72dfc2; }
  .game-room-panel .dp-card { background:#1b1b2c; border-color:rgba(172,144,214,.32); }
  .game-room-panel .dp-card.open { border-color:rgba(244,202,108,.45); }
  .game-room-panel .dp-card em { color:#a894d5; font-style:normal; }
  .game-room-panel .dp-clock { margin:12px 0 9px; color:#f2ca6b; font:500 26px/1 var(--font-mono,monospace); letter-spacing:1px; }
  .game-room-panel .dp-inline-actions { min-height:25px; display:flex; align-items:center; }
  .game-room-panel .dp-inline-actions span { color:#7c8ba2; font:10px/1.35 var(--font-cn); }
  .game-room-panel .dp-queue { padding-bottom:6px; }
  .game-room-panel .dp-empty { padding:9px 0 5px; text-align:center; color:#78869b !important; }
  .game-room-panel .dp-penalty { display:flex; gap:10px; justify-content:space-between; align-items:center; padding:10px 0; border-top:1px solid rgba(128,150,185,.15); }
  .game-room-panel .dp-penalty strong { display:block; margin:4px 0 2px; color:#e5eaf3; font:13px var(--font-cn); }
  .game-room-panel .dp-penalty p { margin:0; color:#8f9db2; font:11px/1.4 var(--font-cn); }
  .game-room-panel .dp-penalty-state { color:#f3b96c; font:10px var(--font-cn); font-style:normal; }
  .game-room-panel .dp-penalty-state.settled { color:#76dfc3; }
  .game-room-panel .dp-badge-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-top:10px; }
  .game-room-panel .dp-badge { min-height:76px; padding:9px; border:1px solid rgba(128,150,185,.2); border-radius:6px; background:#141a25; }
  .game-room-panel .dp-badge span { display:block; color:#f2ca6b; font-size:17px; }
  .game-room-panel .dp-badge strong { display:block; margin:5px 0 2px; color:#e4eaf4; font:12px var(--font-cn); }
  .game-room-panel .dp-badge small { display:block; color:#7c8ba0; font:10px/1.35 var(--font-cn); }
  .game-room-panel .dp-badge.locked { filter:saturate(.3); opacity:.62; }
  .game-room-panel .dp-note { margin-top:12px; padding:13px; border-left:2px solid #ed9a78; background:#211d29; }
  .game-room-panel .dp-note span { color:#edb28e; font:10px var(--font-cn); letter-spacing:1.1px; }
  .game-room-panel .dp-note p { margin:6px 0 0; color:#e6d8dc; font:13px/1.55 var(--font-cn); }
  .game-room-panel .dp-safety { display:grid; grid-template-columns:1fr 1fr 1.35fr; gap:8px; margin-top:12px; }
  .game-room-panel .dp-safety button { min-height:37px; border:1px solid #657891; border-radius:6px; background:#18202d; color:#d8e0eb; cursor:pointer; font:12px var(--font-cn); }
  .game-room-panel .dp-safety button:nth-child(1) { color:#f3c66e; border-color:rgba(243,198,110,.58); }
  .game-room-panel .dp-safety button:nth-child(2) { color:#ef8c7f; border-color:rgba(239,140,127,.58); }
  .game-room-panel .dp-safety .dp-settle { color:#8ae2c8; border-color:rgba(112,216,189,.62); }
  .game-room-panel .dp-notice { white-space:pre-wrap; word-break:break-word; margin:10px 0 0; padding:9px; color:#aebbd0; border:1px solid rgba(128,150,185,.18); border-radius:6px; background:#101520; font:11px/1.45 var(--font-cn); }
  .game-room-panel .dp-loading { max-width:540px; margin:18px auto 0; padding:24px; color:#8c9bb1; background:#121722; border:1px solid rgba(128,150,185,.32); border-radius:8px; font:13px var(--font-cn); text-align:center; }
  .game-room-panel .daily-protocol .gr-play { border-color:rgba(128,150,185,.26); border-radius:8px; background:#171e2b; }
  .game-room-panel .daily-protocol .gr-play h4, .game-room-panel .daily-protocol .gr-chat-line p { color:#e8edf6; }
  .game-room-panel .daily-protocol .gr-play-heading p, .game-room-panel .daily-protocol .gr-chat-label, .game-room-panel .daily-protocol .gr-card-eyebrow { color:#8998ad; }
  .game-room-panel .daily-protocol .gr-chat-line.echo p { background:#202a3c; }
  .game-room-panel .daily-protocol .gr-chat-line.joy p { background:#332735; }
  .game-room-panel .daily-protocol .gr-play-input textarea { border-color:rgba(128,150,185,.38); background:#121722; color:#e8edf6; border-radius:6px; }
  @keyframes gr-blink { 50% { opacity:0; } }
  .game-room-panel .gr-muted { grid-column:1/-1; padding:12px; color:var(--ink-faint); font:13px var(--font-cn); }
  @media (max-width:520px) { .game-room-panel .gr-lobby-heading h3 { font-size:21px; } .game-room-panel .gr-cards { grid-template-columns:1fr; } .game-room-panel .gr-command { grid-template-columns:1fr; } .game-room-panel .gr-actions button { flex:1 1 auto; } .game-room-panel .gr-play-heading { flex-direction:column; } .game-room-panel .gr-play-input { grid-template-columns:1fr; } .game-room-panel .daily-protocol { padding:12px; margin-top:14px; } .game-room-panel .dp-grid { grid-template-columns:1fr; } .game-room-panel .dp-safety { grid-template-columns:1fr; } .game-room-panel .dp-task { grid-template-columns:26px minmax(0,1fr); } .game-room-panel .dp-skip { grid-column:2; justify-self:start; } }
`
