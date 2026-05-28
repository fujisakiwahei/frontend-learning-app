import MarkdownIt from "markdown-it";
import { getHighlighter, SHIKI_THEME } from "./shiki";

let mdPromise: Promise<MarkdownIt> | null = null;

async function getMarkdown(): Promise<MarkdownIt> {
  if (!mdPromise) {
    mdPromise = (async () => {
      const highlighter = await getHighlighter();
      const loadedLangs = highlighter.getLoadedLanguages() as readonly string[];
      return new MarkdownIt({
        html: false,
        linkify: true,
        breaks: false,
        highlight(code, lang) {
          const safeLang = loadedLangs.includes(lang) ? lang : "text";
          return highlighter.codeToHtml(code, { lang: safeLang, theme: SHIKI_THEME });
        },
      });
    })();
  }
  return mdPromise;
}

export async function renderMarkdown(src: string): Promise<string> {
  const md = await getMarkdown();
  return md.render(src);
}
