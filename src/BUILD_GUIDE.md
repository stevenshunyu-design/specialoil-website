# 项目构建指南
# 项目构建指南

本指南将详细说明如何在本地构建项目，以及如何生成可部署的静态文件。

## 前提条件

在开始之前，请确保您的计算机上已经安装了以下软件：

1. **Node.js** (推荐版本 16.x 或更高)
   - 可以从 [Node.js 官网](https://nodejs.org/) 下载并安装
   - 安装完成后，可以在终端中运行 `node -v` 命令验证安装是否成功

2. **包管理器**
   - 项目支持 npm 或 pnpm 两种包管理器
   - npm 会随 Node.js 自动安装
   - 如需使用 pnpm，请在终端中运行 `npm install -g pnpm` 进行全局安装

## 本地构建步骤

### 1. 安装依赖

首先，需要安装项目所需的所有依赖包。打开终端，导航到项目根目录，然后运行以下命令之一：

使用 npm:
```bash
npm install
```

使用 pnpm:
```bash
pnpm install
```

这将根据 package.json 文件安装所有必要的依赖项。

### 2. 运行构建命令

依赖安装完成后，可以运行构建命令来生成生产环境的代码。在项目根目录下运行以下命令之一：

#### 标准构建（用于开发测试）

使用 npm:
```bash
npm run build
```

使用 pnpm:
```bash
pnpm build
```

此命令会将文件构建到 `dist/static` 目录。

#### 部署专用构建（直接生成可部署文件）

为了更方便地生成可以直接部署的静态文件，我们提供了专用的部署构建命令：

使用 npm:
```bash
npm run build:deploy
```

使用 pnpm:
```bash
pnpm build:deploy
```

此命令会直接将文件构建到 `dist` 目录根目录，更适合直接部署到托管平台。

### 3. 构建过程说明

当您运行构建命令时，会执行以下操作：
1. 删除项目根目录下的旧 `dist` 文件夹（如果存在）
2. 自动修复可能的 esbuild 执行权限问题（通过内置的 `fix-permissions` 脚本）
3. 使用 Vite 构建工具将源代码编译打包
4. 对于 `build:deploy` 命令，文件会直接生成在 `dist` 根目录中

构建成功后，您可以在项目根目录下看到生成的 `dist` 文件夹，其中包含了所有可以直接部署的静态文件。

## 构建输出说明

### 标准构建输出 (`npm run build`)

```
dist/
├── static/                # 包含所有编译后的静态资源
│   ├── assets/            # 包含 CSS、JavaScript 和图像等资源
│   ├── index.html         # 主 HTML 文件
│   └── ...                # 其他可能的静态文件
├── package.json           # 从根目录复制的 package.json 文件
└── build.flag             # 构建标记文件
```

### 部署专用构建输出 (`npm run build:deploy`)

```
dist/                      # 根目录直接包含所有静态资源
├── assets/                # 包含 CSS、JavaScript 和图像等资源
├── index.html             # 主 HTML 文件
└── ...                    # 其他静态文件
```

这些文件是完全静态的，可以直接部署到任何支持静态网站托管的平台。

## 常见问题排解

### 构建失败 - EACCES 权限错误

- **问题**：构建命令执行时出现类似 `Error: The service was stopped: spawn ... esbuild EACCES` 的错误。这通常是因为 esbuild 二进制文件没有执行权限，特别是在 CI/CD 环境或权限受限的服务器上。

- **解决方法**：
  1. 项目已内置修复脚本 (`fix-permissions`)，会自动尝试解决权限问题。这个脚本会：
     - 查找并修复所有 node_modules 目录下的 esbuild 相关文件权限
     - 特别处理 pnpm 存储结构中的 esbuild 二进制文件
     - 确保 .bin 目录下的所有文件都有执行权限
   
  2. 如果自动修复脚本仍然无法解决问题，您可以尝试手动运行以下命令：
     ```bash
     find node_modules -name 'esbuild' -type d -exec chmod -R +x {} +
     find node_modules/.pnpm -name '*esbuild*' -type d -exec chmod -R +x {} +
     chmod +x node_modules/.bin/*
     ```
   
  3. 另一种方法是在本地构建项目，然后将构建好的 dist 目录上传到服务器，这样可以避免在权限受限的环境中进行构建。

### 构建后文件不完整

- **问题**：构建后的 `dist` 目录中缺少某些文件
- **解决方法**：尝试使用 `npm run build:deploy` 命令，这会生成更完整的部署文件

## 部署指南

有关如何将构建后的静态文件部署到具体托管平台（如Hostinger）的详细步骤，请参阅项目根目录下的 `DEPLOYMENT_GUIDE.md` 文件。

## 其他说明

本项目是一个纯静态前端应用，构建后不需要 Node.js 服务器运行，可以部署到任何支持静态网站托管的平台。

如需更多帮助，请联系技术支持或查阅相关文档。