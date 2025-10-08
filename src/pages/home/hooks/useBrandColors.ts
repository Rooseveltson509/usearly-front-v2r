// #f0f0f0
// --brand-banner-border: rgba(17, 17, 17, 0.2);
import { useMemo, useEffect, useState } from "react";
import { brandColors } from "@src/utils/brandColors";
import { hexToRgba } from "@src/utils/colorUtils";
import { fetchValidBrandLogo } from "@src/utils/brandLogos";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";

export function useBrandColors(
  activeTab: FeedbackType,
  feedbackData: (CoupDeCoeur | Suggestion)[],
  selectedBrand: string,
  selectedSiteUrl?: string,
) {
  const [selectedBrandLogo, setSelectedBrandLogo] = useState<string | null>(
    null,
  );

  const normalizedBrand = useMemo(
    () => selectedBrand?.trim()?.toLowerCase() ?? "",
    [selectedBrand],
  );

  const selectedBrandBaseColor = useMemo(() => {
    if (!normalizedBrand) return null;
    return brandColors[normalizedBrand] ?? null;
  }, [normalizedBrand]);

  const brandBannerStyle = useMemo(() => {
    if (!selectedBrandBaseColor) return {};
    return {
      "--brand-banner-bg": hexToRgba(selectedBrandBaseColor, 0.18),
      "--brand-banner-border": hexToRgba(selectedBrandBaseColor, 0.3),
      "--brand-banner-accent": selectedBrandBaseColor,
    } as React.CSSProperties;
  }, [selectedBrandBaseColor]);

  const suggestionBannerStyle = useMemo(() => {
    if (!selectedBrandBaseColor) return {};
    return {
      "--suggestion-bg": hexToRgba(selectedBrandBaseColor, 0.15),
      "--suggestion-border": hexToRgba(selectedBrandBaseColor, 0),
      "--suggestion-accent": selectedBrandBaseColor,
    } as React.CSSProperties;
  }, [selectedBrandBaseColor]);

  useEffect(() => {
    if (!selectedBrand) return setSelectedBrandLogo(null);
    let cancelled = false;
    fetchValidBrandLogo(selectedBrand, selectedSiteUrl)
      .then((url) => !cancelled && setSelectedBrandLogo(url))
      .catch(() => !cancelled && setSelectedBrandLogo(null));
    return () => {
      cancelled = true;
    };
  }, [selectedBrand, selectedSiteUrl]);

  return {
    brandBannerStyle,
    suggestionBannerStyle,
    selectedBrandLogo,
    selectedBrandBaseColor,
  };
}
