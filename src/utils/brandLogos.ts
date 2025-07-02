// Logos statiques haute qualité (prioritaires)
const staticLogos: Record<string, string> = {
  adidas: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  nike: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  samsung: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  google: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
};

// Placeholder de secours
const fallbackPlaceholder = "https://via.placeholder.com/32x32?text=?";

// Utilise Clearbit en fallback
const fallbackClearbit = (brand: string) =>
  `https://logo.clearbit.com/${brand}.com`;

/**
 * Extrait le premier domaine valide depuis un siteUrl comme "adidas.com/adidas.fr".
 */
function extractDomain(siteUrl: string): string | null {
  if (!siteUrl) return null;
  const parts = siteUrl.split(/[\/,]/).map(p => p.trim()).filter(Boolean);

  for (const part of parts) {
    if (part.includes(".")) {
      return part.replace(/^www\./, "");
    }
  }
  return null;
}

/**
 * Renvoie l'URL du logo d'une marque en utilisant :
 * 1️⃣ Logo statique si présent
 * 2️⃣ Domaine extrait de siteUrl pour Clearbit
 * 3️⃣ Fallback Clearbit sur le brand name
 */
export function getBrandLogo(brand: string, siteUrl?: string): string {
  const key = brand.toLowerCase().trim();

  if (staticLogos[key]) return staticLogos[key];

  if (siteUrl) {
    const domain = extractDomain(siteUrl);
    if (domain) {
      return `https://logo.clearbit.com/${domain}`;
    }
  }

  return fallbackClearbit(key);
}

/**
 * Si tu souhaites tester dynamiquement si le logo existe réellement avant de l'afficher.
 */
export async function fetchValidBrandLogo(brand: string, siteUrl?: string): Promise<string> {
  const key = brand.toLowerCase().trim();

  if (staticLogos[key]) return staticLogos[key];

  if (siteUrl) {
    const domain = extractDomain(siteUrl);
    if (domain) {
      const clearbitURL = `https://logo.clearbit.com/${domain}`;
      if (await urlExists(clearbitURL)) return clearbitURL;
    }
  }

  const fallbackClearbitURL = fallbackClearbit(key);
  if (await urlExists(fallbackClearbitURL)) return fallbackClearbitURL;

  return fallbackPlaceholder;
}

// Helper pour tester si une URL existe via HEAD
async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}
