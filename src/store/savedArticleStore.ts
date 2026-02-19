import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Article } from "@/types";

interface SavedArticleState {
  articles: Article[];
  addArticle: (article: Article) => void;
  removeArticle: (id: string) => void;
  getArticleBySource: (source: string) => Article | undefined;
  getArticleByContent: (content: string) => Article | undefined;
}

const generateContentHash = (content: string): string => {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

export const useSavedArticleStore = create<SavedArticleState>()(
  persist(
    (set, get) => ({
      articles: [],

      addArticle: (article) => {
        const existing = get().articles.find((a) => a.id === article.id);
        if (existing) return;

        set((state) => ({
          articles: [article, ...state.articles],
        }));
      },

      removeArticle: (id) => {
        set((state) => ({
          articles: state.articles.filter((a) => a.id !== id),
        }));
      },

      getArticleBySource: (source) => {
        if (!source) return undefined;
        return get().articles.find((a) => a.source === source);
      },

      getArticleByContent: (content) => {
        const hash = generateContentHash(content);
        return get().articles.find((a) => generateContentHash(a.content) === hash);
      },
    }),
    {
      name: "lingflow-saved-articles",
    }
  )
);
