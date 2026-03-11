# AI Customer Chat System

一个完整的 AI 智能客服系统，支持 AI 自动回复和人工客服转接，适用于任何需要在线客服功能的网站。

## 功能特性

- 🤖 **AI 智能客服**：基于 OpenAI API 自动回复常见问题
- 👨‍💼 **人工客服转接**：当 AI 无法解决时，一键转接人工客服
- 🔔 **飞书通知**：新客户咨询实时通知到飞书群
- 💬 **后台管理界面**：完整的客服工作台，支持多会话管理
- 📱 **响应式设计**：适配桌面和移动端
- 🔄 **实时轮询**：前端轮询获取新消息，无需 WebSocket
- 📊 **会话状态管理**：waiting（等待）、active（活跃）、closed（已关闭）
- 📁 **历史记录**：按客户分组的会话历史

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
├─────────────────────────┬───────────────────────────────────┤
│   ChatWidget.tsx        │      AdminChat.tsx                │
│   (网站聊天窗口)          │      (后台客服界面)                │
└─────────────────────────┴───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Backend API                           │
├─────────────────────────────────────────────────────────────┤
│  POST /api/chat          - AI 聊天                          │
│  POST /api/chat/human    - 人工客服消息                      │
│  GET  /api/chat/messages - 获取新消息                        │
│  GET  /api/chat/sessions - 获取所有会话                      │
│  POST /api/chat/admin/message - 管理员回复                   │
│  POST /api/chat/sessions/:id/close - 关闭会话               │
│  DELETE /api/chat/sessions/:id - 删除会话                   │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
    ┌──────────┐       ┌──────────┐       ┌──────────┐
    │ Supabase │       │  OpenAI  │       │  飞书    │
    │ (数据库)  │       │   API    │       │ Webhook  │
    └──────────┘       └──────────┘       └──────────┘
```

## 快速开始

### 1. 数据库配置

在 Supabase SQL Editor 中执行：

```sql
-- 见 templates/database-schema.sql
```

### 2. 环境变量配置

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API
OPENAI_API_KEY=your_openai_api_key
OPENAI_API_HOST=api.openai.com  # 或自定义代理

# 飞书通知（可选）
FEISHU_CHAT_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx

# 网站地址
SITE_URL=https://your-website.com
```

### 3. 安装依赖

```bash
pnpm add @supabase/supabase-js
```

### 4. 复制代码文件

- `templates/ChatWidget.tsx` → `src/components/ChatWidget.tsx`
- `templates/AdminChat.tsx` → `src/pages/AdminChat.tsx`
- `templates/chat-api.ts` → 添加到 `server.ts` 中

### 5. 添加路由

```tsx
// 在 App.tsx 中添加
import ChatWidget from './components/ChatWidget';
import AdminChat from './pages/AdminChat';

// 在页面中添加聊天组件
<ChatWidget />

// 添加后台路由
<Route path="/admin/chat" element={<AdminChat />} />
```

## API 文档

### POST /api/chat

AI 智能聊天接口。

**请求体：**
```json
{
  "message": "用户消息",
  "history": [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}],
  "customerInfo": {
    "name": "客户姓名",
    "email": "客户邮箱",
    "phone": "客户电话"
  }
}
```

**响应：**
```json
{
  "response": "AI 回复内容",
  "needsHuman": false,
  "sessionId": "session_xxx"
}
```

### POST /api/chat/human

人工客服模式下的消息发送。

**请求体：**
```json
{
  "message": "用户消息",
  "sessionId": "session_xxx",
  "customerInfo": {
    "name": "客户姓名",
    "customerNo": "#1234"
  }
}
```

### GET /api/chat/messages

轮询获取新消息。

**参数：**
- `sessionId`: 会话 ID
- `after`: 最后一条消息 ID（可选，用于增量获取）

### GET /api/chat/sessions

获取所有会话列表（后台使用）。

### POST /api/chat/admin/message

管理员发送回复。

**请求体：**
```json
{
  "sessionId": "session_xxx",
  "message": "管理员回复",
  "adminName": "客服名称"
}
```

## 自定义配置

### 修改 AI 提示词

在 `server.ts` 中修改系统提示：

```typescript
const systemPrompt = `You are a helpful customer service assistant for [公司名].
You can help with:
- Product information
- Order status
- Technical support

If you cannot help, suggest the user to request human support.`;
```

### 添加转人工关键词

```typescript
function needsHumanAgent(message: string): boolean {
  const keywords = [
    'human', '人工', '客服', '转人工',
    'speak to someone', 'real person',
    // 添加更多关键词...
  ];
  return keywords.some(k => message.toLowerCase().includes(k));
}
```

### 自定义快速问题

在 `ChatWidget.tsx` 中修改：

```typescript
const QUICK_QUESTIONS = [
  "What products do you offer?",
  "Tell me about pricing",
  "How to contact you?",
  "I need technical support"
];
```

## 文件结构

```
skills/ai-customer-chat/
├── README.md                    # 本文档
├── templates/
│   ├── ChatWidget.tsx          # 前端聊天组件
│   ├── AdminChat.tsx           # 后台管理界面
│   ├── chat-api.ts             # 后端 API 代码
│   └── database-schema.sql     # 数据库建表语句
└── references/
    ├── feishu-integration.md   # 飞书集成指南
    └── styling-guide.md        # 样式定制指南
```

## 常见问题

### Q: 飞书通知不工作？

1. 检查 `FEISHU_CHAT_WEBHOOK` 环境变量是否正确
2. 确保使用的是纯文本格式（`msg_type: 'text'`），飞书 webhook v2 不支持某些卡片元素

### Q: 消息轮询重复？

前端已实现去重逻辑，基于消息 ID 和 `role:content` 组合去重。

### Q: 如何修改客服后台密码？

在 `AdminChat.tsx` 中修改 `handleLogin` 函数：

```typescript
if (password === 'your-new-password') {
  // ...
}
```

### Q: 如何部署到 Hostinger？

Hostinger 运行的是编译后的 `server.production.js` 文件。修改代码后需要：
1. 修改 `server.ts`（源代码）
2. **同时修改** `server.production.js`（编译后的文件）
3. 两个文件都提交推送

## License

MIT
