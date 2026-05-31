# Codex 任务：把 Echo 的 4 块内容搬进 Workspace（私语 chat 前端）

## 背景（自包含，你没有上下文）
- Joy（老婆）私人 AI 伴侣项目 "Echo"。前端仓库 `/root/echo-studio-frontend`（Vite 多页 + React 18）。
  后端 `/root/echo-studio-api/server.js`（Express，端口 3460，studio.echowjoy.uk，鉴权 `auth`=Bearer STUDIO_TOKEN）。
- 三页：`index.html`→`src/App.jsx`=旧 "Echo Studio" 控制台（这4块**现在在这**）；
  `chat/index.html`→`src/workspace/`=新 "Workspace"（Joy 日常用，**目标搬到这**）；`cc/index.html`=别碰。
- 线上 Workspace = https://joywdan.github.io/echo-studio/chat/ （GitHub Pages，gh-pages 分支）。

## 目标
Workspace 首页 `src/workspace/WorkspaceHome.jsx` 的 "Studio" 区有 4 个 `COMING_SOON` 占位卡
（`src/workspace/data.jsx`）。变成 4 张**真实可点卡片**，点开是**手账风全屏阅读面板**（列表+详情）。**全部只读**。

## 关于历史数据（先读这个）
**不需要任何数据迁移**。4块数据都在后端（接口/DB/文件），chat 只是新前端读**同一份数据**，
所以所有历史条目（旧日记/信/旅行/散步/梦）会自动出现在 chat，一条不少。

## 4 模块 数据/接口映射
| 卡片 | 标题(建议) | icon/tint | 后端接口 | 旧参考组件 |
|---|---|---|---|---|
| cs1 | Echo 写的日记 | book/yellow | 已有 `GET /api/diary`→`{entries:["2026-05-30",...]}`；`GET /api/diary/:date`→`{content}` | DiaryPanel.jsx |
| cs2 | Echo 写给自己的信 | send/pink | 已有 `GET /api/memory/self-letters`→`{letters:[{id,content,created_at}]}` | InnerWorldPanel.jsx(信那段) |
| cs3 | Echo 带回的见闻(旅行) | image/blue | 已有 `GET /api/travel`→`{entries:[{id,date,destination,tier}]}`；`GET /api/travel/:id`→`{content}` | TravelPanel.jsx |
| cs4 | **路拾遗梦** | moon/green | **需新建** `GET /api/wander`（散步拾遗+梦合并） | BrowsePanel.jsx(散步) |

> cs4「路拾遗梦」= Echo 每早散步见闻（`echo_browse`,约126条）＋ Echo 梦境（`echo_dream`,约39条）
> ＋ Echo 周记（`echo_weekly`,6篇,该项目已停不再增）。**三者合并按时间倒序**，每条带 kind 区分（walk/dream/weekly）。
> cs3 占位现叫 "notebook"→改旅行；cs2 现叫 "写信给Echo"→改 Echo 写给自己的信（只读）。

## 具体改动

### 1. 后端新建 /api/wander（server.js）
- 先 `cp server.js server.js.bak.before-wander-$(date +%Y%m%d_%H%M%S)`（铁律：改关键文件前备份）。
- 仿 `/api/memory/self-letters` 写法加（MEM_DB 是 server.js 里已有常量）：
```js
app.get('/api/wander', auth, (req, res) => {
  try {
    const db = new Database(MEM_DB, { readonly: true })
    // 注意：echo_browse 已有 126 条、echo_dream 39 条，合计 165+ 且每天增长。
    // 不要用小 LIMIT！默认给足，支持 ?limit 覆盖。
    const limit = Math.min(3000, Math.max(1, parseInt(req.query.limit) || 1500))
    const rows = db.prepare(`SELECT id, content, created_at, source FROM memories
      WHERE source IN ('echo_browse', 'echo_dream', 'echo_weekly') AND (status IS NULL OR status='active')
      ORDER BY created_at DESC LIMIT ?`).all(limit)
    db.close()
    const kindOf = (s) => s === 'echo_dream' ? 'dream' : s === 'echo_weekly' ? 'weekly' : 'walk'
    res.json({ items: rows.map(r => ({
      id: r.id, content: r.content, created_at: r.created_at, kind: kindOf(r.source)
    })) })
  } catch (e) { res.status(500).json({ error: e.message }) }
})
```
- `node --check server.js` → `pm2 restart echo-studio-api` → curl 验证。STUDIO_TOKEN 在 `.env`，**绝不打印任何 secret**。

