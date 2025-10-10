// useBrandColor.ts
import { useMemo } from "react";
import { brandColors } from "@src/utils/brandColors";

/**
 * Retourne la couleur hex de la marque (ou null si inconnue).
 */
export function useColorBrand(selectedBrand?: string): string | null {
  const normalized = useMemo(
    () => selectedBrand?.trim().toLowerCase() ?? "",
    [selectedBrand],
  );

  const color = useMemo(
    () => (normalized ? (brandColors[normalized] ?? null) : null),
    [normalized],
  );

  return color;
}
