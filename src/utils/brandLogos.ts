// ====================
// ✅ Liste de logos statiques connus
// ====================
/* export const staticLogos: Record<string, string> = {
  apple: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  samsung: "https://companieslogo.com/img/orig/005930.KS-7e02a593.png?t=1728583894",
  nike: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  adidas: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  google: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  microsoft: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  sony: "https://upload.wikimedia.org/wikipedia/commons/2/20/Sony_Logo.svg",
  zalando: "https://companieslogo.com/img/orig/ZALANDO.D-46b0b08a.png?t=1728583894",
  shein: "https://companieslogo.com/img/orig/SHEIN-5663e7b8.png?t=1728583894",
  asos: "https://companieslogo.com/img/orig/ASOS.L-df234db6.png?t=1728583894",
  vinted: "https://companieslogo.com/img/orig/VINTED-9fda6d36.png?t=1728583894",
  ebay: "https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg",
  etsy: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Etsy_logo.svg",
  boursorama: "https://upload.wikimedia.org/wikipedia/fr/3/30/Boursorama_Banque_Logo.svg",
  lcl: "https://companieslogo.com/img/orig/LCL.PA-065d86eb.png?t=1728583894",
  bnp: "https://companieslogo.com/img/orig/BNP.PA-d4e51e5d.png?t=1728583894",
  societe_generale: "https://companieslogo.com/img/orig/GLE.PA-37e9f8aa.png?t=1728583894",
  fortuneo: "https://companieslogo.com/img/orig/FORTUNEO-ec3c5b78.png?t=1728583894",
  revolut: "https://companieslogo.com/img/orig/REVOLUT-1b17a3b1.png?t=1728583894",
  dyson: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Dyson_logo.svg",
  mistral: "https://vectorwiki.com/images/mUccB__mistral-ai.svg",
  decathlon: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Decathlon_Logo.svg",
  ikea: "https://upload.wikimedia.org/wikipedia/commons/4/48/Ikea_logo.svg",
  carrefour: "https://upload.wikimedia.org/wikipedia/commons/9/94/Carrefour_logo.svg",
  leclerc: "https://upload.wikimedia.org/wikipedia/commons/6/65/Logo_E.Leclerc.svg",
  auchan: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Auchan_logo.svg",
  netflix: "https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg",
  spotify: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  disney: "https://upload.wikimedia.org/wikipedia/commons/d/df/Walt_Disney_Pictures_Logo.svg",
  orange: "https://upload.wikimedia.org/wikipedia/commons/4/43/Orange_logo.svg",
  sfr: "https://companieslogo.com/img/orig/SFR.PA-4d1883e8.png?t=1728583894",
  bouygues: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Bouygues_Telecom_logo.svg",
  free: "https://upload.wikimedia.org/wikipedia/commons/6/66/Free_logo.svg",
  renault: "https://upload.wikimedia.org/wikipedia/commons/0/09/Renault_2021.svg",
  peugeot: "https://upload.wikimedia.org/wikipedia/commons/8/87/Peugeot_Logo_2021.svg",
  tesla: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  bmw: "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
  mercedes: "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
  toyota: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg",
}; */

// ====================
// ✅ Placeholder générique
// ====================
const placeholderSvg =
  "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><rect width='64' height='64' rx='16' fill='%23f1f1f5'/><path d='M20 36.2c2.6 3.5 7 6.3 11.8 6.3 6.9 0 10.6-4.1 10.6-9.1 0-4.8-3.3-8.1-8.5-8.1-3.6 0-6.1 1.6-7.8 3.7l-5.3-2.9c2.8-4.1 7.3-6.4 13.4-6.4 9.1 0 15.2 5.8 15.2 13.9 0 8.5-6.1 14.9-16.3 14.9-7.1 0-12.8-3.4-15.8-8.2z' fill='%23848394'/></svg>";

export const FALLBACK_BRAND_PLACEHOLDER = `data:image/svg+xml;utf8,${placeholderSvg.replace(
  /#/g,
  "%23",
)}`;

// ====================
// ✅ Config & Cache
// ====================
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const brandLogoCache = new Map<string, string>();

// ====================
// ✅ Normalisation de domaine
// ====================
export function normalizeDomain(siteUrl?: string): string {
  if (!siteUrl) return "";
  return siteUrl
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .trim();
}

// ====================
// ✅ Méthode principale
// ====================
export async function fetchValidBrandLogo(
  brand: string,
  siteUrl?: string,
): Promise<string> {
  const cacheKey = `${brand.toLowerCase().trim()}|${siteUrl ?? ""}`;
  if (brandLogoCache.has(cacheKey)) return brandLogoCache.get(cacheKey)!;

  const normalizedBrand = brand.toLowerCase().trim();
  const domain =
    siteUrl
      ?.replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0] || `${normalizedBrand}.com`;

  try {
    const res = await fetch(`${API_BASE_URL}/api/logo?domain=${domain}`, {
      headers: { "Cache-Control": "no-cache" },
    });
    if (!res.ok) throw new Error("Logo not found");

    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    brandLogoCache.set(cacheKey, objectUrl);
    return objectUrl;
  } catch {
    // 🔁 Fallback favicon Google
    const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    brandLogoCache.set(cacheKey, fallbackUrl);
    return fallbackUrl;
  }
}

// ====================
// ✅ Accès direct (synchrone)
// ====================
export function getBrandLogo(brand: string, siteUrl?: string): string {
  const key = brand.toLowerCase().trim();
  if (!key) return FALLBACK_BRAND_PLACEHOLDER;

  //if (staticLogos[key]) return staticLogos[key];
  const domain = siteUrl ? normalizeDomain(siteUrl) : `${key}.com`;
  return `${API_BASE_URL}/api/logo?domain=${domain}`;
}