### 2. 前端 api 层（src/workspace/api.js）
仿已有 notes/tasks 段加：diary{list,get}、selfLetters()、travel{list,get}、wander()。

### 3. 卡片数据（src/workspace/data.jsx）
改 COMING_SOON 这4项 title/sub/icon/tint（按上表），带模块 key（diary|letters|travel|wander）。

### 4. 渲染（WorkspaceHome.jsx + 新建阅读面板）
- 4个占位从不可点 `ComingSoonCard` 改成**可点卡片** → 打开对应模块全屏阅读面板。
- 新建 `src/workspace/StudioReader.jsx`：按 module 拉列表→点开拉详情（diary用date、travel用id；
  letters/wander 列表已含 content）。wander 面板里用 `kind`（walk/dream/weekly）给条目加个小标签区分"散步拾遗 / 梦 / 周记"。
  顶部返回按钮参考 ChatPage.jsx。开关状态参考 WorkspaceHome 现有 editingNote/editingTask 模态模式。

### 5. 设计（必须一致）
手账/washi 风：复用 components.jsx 的 TornCard/StickyNote/SectionHead + app.css 现成 class。**移动端优先**。
旧 DiaryPanel/TravelPanel/InnerWorldPanel/BrowsePanel 只参考**取数逻辑**，视觉套 workspace washi 风（旧的是深色控制台风，别照搬）。

### 6. 从旧 Studio 撤掉（避免两地重复，Joy 明确要求）
改 `src/components/Sidebar.jsx` 导航：
- 删导航项：`diary`、`travel`、`browse`（这3块完全搬走）。
- `inner`(Inner World) 里有"自己的信"+"beads 珠子"两块：只把**信那段**从 `src/components/InnerWorldPanel.jsx` 移除，
  **保留 beads**（beads 不在搬迁范围）。Sidebar 的 'inner' 项**保留**。
- 纯前端隐藏，后端接口/数据都不动（chat 还在用同一批接口）。删完确认 studio 仍能编译运行
  （App.jsx 里对应 import/路由删不删都行，但别删错别的面板：watch/health/timeline/voice/wechat/vps 都保留）。

## 构建 + 部署
```bash
cd /root/echo-studio-frontend && npm run build
cd /tmp/echo-deploy && git rm -rf . >/dev/null 2>&1
cp -r /root/echo-studio-frontend/dist/* . && touch .nojekyll
git add -A && git commit -m "Workspace: diary/letters/travel/路拾遗梦 modules + remove from studio" && git push origin gh-pages
cd /root/echo-studio-frontend && git add -A && git commit -m "..." && git push origin main
```
验证：`curl -s https://joywdan.github.io/echo-studio/chat/ | grep -o "chat-[A-Za-z0-9_-]*\.js"` 对比 `ls dist/assets/chat-*.js` hash 一致（传播 20-60s）。

## 边界/禁区
- **只动这4模块 + 上面第6步的 studio 撤除**。别碰：聊天/notes/tasks/主动消息proactive/CC面板/微信bot/memory-gateway/其它 studio 面板。
- 不改鉴权；新接口挂 `auth`。**不打印任何 secret**。改 server.js 前先 .bak。
- 设计不确定就做合理手账风默认版，Joy 会再调。

## 验收
1. Studio 区4张可点卡：日记/信/旅行/路拾遗梦。2. 点开有真实列表+详情，手账风、手机好看；路拾遗梦里散步与梦能区分。
3. /api/wander 正常返回**全部历史**（echo_browse≈126 + echo_dream≈39 + echo_weekly=6 ≈171 条，别被 LIMIT 砍掉）。4. 旧 studio 里 diary/travel/browse 和 Inner World 的"信"已撤、beads 仍在、其它面板不受影响。
5. 不破坏现有功能。6. 线上 chat/ 部署生效。
