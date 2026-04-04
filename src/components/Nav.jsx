import React from 'react'

const tabs = [
  { id: 'voice',  label: '推特',  icon: '🐦' },
  { id: 'wechat', label: '微信',  icon: '💬' },
  { id: 'memory', label: '记忆',  icon: '🧠' },
  { id: 'vps',    label: 'VPS',   icon: '🖥️' },
  { id: 'diary',  label: '日记',  icon: '📓' },
]

export default function Nav({ tab, setTab }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-card border-t border-border flex safe-bottom"
         style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className={`flex-1 flex flex-col items-center py-3 text-xs gap-1 transition-colors
            ${tab === t.id ? 'text-accent' : 'text-muted'}`}
        >
          <span className="text-lg leading-none">{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
