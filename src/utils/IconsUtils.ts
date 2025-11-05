/**
 * Associe dynamiquement une sous-catégorie à une icône en se basant sur des mots-clés.
 */

const keywordMap: Record<string, string[]> = {
  "basket-add-remove.png": [
    "ajout",
    "retrait",
    "panier",
    "vide",
    "articles",
    "article",
    "supprimé",
    "disparaît",
  ],
  "damaged-parcel.png": [
    "endommagé",
    "détérioré",
    "cassé",
    "casse",
    "abîmé",
    "défectueux",
    "réception",
    "abimé",
  ],
  "filter.png": ["filtre", "recherche", "tri", "moteur", "affichage", "trié"],
  "connect-bug.png": [
    "connexion",
    "login",
    "identifiant",
    "mot de passe",
    "inscription",
    "compte",
    "déconnexion",
  ],
  "order-tracking.png": [
    "commande",
    "suivi",
    "expédition",
    "tracking",
    "statut",
    "en cours",
    "colis",
    "livraison",
  ],
  /*   "wrong-description.png": [
      "description", "mauvais", "erreur", "détail", "info", "incohérent", "différent", "mensonger"
    ], */
  /*   "payment-fail.png": [
      "validation du paiement", "paiement", "carte", "refusé", "transaction", "code", "erreur bancaire"
    ], */
  "payment-fail.png": [
    "paiement",
    "bancaire",
    "carte",
    "refusé",
    "transaction",
    "code",
    "erreur bancaire",
    "problème de paiement",
    "informations bancaires",
    "problème avec la carte",
  ],

  "loading-page.png": [
    "chargement",
    "bug",
    "réactivité",
    "lent",
    "ralenti",
    "bloque",
    "plante",
    "plantage",
    "lag",
    "freeze",
  ],

  "design.png": [
    "affichage",
    "interface",
    "ux",
    "ui",
    "visuel",
    "design",
    "graphisme",
    "problème d'affichage",
  ],

  "delivery.png": [
    "adresse",
    "mauvaise",
    "livraison",
    "destinataire",
    "invalide",
  ],
  "delivery-delay.png": [
    "retard",
    "tard",
    "long",
    "attente",
    "temps",
    "jour",
    "délai",
  ],
  "support.png": [
    "service client",
    "conseiller",
    "support",
    "contact",
    "joindre",
    "assistance",
    "réponse",
    "injoignable",
    "disponible",
    "indisponible",
    "tchat",
    "chat",
    "pas de réponse",
    "aucune réponse",
    "relance",
  ],

  "error-message.png": ["popup", "alerte", "message système"],
  "restart.png": [
    "recommencer",
    "relancer",
    "retour à zéro",
    "depuis le début",
    "réinitialiser",
  ],
  "incomprehensible.png": [
    "trop d'information",
    "confusion",
    "illisible",
    "trop de texte",
    "compliqué",
    "incompréhensible",
  ],
  "size-product.png": [
    "taille",
    "dimension",
    "format",
    "grande",
    "petite",
    "panier",
  ],
  "conflicting-information.png": [
    "incohérence",
    "contradiction",
    "incompatibilité",
    "divergence",
    "discordance",
    "différence",
  ],

  "exchange-and-return.png": [
    "retourner",
    "échange",
    "retour",
    "remboursement",
    "politique",
    "procédure",
  ],
  "stock.png": ["stock", "indisponible", "rupture", "épuisé"],
  "photo-error.png": [
    "photo",
    "image",
    "manquante",
    "visuel",
    "aperçu",
    "miniature",
  ],
  "other.png": [],
};

const normalize = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9 ]/g, "");
};

export const getCategoryIconPathFromSubcategory = (
  subcategory: string | undefined,
): string => {
  if (!subcategory) return "/assets/categories-icons/other.png";

  const clean = normalize(subcategory);

  // 1. Recherche dans keywordMap
  for (const [icon, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (new RegExp(`\\b${normalize(keyword)}\\b`, "i").test(clean)) {
        return `/assets/categories-icons/${icon}`;
      }
    }
  }

  // 2. Fallback basé sur similarité avec nom d’icône
  const icons = [
    "password",
    "connect-bug",
    "account",
    "content-error",
    "design",
    "photo-error",
    "delivery",
    "delay",
    "reply-error",
    "wrong-address",
    "payment-fail",
    "expired",
    "verification-code",
    "size",
    "payment",
    "disconnect",
    "order-tracking",
    "support",
    "reviews-fake",
    "wrong-description",
    "bug",
    "error-message",
    "basket",
    "filter",
    "coupon",
    "scroll",
    "resolution",
    "restart",
    "stock",
    "support",
    "double-charge",
    "unresolved",
    "sum-error",
    "fraud",
    "navigation",
  ];

  const match = icons.find((icon) => clean.includes(icon.replace(/-/g, "")));

  if (match) {
    return `/assets/categories-icons/${match}.png`;
  }

  return "/assets/categories-icons/other.png"; // fallback final
};

/* export const getCategoryIconPathFromSubcategory = (
  subcategory: string | undefined
): string => {
  if (!subcategory) return "/assets/categories-icons/other.png";

  const clean = normalize(subcategory);

  for (const [icon, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
        console.log(`Matched subcategory "${subcategory}" with icon "${icon}"`);
      if (clean.includes(normalize(keyword))) {
        return `/assets/categories-icons/${icon}`;
      }
    }
  }

  return "/assets/categories-icons/other.png"; // fallback
}; */
