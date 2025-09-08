const staticLogos: Record<string, string> = {
  adidas: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  nike: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  samsung: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  google: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  mistral: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Mistral_logo.svg", // ou ton lien propre
  // Ajoute transitionspro si besoin
};

const fallbackClearbit = (domain: string) => `https://logo.clearbit.com/${domain}`;
const fallbackFavicon = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
const fallbackPlaceholder = "https://via.placeholder.com/32x32?text=?";

/**
 * Teste si une URL est valide
 */
async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * ✅ Version restaurée adaptée :
 * Permet de récupérer dynamiquement le logo d'une marque,
 * en utilisant en priorité siteUrl, sinon le nom de la marque.
 */
function normalizeDomain(siteUrl: string): string {
  return siteUrl.replace(/^https?:\/\//, "").replace(/^www\./, "").trim();
}

export async function fetchValidBrandLogo(
  brand: string,
  siteUrl?: string
): Promise<string> {
  const key = brand.toLowerCase().trim();

  // 1️⃣ Static logos
  if (staticLogos[key]) return staticLogos[key];

  // 2️⃣ Utilise siteUrl si dispo
  if (siteUrl) {
    const domain = normalizeDomain(siteUrl); // "zenity.fr"
    const clearbitURL = fallbackClearbit(domain);
    if (await urlExists(clearbitURL)) return clearbitURL;
  }

  // 3️⃣ Fallback Clearbit brand.com
  const clearbitURL = fallbackClearbit(`${key}.com`);
  if (await urlExists(clearbitURL)) return clearbitURL;

  // 4️⃣ Favicon Google
  const domain = siteUrl ? normalizeDomain(siteUrl) : `${key}.com`;
  const faviconURL = fallbackFavicon(domain);
  if (await urlExists(faviconURL)) return faviconURL;

  // 5️⃣ Placeholder
  return fallbackPlaceholder;
}

export function getBrandLogo(brand: string, siteUrl?: string): string {
  const key = brand.toLowerCase().trim();

  if (staticLogos[key]) return staticLogos[key];
  if (siteUrl) return fallbackClearbit(normalizeDomain(siteUrl));

  return fallbackClearbit(`${key}.com`);
}
