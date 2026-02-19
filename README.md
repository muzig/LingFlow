## 技术英语阅读器 MVP 已完成

### 项目结构

```
LingFlow/
├── src/                          # React 前端
│   ├── components/
│   │   ├── layout/               # 布局组件
│   │   │   ├── Layout.tsx        # 主布局
│   │   │   └── Sidebar.tsx       # 侧边导航
│   │   ├── reader/               # 阅读器组件
│   │   │   ├── ArticleContent.tsx # 文章内容渲染
│   │   │   └── WordPopover.tsx   # 划词浮层
│   │   └── ui/                   # shadcn/ui 组件
│   ├── pages/
│   │   ├── ReaderPage.tsx        # 阅读页面
│   │   ├── VocabularyPage.tsx    # 生词本页面
│   │   └── ReviewPage.tsx        # 每日复习页面
│   ├── store/                    # Zustand 状态管理
│   │   ├── wordStore.ts          # 生词存储
│   │   ├── articleStore.ts       # 文章状态
│   │   └── selectionStore.ts     # 划词选择状态
│   ├── types/                    # TypeScript 类型定义
│   └── lib/utils.ts              # 工具函数
└── src-tauri/                    # Rust 后端
    └── src/lib.rs                # URL 抓取 + AI 解释
```

### 已实现功能

**P0 功能：**

- 技术英文阅读器：支持 URL 加载和纯文本/Markdown 粘贴
- 划词解释浮层：鼠标划词/双击单词触发，显示英中解释
- 生词保存：⭐ 一键保存到本地
- 生词本：按时间倒序列表，支持搜索，点击查看详情

**P1 功能：**

- 每日轻量复习：随机 + 最近优先选词，问答式复习

### 技术栈

- **前端**: React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- **后端**: Tauri 2 + Rust
- **状态管理**: Zustand (持久化到 localStorage)
- **路由**: React Router DOM 7

### 运行方式

```bash
pnpm tauri dev   # 开发模式
pnpm tauri build # 构建生产版本
```

### 后续可扩展

1. **AI 服务接入**: `src-tauri/src/lib.rs` 中的 `explain_word` 函数已预留接口，可接入 OpenAI 等 AI 服务
2. **SQLite 持久化**: 当前使用 localStorage，可升级为 SQLite
3. **云同步**: 可添加用户账户系统和云同步功能

应用窗口应该已经打开了，你可以尝试：

1. 粘贴一篇英文技术文章 URL 或直接粘贴文本
2. 划词或双击单词查看解释
3. 点击 ⭐ 保存生词
4. 在生词本页面查看已保存的词汇
5. 在复习页面进行每日复习
