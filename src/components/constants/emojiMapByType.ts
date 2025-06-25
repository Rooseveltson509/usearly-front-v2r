export const EMOJIS = {
  post: [
    { emoji: "😒", label: "Agacé" },
    { emoji: "😖", label: "Frustré" },
    { emoji: "😐", label: "Neutre" },
    { emoji: "😨", label: "Angoissé" },
    { emoji: "😞", label: "Déçu" },
    { emoji: "🤣", label: "Haha" },
    { emoji: "🥵", label: "Fatiguant" },
  ],

  report: [
    { emoji: "👍", label: "Merci" },
    { emoji: "🤚", label: "Moi aussi" },
    { emoji: "🤯", label: "Choqué" },
    { emoji: "😂", label: "MDR" },
    { emoji: "😱", label: "Inquiétant" },
    { emoji: "🔥", label: "À corriger vite" },
    { emoji: "💡", label: "Une solution ?" },
  ],
  coupdecoeur: [
    { emoji: "👍", label: "J'aime" },
    { emoji: "😂", label: "MDR" },
    { emoji: "🐣", label: "Belle découverte" },
    { emoji: "🤩", label: "Stylé" },
    { emoji: "😍", label: "Trop cute" },
  ],
  suggestion: [
    { emoji: "👍", label: "J'aime" },
    { emoji: "🙌", label: "Je soutiens" },
    { emoji: "😍", label: "J'en rêve" },
    { emoji: "🤔", label: "Je ne sais pas" },
    { emoji: "👎", label: "Pas convaincu" },
  ],
};

/**
 * Fonction pour récupérer les emojis d'un type spécifique.
 * @param type - "post" | "report" | "suggestion" | "coupdecoeur"
 * @returns Liste des emojis avec labels
 */
export const getEmojisForType = (type: keyof typeof EMOJIS) => {
  return EMOJIS[type] || [];
};
