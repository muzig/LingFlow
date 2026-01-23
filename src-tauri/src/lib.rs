use serde::{Deserialize, Serialize};
use scraper::{Html, Selector};

// 文章抓取结果
#[derive(Debug, Serialize, Deserialize)]
pub struct ArticleResult {
    pub title: String,
    pub content: String,
}

// AI 解释结果
#[derive(Debug, Serialize, Deserialize)]
pub struct ExplainResult {
    pub english: String,
    pub chinese: String,
    pub technical_note: Option<String>,
}

// 抓取网页文章
#[tauri::command]
async fn fetch_article(url: String) -> Result<ArticleResult, String> {
    // 获取网页内容
    let response = reqwest::get(&url)
        .await
        .map_err(|e| format!("Failed to fetch URL: {}", e))?;

    let html = response
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    // 解析 HTML
    let document = Html::parse_document(&html);

    // 提取标题
    let title = extract_title(&document).unwrap_or_else(|| url.clone());

    // 提取主要内容
    let content = extract_content(&document, &html);

    Ok(ArticleResult { title, content })
}

// 提取标题
fn extract_title(document: &Html) -> Option<String> {
    // 尝试多种标题选择器
    let selectors = [
        "h1",
        "article h1",
        ".article-title",
        ".post-title",
        "title",
        "meta[property='og:title']",
    ];

    for selector_str in selectors {
        if let Ok(selector) = Selector::parse(selector_str) {
            if let Some(element) = document.select(&selector).next() {
                if selector_str.contains("meta") {
                    if let Some(content) = element.value().attr("content") {
                        return Some(content.trim().to_string());
                    }
                } else {
                    let text = element.text().collect::<String>().trim().to_string();
                    if !text.is_empty() {
                        return Some(text);
                    }
                }
            }
        }
    }

    None
}

// 提取文章内容
fn extract_content(document: &Html, html: &str) -> String {
    // 尝试找到文章主体
    let content_selectors = [
        "article",
        "main article",
        ".post-content",
        ".article-content",
        ".markdown-body",
        ".entry-content",
        "main",
        ".content",
    ];

    for selector_str in content_selectors {
        if let Ok(selector) = Selector::parse(selector_str) {
            if let Some(element) = document.select(&selector).next() {
                let inner_html = element.inner_html();
                if inner_html.len() > 200 {
                    // 转换为 Markdown
                    return html2md::parse_html(&inner_html);
                }
            }
        }
    }

    // 如果找不到特定内容区域，转换整个 body
    if let Ok(selector) = Selector::parse("body") {
        if let Some(element) = document.select(&selector).next() {
            return html2md::parse_html(&element.inner_html());
        }
    }

    // 最后手段：转换整个 HTML
    html2md::parse_html(html)
}

// AI 解释单词
#[tauri::command]
async fn explain_word(word: String, sentence: String) -> Result<ExplainResult, String> {
    // TODO: 接入真实的 AI 服务（如 OpenAI API）
    // 目前返回模拟数据，方便前端开发

    // 模拟网络延迟
    tokio::time::sleep(tokio::time::Duration::from_millis(500)).await;

    // 生成模拟解释
    let english = format!(
        "A term commonly used in technical contexts to describe or refer to specific concepts or operations.",
    );

    let chinese = format!(
        "在技术语境中，\"{}\" 通常指代特定的概念或操作。这个词在编程和系统设计中经常出现。",
        word
    );

    let technical_note = Some(format!(
        "In the context of \"{}\", this term typically refers to {}.",
        truncate_sentence(&sentence, 50),
        get_technical_context(&word)
    ));

    Ok(ExplainResult {
        english,
        chinese,
        technical_note,
    })
}

fn truncate_sentence(s: &str, max_len: usize) -> String {
    if s.len() <= max_len {
        s.to_string()
    } else {
        format!("{}...", &s[..max_len])
    }
}

fn get_technical_context(word: &str) -> &'static str {
    // 简单的技术词汇上下文映射
    match word.to_lowercase().as_str() {
        "api" => "Application Programming Interface, a set of protocols for building software",
        "async" | "asynchronous" => "non-blocking operations that don't wait for completion",
        "cache" => "temporary storage for frequently accessed data",
        "concurrency" => "handling multiple tasks simultaneously",
        "database" => "organized collection of structured data",
        "deploy" | "deployment" => "releasing software to production environment",
        "endpoint" => "URL where an API can be accessed",
        "framework" => "reusable software platform for development",
        "git" => "distributed version control system",
        "http" => "protocol for transferring data on the web",
        "index" => "data structure for fast data retrieval",
        "json" => "JavaScript Object Notation, a data format",
        "kubernetes" | "k8s" => "container orchestration platform",
        "latency" => "delay in data transmission",
        "middleware" => "software that bridges different applications",
        "node" => "a point in a network or data structure",
        "orm" => "Object-Relational Mapping for database abstraction",
        "pipeline" => "sequence of data processing stages",
        "query" => "request for data from a database",
        "rest" | "restful" => "architectural style for web services",
        "schema" => "structure definition for data",
        "thread" => "smallest unit of execution in a process",
        "url" => "Uniform Resource Locator, web address",
        "webhook" => "HTTP callback for event notifications",
        _ => "a concept commonly encountered in software development",
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![fetch_article, explain_word])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
