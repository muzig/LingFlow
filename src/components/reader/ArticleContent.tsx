import { useCallback, useRef, useState, useEffect } from "react";
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
  
  // 触摸相关状态
  const [touchStartTime, setTouchStartTime] = useState(0);
  const [touchTimer, setTouchTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 处理选中的文本并显示浮层
  const processSelection = useCallback(() => {
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

    // 在移动端不立即清除选中状态，让用户看到选中效果
    if (!isMobile) {
      selection.removeAllRanges();
    }
  }, [setSelection, isMobile]);

  // 处理文本选择（鼠标事件 - 桌面端）
  const handleMouseUp = useCallback(() => {
    if (isMobile) return; // 移动端不使用鼠标事件
    processSelection();
  }, [processSelection, isMobile]);

  // 处理双击选词（桌面端）
  const handleDoubleClick = useCallback(() => {
    if (isMobile) return; // 移动端不使用双击
    // 双击后浏览器会自动选中单词，等待 selection 更新后再处理
    setTimeout(() => {
      processSelection();
    }, 10);
  }, [processSelection, isMobile]);

  // 触摸开始（移动端）
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    const time = Date.now();
    setTouchStartTime(time);
    
    // 清除之前的定时器
    if (touchTimer) {
      clearTimeout(touchTimer);
    }
    
    // 设置长按定时器（500ms）
    const timer = setTimeout(() => {
      // 长按后选择触摸点的单词
      const touch = e.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (element && element.nodeType === Node.TEXT_NODE || element.textContent) {
        // 尝试选择触摸点的单词
        const range = document.caretRangeFromPoint(touch.clientX, touch.clientY);
        if (range) {
          selectWordAtPoint(range);
        }
      }
    }, 500);
    
    setTouchTimer(timer);
  }, [isMobile, touchTimer]);

  // 触摸结束（移动端）
  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;
    
    if (touchTimer) {
      clearTimeout(touchTimer);
    }
    
    const touchDuration = Date.now() - touchStartTime;
    
    // 如果是短按（不到500ms），检查是否有文本被选中
    if (touchDuration < 500) {
      // 短暂延迟，等待系统选择完成
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
          processSelection();
        }
      }, 50);
    } else {
      // 长按后也处理选择
      setTimeout(() => {
        processSelection();
      }, 50);
    }
  }, [isMobile, touchTimer, touchStartTime, processSelection]);

  // 选择触摸点的单词
  const selectWordAtPoint = (range: Range) => {
    const textNode = range.startContainer;
    const offset = range.startOffset;
    
    if (textNode.nodeType !== Node.TEXT_NODE || !textNode.textContent) {
      return;
    }
    
    const text = textNode.textContent;
    let start = offset;
    let end = offset;
    
    // 向前找单词边界
    while (start > 0 && /[a-zA-Z-]/.test(text[start - 1])) {
      start--;
    }
    
    // 向后找单词边界
    while (end < text.length && /[a-zA-Z-]/.test(text[end])) {
      end++;
    }
    
    // 创建新的选择范围
    if (start < end) {
      const selection = window.getSelection();
      if (selection) {
        const newRange = document.createRange();
        newRange.setStart(textNode, start);
        newRange.setEnd(textNode, end);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  };

  const handleBack = () => {
    setCurrentArticle(null);
  };

  if (!currentArticle) return null;

  return (
    <div className="h-full flex flex-col">
      {/* 头部 */}
      <header className="border-b px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9 md:h-10 md:w-10">
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm md:text-base font-semibold truncate">{currentArticle.title}</h1>
          {currentArticle.source && (
            <a
              href={currentArticle.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] md:text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <ExternalLink className="w-2.5 h-2.5 md:w-3 md:h-3" />
              <span className="truncate">{currentArticle.source}</span>
            </a>
          )}
        </div>
      </header>

      {/* 文章内容 */}
      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div
          ref={contentRef}
          className="max-w-3xl mx-auto px-4 md:px-6 py-4 md:py-8"
          onMouseUp={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={{
            // 在移动端启用文本选择
            userSelect: isMobile ? 'text' : 'auto',
            WebkitUserSelect: isMobile ? 'text' : 'auto',
          }}
        >
          <article className="prose prose-sm md:prose-base">
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
