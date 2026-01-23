// 生词记录
export interface Word {
  id: string;
  word: string;
  sentence: string; // 所在句子
  paragraph?: string; // 原始段落（可选）
  source: string; // 来源（URL / 文档名）
  sourceTitle?: string; // 来源标题
  createdAt: number; // 保存时间戳
  // AI 解释
  explanation?: {
    english: string; // 英文简要解释
    chinese: string; // 中文解释
    technicalNote?: string; // 技术语境说明
  };
  // 复习相关
  reviewCount: number; // 复习次数
  lastReviewedAt?: number; // 上次复习时间
}

// 文章内容
export interface Article {
  id: string;
  title: string;
  content: string; // Markdown 或纯文本
  source?: string; // URL 来源
  createdAt: number;
}

// 划词选择信息
export interface SelectionInfo {
  word: string;
  sentence: string;
  paragraph: string;
  position: {
    x: number;
    y: number;
  };
}

// AI 解释请求
export interface ExplainRequest {
  word: string;
  sentence: string;
  context?: string; // 技术领域上下文
}

// AI 解释响应
export interface ExplainResponse {
  english: string;
  chinese: string;
  technicalNote?: string;
}

// 每日复习
export interface ReviewSession {
  date: string; // YYYY-MM-DD
  words: Word[];
  completed: boolean;
}
