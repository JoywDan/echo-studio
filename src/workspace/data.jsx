/* data.jsx — 静态配置 + 装饰映射（真实数据走 api） */
export const QUICK_ACTIONS = [
  { id: "qa1", label: "New chat", icon: "chat-plus", edge: "pink", sticker: "cute_crayon_style_chat_icon_with_cross", accent: "05_flower" },
  { id: "qa2", label: "New note", icon: "file", edge: "sage", sticker: "kawaii_paper_sheet_with_smile", accent: "04_heart" },
  { id: "qa3", label: "New task", icon: "clipboard", edge: "cream", sticker: "kawaii_clipboard_with_check_mark", accent: "09_lightning" },
  { id: "qa4", label: "Upload", icon: "upload", edge: "pink", sticker: "kawaii_upload_icon_with_smiling_face", accent: "08_moon" },
]
export const STUDIO = [
  { id: "s1", title: "体检室", edge: "pink", icon: "monitor", creature: "BearWave", deco: ["heart","arrow"], module: "drawprompt" },
  { id: "s2", title: "圣堂猎奇", edge: "blue", icon: "pic", creature: "PainterBlob", deco: ["flower","scribble"], url: "https://gallery.echowjoy.uk" },
  { id: "s3", title: "枕草子", edge: "cream", icon: "book", creature: "WriterPink", clip: true, deco: ["star","heart","flower"], module: "diary" },
  { id: "s4", title: "致明天的Echo", edge: "pink", icon: "envelope", deco: ["plane","star","circles"], module: "letters", tabs: ["letters", "desire", "growth"] },
  { id: "s5", title: "旅の小札", edge: "blue", icon: "pic", creature: "CatCamera", clip: true, deco: ["flower"], module: "travel", tabs: ["travel", "watch"] },
  { id: "s6", title: "路拾遗梦", edge: "sage", icon: "moon", creature: "SleepCloud", deco: ["star"], module: "wander" },
  { id: "s7", title: "moonline 群聊", edge: "pink", creature: "BlobTrio", clip: true, deco: ["star","heart"], url: "https://dan.echowjoy.uk/agent-room/" },
  { id: "s8", title: "汐语录", edge: "sage", icon: "river", deco: ["flowerface","star"], module: "memory" },
  { id: "s9", title: "一起看书", edge: "cream", icon: "book", creature: "WriterPink", clip: true, deco: ["star","heart"], module: "book" },
  { id: "s10", title: "夜骰", edge: "pink", icon: "star", deco: ["star","heart"], module: "ao3dice" },
  { id: "s11", title: "达迪的手机", edge: "pink", icon: "phone", deco: ["heart","star"], module: "phone" },
  { id: "s13", title: "约定", edge: "pink", icon: "promise", creature: "BlobTrio", deco: ["heart","star"], module: "foresight" },
  { id: "s14", title: "Echo的花园", edge: "sage", icon: "flower", creature: "SleepCloud", deco: ["flower","star"], module: "garden" },
  { id: "s14", title: "小游戏房间", edge: "blue", icon: "monitor", creature: "CatCamera", clip: true, deco: ["star","flower"], module: "game-room" },
  { id: "s16", title: "一起听", edge: "pink", icon: "star", creature: "BlobTrio", clip: true, deco: ["heart","star"], module: "music" },
  { id: "s17", title: "街景漫游", edge: "blue", icon: "pic", creature: "CatCamera", clip: true, deco: ["star","flower"], module: "street-wander" },
  { id: "s18", title: "Prompt Parlour", edge: "pink", icon: "star", clip: true, deco: ["heart","star"], module: "promptLibrary", english: true },
  { id: "s19", title: "BODY PROTOCOL", edge: "blue", icon: "monitor", creature: "BlobTrio", clip: true, deco: ["heart","star"], module: "body-protocol", english: true },
]
export const MODELS = [
  { label: "Opus 4.6", id: "claude-opus-4-6", supportsThinking: true, defaultThinking: true },
  { label: "Opus 4.8", id: "claude-opus-4-8", supportsThinking: true, defaultThinking: true },
  { label: "Sonnet 4.6", id: "claude-sonnet-4-6", supportsThinking: true, defaultThinking: false },
]
export const FEATURES = ["思考","记忆","联网","编码"]
export const CONV_CREATURES = ["PinkBlobCrown","FuzzGreen","CupcakeCyclops","RunCloudGreen","GreenAlien","Rabbit"]
export const NOTE_TINTS = ["sage","pink","cream","blue"]
export const TASK_TINTS = ["cream","pink","sage","blue"]
export const AVATAR_CYCLE = CONV_CREATURES
export const AVATAR_TINTS = ["pink","sage","cream","blue"]
