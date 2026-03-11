# 样式定制指南

本文档说明如何定制聊天组件的样式，以匹配你的网站品牌。

## 主题颜色

聊天组件使用了以下主题颜色变量，你可以根据品牌进行调整：

### 品牌主色

在 `ChatWidget.tsx` 和 `AdminChat.tsx` 中搜索以下颜色值：

```tsx
// 主色调 - 用于按钮、强调元素
'#D4AF37'  // 金色（主要）
'#B8960C'  // 深金色（hover 状态）

// 企业色 - 用于管理员头像、发送按钮
'#003366'  // 深蓝色
'#004080'  // 蓝色（hover 状态）
```

### 替换颜色示例

如果你的品牌是绿色系：

```tsx
// 原代码
className="bg-gradient-to-r from-[#D4AF37] to-[#B8960C]"

// 改为
className="bg-gradient-to-r from-[#10B981] to-[#059669]"
```

## 聊天窗口尺寸

在 `ChatWidget.tsx` 中修改窗口尺寸：

```tsx
// 默认尺寸
<div className="w-96 h-[500px]">  // 384px x 500px

// 改为更宽的窗口
<div className="w-[450px] h-[600px]">
```

## 圆角样式

组件使用了 `rounded-2xl`（16px 圆角），你可以改为：

- `rounded-lg` - 8px 圆角（更方正）
- `rounded-xl` - 12px 圆角（中等）
- `rounded-3xl` - 24px 圆角（更圆润）
- `rounded-full` - 完全圆形（仅适用于按钮）

## 按钮样式

### 发送按钮

```tsx
// 默认样式
<button className="px-6 py-3 bg-gradient-to-r from-[#003366] to-[#004080] text-white rounded-2xl">

// 改为实心颜色（无渐变）
<button className="px-6 py-3 bg-[#003366] hover:bg-[#004080] text-white rounded-2xl">

// 改为圆角按钮
<button className="w-12 h-12 bg-[#003366] text-white rounded-full">
```

### 快捷问题按钮

```tsx
// 默认样式
<button className="px-3 py-1.5 bg-white/10 text-white/80 rounded-lg text-sm">

// 改为描边样式
<button className="px-3 py-1.5 border border-white/30 text-white/80 rounded-lg text-sm">
```

## 消息气泡样式

### 访客消息（左侧）

```tsx
// 默认样式 - 白色背景
<div className="bg-white border border-slate-200 rounded-bl-md">

// 改为浅灰色背景
<div className="bg-slate-100 rounded-bl-md">
```

### 管理员/AI 消息（右侧）

```tsx
// 默认样式 - 深蓝色背景
<div className="bg-[#003366] rounded-br-md">

// 改为品牌主色
<div className="bg-[#D4AF37] rounded-br-md">
```

## 图标定制

聊天组件使用 Font Awesome 图标。你可以：

### 更换图标

```tsx
// 默认聊天图标
<i className="fa-solid fa-comments"></i>

// 改为客服图标
<i className="fa-solid fa-headset"></i>

// 改为消息图标
<i className="fa-solid fa-message"></i>
```

### 添加图标库

确保在 `index.html` 中引入 Font Awesome：

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

## 深色模式支持

如需支持深色模式，可以添加 Tailwind 的 `dark:` 前缀：

```tsx
// 默认
<div className="bg-white text-slate-800">

// 支持深色模式
<div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
```

## 后台界面定制

### 登录页面背景

```tsx
// 默认渐变背景
<div className="bg-gradient-to-br from-slate-900 via-[#003366] to-slate-900">

// 改为品牌色渐变
<div className="bg-gradient-to-br from-slate-900 via-[#D4AF37] to-slate-900">
```

### 侧边栏

```tsx
// 默认深色
<div className="bg-gradient-to-b from-slate-800 to-slate-900">

// 改为浅色（需要同时调整文字颜色）
<div className="bg-gradient-to-b from-slate-100 to-white">
```

## 动画效果

### 打开/关闭动画

```tsx
// 默认 - 无动画
setIsOpen(!isOpen)

// 添加过渡动画
<div className={`transition-all duration-300 ${isOpen ? 'scale-100' : 'scale-0'}`}>
```

### 消息出现动画

```tsx
// 使用 Framer Motion
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
  {message}
</motion.div>
```

## 字体定制

在 `globals.css` 中添加自定义字体：

```css
/* 引入 Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

/* 应用到聊天组件 */
.chat-widget {
  font-family: 'Inter', sans-serif;
}
```

## 响应式调整

针对移动端调整样式：

```tsx
// 默认尺寸
<div className="w-96 h-[500px]">

// 响应式：移动端全宽
<div className="w-full sm:w-96 h-[70vh] sm:h-[500px]">
```
