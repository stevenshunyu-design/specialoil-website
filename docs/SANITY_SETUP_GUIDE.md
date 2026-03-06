# Sanity CMS 设置指南

## 📋 概述

本项目已集成 Sanity CMS，实现博客文章的动态管理。设置完成后，您可以在 Sanity 后台直接发布和编辑博客文章，无需重新部署网站。

## 🚀 快速开始

### 步骤 1：注册 Sanity 账户

1. 访问 [https://www.sanity.io/](https://www.sanity.io/)
2. 点击 "Get Started" 注册免费账户
3. 可使用 Google、GitHub 或 Email 注册

### 步骤 2：创建新项目

1. 登录后点击 "New Project"
2. 填写项目名称，如：`China Special Oil Blog`
3. 选择默认数据集 `production`
4. 记录生成的 **Project ID**（格式类似：`abc123xyz`）

### 步骤 3：配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
VITE_SANITY_PROJECT_ID=你的项目ID
```

例如：
```env
VITE_SANITY_PROJECT_ID=abc123xyz
```

### 步骤 4：创建 Sanity Studio 项目

**方式 A：使用 Sanity CLI（推荐）**

```bash
# 安装 Sanity CLI
npm install -g @sanity/cli

# 创建 Studio 项目
cd /你的工作目录
sanity init --project-plan free

# 选择 "Create new project"
# 输入项目名称：china-special-oil-blog
# 选择数据集：production
# 选择输出路径：sanity-studio
```

**方式 B：使用预配置模板**

```bash
# 创建 sanity-studio 目录
mkdir sanity-studio
cd sanity-studio

# 初始化 package.json
npm init -y

# 安装依赖
npm install @sanity/cli @sanity/base @sanity/components @sanity/core @sanity/default-layout @sanity/default-login @sanity/desk-tool @sanity/vision
```

### 步骤 5：配置 Schema

将 `sanity-schemas/post.ts` 中的 Schema 复制到您的 Sanity Studio 项目的 `schemas` 目录中：

```
sanity-studio/
├── schemas/
│   ├── index.ts
│   ├── post.ts
│   ├── category.ts
│   └── tag.ts
└── sanity.config.ts
```

**schemas/index.ts:**
```typescript
import post from './post'
import category from './category'
import tag from './tag'

export const schemaTypes = [post, category, tag]
```

**schemas/post.ts:**
```typescript
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      }
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }]
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: { type: 'category' }
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tag' } }]
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime'
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string'
    }
  ]
}
```

**schemas/category.ts:**
```typescript
export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    }
  ]
}
```

**schemas/tag.ts:**
```typescript
export default {
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    }
  ]
}
```

### 步骤 6：启动 Sanity Studio

```bash
cd sanity-studio
sanity dev
```

访问 [http://localhost:3333](http://localhost:3333) 打开 Sanity Studio 后台。

### 步骤 7：添加内容

1. **创建分类**
   - 进入 Categories
   - 添加以下分类：
     - Industry News
     - Technical Information
     - Market Analysis
     - Product Updates

2. **创建标签**
   - 进入 Tags
   - 添加相关标签

3. **创建文章**
   - 进入 Blog Posts
   - 点击 "Create new"
   - 填写标题、摘要、内容等
   - 上传特色图片
   - 选择分类和标签
   - 设置发布时间
   - 点击 "Publish"

### 步骤 8：重新构建并部署

```bash
# 在项目根目录
pnpm build

# 上传 dist 文件夹到 Hostinger
```

## 🔧 配置 CORS（重要）

为了让您的网站能够访问 Sanity API：

1. 登录 [Sanity Dashboard](https://www.sanity.io/manage)
2. 选择您的项目
3. 进入 Settings > API > CORS origins
4. 添加您的网站域名：
   - `https://yourdomain.com`
   - `http://localhost:5000`（开发环境）

## 📚 预设文章内容

项目已内置 8 篇高质量博客文章，涵盖：

1. **2025 中国特种油市场报告** - 市场规模达 3862 亿元
2. **变压器油出口突破** - 燕山石化出口新加坡
3. **技术标准对比** - IEC 60296、ASTM D3487 标准
4. **绿色转型** - 生物基特种油发展
5. **橡胶加工油** - 环烷油优势分析
6. **白油产品** - 食品级和医药级生产
7. **液压油** - 性能对比国际品牌
8. **法规更新** - EU REACH 和 US EPA 要求

这些文章将在未配置 Sanity 时作为默认数据显示。

## 💡 两种模式对比

| 特性 | 本地模式（默认） | Sanity CMS |
|------|------------------|------------|
| 文章管理 | localStorage | 云端后台 |
| 添加文章 | 需重新部署 | 后台直接发布 |
| 图片管理 | 外部链接 | 云端存储 |
| 实时更新 | ❌ | ✅ |
| 多用户协作 | ❌ | ✅ |
| 免费额度 | 无限制 | 免费 3 用户 |

## 🆘 常见问题

### Q: 如何判断是否已连接 Sanity？
A: 打开浏览器控制台，如果看到 "Loaded posts from Sanity CMS" 日志，说明已成功连接。

### Q: 如何切换回本地模式？
A: 删除 `.env.local` 文件中的 `VITE_SANITY_PROJECT_ID` 变量，或将值改为 `your-project-id-here`。

### Q: 图片无法显示？
A: 确保 CORS 配置正确，图片需要通过 Sanity 图片 CDN 加载。

### Q: 如何迁移现有文章到 Sanity？
A: 在 Sanity Studio 中手动创建文章，或将现有文章内容复制到新系统中。

## 📞 技术支持

如有问题，请参考：
- [Sanity 官方文档](https://www.sanity.io/docs)
- [Sanity GROQ 查询语言](https://www.sanity.io/docs/groq)
