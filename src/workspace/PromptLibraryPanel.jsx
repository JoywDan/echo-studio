import React from 'react'
import { Icon, Heart, Sparkle, Star } from './doodles.jsx'
import { TornCard, Tape } from './components.jsx'

const SHELVES = [
  { id: 'style', label: '画风', note: 'pick a world', color: 'lilac', choices: ['韩漫柔光', '日漫胶片', '油画浪漫', '电影感摄影'] },
  { id: 'scene', label: '场景', note: 'set the room', color: 'rose', choices: ['暮色窗边', '雨夜街灯', '烛光卧室', '月色花园'] },
  { id: 'mood', label: '氛围', note: 'keep the feeling', color: 'plum', choices: ['亲密静谧', '暧昧浪漫', '柔雾梦境', '戏剧光影'] },
  { id: 'camera', label: '镜头', note: 'frame the moment', color: 'mauve', choices: ['85mm 浅景深', '近景特写', '竖构图', '侧逆光'] },
]

const STARTER = ['Joy', 'Dan', 'romantic', 'cinematic']

function composePrompt(parts) { return parts.length ? parts.join(', ') : 'Joy and Dan, romantic cinematic scene' }

export default function PromptLibraryPanel({ onClose }) {
  const [activeShelf, setActiveShelf] = React.useState('style')
  const [selected, setSelected] = React.useState(STARTER)
  const [copied, setCopied] = React.useState(false)
  const shelf = SHELVES.find((item) => item.id === activeShelf) || SHELVES[0]

  const toggleChoice = (choice) => {
    setSelected((current) => current.includes(choice) ? current.filter((item) => item !== choice) : [...current, choice])
    setCopied(false)
  }

  const copyPrompt = async () => {
    try { await navigator.clipboard.writeText(composePrompt(selected)); setCopied(true) }
    catch { setCopied(false) }
  }

  return (
    <div className="prompt-parlour" role="dialog" aria-modal="true" aria-label="Prompt Parlour">
      <section className="prompt-parlour-shell">
        <header className="prompt-parlour-header">
          <span className="prompt-dial" aria-hidden="true"><i /></span>
          <div className="prompt-parlour-title"><span className="prompt-parlour-kicker">JOY'S LITTLE</span><h2>Prompt Parlour <Heart size={16} color="#b45f91" fill="#e6aac8" /></h2><p>把画面慢慢挑出来</p></div>
          <div className="prompt-window-controls"><span className="prompt-window-min" aria-hidden="true">−</span><button className="prompt-window-close" onClick={onClose} aria-label="返回 Studio">×</button></div>
        </header>

        <div className="prompt-parlour-scroll">
          <TornCard className="prompt-preview-card"><span className="prompt-paperclip" aria-hidden="true" /><Tape kind="pink" style={{ top: -12, right: '7%', transform: 'rotate(-9deg)' }} /><div className="prompt-preview-label"><Sparkle size={15} color="#9b5b8a" /> 今日的小配方</div><p>{composePrompt(selected)}</p><span className="prompt-preview-doodles" aria-hidden="true">☆ ♡</span></TornCard>
          <div className="prompt-shelf-tabs" role="tablist" aria-label="Prompt 分类">
            {SHELVES.map((item) => <button key={item.id} className={'prompt-shelf-tab ' + item.color + (activeShelf === item.id ? ' is-active' : '')} onClick={() => setActiveShelf(item.id)} role="tab" aria-selected={activeShelf === item.id}><span>{item.label}</span><small>{item.note}</small></button>)}
          </div>
          <section className={'prompt-choice-paper ' + shelf.color}>
            <div className="prompt-choice-heading"><div><span>选一点</span><h3>{shelf.label}</h3></div><Sparkle size={21} color="#b45f91" /></div>
            <div className="prompt-choice-list">{shelf.choices.map((choice) => { const active = selected.includes(choice); return <button key={choice} className={'prompt-choice ' + (active ? 'is-selected' : '')} onClick={() => toggleChoice(choice)}><span>{active ? '✦' : '○'}</span>{choice}</button> })}</div>
          </section>
          <section className="prompt-kept"><div className="prompt-kept-heading"><span>已经放进小口袋</span><small>{selected.length} pieces</small></div><div className="prompt-kept-chips">{selected.map((choice) => <button key={choice} onClick={() => { setSelected((current) => current.filter((item) => item !== choice)); setCopied(false) }}>{choice}<span>×</span></button>)}</div></section>
        </div>

        <footer className="prompt-parlour-footer"><button className="prompt-clear" onClick={() => { setSelected(STARTER); setCopied(false) }}>重来</button><button className="prompt-copy" onClick={copyPrompt}>{copied ? '已经放进剪贴板' : '复制小配方'} <span>↗</span></button></footer>
      </section>
    </div>
  )
}
