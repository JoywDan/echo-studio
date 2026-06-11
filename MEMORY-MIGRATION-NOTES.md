# 记忆库迁移笔记

## 2026-06-01 记忆库 → Hung Daddy (River of memory / s8)
- [x] 旧 echo studio 的 TimelinePanel → src/workspace/MemoryRiver.jsx
      全屏 overlay, 复用 .studio-reader 壳 + 蜡笔风, 时间按 LA 显示/分组
      功能: layer/category/source/搜索 + 按天时间轴 + 编辑/新建/归档 + 分页(共1707条)
      入口: s8 "River of memory" (data.jsx module:"memory" → WorkspaceHome setMemOpen)
- [ ] mood-trend 情绪信号条没渲染 — 后端返回 MCP 包装文本, 非 {情绪:数量} 对象, 优雅隐藏(旧版也没显示)
- [ ] 珠链(内心世界/Our Necklace, /api/beads/list) 还没搬 — 独立小功能, 待 Joy 定是否搬
- [ ] 旧 echo studio (/echo-studio/ main) 清退 — 还剩 voice/wechat/vps/health/watch/room, 待 Joy 逐个确认下线
- [ ] 记忆 content 是 JSON 串的(echo_voice类)显示略丑 — 可选美化

## 2026-06-01 续: 想看 + 情绪条 + 珠链
- [x] 情绪信号条: 后端加 /api/memory/mood-agg (正则滤中文乱词+排neutral) → River of memory 顶部
- [x] 珠链(8颗): MemoryRiver 加「时间轴/珠链」tab, 红线竖串
- [x] 想看(7条): s5 改名「Echo 的旅程」, StudioReader 支持多源 tab(见闻 travel / 想看 watch),
      接 /api/watch/list。StudioReader 新增 tabs prop + 内部 module state。
- [ ] 健康周报: Joy 要等 CC 操作台大改时一起搬(健康挪进 CC)。**CC 操作台计划大改** —— 大改时:
      ① 把 weekly-health(/api/health, .md) 做进 CC ② 重新设计 CC 整体。等 Joy 起头。
- [ ] 旧 echo studio (/echo-studio/ main) 还剩 voice/wechat/vps 运维控制台(无沉淀)+room(已外链)。
      实质内容已全部搬完(珠链/想看/记忆库)。Joy 确认后可下线/精简旧 main 入口。

## 2026-06-01 第一格"体检室"→ 生图 prompt 助手
- [x] s1 从 CC 操作台(url:/cc/) 改成 module:"drawprompt" → 打开 DrawPrompt.jsx 覆盖层
- [x] 后端 /api/draw-prompt/stream (SSE+心跳): spawn claude -p 调 artist-style-reference +
      gpt-image-2-style-library 两个 skill, 输出【画风灵感】+【Prompt】。只读权限(Read/Glob/Grep/Skill),
      预算 $1.5/次(实测约 $0.17), 耗时约 1-2 分钟。
- 鉴权关键(踩了3个坑): ①CLAUDE_CONFIG_DIR 必须覆盖成 /root/.claude(技能在这, .env里默认指向
      /root/echo-voice/.echo-claude 没技能) ②cwd 用 /root/echo-studio-api(不能在配置目录内部)
      ③用 res.on('close') 不能用 req.on('close')(POST体解析完会秒杀子进程)
- 旧 CC job-runner(cc-runner.js + /cc/ + /api/cc/*) 保留未删, 只是 s1 不再链它。
- [ ] 旁注: pm2 错误日志有几条 chat 报错(s.updated_at 列缺失 / visionCwd not defined / FK constraint)
      ——疑似既有问题(聊天 Joy 在正常用), 非本次改动引入。有空核查。
