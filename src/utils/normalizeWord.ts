export function normalizeWord(word: string) {
  return word
    .toLowerCase()
    .normalize("NFD") // accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/gi, "");
}

export function filterValidHighlights(
  punchline: string,
  highlightedWords: string[],
): string[] {
  const normalizedPunchlineWords = punchline.split(/\s+/).map(normalizeWord);

  return highlightedWords.filter((word) =>
    normalizedPunchlineWords.includes(normalizeWord(word)),
  );
}
