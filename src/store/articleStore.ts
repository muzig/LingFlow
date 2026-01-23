import { create } from "zustand";
import type { Article } from "@/types";

interface ArticleState {
  currentArticle: Article | null;
  setCurrentArticle: (article: Article | null) => void;
  loadFromUrl: (url: string) => Promise<void>;
  loadFromText: (text: string, title?: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const useArticleStore = create<ArticleState>((set) => ({
  currentArticle: null,
  isLoading: false,
  error: null,

  setCurrentArticle: (article) => {
    set({ currentArticle: article, error: null });
  },

  loadFromUrl: async (url: string) => {
    set({ isLoading: true, error: null });
    try {
      // 调用 Tauri 后端获取网页内容
      const { invoke } = await import("@tauri-apps/api/core");
      const result = await invoke<{ title: string; content: string }>(
        "fetch_article",
        { url }
      );

      const article: Article = {
        id: crypto.randomUUID(),
        title: result.title || url,
        content: result.content,
        source: url,
        createdAt: Date.now(),
      };

      set({ currentArticle: article, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load URL",
        isLoading: false,
      });
    }
  },

  loadFromText: (text: string, title?: string) => {
    const article: Article = {
      id: crypto.randomUUID(),
      title: title || "Untitled Document",
      content: text,
      createdAt: Date.now(),
    };
    set({ currentArticle: article, error: null });
  },
}));
