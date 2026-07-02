import React from 'react'
import { idbPut, idbGet, idbDel } from './idb.js'
export const PAPER_PRESETS = [
  { id: 'sandpaper', name: '米黄砂纸', paper: '#eadfc6' },
  { id: 'camel-washi', name: '淡驼和纸', paper: '#ded0bb' },
  { id: 'sky-grid', name: '天空蓝小格', paper: '#dfeef3' },
  { id: 'pink-xuan', name: '浅粉宣纸', paper: '#f3dde0' },
  { id: 'kraft', name: '牛皮纸', paper: '#d2b98f' },
  { id: 'linen', name: '亚麻布', paper: '#ddd2bf' },
  { id: 'cotton', name: '象牙棉纸', paper: '#f4eddf' },
  { id: 'mist-handmade', name: '雾灰手工纸', paper: '#e5e1d6' },
]
export const THEME_DEFAULTS = { accent: '#a7372a', paper: PAPER_PRESETS[0].paper, paperPreset: 'sandpaper', textColor: '#3a3027', texture: 60, radius: 16, titleFont: 'Caveat', cnFont: 'ZCOOL KuaiLe', decor: 'full' }
export const THEME_PRESETS = [
  { id: 'crayon',  name: '暖蜡笔',     t: { accent:'#a7372a', paper:'#eadfc6', paperPreset:'sandpaper',     textColor:'#3a3027', texture:60, radius:16, titleFont:'Caveat', cnFont:'ZCOOL KuaiLe',  decor:'full' } },
  { id: 'morandi', name: '莫兰迪',     t: { accent:'#a98467', paper:'#e6e1d6', paperPreset:'mist-handmade', textColor:'#574f44', texture:35, radius:14, titleFont:'Caveat', cnFont:'ZCOOL KuaiLe',  decor:'soft' } },
  { id: 'kraft',   name: '复古牛皮纸', t: { accent:'#8f4a2e', paper:'#d2b98f', paperPreset:'kraft',         textColor:'#473726', texture:70, radius:12, titleFont:'Caveat', cnFont:'Ma Shan Zheng', decor:'full' } },
  { id: 'mint',    name: '薄荷',       t: { accent:'#3f9b80', paper:'#e3efe7', paperPreset:'cotton',        textColor:'#3c5148', texture:28, radius:18, titleFont:'Caveat', cnFont:'ZCOOL KuaiLe',  decor:'soft' } },
  { id: 'seasalt', name: '海盐蓝',     t: { accent:'#3f7fa6', paper:'#dfeef3', paperPreset:'sky-grid',      textColor:'#39495a', texture:28, radius:18, titleFont:'Caveat', cnFont:'ZCOOL KuaiLe',  decor:'soft' } },
  { id: 'muji',    name: '无印·性冷淡', t: { accent:'#8a8175', paper:'#f1ede3', paperPreset:'cotton',        textColor:'#4a463e', texture:0,  radius:6,  titleFont:'Caveat', cnFont:'Noto Sans SC', decor:'none' } },
]
function isSafeMode() {
  try {
    const p = new URLSearchParams(window.location.search)
    return p.get('safe') === '1' || p.get('reset-local') === '1'
  } catch {
    return false
  }
}
export function shade(hex, pct) {
  const h = hex.replace('#', '')
  let r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  const f = pct / 100; const adj = (c) => Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f)
  r = adj(r); g = adj(g); b = adj(b)
  return '#' + [r, g, b].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join('')
}
function downscaleImage(file, maxDim, quality) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(maxDim / img.width, maxDim / img.height, 1)
      const cv = document.createElement('canvas'); cv.width = Math.round(img.width * scale); cv.height = Math.round(img.height * scale)
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height)
      cv.toBlob((b) => resolve(b || file), 'image/jpeg', quality)
    }
    img.onerror = () => resolve(file)
    img.src = URL.createObjectURL(file)
  })
}
export function useTheme() {
  const safeMode = isSafeMode()
  const [t, setT] = React.useState(() => {
    if (safeMode) return { ...THEME_DEFAULTS, decor: 'none', texture: 0, cnFont: 'Noto Sans SC' }
    try { return { ...THEME_DEFAULTS, ...JSON.parse(localStorage.getItem('ws_theme') || '{}') } } catch { return { ...THEME_DEFAULTS } }
  })
  const [wallpaper, setWallpaper] = React.useState(null)
  const [customFont, setCustomFont] = React.useState(null)
  const set = (key, val) => setT((p) => { const n = { ...p, [key]: val }; localStorage.setItem('ws_theme', JSON.stringify(n)); return n })
  const reset = () => { localStorage.removeItem('ws_theme'); setT({ ...THEME_DEFAULTS }) }
  const applyTheme = (obj) => setT(() => { const n = { ...THEME_DEFAULTS, ...obj }; localStorage.setItem('ws_theme', JSON.stringify(n)); return n })
  const exportTheme = () => {
    const blob = new Blob([JSON.stringify(t, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'echo-theme.json'; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1500)
  }
  const importTheme = async (file) => {
    const obj = JSON.parse(await file.text())
    if (!obj || typeof obj !== 'object') throw new Error('不是有效的主题文件')
    applyTheme(obj)
  }

  React.useEffect(() => {
    if (safeMode) return
    idbGet('wallpaper').then((blob) => { if (blob) setWallpaper(URL.createObjectURL(blob)) }).catch(() => {})
    idbGet('font').then(async (blob) => {
      if (!blob) return
      try { const ff = new FontFace('UserCN', await blob.arrayBuffer()); await ff.load(); document.fonts.add(ff); setCustomFont(localStorage.getItem('ws_fontname') || '自定义字体') } catch {}
    }).catch(() => {})
  }, [safeMode])

  const uploadWallpaper = async (file) => {
    let blob = file
    if ((file.type || '').startsWith('image/') && file.size > 400 * 1024) blob = await downscaleImage(file, 1920, 0.85)
    await idbPut('wallpaper', blob)
    setWallpaper((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob) })
  }
  const clearWallpaper = async () => { await idbDel('wallpaper'); setWallpaper((prev) => { if (prev) URL.revokeObjectURL(prev); return null }) }
  const uploadFont = async (file) => {
    const buf = await file.arrayBuffer()
    const ff = new FontFace('UserCN', buf); await ff.load(); document.fonts.add(ff)
    await idbPut('font', file); localStorage.setItem('ws_fontname', file.name); setCustomFont(file.name); set('cnFont', 'UserCN')
  }
  const clearFont = async () => { await idbDel('font'); localStorage.removeItem('ws_fontname'); setCustomFont(null); if (t.cnFont === 'UserCN') set('cnFont', 'ZCOOL KuaiLe') }

  const preset = PAPER_PRESETS.find((p) => p.id === t.paperPreset) || PAPER_PRESETS.find((p) => p.paper === t.paper) || PAPER_PRESETS[0]
  const cssVars = {
    '--vermillion': t.accent, '--vermillion-l': shade(t.accent, 18), '--vermillion-d': shade(t.accent, -16),
    '--brick': t.accent, '--brick-l': shade(t.accent, 18), '--brick-d': shade(t.accent, -16),
    '--washi': t.paper, '--washi-deep': shade(t.paper, -8), '--card': shade(t.paper, 14),
    '--paper': t.paper, '--paper-2': shade(t.paper, 8), '--paper-torn': shade(t.paper, 12),
    '--paper-preset': preset.id,
    '--ink': t.textColor, '--ink-soft': shade(t.textColor, 28), '--ink-faint': shade(t.textColor, 50),
    '--texture': (t.texture / 100).toFixed(2),
    '--radius': t.radius + 'px', '--radius-sm': (t.radius - 5) + 'px', '--radius-lg': (t.radius + 6) + 'px',
    '--font-title': `"${t.titleFont}", "ZCOOL KuaiLe", cursive`,
    '--font-cute': `"${t.cnFont}", "ZCOOL KuaiLe", cursive`,
    '--font-cn': `"${t.cnFont}", "ZCOOL KuaiLe", "Noto Sans SC", system-ui, sans-serif`,
    '--wallpaper': wallpaper ? `url(${wallpaper})` : 'none',
  }
  return { t, set, reset, applyTheme, exportTheme, importTheme, cssVars, wallpaper, uploadWallpaper, clearWallpaper, customFont, uploadFont, clearFont }
}
