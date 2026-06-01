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
export const THEME_DEFAULTS = { accent: '#a7372a', paper: PAPER_PRESETS[0].paper, paperPreset: 'sandpaper', textColor: '#3a3027', texture: 60, radius: 16, titleFont: 'Caveat', cnFont: 'ZCOOL KuaiLe' }
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
  const [t, setT] = React.useState(() => { try { return { ...THEME_DEFAULTS, ...JSON.parse(localStorage.getItem('ws_theme') || '{}') } } catch { return { ...THEME_DEFAULTS } } })
  const [wallpaper, setWallpaper] = React.useState(null)
  const [customFont, setCustomFont] = React.useState(null)
  const set = (key, val) => setT((p) => { const n = { ...p, [key]: val }; localStorage.setItem('ws_theme', JSON.stringify(n)); return n })
  const reset = () => { localStorage.removeItem('ws_theme'); setT({ ...THEME_DEFAULTS }) }

  React.useEffect(() => {
    idbGet('wallpaper').then((blob) => { if (blob) setWallpaper(URL.createObjectURL(blob)) }).catch(() => {})
    idbGet('font').then(async (blob) => {
      if (!blob) return
      try { const ff = new FontFace('UserCN', await blob.arrayBuffer()); await ff.load(); document.fonts.add(ff); setCustomFont(localStorage.getItem('ws_fontname') || '自定义字体') } catch {}
    }).catch(() => {})
  }, [])

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
  return { t, set, reset, cssVars, wallpaper, uploadWallpaper, clearWallpaper, customFont, uploadFont, clearFont }
}
