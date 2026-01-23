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
    <div className="h-full flex flex-col">
      <header className="border-b px-6 py-4">
        <h1 className="text-xl font-semibold">技术英语阅读器</h1>
        <p className="text-sm text-muted-foreground mt-1">
          粘贴 URL 或文本开始阅读，划词即可查看解释
        </p>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="gap-2">
                <Link2 className="w-4 h-4" />
                URL
              </TabsTrigger>
              <TabsTrigger value="text" className="gap-2">
                <FileText className="w-4 h-4" />
                文本
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="mt-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="粘贴文章 URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLoadUrl()}
                    className="flex-1"
                  />
                  <Button onClick={handleLoadUrl} disabled={isLoading || !url.trim()}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "加载"
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  支持 GitHub README、技术博客、Medium 等英文技术文章
                </p>
              </div>
            </TabsContent>

            <TabsContent value="text" className="mt-4">
              <div className="space-y-4">
                <Textarea
                  placeholder="粘贴英文技术文章内容（支持 Markdown）..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <Button
                  onClick={handleLoadText}
                  disabled={!text.trim()}
                  className="w-full"
                >
                  开始阅读
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 示例内容提示 */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">试试这些内容：</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
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
