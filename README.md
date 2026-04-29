# LifeScript · 人生剧本

一个会在 QQ 里“活着”的 AI 好友。

> 你说的每一句话，都可能改变 TA 的人生。

## 项目简介

**LifeScript（人生剧本）** 是一个面向 **QQ · AI 社交** 赛道的产品原型：
AI 不再只是被动回答问题的工具，而是一个真正拥有自己生活轨迹的“好友”。

在这个产品里：
- AI 会 **主动找你聊天**，而不是永远等待你先开口
- AI 有 **自己的日常状态、空间动态和人生阶段**
- 你的回应会影响 TA 的选择、情绪和结局
- 聊天不再是“一问一答”，而是一段会推进的人生关系

## 核心体验

### 1. QQ 风格消息列表
- 仿 QQ 消息页视觉
- 展示 AI 好友头像、最近消息、未读数、在线状态
- 支持从消息列表进入聊天与资料页

### 2. 沉浸式聊天界面
- 像真实 QQ 聊天一样的气泡、输入栏、顶部导航
- 角色分多条短消息回复
- 支持“正在输入中”与建议回复
- 对话会推动剧情进入下一个人生阶段

### 3. 动态 / 空间内容
- 角色会发和当前人生状态有关的动态
- 用户可以点赞、评论
- 动态内容与剧情阶段联动

### 4. 角色资料页
- 头像、签名、基础背景信息
- 可查看角色当前状态
- 通关后可解锁人生时间线

### 5. 结局与时间线
- 聊天推进到结局后，展示角色最终命运
- 回看完整人生轨迹与关键转折

## 产品差异化

| 普通 AI 聊天 | LifeScript |
|---|---|
| AI 等你开口 | AI 会主动联系你 |
| AI 没有自己的生活 | AI 每天都在“过日子” |
| 对话结束就结束了 | 你的话会持续影响 TA 的人生 |
| AI 是工具 | AI 是你会牵挂的朋友 |

## 技术栈

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **OpenAI SDK**（接口已预留，可切换真实 LLM）

## 项目结构

```text
src/
├── app/
│   ├── page.tsx                 # 主应用状态机
│   ├── globals.css              # 全局样式
│   └── api/chat/route.ts        # 聊天 API（支持 mock / LLM）
├── components/
│   ├── Landing.tsx              # 开屏页
│   ├── StorySelect.tsx          # 角色选择
│   ├── MessageListPage.tsx      # 消息列表页
│   ├── ChatView.tsx             # 聊天界面
│   ├── MomentsFeed.tsx          # 动态流
│   ├── ProfilePage.tsx          # 角色资料页
│   ├── TimelineView.tsx         # 人生时间线
│   ├── EndingView.tsx           # 结局页
│   └── BottomTabBar.tsx         # 底部导航
├── lib/
│   ├── characters.ts            # 角色数据
│   ├── story-stages.ts          # 剧情阶段
│   ├── prompts.ts               # Prompt 模板
│   ├── chat-engine.ts           # 对话引擎
│   ├── mock-responses.ts        # Mock 回复
│   ├── moments-data.ts          # 动态数据
│   ├── daily-life.ts            # 日常状态/生活片段
│   ├── memory.ts                # 本地进度与聊天记录缓存
│   └── timeline-data.ts         # 结局时间线
└── types/
    └── index.ts                 # 类型定义
```

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

打开浏览器访问：

```text
http://localhost:3000
```

## LLM 接入说明

当前项目支持两种模式：

### Mock 模式
如果没有配置模型密钥，项目会走预设回复逻辑，方便快速演示产品流程。

### 真实模型模式
你可以在本地创建 `.env.local`，配置相应环境变量后接入真实 LLM。

示例：

```bash
OPENAI_API_KEY=your_key_here
```

> 当前代码中已预留 `/api/chat` 路由和 Prompt 模板，可继续扩展多模型或更复杂的剧情推进逻辑。

## 适合继续完善的方向

- 更精细的剧情分支与多结局系统
- 角色长期记忆与关系变化机制
- 主动消息推送策略
- 更强的“空间动态”生成与互动
- 接入真实语音消息 / 配音能力
- 部署到 Vercel 形成可分享 Demo

## 相关文档

- `PRODUCT_V5.md`：产品方案终稿
- `ARCHITECTURE.md`：技术架构与数据流
- `AGENTS.md`：AI 协作者工程规则
- `PROJECT_DASHBOARD.html`：项目看板/展示材料

## 当前状态

目前仓库已经不是空壳脚手架，而是一个正在快速迭代的比赛原型，核心页面与交互骨架已具备：
- 消息列表
- 聊天主流程
- 动态流
- 角色资料
- 时间线 / 结局
- 本地进度存储

接下来最值得投入的重点通常是：
1. UI 细节打磨
2. 对话引擎和 Prompt 质量
3. 演示链路稳定性
4. README / 答辩材料 / 录屏效果

## License

仅用于项目开发、比赛展示与内部协作。
