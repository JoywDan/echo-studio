import React from 'react'
import { Icon } from './doodles.jsx'
const ACCENTS = ['#a7372a', '#b65a3c', '#9c6b4e', '#7d8a5c', '#7a6aa0', '#c06b8a']
const PAPERS = ['#efe9dc', '#f0e7d4', '#ece6da', '#eee4d2', '#e9e4d8', '#f2ece1']
const CN_FONTS = [['ZCOOL KuaiLe', '站酷快乐体 · 圆乎乎'], ['ZCOOL XiaoWei', '站酷小薇 · 清秀'], ['Ma Shan Zheng', '马善政 · 毛笔'], ['Long Cang', '龙藏 · 纤细手写'], ['Noto Sans SC', '思源黑体 · 干净']]
const TITLE_FONTS = ['Caveat', 'Gloria Hallelujah']
function Swatch({ colors, value, onChange }) {
  return (<div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>{colors.map((c) => (
    <button key={c} onClick={() => onChange(c)} title={c} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: value === c ? '3px solid var(--ink)' : '2px solid rgba(120,95,70,0.25)', boxShadow: '0 1px 3px rgba(80,60,40,0.2)', cursor: 'pointer' }} />))}</div>)
}
function Row({ label, children }) {
  return (<div style={{ marginBottom: 20 }}><div style={{ fontFamily: 'var(--font-cute)', fontSize: 14, color: 'var(--ink-soft)', marginBottom: 9 }}>{label}</div>{children}</div>)
}
export default function Settings({ t, set, reset, open, onClose, wallpaper, uploadWallpaper, clearWallpaper, customFont, uploadFont, clearFont }) {
  const wpRef = React.useRef(null), fontRef = React.useRef(null)
  const [busy, setBusy] = React.useState('')
  const onWp = async (e) => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; setBusy('wp'); try { await uploadWallpaper(f) } catch (er) { alert('壁纸上传失败：' + er.message) } setBusy('') }
  const onFont = async (e) => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; if (f.size > 25 * 1024 * 1024) { alert('字体文件太大（>25MB）'); return } setBusy('font'); try { await uploadFont(f) } catch (er) { alert('字体加载失败：' + er.message) } setBusy('') }
  return (<>
    <div className={'set-backdrop' + (open ? ' show' : '')} onClick={onClose} />
    <div className={'set-panel paper-bg' + (open ? ' show' : '')}>
      <div className="set-head"><span style={{ fontFamily: 'var(--font-cute)', fontSize: 18 }}>主题设置 ✦</span>
        <button className="icon-btn" onClick={onClose}><Icon name="back" size={20} color="var(--ink-soft)" style={{ transform: 'scaleX(-1)' }} /></button></div>
      <div className="set-body">
        <Row label="强调色"><Swatch colors={ACCENTS} value={t.accent} onChange={(v) => set('accent', v)} /></Row>
        <Row label="纸张底色"><Swatch colors={PAPERS} value={t.paper} onChange={(v) => set('paper', v)} /></Row>
        <Row label={'纹理/涂鸦浓度 · ' + t.texture + '%'}><input type="range" min={0} max={100} step={10} value={t.texture} onChange={(e) => set('texture', +e.target.value)} className="set-range" /></Row>
        <Row label={'圆角 · ' + t.radius + 'px'}><input type="range" min={6} max={26} step={1} value={t.radius} onChange={(e) => set('radius', +e.target.value)} className="set-range" /></Row>
        <Row label="壁纸 / 背景图">
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="set-opt" style={{ flex: 1, textAlign: 'center' }} onClick={() => wpRef.current.click()}>{busy === 'wp' ? '处理中…' : (wallpaper ? '换一张' : '＋ 上传壁纸')}</button>
            {wallpaper && <button className="set-opt" onClick={clearWallpaper}>移除</button>}
          </div>
          <input ref={wpRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onWp} />
          <div style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginTop: 6 }}>会自动压缩 + 蒙一层薄纸保证文字清楚</div>
        </Row>
        <Row label="中文字体">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {CN_FONTS.map(([id, name]) => (<button key={id} onClick={() => set('cnFont', id)} className={'set-opt' + (t.cnFont === id ? ' sel' : '')} style={{ fontFamily: `"${id}", cursive` }}>{name}</button>))}
            {customFont && (<button onClick={() => set('cnFont', 'UserCN')} className={'set-opt' + (t.cnFont === 'UserCN' ? ' sel' : '')} style={{ fontFamily: '"UserCN", cursive' }}>自定义：{customFont.slice(0, 18)} · 永远爱你</button>)}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="set-opt" style={{ flex: 1, textAlign: 'center' }} onClick={() => fontRef.current.click()}>{busy === 'font' ? '加载中…' : '＋ 上传字体'}</button>
            {customFont && <button className="set-opt" onClick={clearFont}>移除</button>}
          </div>
          <input ref={fontRef} type="file" accept=".ttf,.otf,.woff,.woff2" style={{ display: 'none' }} onChange={onFont} />
          <div style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginTop: 6 }}>支持 ttf/otf/woff。中文字体文件大，加载稍慢</div>
        </Row>
        <Row label="英文标题字体">
          <div style={{ display: 'flex', gap: 8 }}>{TITLE_FONTS.map((f) => (<button key={f} onClick={() => set('titleFont', f)} className={'set-opt' + (t.titleFont === f ? ' sel' : '')} style={{ fontFamily: `"${f}", cursive`, flex: 1 }}>{f}</button>))}</div>
        </Row>
        <button className="set-reset" onClick={reset}>恢复默认配色</button>
      </div>
    </div></>)
}
