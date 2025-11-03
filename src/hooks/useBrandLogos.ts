import { useEffect, useMemo, useState } from "react";
import {
  FALLBACK_BRAND_PLACEHOLDER,
  fetchValidBrandLogo,
} from "@src/utils/brandLogos";

type BrandInput = string | { brand: string; siteUrl?: string };

export const useBrandLogos = (brands: BrandInput[]): Record<string, string> => {
  const [logos, setLogos] = useState<Record<string, string>>({});

  // ✅ Normalisation : clé = brand.toLowerCase().trim()
  const normalizedBrands = useMemo(() => {
    const map = new Map<string, string | undefined>();
    for (const b of brands || []) {
      if (typeof b === "string") {
        map.set(b.toLowerCase().trim(), undefined);
      } else {
        map.set(b.brand.toLowerCase().trim(), b.siteUrl);
      }
    }
    return Array.from(map.entries());
  }, [brands]);

  useEffect(() => {
    if (normalizedBrands.length === 0) return;

    let cancelled = false;

    const loadMissing = async () => {
      const missing = normalizedBrands.filter(([brand]) => !logos[brand]);
      if (missing.length === 0) return;

      const results = await Promise.all(
        missing.map(async ([brand, siteUrl]) => {
          const logo = await fetchValidBrandLogo(brand, siteUrl).catch(
            () => FALLBACK_BRAND_PLACEHOLDER,
          );
          return [brand, logo || FALLBACK_BRAND_PLACEHOLDER] as const;
        }),
      );

      if (!cancelled) {
        // ✅ Toujours renvoyer un nouvel objet → force le re-render
        setLogos((prev) => {
          const next = { ...prev };
          for (const [brand, logo] of results) {
            next[brand] = logo;
          }
          return { ...next };
        });
      }
    };

    void loadMissing();

    return () => {
      cancelled = true;
    };
    // ⚠️ ne pas mettre `logos` ici → sinon le hook reboucle sans fin
  }, [normalizedBrands]);

  return logos;
};
