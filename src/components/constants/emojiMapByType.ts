export const emojiMapByType = {
  report: ["😡", "😕", "🐞", "🚫", "🤯"], // frustration, bug, rejet
  coupdecoeur: ["❤️", "😍", "🔥", "👏", "✨"], // amour, admiration
  suggestion: ["💡", "📝", "🤔", "📈", "👍"], // idée, réflexion
} as const;

export const emojiLabelMap: Record<string, string> = {
  // Report
  "😡": "Énervé",
  "🤯": "Surpris",
  "🐞": "Bug détecté",
  "😕": "Confus",
  "🚫": "Inacceptable",
  "💢": "Problème majeur",

  // Coup de coeur
  "❤️": "J'adore",
  "😍": "Magnifique",
  "👏": "Bravo",
  "🔥": "Incroyable",
  "✨": "Inspiration",
  "💯": "Parfait",

  // Suggestion
  "💡": "Bonne idée",
  "📝": "Suggestion écrite",
  "🤔": "À réfléchir",
  "📈": "Amélioration",
  "👍": "Je valide",
  "🙌": "En accord",
};

