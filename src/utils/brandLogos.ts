const staticLogos: Record<string, string> = {
  adidas: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  nike: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  samsung: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  google: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
};

const fallbackClearbit = (brand: string) => `https://logo.clearbit.com/${brand}.com`;
const fallbackFavicon = (brand: string) =>
  `https://www.google.com/s2/favicons?domain=${brand}.com&sz=64`;
const fallbackPlaceholder = "https://via.placeholder.com/32x32?text=?";

/**
 * Renvoie l'URL du logo d'une marque.
 */
export function getBrandLogo(brand: string): string {
  const key = brand.toLowerCase().trim();

  // 1. Logo en dur (Wikipédia, SVG haute qualité)
  if (staticLogos[key]) return staticLogos[key];

  // 2. Fallback Clearbit
  return fallbackClearbit(key);
}

/**
 * Optionnel — utile si tu veux tester dynamiquement si le logo existe réellement
 */
export async function fetchValidBrandLogo(brand: string): Promise<string> {
  const key = brand.toLowerCase().trim();

  // 1. Si on a un logo connu en dur
  if (staticLogos[key]) return staticLogos[key];

  // 2. Vérifier Clearbit (HEAD)
  const clearbitURL = fallbackClearbit(key);
  if (await urlExists(clearbitURL)) return clearbitURL;

  // 3. Vérifier favicon Google
  const faviconURL = fallbackFavicon(key);
  if (await urlExists(faviconURL)) return faviconURL;

  // 4. Sinon, placeholder
  return fallbackPlaceholder;
}

// Petit helper pour tester si une URL existe
async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}
