import type { Highlighter } from "shiki";
import { createHighlighter } from "shiki";

export const SHIKI_THEME = "light-plus";
export const SHIKI_LANGS = ["ts", "vue", "css", "html", "json"] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [SHIKI_THEME],
      langs: [...SHIKI_LANGS],
    });
  }
  return highlighterPromise;
}

export async function highlightCode(src: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter();
  const loaded = highlighter.getLoadedLanguages();
  const safeLang = (loaded as readonly string[]).includes(lang) ? lang : "text";
  return highlighter.codeToHtml(src, { lang: safeLang, theme: SHIKI_THEME });
}
