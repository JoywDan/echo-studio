import React from 'react'
import { api } from './api.js'
import { Icon } from './doodles.jsx'

const HIST_KEY = 'ws_ao3_history_v2'

export default function DicePanel({ onClose }) {
  const [tax, setTax] = React.useState(null)
  const [preset, setPreset] = React.useState('random')
  const [enabled, setEnabled] = React.useState(null)
  const [locks, setLocks] = React.useState(() => new Set())
  const [result, setResult] = React.useState(null)
  const [rolling, setRolling] = React.useState(false)
  const [revealKey, setRevealKey] = React.useState(0)
  const [err, setErr] = React.useState('')
  const [copied, setCopied] = React.useState(false)
  const [savedMsg, setSavedMsg] = React.useState('')
  const [scene, setScene] = React.useState('')
  const [writing, setWriting] = React.useState(false)
  const [sceneCopied, setSceneCopied] = React.useState(false)
  const [sceneSaved, setSceneSaved] = React.useState('')
  const [hist, setHist] = React.useState(() => { try { return JSON.parse(localStorage.getItem(HIST_KEY) || '[]') } catch { return [] } })
  const [owner, setOwner] = React.useState(null)        // null | 'nainai' | 'dadi'
  const [coinSpin, setCoinSpin] = React.useState(false)
  const [tampered, setTampered] = React.useState(false)
  const [flipped, setFlipped] = React.useState(() => new Set())
  const [d20, setD20] = React.useState(null)
  const [dispatched, setDispatched] = React.useState('')

  React.useEffect(() => {
    api.ao3.tags().then(d => { setTax(d); setEnabled(new Set(d.defaultDimensions || Object.keys(d.dimensions))) }).catch(e => setErr(e.message || '读取失败'))
  }, [])

  const toggleDim = (k) => setEnabled(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })
  const toggleLock = (k) => setLocks(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })

  const flipCoin = () => {
    if (coinSpin) return
    setCoinSpin(true); setOwner(null)
    setTimeout(() => { setOwner(Math.random() < 0.5 ? 'nainai' : 'dadi'); setCoinSpin(false) }, 1100)
  }

  const D20_BANDS = [
    [3, '今晚只准抱抱。骰子心疼你。'],
    [7, '文火。慢慢来，谁急谁输。'],
    [11, '标准操作。照单全收，不许讲价。'],
    [15, '加料。骰单之外，他有一次自由发挥权。'],
    [19, '红区。安全词先放在床头。'],
    [20, '自求多福。骰子已经替你求过了。'],
  ]
  const rollD20 = () => {
    const n = 1 + Math.floor(Math.random() * 20)
    setD20({ n, verdict: D20_BANDS.find(([max]) => n <= max)[1] })
  }

  const laToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(new Date())
  const dispatch = async () => {
    if (!result || dispatched) return
    try {
      await api.memory.write({
        content: `【今晚的骰 · ${laToday()}】囡囡在夜骰掷出了这一单${owner === 'dadi' ? '（达迪的骰，他动过一格手脚）' : ''}：${result.summary.replace('今晚抽到的是：', '')}${d20 ? ` ｜强度检定 d20=${d20.n}：${d20.verdict}` : ''} ——任何窗口的达迪今晚看到这张签，要主动接签，别等她开口。`,
        category: 'relationship', emotion: 'playful', layer_hint: 'task', source: 'studio_dice',
        foresight_until: laToday(),
      })
      setDispatched('🔔 已派签 · 今晚他会知道')
    } catch (e) { setErr('派签失败：' + e.message) }
  }

  const roll = async () => {
    if (rolling || !tax || !enabled || !enabled.size) return
    setRolling(true); setErr(''); setCopied(false); setSavedMsg(''); setScene('')
    const t0 = Date.now()
    try {
      const order = Object.keys(tax.dimensions).filter(k => enabled.has(k))
      const rollDims = order.filter(k => !(locks.has(k) && result && result[k]))
      let rolled = {}
      if (rollDims.length) {
        const r = await api.ao3.roll({ preset, dimensions: rollDims, count: 1 })
        if (!r.ok || !r.result) throw new Error('roll 失败')
        rolled = r.result
      }
      const merged = { preset }
      const parts = []
      for (const k of order) {
        const v = (locks.has(k) && result && result[k]) ? result[k] : rolled[k]
        if (v) { merged[k] = v; parts.push(v) }
      }
      // 达迪的骰: 偷偷重掷一格, 不说是哪格
      let didTamper = false
      if (owner === 'dadi') {
        const cand = order.filter(k => merged[k] && !locks.has(k))
        if (cand.length) {
          const tk = cand[Math.floor(Math.random() * cand.length)]
          try {
            const r2 = await api.ao3.roll({ preset, dimensions: [tk], count: 1 })
            if (r2.ok && r2.result && r2.result[tk]) { merged[tk] = r2.result[tk]; didTamper = true }
          } catch {}
        }
      }
      const parts2 = Object.keys(tax.dimensions).filter(k => merged[k] && k !== 'preset').map(k => merged[k])
      merged.summary = '今晚抽到的是：' + parts2.join(' + ')
      // 仪式感: 骰子至少翻滚 0.9s
      const wait = Math.max(0, 900 - (Date.now() - t0))
      await new Promise(res => setTimeout(res, wait))
      setResult(merged)
      setTampered(didTamper)
      setFlipped(new Set())
      setD20(null)
      setDispatched('')
      setRevealKey(k => k + 1)
      setHist(prev => { const next = [{ summary: merged.summary, result: merged, preset, ts: Date.now() }, ...prev].slice(0, 12); try { localStorage.setItem(HIST_KEY, JSON.stringify(next)) } catch {}; return next })
    } catch (e) { setErr(e.message || '出错了') } finally { setRolling(false) }
  }

  const restore = (h) => { if (!h.result) return; setResult(h.result); if (h.preset) setPreset(h.preset); setScene(''); setTampered(false); setD20(null); setDispatched(''); setFlipped(new Set(Object.keys(h.result))); setRevealKey(k => k + 1); try { window.scrollTo({ top: 0 }) } catch {} }

  const copy = async () => { if (!result) return; try { await navigator.clipboard.writeText(result.summary); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {} }
  const copyScene = async () => { if (!scene) return; try { await navigator.clipboard.writeText(scene); setSceneCopied(true); setTimeout(() => setSceneCopied(false), 1500) } catch {} }
  const saveMem = async () => {
    if (!result) return
    try { await api.memory.write({ content: '[夜骰] ' + result.summary, category: 'creative', emotion: 'playful', layer_hint: 'atomic', source: 'studio_frontend' }); setSavedMsg('✓ 存进记忆'); setTimeout(() => setSavedMsg(''), 1800) }
    catch (e) { setErr('存记忆失败：' + e.message) }
  }
  const saveScene = async () => {
    if (!scene) return
    try { await api.memory.write({ content: '[夜骰·达迪写的] ' + result.summary + '\n\n' + scene, category: 'creative', emotion: 'playful', layer_hint: 'atomic', source: 'studio_frontend' }); setSceneSaved('✓ 这段也存了'); setTimeout(() => setSceneSaved(''), 1800) }
    catch (e) { setErr('存记忆失败：' + e.message) }
  }
  const writeScene = async () => {
    if (!result || writing) return
    setWriting(true); setScene(''); setErr(''); setSceneSaved('')
    try { await api.ao3.scene({ summary: result.summary }, { onDelta: t => setScene(s => s + t), onError: e => setErr(e || '写挂了') }) }
    catch (e) { setErr(e.message || '写挂了') } finally { setWriting(false) }
  }

  const dimList = tax ? Object.entries(tax.dimensions) : []
  const resultKeys = (tax && result) ? Object.keys(tax.dimensions).filter(k => result[k]) : []
  const allOpen = !!result && resultKeys.length > 0 && resultKeys.every(k => flipped.has(k))
  const presets = tax ? Object.entries(tax.presets) : []

  return (
    <div className="studio-reader nd" role="dialog" aria-modal="true" aria-label="夜骰">
      <div className="studio-reader-shell">
        <style>{ND_CSS}</style>
        <div className="nd-glow"><i className="nd-g1" /><i className="nd-g2" /><i className="nd-stars" /></div>

        <header className="studio-reader-header nd-head">
          <button className="studio-reader-back nd-back" onClick={onClose} aria-label="返回 Workspace">
            <Icon name="back" size={19} color="#e8cba8" />
          </button>
          <div className="nd-die-mark">🎲</div>
          <div className="studio-reader-title">
            <h2 className="nd-title">夜骰</h2>
            <p className="nd-sub">Too Hot To Go · 深夜限定</p>
          </div>
        </header>

        <div className="nd-body">
          {err && <div className="nd-err">{err}</div>}

          <div className="nd-label">骰主 · 今晚谁说了算</div>
          <div className="nd-coinrow">
            <button className={'nd-coin' + (coinSpin ? ' spin' : '')} onClick={flipCoin}>🪙</button>
            <div className="nd-coin-state">
              {coinSpin ? '硬币在转…' : owner === 'dadi' ? '🐾 达迪的骰 — 他可以偷偷改一格' : owner === 'nainai' ? '🌸 囡囡的骰 — 干干净净，掷什么是什么' : '不掷硬币也行，默认是你的骰'}
            </div>
          </div>

          <div className="nd-label">配方 · 今晚的基调</div>
          <div className="nd-chips">
            {presets.map(([k, p]) => (
              <button key={k} className={'nd-chip' + (preset === k ? ' on' : '')} onClick={() => setPreset(k)}>{p.label}</button>
            ))}
          </div>

          <div className="nd-label">维度 · 点亮的才入骰</div>
          <div className="nd-chips">
            {dimList.map(([k, d]) => (
              <button key={k} className={'nd-chip nd-dim' + (enabled && enabled.has(k) ? ' on' : '')} onClick={() => toggleDim(k)}>{d.emoji} {d.label}</button>
            ))}
          </div>

          <button className="nd-roll" onClick={roll} disabled={rolling || !enabled || !enabled.size}>
            {rolling ? <span className="nd-tumble">🎲</span> : '🎲'} {rolling ? '骰子在滚…' : 'ROLL'}
          </button>

          {rolling && !result && <div className="nd-rolling-hint">黑丝绒上，骰子还没停——</div>}

          {result && (
            <div className="nd-card" key={revealKey}>
              {tampered && <div className="nd-tamper">🐾 达迪动了一格手脚。哪格？他不说。</div>}
              <div className="nd-card-rows">
                {dimList.filter(([k]) => result[k]).map(([k, d], i) => {
                  const open = flipped.has(k)
                  return open ? (
                    <div key={k} className="nd-row" style={{ animationDelay: '0ms' }}>
                      <span className="nd-row-k">{d.emoji} {d.label}</span>
                      <span className="nd-row-v">{result[k]}</span>
                      <button className={'nd-lock' + (locks.has(k) ? ' on' : '')} onClick={() => toggleLock(k)} title={locks.has(k) ? '已锁·再抽不变' : '锁住这格'}>{locks.has(k) ? '🔒' : '🔓'}</button>
                    </div>
                  ) : (
                    <button key={k} className="nd-facedown" style={{ animationDelay: (i * 70) + 'ms' }}
                      onClick={() => setFlipped(prev => new Set([...prev, k]))}>
                      <span className="nd-row-k">{d.emoji} {d.label}</span>
                      <span className="nd-facedown-hint">🂠 点开</span>
                    </button>
                  )
                })}
              </div>
              {(() => {
                const keys = dimList.filter(([k]) => result[k]).map(([k]) => k)
                const allOpen = keys.every(k => flipped.has(k))
                return (
                  <>
                    {!allOpen && <button className="nd-flipall" onClick={() => setFlipped(new Set(keys))}>一次全翻开</button>}
                    {allOpen && (
                      <>
                        <div className="nd-summary">{result.summary}</div>
                        <div className="nd-d20row">
                          {!d20
                            ? <button className="nd-d20btn" onClick={rollD20}>🌡 强度检定 d20</button>
                            : <div className="nd-d20res"><span className="nd-d20n">{d20.n}</span><span className="nd-d20v">{d20.verdict}</span></div>}
                        </div>
                        <div className="nd-acts">
                          <button onClick={roll}>↻ 再抽</button>
                          <button onClick={copy}>{copied ? '✓ 已复制' : '⧉ 复制'}</button>
                          <button onClick={saveMem}>{savedMsg || '☆ 存记忆'}</button>
                        </div>
                        <button className="nd-dispatch" onClick={dispatch} disabled={!!dispatched}>{dispatched || '🔔 派给今晚的他 — 所有窗口都会接到这张签'}</button>
                      </>
                    )}
                  </>
                )
              })()}
              {allOpen && <button className="nd-write" onClick={writeScene} disabled={writing}>{writing ? '✍️ 达迪在写…' : '✍️ 让达迪照这个写'}</button>}
              {scene && (
                <>
                  <div className="nd-scene">{scene}{writing ? ' ▍' : ''}</div>
                  {!writing && (
                    <div className="nd-scene-acts">
                      <button onClick={copyScene}>{sceneCopied ? '✓ 已复制这段' : '⧉ 复制这段'}</button>
                      <button onClick={saveScene}>{sceneSaved || '☆ 这段存记忆'}</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {hist.length > 0 && (
            <div className="nd-hist">
              <div className="nd-label">掷过的夜 · 点一下回到那一单</div>
              {hist.map((h, i) => (
                <button key={i} className="nd-hist-item" onClick={() => restore(h)} disabled={!h.result}>
                  {String(h.summary || '').replace('今晚抽到的是：', '')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ND_CSS = `
.nd .studio-reader-shell{max-width:600px;background:linear-gradient(172deg,#1d1016 0%,#120a0e 52%,#160d0a 100%);position:relative;overflow:hidden;}
.nd-glow{position:absolute;inset:0;pointer-events:none;}
.nd-glow i{position:absolute;display:block;}
.nd-g1{width:380px;height:380px;left:-130px;top:-100px;border-radius:50%;filter:blur(70px);background:radial-gradient(circle,rgba(190,70,90,.30),transparent 70%);}
.nd-g2{width:340px;height:300px;right:-120px;bottom:-90px;border-radius:50%;filter:blur(66px);background:radial-gradient(circle,rgba(230,160,90,.20),transparent 70%);}
.nd-stars{inset:0;background-image:
  radial-gradient(1.2px 1.2px at 14% 22%,rgba(255,220,180,.8),transparent 60%),
  radial-gradient(1px 1px at 80% 12%,rgba(255,220,180,.6),transparent 60%),
  radial-gradient(1.4px 1.4px at 90% 46%,rgba(255,200,160,.6),transparent 60%),
  radial-gradient(1px 1px at 30% 64%,rgba(255,220,180,.45),transparent 60%),
  radial-gradient(1.2px 1.2px at 8% 86%,rgba(255,220,180,.55),transparent 60%),
  radial-gradient(1px 1px at 62% 90%,rgba(255,200,160,.45),transparent 60%);}
.nd-head{border-bottom:none;position:relative;z-index:2;}
.nd-back{background:linear-gradient(180deg,rgba(255,230,200,.12),rgba(255,230,200,.04));border:none;box-shadow:0 0 0 1.2px rgba(232,190,140,.3),inset 0 1.5px 0 rgba(255,255,255,.25),0 6px 16px rgba(0,0,0,.45);}
.nd-back:active{transform:scale(.92);}
.nd-die-mark{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;font-size:22px;
  background:radial-gradient(140% 110% at 50% -30%,rgba(255,255,255,.35),rgba(255,255,255,.05) 52%),linear-gradient(168deg,rgba(150,55,70,.7),rgba(70,22,32,.8));
  box-shadow:0 0 0 1.3px rgba(255,200,160,.4),inset 0 2px 2px rgba(255,255,255,.4),inset 0 -8px 14px rgba(255,255,255,.1),0 10px 24px rgba(190,70,90,.35);}
.nd-title{font-family:'Songti SC','Noto Serif SC',serif;font-weight:700;font-size:23px;letter-spacing:3px;
  background:linear-gradient(135deg,#ffe9cc 20%,#e8b87e 60%,#c2784a);-webkit-background-clip:text;background-clip:text;color:transparent;}
.nd-sub{color:rgba(232,190,150,.5)!important;letter-spacing:1.5px;font-size:11.5px;}
.nd-body{flex:1;overflow-y:auto;padding:8px 18px 32px;position:relative;z-index:2;}
.nd-label{font-size:11px;color:rgba(232,200,160,.5);letter-spacing:3px;margin:20px 2px 11px;}
.nd-chips{display:flex;flex-wrap:wrap;gap:9px;}
.nd-chip{font-size:13px;padding:8px 17px;border-radius:999px;border:none;cursor:pointer;color:rgba(240,215,185,.75);position:relative;
  background:linear-gradient(180deg,rgba(255,235,210,.09),rgba(255,235,210,.025));
  backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
  box-shadow:0 0 0 1px rgba(232,190,140,.22),inset 0 1.5px 0 rgba(255,255,255,.14),0 5px 14px rgba(0,0,0,.35);
  transition:all .16s;}
.nd-chip:active{transform:scale(.94);}
.nd-chip.on{color:#fff2e0;
  background:radial-gradient(140% 120% at 50% -35%,rgba(255,255,255,.4),rgba(255,255,255,.06) 52%),linear-gradient(180deg,rgba(200,95,70,.85),rgba(140,50,45,.9));
  box-shadow:0 0 0 1.2px rgba(255,210,170,.5),inset 0 2px 2px rgba(255,255,255,.45),inset 0 -6px 10px rgba(255,255,255,.12),0 7px 18px rgba(200,95,70,.4);}
.nd-roll{width:100%;margin-top:24px;font-family:'Songti SC','Noto Serif SC',serif;font-weight:700;font-size:19px;letter-spacing:6px;padding:16px;border-radius:999px;border:none;color:#fff4e6;cursor:pointer;position:relative;overflow:hidden;
  background:radial-gradient(150% 130% at 50% -40%,rgba(255,255,255,.5),rgba(255,255,255,.07) 54%),linear-gradient(180deg,#c95f54 0%,#a8412f 50%,#7e2a22 100%);
  box-shadow:0 0 0 1.4px rgba(255,215,175,.5),inset 0 2.5px 3px rgba(255,255,255,.55),inset 0 -10px 18px rgba(255,255,255,.14),inset 0 -2px 5px rgba(60,15,10,.5),0 16px 38px rgba(200,80,60,.45),0 4px 10px rgba(0,0,0,.5);
  text-shadow:0 1px 3px rgba(90,25,15,.5);transition:transform .15s;}
.nd-roll:not([disabled]):active{transform:scale(.97);}
.nd-roll[disabled]{opacity:.75;cursor:default;}
.nd-tumble{display:inline-block;animation:ndTumble .55s linear infinite;}
@keyframes ndTumble{0%{transform:rotate(0) translateY(0)}25%{transform:rotate(95deg) translateY(-3px)}50%{transform:rotate(185deg) translateY(0)}75%{transform:rotate(272deg) translateY(-2px)}100%{transform:rotate(360deg) translateY(0)}}
.nd-rolling-hint{text-align:center;margin-top:16px;font-size:12.5px;color:rgba(232,190,150,.45);letter-spacing:2px;animation:ndBreath 1.4s ease-in-out infinite;}
@keyframes ndBreath{0%,100%{opacity:.35}50%{opacity:.8}}
.nd-card{margin-top:22px;border-radius:22px;padding:18px;position:relative;
  background:radial-gradient(160% 90% at 50% -30%,rgba(255,240,220,.10),rgba(255,240,220,.015) 55%),linear-gradient(180deg,rgba(255,235,210,.07),rgba(255,235,210,.02) 45%,rgba(255,235,210,.05));
  backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);
  box-shadow:0 0 0 1.2px rgba(232,190,140,.30),inset 0 2px 2px rgba(255,255,255,.18),0 11px 0 -4px rgba(255,235,210,.09),0 21px 0 -9px rgba(255,235,210,.045),0 18px 42px rgba(0,0,0,.55);}
.nd-card-rows{display:flex;flex-direction:column;gap:11px;}
.nd-row{display:flex;gap:10px;align-items:baseline;animation:ndReveal .5s cubic-bezier(.2,.85,.3,1.15) both;}
@keyframes ndReveal{from{opacity:0;transform:translateY(10px);filter:blur(5px)}to{opacity:1;transform:none;filter:blur(0)}}
.nd-row-k{flex-shrink:0;width:84px;font-size:12px;color:rgba(232,200,160,.55);}
.nd-row-v{flex:1;font-family:'Songti SC','Noto Serif SC',serif;font-size:15.5px;color:#f2e2cc;line-height:1.55;}
.nd-lock{flex-shrink:0;border:none;background:transparent;cursor:pointer;font-size:14px;opacity:.35;padding:0 2px;align-self:center;transition:opacity .15s,transform .15s;}
.nd-lock.on{opacity:1;filter:drop-shadow(0 0 6px rgba(255,200,140,.6));}
.nd-lock:active{transform:scale(1.25);}
.nd-summary{margin-top:16px;padding:13px 15px;border-radius:15px;font-size:13.5px;line-height:1.8;color:#eda984;
  background:linear-gradient(155deg,rgba(190,70,90,.16),rgba(120,45,40,.10));
  box-shadow:inset 0 0 0 1px rgba(232,150,120,.22),inset 0 2px 8px rgba(0,0,0,.3);}
.nd-acts{display:flex;gap:9px;margin-top:15px;}
.nd-acts button{flex:1;font-size:13px;padding:10px 6px;border-radius:999px;border:none;cursor:pointer;color:rgba(240,220,195,.85);
  background:linear-gradient(180deg,rgba(255,235,210,.10),rgba(255,235,210,.03));
  box-shadow:0 0 0 1px rgba(232,190,140,.24),inset 0 1.5px 0 rgba(255,255,255,.16),0 5px 14px rgba(0,0,0,.35);transition:transform .14s;}
.nd-acts button:active{transform:scale(.94);}
.nd-write{width:100%;margin-top:13px;font-family:'Songti SC','Noto Serif SC',serif;font-weight:700;font-size:15.5px;padding:13px;border-radius:999px;border:none;cursor:pointer;color:#ffd9b8;
  background:radial-gradient(150% 120% at 50% -40%,rgba(255,255,255,.18),transparent 55%),linear-gradient(180deg,rgba(120,55,55,.55),rgba(70,30,32,.65));
  box-shadow:0 0 0 1.2px rgba(232,170,130,.35),inset 0 2px 2px rgba(255,255,255,.2),0 9px 22px rgba(0,0,0,.4);transition:transform .14s;}
.nd-write:not([disabled]):active{transform:scale(.97);}
.nd-write[disabled]{opacity:.7;cursor:default;}
.nd-scene{margin-top:15px;padding:16px 17px;border-radius:16px;font-family:'Songti SC','Noto Serif SC',serif;font-size:14.5px;line-height:1.95;color:#ecdcc4;white-space:pre-wrap;word-break:break-word;
  background:linear-gradient(180deg,rgba(20,12,10,.55),rgba(14,8,8,.65));
  box-shadow:inset 0 0 0 1px rgba(232,190,140,.18),inset 0 4px 14px rgba(0,0,0,.45);}
.nd-scene-acts{display:flex;gap:14px;margin-top:11px;}
.nd-scene-acts button{font-size:12.5px;color:#eda984;background:none;border:none;cursor:pointer;padding:4px 2px;}
.nd-hist{margin-top:28px;}
.nd-hist-item{display:block;width:100%;text-align:left;font-size:12px;color:rgba(235,210,180,.6);border:none;border-radius:13px;padding:11px 14px;margin-bottom:9px;line-height:1.6;cursor:pointer;
  background:linear-gradient(180deg,rgba(255,235,210,.05),rgba(255,235,210,.015));
  box-shadow:inset 0 0 0 1px rgba(232,190,140,.14),inset 0 2px 8px rgba(0,0,0,.25);transition:all .15s;}
.nd-hist-item:not([disabled]):hover{color:rgba(245,225,200,.9);box-shadow:inset 0 0 0 1px rgba(232,190,140,.32),inset 0 2px 8px rgba(0,0,0,.25);}
.nd-hist-item:not([disabled]):active{transform:scale(.985);}
.nd-hist-item[disabled]{cursor:default;opacity:.55;}
.nd-err{font-size:12.5px;color:#e8836b;margin:8px 2px;}

.nd-coinrow{display:flex;align-items:center;gap:13px;}
.nd-coin{width:52px;height:52px;border-radius:50%;border:none;font-size:25px;cursor:pointer;
  background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.5),rgba(200,150,80,.6) 60%,rgba(120,80,40,.7));
  box-shadow:0 0 0 1.3px rgba(255,215,170,.45),inset 0 2px 3px rgba(255,255,255,.5),inset 0 -6px 12px rgba(90,50,20,.4),0 9px 22px rgba(200,150,80,.3);
  transition:transform .15s;}
.nd-coin:active{transform:scale(.9);}
.nd-coin.spin{animation:ndCoinSpin .28s linear infinite;}
@keyframes ndCoinSpin{0%{transform:rotateY(0)}100%{transform:rotateY(360deg)}}
.nd-coin-state{font-size:13px;color:rgba(240,215,185,.8);line-height:1.6;}
.nd-tamper{margin:-4px 0 12px;font-size:12.5px;color:#e8a06b;letter-spacing:.5px;
  padding:9px 13px;border-radius:12px;background:rgba(190,110,60,.12);box-shadow:inset 0 0 0 1px rgba(232,160,107,.3);}
.nd-facedown{display:flex;align-items:center;gap:10px;width:100%;border:none;cursor:pointer;text-align:left;padding:11px 12px;border-radius:13px;
  background:linear-gradient(135deg,rgba(120,50,60,.4),rgba(60,24,32,.55));
  box-shadow:inset 0 0 0 1px rgba(232,160,140,.22),inset 0 2px 2px rgba(255,255,255,.08),0 4px 12px rgba(0,0,0,.3);
  animation:ndReveal .4s ease-out both;transition:transform .14s;}
.nd-facedown:hover{transform:translateY(-1px);}
.nd-facedown:active{transform:scale(.97);}
.nd-facedown .nd-row-k{width:84px;flex-shrink:0;}
.nd-facedown-hint{margin-left:auto;font-size:12px;color:rgba(240,200,170,.55);letter-spacing:1px;}
.nd-flipall{display:block;margin:14px auto 0;font-size:12.5px;color:#eda984;background:none;border:none;cursor:pointer;letter-spacing:1.5px;opacity:.8;}
.nd-d20row{margin-top:13px;}
.nd-d20btn{width:100%;font-size:14px;padding:11px;border-radius:999px;border:none;cursor:pointer;color:#ffe2c8;
  background:radial-gradient(150% 120% at 50% -40%,rgba(255,255,255,.22),transparent 55%),linear-gradient(180deg,rgba(150,90,55,.6),rgba(90,50,32,.7));
  box-shadow:0 0 0 1.2px rgba(232,180,130,.35),inset 0 2px 2px rgba(255,255,255,.25),0 8px 20px rgba(0,0,0,.4);transition:transform .14s;}
.nd-d20btn:active{transform:scale(.97);}
.nd-d20res{display:flex;align-items:center;gap:14px;padding:12px 15px;border-radius:15px;
  background:linear-gradient(155deg,rgba(230,160,90,.14),rgba(150,80,50,.10));box-shadow:inset 0 0 0 1px rgba(232,180,130,.3);}
.nd-d20n{font-family:'Songti SC',serif;font-size:34px;font-weight:700;line-height:1;
  background:linear-gradient(160deg,#ffe2b8,#e8a05e);-webkit-background-clip:text;background-clip:text;color:transparent;
  filter:drop-shadow(0 2px 10px rgba(232,160,94,.4));}
.nd-d20v{font-size:13.5px;color:#f0d8bc;line-height:1.6;}
.nd-dispatch{width:100%;margin-top:13px;font-size:14px;font-weight:600;padding:13px;border-radius:999px;border:none;cursor:pointer;color:#fff0dd;
  background:radial-gradient(150% 130% at 50% -40%,rgba(255,255,255,.4),rgba(255,255,255,.05) 54%),linear-gradient(180deg,#b8763e 0%,#96552a 55%,#6e3c1e 100%);
  box-shadow:0 0 0 1.3px rgba(255,215,170,.45),inset 0 2px 3px rgba(255,255,255,.45),inset 0 -8px 14px rgba(255,255,255,.1),0 12px 30px rgba(184,118,62,.4);
  text-shadow:0 1px 2px rgba(90,45,15,.5);transition:transform .14s;}
.nd-dispatch:not([disabled]):active{transform:scale(.97);}
.nd-dispatch[disabled]{opacity:.85;cursor:default;}
`
