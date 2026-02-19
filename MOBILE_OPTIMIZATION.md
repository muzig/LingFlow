# 移动端优化说明

## 已完成的优化

### 1. iOS 文本选择支持

#### 问题

- iOS 设备上双击无法选中单词
- 原有的 `onDoubleClick` 事件在移动设备上不可靠

#### 解决方案

- **触摸事件处理**：添加了 `onTouchStart` 和 `onTouchEnd` 事件处理
- **长按选词**：实现了 500ms 长按自动选择触摸点的单词
- **系统选择支持**：支持 iOS 原生的文本选择手势
- **智能处理**：
  - 短按（<500ms）：使用系统默认选择
  - 长按（≥500ms）：自动选择触摸点的单词

#### 技术实现

```typescript
// ArticleContent.tsx
- 移动设备检测
- 触摸开始/结束事件处理
- selectWordAtPoint() 函数实现精准选词
- 启用 user-select: text
```

### 2. 移动端布局适配

#### 响应式设计

- **断点**：使用 `md:` (768px) 作为主要断点
- **桌面端**：16px 宽度侧边栏
- **移动端**：底部导航栏（60px 高度）

#### 组件优化

**Sidebar**

- 桌面端：左侧固定侧边栏
- 移动端：底部导航栏，适配安全区域

**ArticleContent**

- 响应式间距：px-4 md:px-6
- 响应式字体：text-sm md:text-base
- 移动端增加底部 padding（为底部导航留空间）

**WordPopover**

- 移动端：智能定位，优先居中显示
- 桌面端：跟随选择位置显示
- 半透明背景遮罩（仅移动端）

**所有页面**

- VocabularyPage：网格布局适配，搜索框全宽
- ReviewPage：卡片内容优化，按钮响应式
- ReaderPage：输入框和按钮适配移动端

### 3. iOS 专用优化

#### HTML Meta 标签

```html
<!-- viewport 优化 -->
<meta name="viewport" content="viewport-fit=cover" />

<!-- iOS Web App 支持 -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />

<!-- 禁用电话号码自动识别 -->
<meta name="format-detection" content="telephone=no" />
```

#### CSS 优化

```css
/* 文本选择 */
-webkit-user-select: text;
-webkit-touch-callout: default;

/* 防止双击缩放 */
touch-action: manipulation;

/* 安全区域支持 */
padding: env(safe-area-inset- *);

/* 防止输入框缩放 */
input,
textarea {
  font-size: 16px;
}
```

### 4. 用户体验优化

#### 触摸反馈

- 透明点击高亮：`-webkit-tap-highlight-color: transparent`
- 主动缩放反馈：`active:scale-[0.98]`

#### 字体和间距

- 移动端最小字体：12px（防止 iOS 自动缩放）
- 输入框字体：16px（防止 iOS 自动放大）
- 增强的行高：移动端 line-height: 1.75

#### 滚动优化

- 惯性滚动：`-webkit-overflow-scrolling: touch`
- 更细的滚动条（移动端 4px）

## 测试建议

### iOS 测试要点

1. **文本选择**

   - 长按文章中的单词（500ms）应自动选中
   - 系统原生双击选择应正常工作
   - 选中后应显示 WordPopover 浮层

2. **布局检查**

   - 底部导航不应遮挡内容
   - 刘海屏设备安全区域正确
   - 横屏模式布局正常

3. **交互测试**
   - 点击响应灵敏
   - 滚动流畅
   - 输入框不触发页面缩放

### 测试设备

- iPhone（不同尺寸）
- iPad
- 不同 iOS 版本（建议 14.0+）

## 技术栈

- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Tauri 2**
- **响应式设计**: 移动优先 + md 断点

## 最新更新：iOS 安全区域修复 ✅

### 问题

内容会滚动到灵动岛（Dynamic Island）下方被遮挡

### 解决方案

#### 1. Layout 层级优化

```tsx
// Layout.tsx
<div style={{
  paddingTop: 'env(safe-area-inset-top)',
  paddingBottom: 'env(safe-area-inset-bottom)',
}}>
```

- 在最外层容器添加安全区域 padding
- 确保内容不会被状态栏/灵动岛遮挡

#### 2. 各页面滚动容器优化

**统一结构：**

```tsx
<div className="h-full flex flex-col overflow-hidden">
  {/* 固定头部 */}
  <header className="flex-shrink-0 bg-background">...</header>

  {/* 可滚动内容 */}
  <div
    className="flex-1 overflow-auto"
    style={{
      paddingBottom: "calc(1rem + env(safe-area-inset-bottom) + 4rem)",
    }}
  >
    ...
  </div>
</div>
```

**关键点：**

- 外层容器：`overflow-hidden`（防止多重滚动）
- 头部：`flex-shrink-0`（固定不动）
- 内容区：`overflow-auto` + 动态底部 padding

#### 3. 底部导航栏优化

```tsx
// Sidebar.tsx (移动端底部导航)
<nav style={{
  paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
}}>
```

#### 4. CSS 优化

```css
/* 使用动态视口高度 */
html,
body,
#root {
  height: 100vh;
  height: 100dvh; /* 动态视口高度，排除浏览器UI */
}
```

### 技术细节

#### 安全区域计算公式

```
移动端底部padding = 内容padding + 安全区域 + 底部导航高度
                  = 1rem + env(safe-area-inset-bottom) + 4rem
```

#### 桌面端处理

- 使用 CSS 类：`md:pb-0`
- 桌面端不需要额外的底部 padding
- 安全区域在桌面端为 0，不影响布局

### 受影响的组件

- ✅ Layout.tsx - 顶部和底部安全区域
- ✅ Sidebar.tsx - 底部导航安全区域
- ✅ ArticleContent.tsx - 滚动容器优化
- ✅ VocabularyPage.tsx - 滚动容器优化
- ✅ ReviewPage.tsx - 滚动容器优化
- ✅ ReaderPage.tsx - 滚动容器优化

## 已知限制

1. iOS Safari 的文本选择行为可能因版本而异
2. 某些第三方浏览器可能有不同的选择行为
3. 建议在真机上测试，模拟器可能表现不一致
4. 动态视口高度（dvh）在较老的 iOS 版本可能不支持（iOS 15.4+）

## 后续优化建议

1. 添加触觉反馈（Haptic Feedback）
2. 支持 iPad 多任务模式
3. 添加深色模式优化
4. 考虑横屏模式的专门优化
5. 添加下拉刷新功能（移动端）
