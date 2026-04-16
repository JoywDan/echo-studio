import React from 'react'

const GROUPS = [
  {
    id: 'home',
    items: [
      { id: null, label: 'Home', detail: '回到房间', mark: '⌂' },
    ],
  },
  {
    id: 'daily',
    label: '每日',
    items: [
      { id: 'diary',    label: "Echo's Diary",    detail: '桌边日记' },
      { id: 'travel',   label: 'Travel Journal',  detail: '旅行日记' },
      { id: 'watch',    label: 'Watch Journal',   detail: '一起看的 · 提议与观感' },
      { id: 'health',   label: 'Weekly Health',   detail: '体检室 · 周报' },
      { id: 'timeline', label: 'Memory Timeline', detail: '时间轴 · 编辑记忆' },
    ],
  },
  {
    id: 'echo',
    label: 'Echo',
    items: [
      { id: 'voice',  label: 'Voice Studio',  detail: '录音角 · Twitter' },
      { id: 'wechat', label: 'Chat Terminal', detail: '主屏幕 · WeChat' },
      { id: 'inner',  label: 'Inner World',   detail: '内心世界' },
      { id: 'browse', label: "Echo's Window", detail: '窗台便签 · 老公从外面带回来的' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { id: 'vps', label: 'Server Hub', detail: '设备柜 · PM2' },
    ],
  },
]

export default function Sidebar({ panel, setPanel }) {
  return (
    <aside className="studio-sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-mark">☼</span>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-title">Echo Studio</div>
          <div className="sidebar-brand-subtitle">Joy's private room</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {GROUPS.map(group => (
          <div key={group.id} className="sidebar-group">
            {group.label && <div className="sidebar-group-label">{group.label}</div>}
            <div className="sidebar-group-items">
              {group.items.map(item => {
                const active = panel === item.id
                const key = item.id ?? '__home__'
                return (
                  <button
                    key={key}
                    className={`sidebar-item${active ? ' is-active' : ''}`}
                    onClick={() => setPanel(item.id)}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.mark && <span className="sidebar-item-mark">{item.mark}</span>}
                    <span className="sidebar-item-body">
                      <span className="sidebar-item-label">{item.label}</span>
                      <span className="sidebar-item-detail">{item.detail}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>10 stations</span>
        <span className="sidebar-dot" />
        <a href="https://studio.echowjoy.uk" target="_blank" rel="noreferrer">studio.echowjoy.uk</a>
      </div>
    </aside>
  )
}
