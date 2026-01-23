import { useCallback, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useArticleStore } from "@/store/articleStore";
import { useSelectionStore } from "@/store/selectionStore";
import { WordPopover } from "./WordPopover";
import type { SelectionInfo } from "@/types";

export function ArticleContent() {
  const { currentArticle, setCurrentArticle } = useArticleStore();
  const { setSelection } = useSelectionStore();
  const contentRef = useRef<HTMLDivElement>(null);

  // 处理文本选择
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();

    // 只处理单词选择（不含空格，长度合理）
    if (!selectedText || selectedText.includes(" ") || selectedText.length > 30) {
      return;
    }

    // 检查是否为有效的英文单词
    if (!/^[a-zA-Z]+(-[a-zA-Z]+)*$/.test(selectedText)) {
      return;
    }

    // 获取选中位置
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // 获取所在句子
    const sentence = getSentenceFromSelection(selection);

    // 获取所在段落
    const paragraph = getParagraphFromSelection(selection);

    const selectionInfo: SelectionInfo = {
      word: selectedText.toLowerCase(),
      sentence,
      paragraph,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.bottom,
      },
    };

    setSelection(selectionInfo);

    // 清除选中状态
    selection.removeAllRanges();
  }, [setSelection]);

  // 处理双击选词
  const handleDoubleClick = useCallback(() => {
    // 双击后浏览器会自动选中单词，等待 selection 更新后再处理
    setTimeout(() => {
      handleMouseUp();
    }, 10);
  }, [handleMouseUp]);

  const handleBack = () => {
    setCurrentArticle(null);
  };

  if (!currentArticle) return null;

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <header className="border-b px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <h1 className="font-semibold truncate">{currentArticle.title}</h1>
          {currentArticle.source && (
            <a
              href={currentArticle.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="truncate">{currentArticle.source}</span>
            </a>
          )}
        </div>
      </header>

      {/* 文章内容 */}
      <div className="flex-1 overflow-auto">
        <div
          ref={contentRef}
          className="max-w-3xl mx-auto px-6 py-8"
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
        >
          <article className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {currentArticle.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>

      {/* 划词浮层 */}
      <WordPopover />
    </div>
  );
}

// 从选中内容获取所在句子
function getSentenceFromSelection(selection: Selection): string {
  const anchorNode = selection.anchorNode;
  if (!anchorNode || !anchorNode.textContent) {
    return selection.toString();
  }

  const text = anchorNode.textContent;
  const offset = selection.anchorOffset;

  // 找到句子的开始和结束
  let start = offset;
  let end = offset;

  // 向前找句子开始
  while (start > 0 && !/[.!?。！？]/.test(text[start - 1])) {
    start--;
  }

  // 向后找句子结束
  while (end < text.length && !/[.!?。！？]/.test(text[end])) {
    end++;
  }

  // 包含句末标点
  if (end < text.length) {
    end++;
  }

  return text.slice(start, end).trim();
}

// 从选中内容获取所在段落
function getParagraphFromSelection(selection: Selection): string {
  const anchorNode = selection.anchorNode;
  if (!anchorNode) {
    return selection.toString();
  }

  // 找到最近的段落元素
  let node: Node | null = anchorNode;
  while (node && node.nodeName !== "P" && node.parentNode) {
    node = node.parentNode;
  }

  if (node && node.textContent) {
    return node.textContent.trim();
  }

  return anchorNode.textContent?.trim() || selection.toString();
}
