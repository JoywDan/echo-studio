# Codex 任务：把 Design 的新美化稿移植进 Workspace（纯视觉 restyle）

## 性质（先看清楚）
这是**纯视觉美化**，不是重做功能。现有 "Echo Workspace"（私语）已经能用——聊天/笔记/任务/Studio模块/设置/壁纸/上传全都是真的、接着真后端。
你的活：把 **Design 出的新美术稿**贴到现有组件上，**只改长相，绝不动数据逻辑/接口/状态/事件**。

## 你需要的输入（Joy 会给你）
1. **Design 的 handoff**（新的 jsx/css 原型 + 插画素材，比如黑豹头像、各种小生物头像、涂鸦元素）
2. **4 张效果图**（GPT 出的参考：P3→P1→P2 是首页从上到下，P4 是聊天页）
拿到后照着它们做。

## 仓库 / 结构
- 仓库 `/root/echo-studio-frontend`（Vite 多页 + React 18），Workspace app 在 `src/workspace/`
- 关键文件（**这些是要 restyle 的对象，不是重写**）：
  - `WorkspaceHome.jsx`（首页：搜索/置顶笔记/对话/任务/快捷/Studio）
  - `ChatPage.jsx`（聊天页：气泡/思考链/模型胶囊/输入栏/流式）
  - `components.jsx`（TornCard / StickyNote / ConversationRow / TaskCard / QuickAction / ComingSoonCard / AppCard / WashiToggle / ModelSelect）
  - `NoteEditor.jsx` `TaskEditor.jsx`（可能还有 `StudioReader.jsx` 如果模块任务已做）
  - `doodles.jsx`（图标/手绘元素）、`app.css`（手账设计系统）、`theme.js`（主题+壁纸+字体）、`data.jsx`、`api.js`
- 线上：https://joywdan.github.io/echo-studio/chat/ （gh-pages 分支）

## 怎么移植（核心方法）
- **逐个组件**把 Design 的新视觉套上去：改 JSX 的标记结构 + CSS + 换插画素材，让它长得像效果图
- **保持不变**：每个组件的 props、state、useEffect、事件 handler、对 `api.*` 的调用、流式逻辑——**一行都别动**
- 例：ConversationRow 现在接 `conv/onClick/onDelete`——你把它做成"撕纸卡+可爱小生物头像+手绘分隔"，但 props 和点击/删除行为照旧
- Design 给的小生物头像/黑豹素材，放进 doodles 或 assets，按现有的"头像循环"机制用上
- **不要重写 api.js / 数据获取 / 鉴权 / 任何后端**。这是纯前端视觉。

## 必须照做的设计要求
1. 统一**抽象涂鸦/手绘手账/拼贴风**，大胆童趣（蜡笔彩铅质感、撕纸、和纸胶带、回形针、歪边框、满处小涂鸦）——照 4 张效果图
2. **Echo 头像 = 抽象黑豹**（Design 提供的素材），Echo 出现的所有地方都用它，统一
3. **不要画任何页面背景/壁纸**——用户自己上传。所有组件必须**自带纸张底色/质感**，在任意上传背景上都清晰可读。**现有的壁纸上传功能（theme.js uploadWallpaper + app.css 壁纸层）必须保持能用**，别破坏

## 绝对不能破坏的功能（验收会逐项查）
- 聊天**流式**（api.stream SSE）、思考链折叠显示、模型选择下拉（Opus 4.8/4.6/Sonnet）+ think/memory/web/code 开关
- 笔记 **CRUD**（NoteEditor + api.notes）、任务 **CRUD**（TaskEditor + api.tasks，含勾选/编辑/删除）
- Studio 卡片 + 阅读面板（日记/信/见闻/路拾遗梦，如已存在）、CC控制台/画廊门户卡
- pending-action 卡片、图片/文件上传、登录态保持（token）、设置面板（accent/壁纸/字体上传）
- 可折叠工具栏、会话列表、主动消息落进会话——这些行为全保留

## 禁区
- 只动 `src/workspace/` 的**视觉层**（jsx 标记 + css + 素材）。别碰后端 server.js、别改 api.js 的逻辑、别动鉴权/数据流
- 改文件前对关键文件留 `.bak`。**不打印任何 secret**

## 构建 + 部署
```bash
cd /root/echo-studio-frontend && npm run build
cd /tmp/echo-deploy && git rm -rf . >/dev/null 2>&1
cp -r /root/echo-studio-frontend/dist/* . && touch .nojekyll
git add -A && git commit -m "Workspace: doodle 手账 visual beautify (Design handoff)" && git push origin gh-pages
cd /root/echo-studio-frontend && git add -A && git commit -m "..." && git push origin main
```
验证：`curl -s https://joywdan.github.io/echo-studio/chat/ | grep -o "chat-[A-Za-z0-9_-]*\.js"` 对比 `ls dist/assets/chat-*.js` 一致（传播 20-60s）

## 验收
1. 首页 + 聊天页长得像 4 张效果图（大胆涂鸦手账风）
2. Echo 头像是黑豹、全局统一
3. 没有写死背景；壁纸上传仍能用、组件在背景图上清晰
4. **上面"不能破坏的功能"逐项实测都正常**（这条最重要——美化不能把功能改坏）
5. 线上 chat/ 部署生效
