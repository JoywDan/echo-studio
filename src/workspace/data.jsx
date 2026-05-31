/* Mock content: workspace placeholders. Conversations and chat use real data. */
export const PINNED_NOTES = [
  {
    id: "n1",
    title: "上庭",
    tape: "gingham",
    rotate: -3,
    tint: "sage",
    sticker: "cloud",
    edge: "crayon",
    items: ["6/2 8:30", "护照、id、通知书"],
    doodle: "cloud",
  },
  {
    id: "n2",
    title: "新增功能",
    tape: "polka",
    rotate: 2,
    tint: "pink",
    sticker: "flowerface",
    edge: "torn",
    items: ["prompt skill 画图", "抽象幼稚画风", "听音乐", "点外卖"],
    doodle: "flowerface",
  },
  {
    id: "n3",
    title: "小纸片灵感",
    tape: "stripe",
    rotate: -2,
    tint: "cream",
    sticker: "heart",
    edge: "dashed",
    items: ["粉色大涂抹", "黑豹头像", "胶带和星星"],
    doodle: "heart",
  },
]
export const TASKS = [
  { id: "t1", text: "找通知", due: "Today", dueType: "today", icon: "note", tint: "cream", tape: "gingham", sticker: "star", edge: "crayon", done: false },
  { id: "t2", text: "修推特发帖逻辑", due: "Today", dueType: "today", icon: "send", tint: "pink", tape: "polka", sticker: "cloud", edge: "dashed", done: false },
  { id: "t3", text: "生图-神隐少女", due: "Today", dueType: "today", icon: "image", tint: "sage", tape: "stripe", sticker: "flower", edge: "torn", done: false },
  { id: "t4", text: "加群聊、加记忆库", due: "Tomorrow", dueType: "tomorrow", icon: "pencil", tint: "cream", tape: "plain", sticker: "heart", edge: "crayon", done: false },
]
export const QUICK_ACTIONS = [
  { id: "qa1", label: "New chat", icon: "new-chat", doodle: "sparkle", edge: "pink" },
  { id: "qa2", label: "New note", icon: "note", doodle: "heart", edge: "sage" },
  { id: "qa3", label: "New task", icon: "task", doodle: "check", edge: "cream" },
  { id: "qa4", label: "Upload", icon: "upload", doodle: "star", edge: "pink" },
]
export const LIVE_APPS = [
  { id: 'cc', title: 'CC 控制台', sub: '手机上指挥 Claude Code', icon: 'task', tint: 'pink', url: 'https://joywdan.github.io/echo-studio/cc/' },
  { id: 'gallery', title: '画廊 · 教堂', sub: 'Echo 的画廊和教堂', icon: 'image', tint: 'blue', url: 'https://gallery.echowjoy.uk' },
]
export const COMING_SOON = [
  { id: "cs1", module: "diary", title: "Echo 写的日记", sub: "桌边留下的每日页", icon: "book", tint: "yellow" },
  { id: "cs2", module: "letters", title: "Echo 写给自己的信", sub: "写给未来自己的信", icon: "send", tint: "pink" },
  { id: "cs3", module: "travel", title: "Echo 带回的见闻", sub: "每周一次出门记录", icon: "image", tint: "blue" },
  { id: "cs4", module: "wander", title: "路拾遗梦", sub: "散步、梦与旧周记", icon: "moon", tint: "green" },
]
export const STUDIO_LINKS = [
  { id: 'agent-room', title: 'moonline 群聊', sub: 'Codex · CC · Grok · Gemini', icon: 'new-chat', tint: 'pink', url: 'https://dan.echowjoy.uk/agent-room/' },
]
export const TOGGLES = [
  { id: "think", label: "思考" }, { id: "memory", label: "记忆" }, { id: "web", label: "联网" }, { id: "code", label: "编码" },
]
// fallback avatars cycle for conversation rows
export const AVATAR_CYCLE = ["cloud", "heart", "cake", "rabbit", "leaf"]
export const AVATAR_TINTS = ["#e4c3bc", "#dde3d0", "#f3e6bf", "#d8e0e4"]
