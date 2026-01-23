# 移动端优化说明

## 已完成的优化

### 1. iOS 文本选择支持

#### 问题
- iOS 设备上双击无法选中单词
- 原有的 `onDoubleClick` 事件在移动设备上不可靠

#### 解决方案
- **触摸事件处理**：添加了 `onTouchStart` 和 `onTouchEnd` 事件处理
- **长按选词**：实现了500ms长按自动选择触摸点的单词
- **系统选择支持**：支持iOS原生的文本选择手势
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
- **移动端**：底部导航栏（60px高度）

#### 组件优化

**Sidebar**
- 桌面端：左侧固定侧边栏
- 移动端：底部导航栏，适配安全区域

**ArticleContent**
- 响应式间距：px-4 md:px-6
- 响应式字体：text-sm md:text-base
- 移动端增加底部padding（为底部导航留空间）

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
padding: env(safe-area-inset-*);

/* 防止输入框缩放 */
input, textarea { font-size: 16px; }
```

### 4. 用户体验优化

#### 触摸反馈
- 透明点击高亮：`-webkit-tap-highlight-color: transparent`
- 主动缩放反馈：`active:scale-[0.98]`

#### 字体和间距
- 移动端最小字体：12px（防止iOS自动缩放）
- 输入框字体：16px（防止iOS自动放大）
- 增强的行高：移动端 line-height: 1.75

#### 滚动优化
- 惯性滚动：`-webkit-overflow-scrolling: touch`
- 更细的滚动条（移动端4px）

## 测试建议

### iOS 测试要点
1. **文本选择**
   - 长按文章中的单词（500ms）应自动选中
   - 系统原生双击选择应正常工作
   - 选中后应显示WordPopover浮层

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
- 不同iOS版本（建议14.0+）

## 技术栈

- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Tauri 2**
- **响应式设计**: 移动优先 + md断点

## 已知限制

1. iOS Safari的文本选择行为可能因版本而异
2. 某些第三方浏览器可能有不同的选择行为
3. 建议在真机上测试，模拟器可能表现不一致

## 后续优化建议

1. 添加触觉反馈（Haptic Feedback）
2. 支持iPad多任务模式
3. 添加深色模式优化
4. 考虑横屏模式的专门优化
