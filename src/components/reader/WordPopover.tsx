import { useState, useEffect } from "react";
import { Star, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelectionStore } from "@/store/selectionStore";
import { useWordStore } from "@/store/wordStore";
import { useArticleStore } from "@/store/articleStore";
import { cn } from "@/lib/utils";

export function WordPopover() {
  const {
    selection,
    isPopoverOpen,
    explanation,
    isExplaining,
    setPopoverOpen,
    setExplanation,
    setIsExplaining,
  } = useSelectionStore();

  const { addWord, getWordByText } = useWordStore();
  const { currentArticle } = useArticleStore();

  const [isSaved, setIsSaved] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 检查是否已保存
  useEffect(() => {
    if (selection) {
      const existing = getWordByText(selection.word);
      setIsSaved(!!existing);
    }
  }, [selection, getWordByText]);

  // 计算浮层位置
  useEffect(() => {
    if (selection && isPopoverOpen) {
      const isMobile = window.innerWidth < 768;
      const padding = isMobile ? 8 : 16;
      const popoverWidth = isMobile ? Math.min(window.innerWidth - padding * 2, 320) : 320;
      const popoverHeight = 280;

      let x = selection.position.x;
      let y = selection.position.y + 10;

      // 移动端优化：居中显示或靠近选择位置
      if (isMobile) {
        // 在移动端，优先考虑垂直方向的位置
        const spaceBelow = window.innerHeight - selection.position.y;
        const spaceAbove = selection.position.y;
        
        // 水平居中
        x = (window.innerWidth - popoverWidth) / 2;
        
        // 垂直位置：优先在下方，空间不足时显示在上方
        if (spaceBelow > popoverHeight + 60) {
          y = selection.position.y + 40; // 在选择下方留更多空间
        } else if (spaceAbove > popoverHeight + 60) {
          y = selection.position.y - popoverHeight - 40;
        } else {
          // 空间都不足时，垂直居中显示
          y = (window.innerHeight - popoverHeight) / 2;
        }
      } else {
        // 桌面端逻辑保持不变
        // 防止超出右边界
        if (x + popoverWidth > window.innerWidth - padding) {
          x = window.innerWidth - popoverWidth - padding;
        }

        // 防止超出左边界
        if (x < padding) {
          x = padding;
        }

        // 防止超出下边界，改为显示在上方
        if (y + popoverHeight > window.innerHeight - padding) {
          y = selection.position.y - popoverHeight - 10;
        }
      }

      setPosition({ x, y });
    }
  }, [selection, isPopoverOpen]);

  // 获取 AI 解释
  useEffect(() => {
    if (selection && isPopoverOpen && !explanation && !isExplaining) {
      fetchExplanation();
    }
  }, [selection, isPopoverOpen]);

  const fetchExplanation = async () => {
    if (!selection) return;

    setIsExplaining(true);
    try {
      const { invoke } = await import("@tauri-apps/api/core");
      const result = await invoke<{
        english: string;
        chinese: string;
        technical_note?: string;
      }>("explain_word", {
        word: selection.word,
        sentence: selection.sentence,
      });

      setExplanation({
        english: result.english,
        chinese: result.chinese,
        technicalNote: result.technical_note,
      });
    } catch (error) {
      console.error("Failed to get explanation:", error);
      // 使用占位解释
      setExplanation({
        english: `Definition of "${selection.word}" in technical context.`,
        chinese: `"${selection.word}" 的技术含义。`,
      });
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSave = () => {
    if (!selection) return;

    addWord({
      word: selection.word,
      sentence: selection.sentence,
      paragraph: selection.paragraph,
      source: currentArticle?.source || "",
      sourceTitle: currentArticle?.title,
      explanation: explanation || undefined,
    });

    setIsSaved(true);
  };

  const handleClose = () => {
    setPopoverOpen(false);
  };

  if (!selection || !isPopoverOpen) return null;

  const isMobile = window.innerWidth < 768;

  return (
    <>
      {/* 背景遮罩 - 点击关闭 */}
      <div
        className="fixed inset-0 z-40 bg-black/20 md:bg-transparent"
        onClick={handleClose}
      />

      {/* 浮层 */}
      <div
        className={cn(
          "fixed z-50 bg-popover border rounded-lg shadow-lg animate-in fade-in duration-200",
          isMobile ? "slide-in-from-bottom-4 w-[calc(100vw-1rem)]" : "zoom-in-95 w-80"
        )}
        style={{
          left: position.x,
          top: position.y,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-semibold text-base md:text-lg">{selection.word}</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 md:h-9 md:w-9",
                isSaved && "text-yellow-500 hover:text-yellow-600"
              )}
              onClick={handleSave}
              disabled={isSaved}
            >
              <Star className={cn("w-4 h-4", isSaved && "fill-current")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:h-9 md:w-9"
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 内容 */}
        <div className="p-3 space-y-3 max-h-[200px] md:max-h-[250px] overflow-y-auto">
          {isExplaining ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : explanation ? (
            <>
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {explanation.english}
                </p>
              </div>

              <div>
                <p className="text-sm md:text-base">{explanation.chinese}</p>
              </div>

              {explanation.technicalNote && (
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  💡 {explanation.technicalNote}
                </div>
              )}
            </>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">
              获取解释中...
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="px-3 py-2 border-t text-xs text-muted-foreground">
          {isSaved ? "✓ 已保存到生词本" : "点击 ⭐ 保存到生词本"}
        </div>
      </div>
    </>
  );
}
