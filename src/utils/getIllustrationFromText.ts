import { illustrationKeywords } from "./illustrationKeywords";

export function getIllustrationFromText(
  title: string,
  punchline?: string,
  keywordsMap: Record<string, string> = illustrationKeywords,
  basePath = "bobAssets",
): string {
  const text = `${title} ${punchline || ""}`.toLowerCase();

  for (const [keyword, path] of Object.entries(keywordsMap)) {
    if (text.includes(keyword)) {
      return `/assets/${basePath}/${path}`;
    }
  }

  // 🔁 Fallback général
  return `/assets/${basePath}/${keywordsMap.default}`;
}
