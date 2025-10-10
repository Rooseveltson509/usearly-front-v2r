import { illustrationKeywords } from "./illustrationKeywords";

export function getIllustrationFromText(
  title: string,
  punchline?: string,
): string {
  const text = `${title} ${punchline || ""}`.toLowerCase();

  for (const [keyword, path] of Object.entries(illustrationKeywords)) {
    if (text.includes(keyword)) {
      return `/assets/bobAssets/${path}`;
    }
  }

  // 🔁 Fallback général
  return `/assets/bobAssets/${illustrationKeywords.default}`;
}
