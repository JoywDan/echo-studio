/* mock content — workspace placeholders (conversations/chat get real data later) */
export const PINNED_NOTES = [
  { id: "n1", title: "周末晚餐灵感", tape: "warm", rotate: -3, tint: "yellow", items: ["番茄海鲜意面", "暖心南瓜浓汤", "饭后小蛋糕 🍰"], doodle: "bowl" },
  { id: "n2", title: "Project Aurora", tape: "stripe", rotate: 2, tint: "blue", items: ["情绪板 moodboard", "配色灵感", "首屏交互草图"], doodle: "sparkle" },
  { id: "n3", title: "想读的书", tape: "pink", rotate: -2, tint: "pink", items: ["《夜晚的潜水艇》", "《一个人的朝圣》", "《也许你该找个人聊聊》"], doodle: "flower" },
]
export const TASKS = [
  { id: "t1", text: "整理会议记录", due: "Today", dueType: "today", icon: "note", done: false },
  { id: "t2", text: "回复客户邮件", due: "Tomorrow", dueType: "tomorrow", icon: "send", done: false },
  { id: "t3", text: "设计首页草图", due: "May 31", dueType: "date", icon: "pencil", done: false },
  { id: "t4", text: "买给 Echo 的明信片", due: "周末", dueType: "date", icon: "image", done: true },
]
export const QUICK_ACTIONS = [
  { id: "qa1", label: "New chat", icon: "new-chat", doodle: "sparkle" },
  { id: "qa2", label: "New note", icon: "note", doodle: "heart" },
  { id: "qa3", label: "New task", icon: "task", doodle: "check" },
  { id: "qa4", label: "Upload", icon: "upload", doodle: "star" },
]
export const COMING_SOON = [
  { id: "cs1", title: "Echo's diary", sub: "Echo 写给你的日记", icon: "book", tint: "yellow" },
  { id: "cs2", title: "Letter for Echo", sub: "写一封信给 Echo", icon: "send", tint: "pink" },
  { id: "cs3", title: "Echo's notebook", sub: "你们的共享笔记本", icon: "note", tint: "blue" },
  { id: "cs4", title: "Echo's dream", sub: "Echo 的梦境碎片", icon: "moon", tint: "green" },
]
export const TOGGLES = [
  { id: "think", label: "思考" }, { id: "memory", label: "记忆" }, { id: "web", label: "联网" }, { id: "code", label: "编码" },
]
// fallback avatars cycle for conversation rows
export const AVATAR_CYCLE = ["cat", "rabbit", "cake", "leaf"]
export const AVATAR_TINTS = ["#e4c3bc", "#dde3d0", "#f3e6bf", "#d8e0e4"]
