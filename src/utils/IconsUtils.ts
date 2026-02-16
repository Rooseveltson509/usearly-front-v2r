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
  "abc-error.png": [
    "fautes d'orthographe",
    "orthographe",
    "grammaire",
    "Erreurs",
    "faute",
    "erreur",
    "typo",
    "typographie",
  ],
  "filter.png": ["filtre", "recherche", "tri", "moteur", "affichage", "trié"],
  "connect-bug.png": [
    "connexion",
    "d'authentification",
    "authentification",
    "se connecter",
    "problème de connexion",
    "bug de connexion",
    "connexion impossible",
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
  "payment-fail.png": [
    "paiement",
    "bancaire",
    "débit",
    "crédit",
    "carte",
    "refusé",
    "transaction",
    "code",
    "erreur bancaire",
    "problème de paiement",
    "informations bancaires",
    "problème avec la carte",
    "prélèvement",
    "prelevement",
    "virement",
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
    "communication",
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

  "error-message.png": [
    "popup",
    "alerte",
    "message système",
    "erreur système",
    "introuvable",
  ],
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
  "size-product.png": ["taille", "dimension", "format", "grande", "petite"],
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
  "double-charge.png": [
    "double debit",
    "double prelevement",
    "double paiement",
    "double facturation",
    "facture en double",
    "montant incorrect",
    "montant errone",
    "montant erroné",
    "montant excessif",
    "facturation excessive",
    "surfacturation",
    "trop facture",
    "trop facturé",
    "somme incorrecte",
    "erreur de montant",
    "prix incorrect",
    "tarif incorrect",
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

  let bestMatch: string = "other.png";
  let bestScore = 0;

  for (const [icon, keywords] of Object.entries(keywordMap)) {
    let score = 0;

    for (const keyword of keywords) {
      const normalizedKeyword = normalize(keyword);

      if (clean.includes(normalizedKeyword)) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = icon;
    }
  }

  if (bestScore > 0) {
    return `/assets/categories-icons/${bestMatch}`;
  }

  return "/assets/categories-icons/other.png";
};
