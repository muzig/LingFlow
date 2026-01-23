import { useState } from "react";
import { Link2, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useArticleStore } from "@/store/articleStore";
import { ArticleContent } from "@/components/reader/ArticleContent";

export function ReaderPage() {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const { currentArticle, loadFromUrl, loadFromText, isLoading, error } =
    useArticleStore();

  const handleLoadUrl = () => {
    if (url.trim()) {
      loadFromUrl(url.trim());
    }
  };

  const handleLoadText = () => {
    if (text.trim()) {
      loadFromText(text.trim());
    }
  };

  // 如果有文章，显示文章内容
  if (currentArticle) {
    return <ArticleContent />;
  }

  // 否则显示输入界面
  return (
    <div className="h-full flex flex-col pb-16 md:pb-0">
      <header className="border-b px-4 md:px-6 py-3 md:py-4">
        <h1 className="text-lg md:text-xl font-semibold">技术英语阅读器</h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          粘贴 URL 或文本开始阅读，划词即可查看解释
        </p>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 md:p-6 overflow-auto">
        <div className="w-full max-w-2xl">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-10 md:h-11">
              <TabsTrigger value="url" className="gap-1.5 md:gap-2 text-sm">
                <Link2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                URL
              </TabsTrigger>
              <TabsTrigger value="text" className="gap-1.5 md:gap-2 text-sm">
                <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
                文本
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="mt-3 md:mt-4">
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <Input
                    placeholder="粘贴文章 URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLoadUrl()}
                    className="flex-1 h-10 md:h-11 text-sm"
                  />
                  <Button 
                    onClick={handleLoadUrl} 
                    disabled={isLoading || !url.trim()}
                    className="h-10 md:h-11 w-full md:w-auto"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "加载"
                    )}
                  </Button>
                </div>
                <p className="text-[11px] md:text-xs text-muted-foreground">
                  支持 GitHub README、技术博客、Medium 等英文技术文章
                </p>
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-3 md:mt-4">
              <div className="space-y-3 md:space-y-4">
                <Textarea
                  placeholder="粘贴英文技术文章内容（支持 Markdown）..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[180px] md:min-h-[200px] font-mono text-xs md:text-sm"
                />
                <Button
                  onClick={handleLoadText}
                  disabled={!text.trim()}
                  className="w-full h-10 md:h-11"
                >
                  开始阅读
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="mt-3 md:mt-4 p-3 md:p-4 bg-destructive/10 text-destructive rounded-lg text-xs md:text-sm">
              {error}
            </div>
          )}

          {/* 示例内容提示 */}
          <div className="mt-6 md:mt-8 p-3 md:p-4 bg-muted rounded-lg">
            <h3 className="text-sm md:text-base font-medium mb-2">试试这些内容：</h3>
            <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
              <li>• GitHub 项目的 README 文件</li>
              <li>• 技术博客文章（如 Martin Fowler、Dan Abramov）</li>
              <li>• AI / ML 相关论文或文档</li>
              <li>• 系统设计相关文章</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
