import { useMemo } from "react";
import { getRandomBrandColor } from "@src/utils/brandColors";

/**
 * Retourne la couleur hex de la marque (ou null si inconnue).
 */
export function useColorBrand(selectedBrand?: string): string | null {
  const normalized = useMemo(
    () => selectedBrand?.trim().toLowerCase() ?? "",
    [selectedBrand],
  );

  const color = useMemo(
    () => (normalized ? getRandomBrandColor(normalized) : null),
    [normalized],
  );

  return color;
}
