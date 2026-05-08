# 灵犀 Linxi

> 像真人一样陪伴你的 AI 好友。心有灵犀，一点就通。

## 产品简介

**灵犀**是一个 AI 社交陪伴产品——AI 不再是冰冷的问答工具，而是一个有自己生活、有情绪、会主动找你聊天的朋友。

### 核心差异

| 传统 AI | 灵犀 |
|---------|------|
| 你不用就不存在 | 有自己的日常，会主动找你 |
| 每次对话从零开始 | 记得你说过的每一句话 |
| 始终机械中立 | 心情随对话实时变化 |
| 你问就秒答 | 像真人一样有时快有时慢 |
| 只能回答问题 | 聊日常、推荐电影、发自拍 |
| 无视觉形象 | 有照片、表情包、朋友圈 |

## 在线体验

🔗 **Demo**: [https://linxi-d2gcj01lm1b6d05c8-1426415964.tcloudbaseapp.com](https://linxi-d2gcj01lm1b6d05c8-1426415964.tcloudbaseapp.com)

无需注册，直接体验。

## 核心功能

### 1. 时间加速引擎（独创）
故事时间:现实时间 = 10:1。AI 会在"合适的时间"主动找你聊天。刚认识时几小时后才发消息，熟了以后越来越快——不确定性制造期待感。

### 2. 心情状态机
AI 有 5 种心情状态（开心/平静/兴奋/焦虑/低落），根据你的话实时切换。你鼓励 TA → TA 变开心；你否定 TA → TA 变焦虑。你对 TA 有真实的影响力。

### 3. 对话记忆摘要
每次退出聊天时，LLM 自动生成记忆摘要。下次聊天时角色会自然提起"上次你说的那个……"——真正的关系积累。

### 4. 兴趣静默提取
不需要填任何表格。系统从自然对话中静默识别 100+ 关键词分类，然后 AI "恰好"聊到你关心的话题。

### 5. 信息型陪伴
不只情感陪伴——TA 还是消息灵通的朋友。能聊球赛、推荐电影、分享新闻。陪伴 + 信息获取一体化。

### 6. 真实感系统
AI 会发表情包、发自拍、发朋友圈。有日常状态（在图书馆/刚起床/深夜还在线），构成完整的"活人"感知。

## 技术架构

```
┌─────────────────────────────────────────────────┐
│  前端层   Next.js 16 · TypeScript · Tailwind    │
│           Framer Motion · App Router            │
├─────────────────────────────────────────────────┤
│  AI 层    DeepSeek Chat API · 动态 Prompt 注入  │
│           记忆摘要生成 · 情绪分析               │
├─────────────────────────────────────────────────┤
│  引擎层   心情状态机 · 时间加速器 · 兴趣提取器  │
│           主动消息调度 · 表情包引擎             │
├─────────────────────────────────────────────────┤
│  基础设施  腾讯云 CloudBase · 静态托管          │
│           localStorage 持久化                   │
└─────────────────────────────────────────────────┘
```

## 项目结构

```
src/
├── app/
│   ├── page.tsx                    # 主应用状态机
│   ├── globals.css                 # 全局样式
│   └── api/chat/route.ts           # AI 对话 API
├── components/
│   ├── Landing.tsx                 # 开屏页
│   ├── StorySelect.tsx             # 角色选择
│   ├── InterestSelect.tsx          # 兴趣选择
│   ├── MessageListPage.tsx         # QQ 风格消息列表
│   ├── ChatView.tsx                # 聊天主界面
│   ├── ChatBubbles.tsx             # 消息气泡（含表情包）
│   ├── MomentsFeed.tsx             # 朋友圈动态流
│   ├── MyProfileTab.tsx            # 个人资料页
│   ├── ProfilePage.tsx             # 角色资料页
│   └── BottomTabBar.tsx            # 底部导航
├── lib/
│   ├── chat-engine.ts              # 对话引擎核心
│   ├── chat-summary.ts             # 对话记忆摘要系统
│   ├── mood-engine.ts              # 心情状态机（5 态）
│   ├── time-engine.ts              # 时间加速引擎（10x）
│   ├── interest-context.ts         # 兴趣静默提取
│   ├── proactive-messages.ts       # 主动消息调度
│   ├── stickers.ts                 # 表情包引擎
│   ├── selfies.ts                  # 自拍系统
│   ├── prompts.ts                  # Prompt 工程模板
│   ├── llm-client.ts              # LLM API 客户端
│   ├── characters.ts               # 角色设定数据
│   ├── memory.ts                   # 本地状态持久化
│   ├── moments-data.ts             # 朋友圈动态数据
│   └── ...                         # 其他辅助模块
└── types/
    └── index.ts                    # 类型定义
```

## 本地开发

### 环境要求

- Node.js >= 18
- npm 或 pnpm

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

### 配置 AI 对话

在项目根目录创建 `.env.local`：

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key
```

不配置 API Key 时会使用内置 mock 回复，方便快速体验产品流程。

## 部署

### 腾讯云 CloudBase（当前方案）

项目已配置为静态导出 + 客户端直连 DeepSeek API：

```bash
npm run build
# 输出到 out/ 目录，上传至 CloudBase 静态托管
```

### Docker

```bash
docker build -t linxi .
docker run -p 3000:3000 linxi
```

## 文档

| 文件 | 说明 |
|------|------|
| `docs/产品说明文档.html` | 产品说明文档（HTML 源文件） |
| `docs/尤逸伦_QQ社交赛道_灵犀_说明文档.pdf` | PDF 版说明文档 |
| `docs/尤逸伦_QQ社交赛道_灵犀_Demo演示.mp4` | 演示录屏 |
| `docs/录屏文字稿.md` | 录屏提词脚本 |
| `docs/产品定位与创新.md` | 产品定位详细文档 |

## License

MIT
