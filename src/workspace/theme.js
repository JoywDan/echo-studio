import React from 'react'
export const THEME_DEFAULTS = {
  accent: '#a7372a', paper: '#efe9dc', texture: 60, radius: 16,
  titleFont: 'Caveat', cnFont: 'ZCOOL KuaiLe',
}
export function shade(hex, pct) {
  const h = hex.replace('#', '')
  let r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16)
  const f = pct / 100
  const adj = (c) => Math.round(f < 0 ? c * (1 + f) : c + (255 - c) * f)
  r = adj(r); g = adj(g); b = adj(b)
  return '#' + [r, g, b].map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0')).join('')
}
export function useTheme() {
  const [t, setT] = React.useState(() => {
    try { return { ...THEME_DEFAULTS, ...JSON.parse(localStorage.getItem('ws_theme') || '{}') } } catch { return { ...THEME_DEFAULTS } }
  })
  const set = (key, val) => setT((p) => { const n = { ...p, [key]: val }; localStorage.setItem('ws_theme', JSON.stringify(n)); return n })
  const reset = () => { localStorage.removeItem('ws_theme'); setT({ ...THEME_DEFAULTS }) }
  const cssVars = {
    '--vermillion': t.accent, '--vermillion-l': shade(t.accent, 18), '--vermillion-d': shade(t.accent, -16),
    '--washi': t.paper, '--washi-deep': shade(t.paper, -8), '--card': shade(t.paper, 14),
    '--texture': (t.texture / 100).toFixed(2),
    '--radius': t.radius + 'px', '--radius-sm': (t.radius - 5) + 'px', '--radius-lg': (t.radius + 6) + 'px',
    '--font-title': `"${t.titleFont}", "ZCOOL KuaiLe", cursive`,
    '--font-cute': `"${t.cnFont}", "Caveat", cursive`,
    '--font-cn': `"${t.cnFont === 'ZCOOL KuaiLe' ? 'LXGW WenKai Screen' : t.cnFont}", "ZCOOL KuaiLe", system-ui, sans-serif`,
  }
  return { t, set, reset, cssVars }
}
