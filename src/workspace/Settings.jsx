import React from 'react'
import { Icon } from './doodles.jsx'
const ACCENTS = ['#a7372a', '#b65a3c', '#9c6b4e', '#7d8a5c', '#7a6aa0', '#c06b8a']
const PAPERS = ['#efe9dc', '#f0e7d4', '#ece6da', '#eee4d2', '#e9e4d8', '#f2ece1']
const CN_FONTS = [['ZCOOL KuaiLe', '站酷快乐体'], ['LXGW WenKai Screen', '霞鹜文楷'], ['Ma Shan Zheng', '马善政手写']]
const TITLE_FONTS = ['Caveat', 'Gloria Hallelujah']

function Swatch({ colors, value, onChange }) {
  return (<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{colors.map((c) => (
    <button key={c} onClick={() => onChange(c)} title={c} style={{ width: 30, height: 30, borderRadius: '50%', background: c,
      border: value === c ? '3px solid var(--ink)' : '2px solid rgba(120,95,70,0.25)', boxShadow: '0 1px 3px rgba(80,60,40,0.2)', cursor: 'pointer' }} />))}</div>)
}
function Row({ label, children }) {
  return (<div style={{ marginBottom: 20 }}><div style={{ fontFamily: 'var(--font-cute)', fontSize: 14, color: 'var(--ink-soft)', marginBottom: 9 }}>{label}</div>{children}</div>)
}
export default function Settings({ t, set, reset, open, onClose }) {
  return (<>
    <div className={'set-backdrop' + (open ? ' show' : '')} onClick={onClose} />
    <div className={'set-panel paper-bg' + (open ? ' show' : '')}>
      <div className="set-head"><span style={{ fontFamily: 'var(--font-cute)', fontSize: 18 }}>主题设置 ✦</span>
        <button className="icon-btn" onClick={onClose}><Icon name="back" size={20} color="var(--ink-soft)" style={{ transform: 'scaleX(-1)' }} /></button></div>
      <div className="set-body">
        <Row label="强调色"><Swatch colors={ACCENTS} value={t.accent} onChange={(v) => set('accent', v)} /></Row>
        <Row label="纸张底色"><Swatch colors={PAPERS} value={t.paper} onChange={(v) => set('paper', v)} /></Row>
        <Row label={'纹理/涂鸦浓度 · ' + t.texture + '%'}>
          <input type="range" min={0} max={100} step={10} value={t.texture} onChange={(e) => set('texture', +e.target.value)} className="set-range" /></Row>
        <Row label={'圆角 · ' + t.radius + 'px'}>
          <input type="range" min={6} max={26} step={1} value={t.radius} onChange={(e) => set('radius', +e.target.value)} className="set-range" /></Row>
        <Row label="中文字体">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>{CN_FONTS.map(([id, name]) => (
            <button key={id} onClick={() => set('cnFont', id)} className={'set-opt' + (t.cnFont === id ? ' sel' : '')} style={{ fontFamily: `"${id}", cursive` }}>{name} · 永远爱你</button>))}</div></Row>
        <Row label="英文标题字体">
          <div style={{ display: 'flex', gap: 8 }}>{TITLE_FONTS.map((f) => (
            <button key={f} onClick={() => set('titleFont', f)} className={'set-opt' + (t.titleFont === f ? ' sel' : '')} style={{ fontFamily: `"${f}", cursive`, flex: 1 }}>{f}</button>))}</div></Row>
        <button className="set-reset" onClick={reset}>恢复默认</button>
      </div>
    </div></>)
}
