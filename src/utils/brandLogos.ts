const staticLogos: Record<string, string> = {
  adidas: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  nike: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  apple:
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  samsung:
    "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  google:
    "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  mistral:
    "https://upload.wikimedia.org/wikipedia/commons/4/4b/Mistral_logo.svg",
};

const fallbackClearbit = (domain: string) =>
  `https://logo.clearbit.com/${domain}`;
const fallbackFavicon = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
const placeholderSvg =
  "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><rect width='64' height='64' rx='16' fill='%23f1f1f5'/><path d='M20 36.2c2.6 3.5 7 6.3 11.8 6.3 6.9 0 10.6-4.1 10.6-9.1 0-4.8-3.3-8.1-8.5-8.1-3.6 0-6.1 1.6-7.8 3.7l-5.3-2.9c2.8-4.1 7.3-6.4 13.4-6.4 9.1 0 15.2 5.8 15.2 13.9 0 8.5-6.1 14.9-16.3 14.9-7.1 0-12.8-3.4-15.8-8.2z' fill='%23848394'/></svg>";
export const FALLBACK_BRAND_PLACEHOLDER = `data:image/svg+xml;utf8,${placeholderSvg.replace(
  /#/g,
  "%23",
)}`;

const brandLogoCache = new Map<string, string>();
const brandLogoPromiseCache = new Map<string, Promise<string>>();

function normalizeDomain(siteUrl: string): string {
  return siteUrl
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .trim();
}

function getCandidates(brand: string, siteUrl?: string): string[] {
  const key = brand.toLowerCase().trim();
  const candidates: string[] = [];

  if (staticLogos[key]) {
    candidates.push(staticLogos[key]);
  }

  if (siteUrl) {
    const domain = normalizeDomain(siteUrl);
    candidates.push(fallbackClearbit(domain));
    candidates.push(fallbackFavicon(domain));
  }

  candidates.push(fallbackClearbit(`${key}.com`));
  candidates.push(fallbackFavicon(`${key}.com`));

  return candidates;
}

function checkImage(url: string): Promise<string | null> {
  if (!url) return Promise.resolve(null);

  if (typeof window === "undefined") {
    return Promise.resolve(url);
  }

  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    const cleanup = () => {
      image.onload = null;
      image.onerror = null;
      if (timeout) window.clearTimeout(timeout);
    };

    const timeout = window.setTimeout(() => {
      cleanup();
      resolve(null);
    }, 4000);

    image.onload = () => {
      cleanup();
      resolve(url);
    };

    image.onerror = () => {
      cleanup();
      resolve(null);
    };

    image.src = url;
  });
}

async function resolveBrandLogo(
  brand: string,
  siteUrl?: string,
): Promise<string> {
  const key = brand.toLowerCase().trim();

  if (!key) {
    return FALLBACK_BRAND_PLACEHOLDER;
  }

  const candidates = getCandidates(key, siteUrl);

  for (const candidate of candidates) {
    try {
      const valid = await checkImage(candidate);
      if (valid) {
        return valid;
      }
    } catch {
      // ignore and try next candidate
    }
  }

  return FALLBACK_BRAND_PLACEHOLDER;
}

export async function fetchValidBrandLogo(
  brand: string,
  siteUrl?: string,
): Promise<string> {
  const cacheKey = `${brand.toLowerCase().trim()}|${siteUrl ?? ""}`;

  if (brandLogoCache.has(cacheKey)) {
    return brandLogoCache.get(cacheKey)!;
  }

  if (brandLogoPromiseCache.has(cacheKey)) {
    return brandLogoPromiseCache.get(cacheKey)!;
  }

  const promise = resolveBrandLogo(brand, siteUrl)
    .catch(() => FALLBACK_BRAND_PLACEHOLDER)
    .then((url) => {
      brandLogoCache.set(cacheKey, url);
      brandLogoPromiseCache.delete(cacheKey);
      return url;
    });

  brandLogoPromiseCache.set(cacheKey, promise);
  return promise;
}

export function getBrandLogo(brand: string, siteUrl?: string): string {
  const key = brand.toLowerCase().trim();

  if (!key) {
    return FALLBACK_BRAND_PLACEHOLDER;
  }

  if (staticLogos[key]) {
    return staticLogos[key];
  }

  if (siteUrl) {
    const domain = normalizeDomain(siteUrl);
    return fallbackClearbit(domain);
  }

  return fallbackClearbit(`${key}.com`);
}
