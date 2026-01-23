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
    <div className="h-full flex flex-col">
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">生词本</h1>
            <p className="text-sm text-muted-foreground mt-1">
              已收录 {words.length} 个词汇
            </p>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索单词、来源..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {displayWords.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            {search ? (
              <p>没有找到匹配的词汇</p>
            ) : (
              <div className="text-center">
                <p className="mb-2">生词本是空的</p>
                <p className="text-sm">阅读文章时，点击单词旁的 ⭐ 即可收藏</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayWords.map((word) => (
              <Card
                key={word.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedWord(word)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{word.word}</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWord(word.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {word.explanation?.chinese || word.sentence}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
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
        <DialogContent className="max-w-lg">
          {selectedWord && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {selectedWord.word}
                </DialogTitle>
                <DialogDescription>
                  {selectedWord.explanation?.chinese}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {selectedWord.explanation?.english && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">English</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedWord.explanation.english}
                    </p>
                  </div>
                )}

                {selectedWord.explanation?.technicalNote && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">技术语境</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedWord.explanation.technicalNote}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium mb-1">原句</h4>
                  <p className="text-sm bg-muted p-3 rounded-lg">
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

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1">
                    {selectedWord.source && (
                      <>
                        <ExternalLink className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">
                          {selectedWord.sourceTitle || selectedWord.source}
                        </span>
                      </>
                    )}
                  </div>
                  <span>复习 {selectedWord.reviewCount} 次</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
