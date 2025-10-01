import { useEffect, useMemo, useState } from "react";
import {
  FALLBACK_BRAND_PLACEHOLDER,
  fetchValidBrandLogo,
} from "@src/utils/brandLogos";

export const useBrandLogos = (brands: string[]): Record<string, string> => {
  const [logos, setLogos] = useState<Record<string, string>>({});

  const normalizedBrands = useMemo(() => {
    const set = new Set<string>();
    for (const brand of brands || []) {
      const key = brand?.trim();
      if (key) set.add(key);
    }
    return Array.from(set);
  }, [brands]);

  useEffect(() => {
    const missing = normalizedBrands.filter((brand) => !logos[brand]);
    if (missing.length === 0) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      const entries = await Promise.all(
        missing.map(async (brand) => {
          const logo = await fetchValidBrandLogo(brand).catch(
            () => FALLBACK_BRAND_PLACEHOLDER,
          );
          return [brand, logo || FALLBACK_BRAND_PLACEHOLDER] as const;
        }),
      );

      if (!cancelled) {
        setLogos((prev) => {
          const next = { ...prev };
          for (const [brand, logo] of entries) {
            next[brand] = logo;
          }
          return next;
        });
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [normalizedBrands, logos]);

  return logos;
};
