import React from 'react'
import { api } from './api.js'
import { Icon } from './doodles.jsx'

const HIST_KEY = 'ws_ao3_history'

export default function DicePanel({ onClose }) {
  const [tax, setTax] = React.useState(null)
  const [preset, setPreset] = React.useState('random')
  const [enabled, setEnabled] = React.useState(null)
  const [locks, setLocks] = React.useState(() => new Set())
  const [result, setResult] = React.useState(null)
  const [rolling, setRolling] = React.useState(false)
  const [err, setErr] = React.useState('')
  const [copied, setCopied] = React.useState(false)
  const [savedMsg, setSavedMsg] = React.useState('')
  const [scene, setScene] = React.useState('')
  const [writing, setWriting] = React.useState(false)
  const [sceneCopied, setSceneCopied] = React.useState(false)
  const [hist, setHist] = React.useState(() => { try { return JSON.parse(localStorage.getItem(HIST_KEY) || '[]') } catch { return [] } })

  React.useEffect(() => {
    api.ao3.tags().then(d => { setTax(d); setEnabled(new Set(d.defaultDimensions || Object.keys(d.dimensions))) }).catch(e => setErr(e.message || '读取失败'))
  }, [])

  const toggleDim = (k) => setEnabled(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })
  const toggleLock = (k) => setLocks(prev => { const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n })

  const roll = async () => {
    if (rolling || !tax || !enabled || !enabled.size) return
    setRolling(true); setErr(''); setCopied(false); setSavedMsg(''); setScene('')
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
      merged.summary = '今晚抽到的是：' + parts.join(' + ')
      setResult(merged)
      setHist(prev => { const next = [{ summary: merged.summary, ts: Date.now() }, ...prev].slice(0, 12); try { localStorage.setItem(HIST_KEY, JSON.stringify(next)) } catch {} ; return next })
    } catch (e) { setErr(e.message || '出错了') } finally { setRolling(false) }
  }

  const copy = async () => { if (!result) return; try { await navigator.clipboard.writeText(result.summary); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {} }
  const copyScene = async () => { if (!scene) return; try { await navigator.clipboard.writeText(scene); setSceneCopied(true); setTimeout(() => setSceneCopied(false), 1500) } catch {} }
  const saveMem = async () => {
    if (!result) return
    try { await api.memory.write({ content: '[夜骰] ' + result.summary, category: 'creative', emotion: 'playful', layer_hint: 'atomic', source: 'studio_frontend' }); setSavedMsg('✓ 存进记忆'); setTimeout(() => setSavedMsg(''), 1800) }
    catch (e) { setErr('存记忆失败：' + e.message) }
  }
  const writeScene = async () => {
    if (!result || writing) return
    setWriting(true); setScene(''); setErr('')
    try { await api.ao3.scene({ summary: result.summary }, { onDelta: t => setScene(s => s + t), onError: e => setErr(e || '写挂了') }) }
    catch (e) { setErr(e.message || '写挂了') } finally { setWriting(false) }
  }

  const dimList = tax ? Object.entries(tax.dimensions) : []
  const presets = tax ? Object.entries(tax.presets) : []

  return (
    <div className="studio-reader ao3-dice" role="dialog" aria-modal="true" aria-label="夜骰">
      <div className="studio-reader-shell paper-bg">
        <style>{`
          .ao3-dice { --nm-d: #cdc4b1; --nm-l: #fbf7ed; }
          .ao3-dice .studio-reader-shell { max-width: 600px; background: #ece5d6; }
          .ao3-dice .studio-reader-header { border-bottom: none; }
          .ao3-dice .studio-reader-mark { display: none; }
          .ao3-dice .studio-reader-title h2 { font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 700; font-size: 22px; color: #3a342a; }
          .ao3-dice .studio-reader-title p { color: #9d9081; }
          .ao3-dice .studio-reader-back { background: #ece5d6; border: none; box-shadow: 4px 4px 9px var(--nm-d), -4px -4px 9px var(--nm-l); }
          .ao3-dice .studio-reader-back:active { box-shadow: inset 3px 3px 6px var(--nm-d), inset -3px -3px 6px var(--nm-l); }
          .ao3-body { flex: 1; overflow-y: auto; padding: 8px 18px 30px; }
          .ao3-label { font-family: var(--font-cn); font-size: 12px; color: #9d9081; letter-spacing: 1px; margin: 18px 2px 10px; }
          .ao3-chips { display: flex; flex-wrap: wrap; gap: 9px; }
          .ao3-chip { font-family: var(--font-cn); font-size: 13px; padding: 8px 15px; border-radius: 13px; border: none; background: #ece5d6; color: #8a7d6c; cursor: pointer; box-shadow: 3px 3px 7px var(--nm-d), -3px -3px 7px var(--nm-l); transition: box-shadow .12s, color .12s; }
          .ao3-chip.on { color: #b1492f; box-shadow: inset 3px 3px 6px var(--nm-d), inset -3px -3px 6px var(--nm-l); }
          .ao3-roll { width: 100%; margin-top: 20px; font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 700; font-size: 18px; padding: 15px; border-radius: 16px; border: none; background: linear-gradient(#c45c40, #a8472f); color: #fff6ef; cursor: pointer; box-shadow: 6px 6px 13px var(--nm-d), -6px -6px 13px var(--nm-l), inset 0 1px 0 rgba(255,255,255,0.28); }
          .ao3-roll:not([disabled]):active { box-shadow: inset 4px 4px 10px rgba(120,40,20,0.4), inset -2px -2px 6px rgba(255,255,255,0.12); }
          .ao3-roll[disabled] { opacity: 0.6; cursor: default; }
          .ao3-card { margin-top: 20px; background: #ece5d6; border: none; border-radius: 18px; padding: 18px; box-shadow: 6px 6px 13px var(--nm-d), -6px -6px 13px var(--nm-l); }
          .ao3-card-rows { display: flex; flex-direction: column; gap: 10px; }
          .ao3-row { display: flex; gap: 10px; align-items: baseline; }
          .ao3-row-k { flex-shrink: 0; width: 78px; font-family: var(--font-cn); font-size: 12px; color: #9d9081; }
          .ao3-row-v { flex: 1; font-family: 'Songti SC','Noto Serif SC',serif; font-size: 15px; color: #4a4236; line-height: 1.5; }
          .ao3-lock { flex-shrink: 0; border: none; background: transparent; cursor: pointer; font-size: 14px; opacity: 0.4; padding: 0 2px; align-self: center; }
          .ao3-lock.on { opacity: 1; }
          .ao3-summary { margin-top: 15px; padding: 13px 14px; border-radius: 13px; box-shadow: inset 3px 3px 6px var(--nm-d), inset -3px -3px 6px var(--nm-l); font-family: var(--font-cn); font-size: 13.5px; line-height: 1.75; color: #b1492f; }
          .ao3-acts { display: flex; gap: 9px; margin-top: 15px; }
          .ao3-acts button { flex: 1; font-family: var(--font-cn); font-size: 13px; padding: 10px 6px; border-radius: 12px; border: none; background: #ece5d6; color: #6b5d50; cursor: pointer; box-shadow: 3px 3px 7px var(--nm-d), -3px -3px 7px var(--nm-l); }
          .ao3-acts button:active { box-shadow: inset 2px 2px 5px var(--nm-d), inset -2px -2px 5px var(--nm-l); }
          .ao3-write { width: 100%; margin-top: 12px; font-family: 'Songti SC','Noto Serif SC',serif; font-weight: 700; font-size: 15px; padding: 13px; border-radius: 14px; border: none; background: #ece5d6; color: #b1492f; cursor: pointer; box-shadow: 4px 4px 9px var(--nm-d), -4px -4px 9px var(--nm-l); }
          .ao3-write:not([disabled]):active { box-shadow: inset 3px 3px 6px var(--nm-d), inset -3px -3px 6px var(--nm-l); }
          .ao3-write[disabled] { opacity: 0.7; cursor: default; }
          .ao3-scene { margin-top: 14px; padding: 15px 16px; border-radius: 14px; background: #ece5d6; box-shadow: inset 3px 3px 7px var(--nm-d), inset -3px -3px 7px var(--nm-l); font-family: 'Songti SC','Noto Serif SC',serif; font-size: 14.5px; line-height: 1.85; color: #4a4236; white-space: pre-wrap; word-break: break-word; }
          .ao3-scene-copy { margin-top: 10px; font-family: var(--font-cn); font-size: 12.5px; color: #b1492f; background: none; border: none; cursor: pointer; }
          .ao3-hist { margin-top: 24px; }
          .ao3-hist-item { font-family: var(--font-cn); font-size: 12px; color: #6b5d50; background: #ece5d6; border: none; border-radius: 11px; padding: 10px 13px; margin-bottom: 8px; line-height: 1.55; box-shadow: inset 2px 2px 5px var(--nm-d), inset -2px -2px 5px var(--nm-l); }
          .ao3-err { font-size: 12.5px; color: #c4452e; font-family: var(--font-cn); margin: 8px 2px; }
        `}</style>

        <header className="studio-reader-header">
          <button className="studio-reader-back" onClick={onClose} aria-label="返回 Workspace">
            <Icon name="back" size={19} color="var(--ink)" />
          </button>
          <div className="studio-reader-mark tint-pink"><span style={{ fontSize: 20 }}>🎲</span></div>
          <div className="studio-reader-title">
            <h2>夜骰</h2>
            <p>Too Hot To Go</p>
          </div>
        </header>

        <div className="ao3-body">
          {err && <div className="ao3-err">{err}</div>}

          <div className="ao3-label">配方 PRESET</div>
          <div className="ao3-chips">
            {presets.map(([k, p]) => (
              <button key={k} className={'ao3-chip' + (preset === k ? ' on' : '')} onClick={() => setPreset(k)}>{p.label}</button>
            ))}
          </div>

          <div className="ao3-label">维度 · 点亮的才抽</div>
          <div className="ao3-chips">
            {dimList.map(([k, d]) => (
              <button key={k} className={'ao3-chip' + (enabled && enabled.has(k) ? ' on' : '')} onClick={() => toggleDim(k)}>{d.emoji} {d.label}</button>
            ))}
          </div>

          <button className="ao3-roll" onClick={roll} disabled={rolling || !enabled || !enabled.size}>{rolling ? '🎲 摇骰子…' : '🎲 Roll'}</button>

          {result && (
            <div className="ao3-card">
              <div className="ao3-card-rows">
                {dimList.filter(([k]) => result[k]).map(([k, d]) => (
                  <div key={k} className="ao3-row">
                    <span className="ao3-row-k">{d.emoji} {d.label}</span>
                    <span className="ao3-row-v">{result[k]}</span>
                    <button className={'ao3-lock' + (locks.has(k) ? ' on' : '')} onClick={() => toggleLock(k)} title={locks.has(k) ? '已锁·再抽不变' : '锁住这格'}>{locks.has(k) ? '🔒' : '🔓'}</button>
                  </div>
                ))}
              </div>
              <div className="ao3-summary">{result.summary}</div>
              <div className="ao3-acts">
                <button onClick={roll}>↻ 再抽</button>
                <button onClick={copy}>{copied ? '✓ 已复制' : '⧉ 复制'}</button>
                <button onClick={saveMem}>{savedMsg || '☆ 存记忆'}</button>
              </div>
              <button className="ao3-write" onClick={writeScene} disabled={writing}>{writing ? '✍️ 达迪在写…' : '✍️ 让达迪照这个写'}</button>
              {scene && (
                <>
                  <div className="ao3-scene">{scene}{writing ? ' ▍' : ''}</div>
                  {!writing && <button className="ao3-scene-copy" onClick={copyScene}>{sceneCopied ? '✓ 已复制这段' : '⧉ 复制这段'}</button>}
                </>
              )}
            </div>
          )}

          {hist.length > 0 && (
            <div className="ao3-hist">
              <div className="ao3-label">最近抽过 · 只留 12</div>
              {hist.map((h, i) => <div key={i} className="ao3-hist-item">{String(h.summary || '').replace('今晚抽到的是：', '')}</div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
