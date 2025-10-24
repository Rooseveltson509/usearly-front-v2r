import { getIllustrationFromText } from "./getIllustrationFromText";
import { illustrationSuggestKeywords } from "./illustrationSuggestKeywords";

export function decideIllustration(
  title: string | null | undefined,
  punchline: string | null | undefined,
  type: "coupdecoeur" | "suggestion",
): string | null {
  // 🔒 Sécurité contre null / undefined
  const safeTitle = title || "";
  const safePunchline = punchline || "";

  const lineCount = safePunchline.split("\n").length;

  // 🔸 1. Si deux lignes → illustration automatique
  if (lineCount > 1) {
    return getIllustrationFromText(safeTitle, safePunchline);
  }

  // 🔸 2. Si suggestion → plus de chance d'avoir une illustration
  if (type === "suggestion") {
    const titleHasSuggestionKeyword = Object.keys(illustrationSuggestKeywords)
      .filter((keyword) => keyword !== "default")
      .some((keyword) => safeTitle.toLowerCase().includes(keyword));

    if (titleHasSuggestionKeyword) {
      return getIllustrationFromText(
        safeTitle,
        undefined,
        illustrationSuggestKeywords,
        "bobAssetsSuggest",
      );
    }

    const keywords = [
      "idée",
      "proposer",
      "nouveau",
      "changer",
      "améliorer",
      "mettre",
      "ajouter",
    ];
    const hasKeyword = keywords.some(
      (k) =>
        safePunchline.toLowerCase().includes(k) ||
        safeTitle.toLowerCase().includes(k),
    );
    if (hasKeyword)
      return getIllustrationFromText(
        safeTitle,
        safePunchline,
        illustrationSuggestKeywords,
        "bobAssetsSuggest",
      );
  }

  // 🔸 3. Si coup de cœur → illustration uniquement si thématique détectée
  const illustration =
    type === "suggestion"
      ? getIllustrationFromText(
          safeTitle,
          safePunchline,
          illustrationSuggestKeywords,
          "bobAssetsSuggest",
        )
      : getIllustrationFromText(safeTitle, safePunchline);
  if (!illustration.endsWith("ordilike.svg")) {
    return illustration; // seulement si une vraie correspondance
  }

  // 🔸 Sinon pas d’illustration
  return null;
}
