# 飞书集成指南

本文档说明如何配置飞书 Webhook，实现新客户咨询的实时通知。

## 创建飞书群机器人

### 步骤 1：创建飞书群

1. 在飞书中创建一个群组，例如"客服通知群"
2. 添加需要接收通知的客服人员

### 步骤 2：添加机器人

1. 进入群设置 → 群机器人 → 添加机器人
2. 选择"自定义机器人"
3. 填写机器人名称，如"客服助手"
4. 复制 Webhook 地址

### 步骤 3：配置环境变量

将 Webhook 地址配置到环境变量：

```env
FEISHU_CHAT_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook-key
```

## 消息格式说明

飞书 Webhook v2 支持多种消息格式，但需要注意兼容性：

### ✅ 推荐格式：纯文本

```typescript
const notification = {
  msg_type: 'text',
  content: {
    text: `🔔 新客户咨询 #1234\n\n客户信息:\n👤 姓名: 张三\n📧 邮箱: test@example.com`
  }
};
```

### ⚠️ 不支持的元素

飞书 Webhook v2 **不支持**以下卡片元素：
- `divider` - 分割线
- `action` - 按钮操作
- `note` - 注释

如果使用这些元素，会返回错误：
```json
{"code":11246,"msg":"ErrCode: 11310; ErrMsg: unsupported type of block; ErrorValue: divider"}
```

### ❌ 错误示例

```typescript
// 不要使用这种格式！
const notification = {
  msg_type: 'interactive',
  card: {
    elements: [
      { tag: 'divider' },  // ❌ 不支持
      { tag: 'action', ... }  // ❌ 不支持
    ]
  }
};
```

## 测试通知

使用 curl 测试 Webhook 是否正常：

```bash
curl -X POST 'https://open.feishu.cn/open-apis/bot/v2/hook/your-webhook-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "msg_type": "text",
    "content": {
      "text": "测试消息：客服系统通知正常"
    }
  }'
```

成功响应：
```json
{"code":0,"msg":"success"}
```

## 多通知渠道

如果需要将询价和客服通知分开，可以配置多个 Webhook：

```env
# 客服通知
FEISHU_CHAT_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx

# 询价通知
FEISHU_INQUIRY_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/yyy
```

在代码中根据场景选择不同的 Webhook：

```typescript
// 客服通知
await fetch(process.env.FEISHU_CHAT_WEBHOOK, { ... });

// 询价通知
await fetch(process.env.FEISHU_INQUIRY_WEBHOOK, { ... });
```

## 安全建议

1. **不要**在前端代码中暴露 Webhook 地址
2. Webhook 地址应仅在后端使用
3. 定期检查群机器人设置，移除不需要的机器人
