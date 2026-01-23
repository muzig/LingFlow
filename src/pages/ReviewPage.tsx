import { useState, useEffect } from "react";
import { RefreshCw, ChevronRight, Check, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useWordStore } from "@/store/wordStore";
import type { Word } from "@/types";

export function ReviewPage() {
  const { words, getWordsForReview, markReviewed } = useWordStore();
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startReview = () => {
    const wordsToReview = getWordsForReview(5);
    setReviewWords(wordsToReview);
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted(false);
  };

  useEffect(() => {
    if (words.length > 0 && reviewWords.length === 0) {
      startReview();
    }
  }, [words]);

  const currentWord = reviewWords[currentIndex];

  const handleNext = () => {
    if (currentWord) {
      markReviewed(currentWord.id);
    }

    if (currentIndex < reviewWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  // 没有可复习的词汇
  if (words.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <header className="border-b px-6 py-4">
          <h1 className="text-xl font-semibold">每日复习</h1>
          <p className="text-sm text-muted-foreground mt-1">
            巩固你的技术词汇
          </p>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">还没有收藏任何词汇</p>
            <p className="text-sm">阅读文章并收藏生词后，就可以开始复习了</p>
          </div>
        </div>
      </div>
    );
  }

  // 复习完成
  if (completed) {
    return (
      <div className="h-full flex flex-col">
        <header className="border-b px-6 py-4">
          <h1 className="text-xl font-semibold">每日复习</h1>
          <p className="text-sm text-muted-foreground mt-1">
            巩固你的技术词汇
          </p>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>复习完成！</CardTitle>
              <CardDescription>
                今天复习了 {reviewWords.length} 个词汇
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button onClick={startReview} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                再来一轮
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <header className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">每日复习</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {currentIndex + 1} / {reviewWords.length}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={startReview}>
            <RefreshCw className="w-4 h-4 mr-2" />
            重新开始
          </Button>
        </div>

        {/* 进度条 */}
        <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / reviewWords.length) * 100}%`,
            }}
          />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        {currentWord && (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardDescription>
                In the context of technical documentation:
              </CardDescription>
              <CardTitle className="text-3xl mt-2">{currentWord.word}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 问题：原句（单词被遮盖） */}
              <div>
                <h4 className="text-sm font-medium mb-2">原句：</h4>
                <p className="text-muted-foreground bg-muted p-4 rounded-lg">
                  {currentWord.sentence.split(currentWord.word).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="bg-primary text-primary-foreground px-2 rounded">
                          {currentWord.word}
                        </span>
                      )}
                    </span>
                  ))}
                </p>
              </div>

              {/* 答案区域 */}
              {showAnswer ? (
                <div className="space-y-3 animate-in fade-in duration-300">
                  {currentWord.explanation?.english && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">English</h4>
                      <p className="text-muted-foreground">
                        {currentWord.explanation.english}
                      </p>
                    </div>
                  )}

                  {currentWord.explanation?.chinese && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">中文</h4>
                      <p className="text-muted-foreground">
                        {currentWord.explanation.chinese}
                      </p>
                    </div>
                  )}

                  {currentWord.explanation?.technicalNote && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">技术语境</h4>
                      <p className="text-muted-foreground">
                        {currentWord.explanation.technicalNote}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    想想这个词在技术语境中的含义...
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="justify-between">
              <Button
                variant="outline"
                onClick={() => setShowAnswer(!showAnswer)}
                className="gap-2"
              >
                {showAnswer ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    隐藏答案
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    显示答案
                  </>
                )}
              </Button>

              <Button onClick={handleNext} className="gap-2">
                {currentIndex < reviewWords.length - 1 ? "下一个" : "完成"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
