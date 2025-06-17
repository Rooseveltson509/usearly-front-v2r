/**
 * Associe dynamiquement une sous-catégorie à une icône en se basant sur des mots-clés.
 */

const keywordMap: Record<string, string[]> = {
  "password.png": ["mot de passe", "password", "mdp"],
  "connect-bug.png": ["connexion", "login", "logon", "signin", "auth", "connect"],
  "account.png": ["authentification", "compte", "identifiant"],
  "content-error.png": ["erreur d'affichage", "affichage", "display", "visuel", "render"],
  "design.png": ["déformé", "design", "mise en page", "layout"],
  "photo-error.png": ["photo", "image", "pic", "media", "visuel"],
  "delivery.png": ["livraison", "delivery", "colis", "expédition", "shipping"],
  "delay.png": ["retard", "delay", "tardif", "temps"],
  "reply-error.png": ["pas de réponse", "non répondu", "ignore", "no reply"],
  "wrong-address.png": ["adresse", "wrong address", "bad address"],
  "expired.png": ["expiré", "expired", "périmé"],
  "verification-code.png": ["code", "vérification", "otp", "security code"],
  "size.png": ["taille", "size", "grandeur"],
  "payment.png": ["paiement", "payment", "carte", "cb", "visa", "mastercard"],
  "disconnect.png": ["déconnexion", "disconnect", "quit"],
  "order-tracking.png": ["suivi", "tracking", "commande", "order"],
  "support.png": ["aide", "support", "assistance", "help"],
  "reviews-fake.png": ["faux avis", "fake review", "commentaire frauduleux"],
  "wrong-description.png": ["description fausse", "wrong description", "erreur produit"],
  "bug.png": ["bug", "glitch", "plantage", "crash"],
  "error-message.png": ["erreur", "error", "message d'erreur", "fail"]
};

const normalize = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9 ]/g, "");
};

export const getCategoryIconPathFromSubcategory = (
  subcategory: string | undefined
): string => {
  if (!subcategory) return "/assets/categories-icons/other.png";

  const clean = normalize(subcategory);

  for (const [icon, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (clean.includes(normalize(keyword))) {
        return `/assets/categories-icons/${icon}`;
      }
    }
  }

  return "/assets/categories-icons/other.png"; // fallback
};
