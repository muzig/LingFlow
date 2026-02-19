import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Word } from "@/types";

interface WordState {
  words: Word[];
  addWord: (word: Omit<Word, "id" | "createdAt" | "reviewCount">) => void;
  removeWord: (id: string) => void;
  updateWord: (id: string, updates: Partial<Word>) => void;
  getWordByText: (text: string) => Word | undefined;
  searchWords: (query: string) => Word[];
  getRecentWords: (limit?: number) => Word[];
  getWordsForReview: (count?: number) => Word[];
  markReviewed: (id: string) => void;
}

export const useWordStore = create<WordState>()(
  persist(
    (set, get) => ({
      words: [],

      addWord: (wordData) => {
        const newWord: Word = {
          ...wordData,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          reviewCount: 0,
        };
        set((state) => ({
          words: [newWord, ...state.words],
        }));
      },

      removeWord: (id) => {
        set((state) => ({
          words: state.words.filter((w) => w.id !== id),
        }));
      },

      updateWord: (id, updates) => {
        set((state) => ({
          words: state.words.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));
      },

      getWordByText: (text) => {
        return get().words.find(
          (w) => w.word.toLowerCase() === text.toLowerCase()
        );
      },

      searchWords: (query) => {
        const q = query.toLowerCase();
        return get().words.filter(
          (w) =>
            w.word.toLowerCase().includes(q) ||
            w.source.toLowerCase().includes(q) ||
            w.sentence.toLowerCase().includes(q)
        );
      },

      getRecentWords: (limit = 50) => {
        return [...get().words]
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, limit);
      },

      // 获取需要复习的词汇：随机 + 最近优先
      getWordsForReview: (count = 5) => {
        const allWords = get().words;
        if (allWords.length === 0) return [];

        // 按复习次数和最后复习时间排序，优先复习次数少的和最近添加的
        const sorted = [...allWords].sort((a, b) => {
          // 首先按复习次数排序
          if (a.reviewCount !== b.reviewCount) {
            return a.reviewCount - b.reviewCount;
          }
          // 复习次数相同，优先最近添加的
          return b.createdAt - a.createdAt;
        });

        // 取前 count * 2 个，然后随机选择 count 个
        const candidates = sorted.slice(0, count * 2);
        const shuffled = candidates.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
      },

      markReviewed: (id) => {
        set((state) => ({
          words: state.words.map((w) =>
            w.id === id
              ? {
                  ...w,
                  reviewCount: w.reviewCount + 1,
                  lastReviewedAt: Date.now(),
                }
              : w
          ),
        }));
      },
    }),
    {
      name: "lingflow-words",
    }
  )
);
