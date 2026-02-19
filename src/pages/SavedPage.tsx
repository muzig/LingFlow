import { useState } from "react";
import { Trash2, FileText, Globe, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSavedArticleStore } from "@/store/savedArticleStore";
import { useArticleStore } from "@/store/articleStore";
import type { Article } from "@/types";
import { cn } from "@/lib/utils";

export function SavedPage() {
  const { articles, removeArticle } = useSavedArticleStore();
  const { currentArticle, loadSavedArticle } = useArticleStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleArticleClick = (article: Article) => {
    loadSavedArticle(article);
  };

  const handleBackToList = () => {
    loadSavedArticle(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "今天";
    } else if (diffDays === 1) {
      return "昨天";
    } else if (diffDays < 7) {
      return `${diffDays} 天前`;
    } else {
      return date.toLocaleDateString("zh-CN", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // 如果有当前文章（从收藏夹打开），显示阅读视图
  if (currentArticle) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <header className="flex-shrink-0 border-b px-4 md:px-6 py-3 md:py-4 bg-background">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackToList}
              className="h-8 w-8"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-base md:text-lg font-semibold truncate">
                {currentArticle.title}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {currentArticle.source || "本地文档"}
              </p>
            </div>
          </div>
        </header>

        <div
          className="flex-1 overflow-auto p-4 md:p-6 bg-background"
          style={{
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom) + 4rem)',
          }}
        >
          <article className="max-w-3xl mx-auto prose dark:prose-invert prose-sm md:prose-base">
            <div className="whitespace-pre-wrap">
              {currentArticle.content}
            </div>
          </article>
        </div>
      </div>
    );
  }

  // 否则显示收藏列表
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <header className="flex-shrink-0 border-b px-4 md:px-6 py-3 md:py-4 bg-background">
        <h1 className="text-lg md:text-xl font-semibold">收藏文章</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          已保存 {articles.length} 篇文章
        </p>
      </header>

      <div
        className="flex-1 overflow-auto p-4 md:p-6"
        style={{
          paddingBottom: 'calc(1rem + env(safe-area-inset-bottom) + 4rem)',
        }}
      >
        {articles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground px-4">
            <FileText className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm md:text-base mb-2">暂无收藏文章</p>
            <p className="text-xs md:text-sm text-center max-w-sm">
              在阅读页面加载 URL 或粘贴文本后，文章会自动保存到这里
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card
                key={article.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  "active:scale-[0.98]",
                  hoveredId === article.id && "ring-2 ring-primary"
                )}
                onClick={() => handleArticleClick(article)}
                onMouseEnter={() => setHoveredId(article.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <CardHeader className="pb-2 p-4 md:p-5">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm md:text-base line-clamp-2 leading-snug">
                      {article.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 md:h-8 md:w-8 flex-shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeArticle(article.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-5 pt-0">
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 mb-3">
                    {truncateText(article.content.replace(/[#*`\[\]]/g, "").substring(0, 200), 100)}
                  </p>
                  <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      {article.source ? (
                        <>
                          <Globe className="w-3 h-3" />
                          <span className="truncate max-w-[120px] md:max-w-[160px]">
                            {article.source.replace(/^https?:\/\//, "").split("/")[0]}
                          </span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3 h-3" />
                          <span>本地文档</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
