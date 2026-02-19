# LingFlow MVP 版本文档

> **版本**: v0.1.0 (MVP)  
> **最后更新**: 2026-02-19  
> **状态**: ✅ 生产可用

## 📋 目录

- [项目概述](#项目概述)
- [快速开始](#快速开始)
- [技术架构](#技术架构)
- [核心功能](#核心功能)
- [数据模型](#数据模型)
- [API 文档](#api-文档)
- [开发指南](#开发指南)
- [部署指南](#部署指南)
- [已知问题](#已知问题)
- [未来规划](#未来规划)

---

## 项目概述

LingFlow 是一个专为开发者和技术人员设计的**技术英语阅读器桌面应用**，帮助用户在阅读英文技术文档时高效学习和积累专业词汇。

### 核心价值主张

- 🎯 **沉浸式学习**：在真实技术文档中学习词汇，保持上下文
- ⚡ **即时反馈**：划词即查，无需切换应用
- 💾 **智能复习**：基于遗忘曲线的轻量复习机制
- 🔒 **隐私优先**：数据本地存储，无需联网账号

### 项目信息

- **项目名称**：LingFlow
- **项目类型**：Desktop Application（Tauri + React）
- **支持平台**：macOS, Windows, Linux, iOS, Android
- **版本**：MVP v0.1.0
- **开发时间**：2026 年 1 月 - 2026 年 2 月

---

## 快速开始

### 前置要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0 (推荐)
- **Rust**: >= 1.70.0
- **操作系统**: macOS 10.15+ / Windows 10+ / Ubuntu 18.04+

### 安装步骤

```bash
# 1. 克隆项目
git clone [repository-url]
cd LingFlow

# 2. 安装依赖
pnpm install

# 3. 开发模式运行
pnpm tauri dev

# 4. 构建生产版本
pnpm tauri build
```

### 开发模式

```bash
# 仅前端开发（无 Tauri）
pnpm dev

# 完整应用开发
pnpm tauri dev

# 检查类型
pnpm build
```

---

## 技术架构

### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        用户界面层                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ 阅读器   │  │ 生词本   │  │ 复习页   │  │ 设置页   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                      状态管理层 (Zustand)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  wordStore   │  │ articleStore │  │selectionStore│     │
│  │  - 生词列表  │  │  - 文章内容  │  │  - 选词状态  │     │
│  │  - 搜索过滤  │  │  - 加载状态  │  │  - 浮层位置  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│              ↓ LocalStorage 持久化                         │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                    Tauri IPC 桥接层                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  invoke('fetch_article', { url })                    │  │
│  │  invoke('explain_word', { word, sentence })         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                      Rust 后端层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ fetch_article│  │ explain_word │  │  网络请求    │     │
│  │  - HTML解析  │  │  - AI接口预留│  │  - 抓取网页  │     │
│  │  - MD转换    │  │  - 词典查询  │  │  - 内容提取  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 技术栈详情

#### 前端技术栈

| 技术           | 版本     | 用途          |
| -------------- | -------- | ------------- |
| React          | 19.1.0   | UI 框架       |
| TypeScript     | 5.8.3    | 类型安全      |
| Vite           | 7.0.4    | 构建工具      |
| Tailwind CSS   | 4.1.18   | 样式框架      |
| shadcn/ui      | -        | UI 组件库     |
| Radix UI       | 多个版本 | 无障碍组件    |
| Zustand        | 5.0.10   | 状态管理      |
| React Router   | 7.12.0   | 路由管理      |
| React Markdown | 10.1.0   | Markdown 渲染 |
| Lucide React   | 0.562.0  | 图标库        |

#### 后端技术栈

| 技术    | 版本       | 用途             |
| ------- | ---------- | ---------------- |
| Tauri   | 2.0        | 桌面应用框架     |
| Rust    | 最新稳定版 | 系统编程语言     |
| reqwest | 0.12       | HTTP 客户端      |
| scraper | 0.23       | HTML 解析        |
| html2md | 0.2        | HTML 转 Markdown |
| tokio   | 1.0        | 异步运行时       |

### 前端技术栈

- **框架**：React 19.1.0
- **语言**：TypeScript
- **构建工具**：Vite 7.0.4
- **样式**：Tailwind CSS 4.1.18
- **UI 组件**：shadcn/ui + Radix UI
- **状态管理**：Zustand 5.0.10
- **路由**：React Router DOM 7.12.0
- **图标**：Lucide React
- **Markdown 渲染**：React Markdown + Remark GFM

### 后端技术栈

- **框架**：Tauri 2.0
- **语言**：Rust
- **插件**：Tauri Opener Plugin

### 存储

- **前端**：LocalStorage（Zustand 持久化）
- **后端**：SQLite（预留）

## 项目结构

```
LingFlow/
├── 📁 src/                          # React 前端源码
│   ├── 📁 components/
│   │   ├── 📁 layout/               # 布局组件
│   │   │   ├── Layout.tsx           # 主布局容器
│   │   │   └── Sidebar.tsx          # 侧边导航栏
│   │   ├── 📁 reader/               # 阅读器组件
│   │   │   ├── ArticleContent.tsx   # 文章内容渲染
│   │   │   └── WordPopover.tsx      # 划词浮层
│   │   └── 📁 ui/                   # shadcn/ui 组件库
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── popover.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       └── tooltip.tsx
│   ├── 📁 pages/                    # 页面组件
│   │   ├── ReaderPage.tsx           # 阅读页面
│   │   ├── VocabularyPage.tsx       # 生词本页面
│   │   └── ReviewPage.tsx           # 每日复习页面
│   ├── 📁 store/                    # Zustand 状态管理
│   │   ├── wordStore.ts             # 生词状态管理
│   │   ├── articleStore.ts          # 文章状态管理
│   │   └── selectionStore.ts        # 划词选择状态
│   ├── 📁 types/                    # TypeScript 类型定义
│   │   └── index.ts                 # 核心类型定义
│   ├── 📁 lib/                      # 工具函数
│   │   └── utils.ts                 # 通用工具函数
│   ├── main.tsx                     # 应用入口
│   └── vite-env.d.ts                # Vite 类型定义
│
├── 📁 src-tauri/                    # Rust 后端源码
│   ├── 📁 src/
│   │   └── lib.rs                   # Tauri 命令实现
│   ├── 📁 capabilities/
│   │   └── default.json             # 权限配置
│   ├── 📁 gen/                      # 自动生成的平台代码
│   │   ├── 📁 apple/                # iOS/macOS 项目
│   │   └── 📁 android/              # Android 项目
│   ├── Cargo.toml                   # Rust 依赖配置
│   └── tauri.conf.json              # Tauri 配置文件
│
├── 📁 public/                       # 静态资源
├── 📄 index.html                    # HTML 模板
├── 📄 package.json                  # Node.js 依赖配置
├── 📄 tsconfig.json                 # TypeScript 配置
├── 📄 vite.config.ts                # Vite 配置
├── 📄 tailwind.config.js            # Tailwind 配置
├── 📄 README.md                     # 项目说明
├── 📄 MOBILE_OPTIMIZATION.md        # 移动端优化文档
└── 📄 MVP_DOCUMENTATION.md          # 本文档
```

### 关键文件说明

| 文件                                    | 作用                 | 重要程度   |
| --------------------------------------- | -------------------- | ---------- |
| `src/main.tsx`                          | 应用入口，路由配置   | ⭐⭐⭐⭐⭐ |
| `src/store/wordStore.ts`                | 生词状态管理核心逻辑 | ⭐⭐⭐⭐⭐ |
| `src/components/reader/WordPopover.tsx` | 划词功能核心组件     | ⭐⭐⭐⭐⭐ |
| `src-tauri/src/lib.rs`                  | Rust 后端命令实现    | ⭐⭐⭐⭐⭐ |
| `src/types/index.ts`                    | TypeScript 类型定义  | ⭐⭐⭐⭐   |

---

## 核心功能

### 功能概览图

```
┌─────────────────────────────────────────────────────────┐
│                    LingFlow 功能矩阵                     │
├──────────────┬──────────────┬──────────────┬───────────┤
│  内容输入    │  词汇学习    │  复习管理    │  数据管理 │
├──────────────┼──────────────┼──────────────┼───────────┤
│ ✅ URL 加载  │ ✅ 划词查询  │ ✅ 智能复习  │ ✅ 本地存储│
│ ✅ 文本粘贴  │ ✅ 生词保存  │ ✅ 进度追踪  │ ⚪ 云同步  │
│ ✅ MD 支持   │ ✅ 搜索管理  │ ⚪ 导出功能  │ ⚪ 导入导出│
│ ⚪ 文件导入  │ ⚪ 标签分类  │ ⚪ 统计报表  │ ⚪ 备份恢复│
└──────────────┴──────────────┴──────────────┴───────────┘

图例：✅ 已实现 | ⚪ 计划中 | ❌ 未计划
```

### P0 核心功能（已实现）

#### 1. 技术英文阅读器

**功能描述**：

- 支持多种内容导入方式：
  - URL 加载：直接输入文章链接，自动抓取内容
  - 文本粘贴：支持纯文本和 Markdown 格式
- 文章内容渲染：
  - Markdown 支持
  - 响应式设计
  - 移动端优化

**技术实现**：

- 使用 React Markdown 渲染
- 支持语法高亮
- 响应式布局适配

#### 2. 划词解释浮层

**功能描述**：

- 鼠标划词触发：选中单词后自动显示解释浮层
- 双击单词触发：快速查看单词解释
- 解释内容：
  - 英文释义
  - 中文翻译
  - 词性标注

**技术实现**：

- 监听选择事件
- 计算位置显示浮层
- 集成词典 API 接口

#### 3. 生词保存功能

**功能描述**：

- 一键保存：点击星标图标保存单词
- 本地存储：使用 LocalStorage 持久化
- 管理界面：在生词本页面查看和管理

**技术实现**：

- Zustand 状态管理
- LocalStorage 持久化
- 可搜索的词汇列表

#### 4. 生词本

**功能描述**：

- 时间倒序列表：最新保存的单词在最前
- 搜索功能：支持按单词搜索
- 详情查看：点击单词查看完整解释和例句

**技术实现**：

- React 列表组件
- 搜索过滤功能
- 本地存储操作

### P1 功能（已实现）

#### 5. 每日轻量复习

**功能描述**：

- 智能选词：随机 + 最近优先选词
- 问答式复习：单词配对练习
- 进度追踪：记录学习进度

**技术实现**：

- 复习算法：随机 + 频率算法
- 问答组件：交互式复习界面
- 数据统计：学习进度追踪

## 核心功能

### P0 核心功能（已实现）

### 1. 技术英文阅读器 📖

**功能描述**：
支持多种内容导入方式：

- **URL 加载**：直接输入技术文章 URL，自动抓取和解析内容
- **文本粘贴**：支持纯文本和 Markdown 格式直接粘贴
- **内容渲染**：
  - 完整 Markdown 支持（GitHub Flavored Markdown）
  - 代码块语法高亮
  - 响应式排版

**用户流程**：

```
用户输入 URL/文本
    ↓
[加载内容] → [解析 HTML] → [转换为 Markdown]
    ↓
[渲染文章] → [用户阅读] → [划词查询]
```

**技术实现**：

- 前端：React Markdown + Remark GFM
- 后端：Rust scraper + html2md
- 支持 GitHub、Medium、技术博客等主流平台

**代码示例**：

```typescript
// src/pages/ReaderPage.tsx
const handleLoadUrl = async () => {
  const result = await invoke<ArticleResult>("fetch_article", { url });
  setArticle({
    title: result.title,
    content: result.content,
    source: url,
  });
};
```

### 2. 划词解释浮层 🔍

**功能描述**：

- **触发方式**：
  - 鼠标划选：选中单词后自动显示浮层
  - 双击选词：双击单词快速查询
  - 触摸选词：移动端长按触发
- **解释内容**：
  - 英文释义
  - 中文翻译
  - 技术语境说明
- **交互操作**：
  - 一键保存到生词本
  - 查看完整例句

**技术实现**：

```typescript
// src/components/reader/WordPopover.tsx
const handleSelection = async () => {
  const selection = window.getSelection();
  const word = selection.toString().trim();

  // 调用 Tauri 后端查询
  const explanation = await invoke<ExplainResponse>("explain_word", {
    word,
    sentence: getCurrentSentence(),
  });

  // 显示浮层
  showPopover(word, explanation);
};
```

**性能优化**：

- 防抖处理：避免频繁触发查询
- 缓存机制：已查询词汇缓存到内存
- 位置计算：智能浮层定位，避免遮挡

### 3. 生词保存功能 ⭐

**功能描述**：

- 一键保存：点击星标图标保存单词
- 本地存储：使用 LocalStorage 持久化
- 管理界面：在生词本页面查看和管理

**技术实现**：

- Zustand 状态管理
- LocalStorage 持久化
- 可搜索的词汇列表

#### 4. 生词本

**功能描述**：

- 时间倒序列表：最新保存的单词在最前
- 搜索功能：支持按单词搜索
- 详情查看：点击单词查看完整解释和例句

**技术实现**：

- React 列表组件
- 搜索过滤功能
- 本地存储操作

### P1 功能（已实现）

#### 5. 每日轻量复习

**功能描述**：

- 智能选词：随机 + 最近优先选词
- 问答式复习：单词配对练习
- 进度追踪：记录学习进度

**技术实现**：

- 复习算法：随机 + 频率算法
- 问答组件：交互式复习界面
- 数据统计：学习进度追踪

## 界面设计

### 主界面布局

```
┌─────────────────┬─────────────────────────────┐
│                 │                             │
│  侧边导航       │       阅读区域              │
│                 │                             │
│  • 阅读器       │                             │
│  • 生词本       │  [文章内容渲染]            │
│  • 复习         │                             │
│                 │                             │
│                 │                             │
└─────────────────┴─────────────────────────────┘
```

### 响应式设计

- **桌面端**：双栏布局（侧边栏 + 内容区）
- **移动端**：单栏布局（导航隐藏/折叠）
- **断点**：
  - 768px 以下：移动端布局
  - 768px 以上：桌面端布局

## 运行方式

### 开发模式

```bash
cd /Users/ligang/src/gitea/LingFlow
pnpm tauri dev
```

### 生产构建

```bash
cd /Users/ligang/src/gitea/LingFlow
pnpm tauri build
```

## 数据存储

### 前端存储

```typescript
// 单词数据结构
interface WordData {
  id: string;
  word: string;
  definition: string;
  translation: string;
  examples: string[];
  partOfSpeech: string;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  reviewedAt: string;
}

// 文章状态
interface ArticleState {
  url: string;
  content: string;
  title: string;
  loading: boolean;
}

// 选择状态
interface SelectionState {
  word: string;
  definition: string;
  show: boolean;
  position: { x: number; y: number };
}
```

### 数据存储位置

- **LocalStorage 键名**：
  - `lingflow_words`: 生词列表
  - `lingflow_lastPosition`: 最后阅读位置
  - `lingflow_settings`: 应用设置

## 性能优化

### 已实现优化

1. **延迟加载**：组件按需加载
2. **虚拟列表**：大量单词列表的性能优化
3. **防抖搜索**：减少 API 调用次数
4. **缓存策略**：页面数据缓存

### 待优化

1. **图片懒加载**：优化图片显示
2. **离线支持**：Service Worker 实现
3. **本地搜索**：全文搜索功能
4. **性能监控**：用户行为分析

## 移动端优化

### 触摸交互

- 双击选词：优化触摸设备体验
- 手势识别：滑动导航
- 缩放支持：文字缩放

### 响应式布局

- 单栏布局设计
- 触摸友好的组件
- 自适应字体大小

## 安全考虑

### 内容安全

- 禁用 HTML 渲染：防止 XSS 攻击
- 内容过滤：去除危险标签
- 链接安全：外部链接处理

### 权限控制

- 文件系统访问：仅允许指定目录
- 网络请求：CSP 配置
- 数据加密：敏感数据加密存储

## 未来规划

### 功能扩展

1. **AI 服务接入**：接入 OpenAI 等 AI 服务
2. **SQLite 持久化**：升级本地存储方案
3. **云同步**：用户账户系统和云同步
4. **多语言支持**：扩展语言范围

### 性能优化

1. **离线阅读**：文章下载和离线阅读
2. **导出功能**：单词列表导出
3. **打印优化**：打印样式支持
4. **主题切换**：暗色/亮色主题

### 集成功能

1. **浏览器扩展**：Chrome 扩展支持
2. **API 接口**：第三方应用集成
3. **插件系统**：可扩展功能插件

## 版本历史

### v1.0.0 (MVP) - 当前版本

**发布日期**：2026 年

**功能特性**：

- ✅ 技术英文阅读器
- ✅ 划词解释浮层
- ✅ 生词保存功能
- ✅ 生词本管理
- ✅ 每日复习功能

**改进点**：

- 初始版本发布
- 基础功能实现
- 界面优化

## 联系方式

如有问题或建议，请通过以下方式联系：

- **项目仓库**：[GitHub Repository]
- **邮件**：[Email Address]
- **文档**：[Documentation Link]

---

_本文档详细描述了 LingFlow 的 MVP 版本，包括技术架构、核心功能、用户界面和使用方法。_
