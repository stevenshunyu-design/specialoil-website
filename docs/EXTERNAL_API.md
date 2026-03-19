# 外部 API 文档

## 概述

外部 API 允许第三方服务（如扣子 AI）自动上传文章到网站。文章提交后进入待审核状态，需要管理员在后台审核后才会发布。

## 认证

所有外部 API 请求需要在请求头中包含 API Key：

```
X-API-Key: your-api-key
```

## 环境变量配置

在 Hostinger 或服务器环境变量中添加：

```
EXTERNAL_API_KEY=your-secure-api-key-here
```

**重要**：请使用安全的随机字符串作为 API Key，例如：
```bash
openssl rand -hex 32
```

## API 接口

### 1. 健康检查

```
GET /api/external/health
```

**请求示例**：
```bash
curl -X GET "https://cnspecialtyoils.com/api/external/health" \
  -H "X-API-Key: your-api-key"
```

**响应**：
```json
{
  "success": true,
  "message": "External API is operational",
  "timestamp": "2026-03-14T15:00:00.000Z"
}
```

### 2. 上传文章

```
POST /api/external/articles
```

**请求头**：
```
Content-Type: application/json
X-API-Key: your-api-key
```

**请求体**：
```json
{
  "title": "润滑油行业最新动态：2026年市场趋势分析",
  "content": "<p>文章正文内容，支持 HTML 格式...</p>",
  "excerpt": "文章摘要（可选，不填会自动生成）",
  "category": "Industry News",
  "tags": ["润滑油", "市场分析", "行业动态"],
  "featuredImage": "https://example.com/image.jpg",
  "sourceUrl": "https://example.com/news/article-123"
}
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | ✅ | 文章标题（5-200字符） |
| content | string | ✅ | 文章内容，支持 HTML（至少100字符） |
| excerpt | string | ❌ | 文章摘要，不填会自动从内容截取 |
| category | string | ❌ | 分类，默认 "Industry News" |
| tags | string[] | ❌ | 标签数组，默认 ["行业动态"] |
| featuredImage | string | ❌ | 封面图片 URL |
| sourceUrl | string | ❌ | 来源网址，用于去重 |

**响应**：

成功（201）：
```json
{
  "success": true,
  "message": "Article submitted successfully, pending review",
  "articleId": "abc123",
  "status": "pending"
}
```

重复文章（409）：
```json
{
  "success": false,
  "error": "Article already exists",
  "existingArticleId": "existing-id"
}
```

认证失败（401）：
```json
{
  "success": false,
  "error": "Invalid or missing API key"
}
```

## 扣子 AI 配置指南

### 工作流配置

1. **触发器**：定时触发
   - 时间：每天 15:00（北京时间 UTC+8）
   - 时区：Asia/Shanghai

2. **步骤 1：搜索行业新闻**
   - 使用 web_search 工具搜索：
     ```
     润滑油 行业动态 最新
     变压器油 市场价格
     特种油 供应链
     ```
   - 筛选条件：近 24 小时内的新闻

3. **步骤 2：AI 整理内容**
   - 提取关键信息
   - 生成吸引人的标题
   - 撰写 500-1000 字文章
   - 格式化为 HTML
   - 提取相关标签

4. **步骤 3：调用 API 上传**
   - HTTP 请求节点
   - 方法：POST
   - URL：`https://cnspecialtyoils.com/api/external/articles`
   - Headers：
     ```
     Content-Type: application/json
     X-API-Key: your-api-key
     ```
   - Body：动态生成 JSON

### 扣子 AI 请求示例

在扣子 AI 的 HTTP 请求节点中配置：

```json
{
  "title": "{{ai_generated_title}}",
  "content": "{{ai_generated_content_html}}",
  "tags": {{ai_extracted_tags}},
  "sourceUrl": "{{original_news_url}}",
  "category": "Industry News"
}
```

## 去重机制

系统会自动检测重复文章：

1. **URL 去重**：如果 `sourceUrl` 已存在，拒绝上传
2. **标题去重**：如果标题完全相同，拒绝上传

## 审核流程

1. 文章上传后状态为 `pending`
2. 管理员登录后台
3. 在「文章管理」中查看待审核文章
4. 编辑内容（如需要）
5. 点击「发布」按钮

## 测试

测试 API 是否正常工作：

```bash
# 健康检查
curl -X GET "https://cnspecialtyoils.com/api/external/health" \
  -H "X-API-Key: your-api-key"

# 上传测试文章
curl -X POST "https://cnspecialtyoils.com/api/external/articles" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "title": "测试文章：润滑油行业动态",
    "content": "<p>这是一篇测试文章，内容关于润滑油行业的最新动态。随着全球经济的复苏，润滑油市场呈现出良好的增长态势。根据最新数据显示，2026年全球润滑油市场规模预计将达到XX亿美元，年复合增长率为X%。</p><p>主要增长动力来自于汽车工业、制造业和能源行业的需求增长。特别是在亚太地区，随着中国和印度等新兴经济体的快速发展，润滑油消费量持续攀升。</p>",
    "tags": ["测试", "润滑油"],
    "category": "Industry News"
  }'
```

## 安全建议

1. **定期更换 API Key**：建议每 3-6 个月更换一次
2. **限制调用频率**：虽然每天只调用一次，但建议在扣子 AI 中设置重试限制
3. **监控异常请求**：关注服务器日志中的 API 调用记录
