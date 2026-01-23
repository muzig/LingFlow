import { useState } from "react";
import { Search, Trash2, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWordStore } from "@/store/wordStore";
import type { Word } from "@/types";

export function VocabularyPage() {
  const [search, setSearch] = useState("");
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const { words, searchWords, removeWord } = useWordStore();

  const displayWords = search ? searchWords(search) : words;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 border-b px-4 md:px-6 py-3 md:py-4 bg-background">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0">
          <div>
            <h1 className="text-lg md:text-xl font-semibold">生词本</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              已收录 {words.length} 个词汇
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索单词、来源..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 md:h-10"
            />
          </div>
        </div>
      </header>

      <div 
        className="flex-1 overflow-auto p-4 md:p-6"
        style={{
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom) + 4rem)', // padding + 安全区域 + 底部导航
        }}
      >
        {displayWords.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground px-4">
            {search ? (
              <p className="text-sm md:text-base">没有找到匹配的词汇</p>
            ) : (
              <div className="text-center">
                <p className="mb-2 text-sm md:text-base">生词本是空的</p>
                <p className="text-xs md:text-sm">阅读文章时，点击单词旁的 ⭐ 即可收藏</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayWords.map((word) => (
              <Card
                key={word.id}
                className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
                onClick={() => setSelectedWord(word)}
              >
                <CardHeader className="pb-2 p-4 md:p-6">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base md:text-lg">{word.word}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWord(word.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Button>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs md:text-sm">
                    {word.explanation?.chinese || word.sentence}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground">
                    <span className="truncate max-w-[60%]">
                      {word.sourceTitle || word.source}
                    </span>
                    <span>{formatDate(word.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 词汇详情弹窗 */}
      <Dialog open={!!selectedWord} onOpenChange={() => setSelectedWord(null)}>
        <DialogContent className="max-w-lg w-[calc(100vw-2rem)] md:w-full">
          {selectedWord && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl">
                  {selectedWord.word}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {selectedWord.explanation?.chinese}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 md:space-y-4 max-h-[60vh] md:max-h-none overflow-y-auto">
                {selectedWord.explanation?.english && (
                  <div>
                    <h4 className="text-xs md:text-sm font-medium mb-1">English</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {selectedWord.explanation.english}
                    </p>
                  </div>
                )}

                {selectedWord.explanation?.technicalNote && (
                  <div>
                    <h4 className="text-xs md:text-sm font-medium mb-1">技术语境</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {selectedWord.explanation.technicalNote}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-xs md:text-sm font-medium mb-1">原句</h4>
                  <p className="text-xs md:text-sm bg-muted p-2.5 md:p-3 rounded-lg leading-relaxed">
                    {selectedWord.sentence.split(selectedWord.word).map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <mark className="bg-yellow-200 dark:bg-yellow-900 px-0.5 rounded">
                            {selectedWord.word}
                          </mark>
                        )}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0 text-xs md:text-sm text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    {selectedWord.source && (
                      <>
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[250px] md:max-w-[200px]">
                          {selectedWord.sourceTitle || selectedWord.source}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-xs">复习 {selectedWord.reviewCount} 次</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
