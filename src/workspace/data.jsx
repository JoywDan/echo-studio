/* data.jsx — 静态配置 + 装饰映射（真实数据走 api） */
export const QUICK_ACTIONS = [
  { id: "qa1", label: "New chat", icon: "chat-plus", edge: "pink", sticker: "cute_crayon_style_chat_icon_with_cross", accent: "05_flower" },
  { id: "qa2", label: "New note", icon: "file", edge: "sage", sticker: "kawaii_paper_sheet_with_smile", accent: "04_heart" },
  { id: "qa3", label: "New task", icon: "clipboard", edge: "cream", sticker: "kawaii_clipboard_with_check_mark", accent: "09_lightning" },
  { id: "qa4", label: "Upload", icon: "upload", edge: "pink", sticker: "kawaii_upload_icon_with_smiling_face", accent: "08_moon" },
]
export const STUDIO = [
  { id: "s1", title: "CC 操作台", edge: "pink", icon: "monitor", creature: "BearWave", deco: ["heart","arrow"], url: "https://joywdan.github.io/echo-studio/cc/" },
  { id: "s2", title: "画廊 · 教堂", edge: "blue", icon: "pic", creature: "PainterBlob", deco: ["flower","scribble"], url: "https://gallery.echowjoy.uk" },
  { id: "s3", title: "Echo's Diary", edge: "cream", icon: "book", creature: "WriterPink", clip: true, deco: ["star","heart","flower"], english: true, module: "diary" },
  { id: "s4", title: "Letter for Echo", edge: "pink", icon: "envelope", deco: ["plane","star","circles"], english: true, module: "letters" },
  { id: "s5", title: "Echo 每日播报", edge: "blue", icon: "pic", creature: "CatCamera", clip: true, deco: ["flower"], module: "travel" },
  { id: "s6", title: "路拾遗梦", edge: "sage", icon: "moon", creature: "SleepCloud", deco: ["star"], module: "wander" },
  { id: "s7", title: "moonline 群聊", edge: "pink", creature: "BlobTrio", clip: true, deco: ["star","heart"], module: "agentroom" },
  { id: "s8", title: "River of memory", edge: "sage", icon: "river", deco: ["flowerface","star"], english: true },
]
export const MODELS = [
  { label: "Opus 4.6", id: "claude-opus-4-6" },
  { label: "Opus 4.8", id: "claude-opus-4-8" },
  { label: "Sonnet 4.6", id: "claude-sonnet-4-6" },
]
export const FEATURES = ["思考","记忆","联网","编码"]
export const CONV_CREATURES = ["PinkBlobCrown","FuzzGreen","CupcakeCyclops","RunCloudGreen","GreenAlien","Rabbit"]
export const NOTE_TINTS = ["sage","pink","cream","blue"]
export const TASK_TINTS = ["cream","pink","sage","blue"]
export const AVATAR_CYCLE = CONV_CREATURES
export const AVATAR_TINTS = ["pink","sage","cream","blue"]
