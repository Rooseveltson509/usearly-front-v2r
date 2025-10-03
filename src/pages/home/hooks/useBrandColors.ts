// #e8e8e8
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

  const selectedBrandBaseColor = useMemo(() => {
    if (!selectedBrand) return null;
    return brandColors[selectedBrand.toLowerCase()] || brandColors.default;
  }, [selectedBrand]);

  const brandBannerStyle = useMemo(() => {
    if (!selectedBrandBaseColor) return {};
    return {
      "--brand-banner-bg": hexToRgba(selectedBrandBaseColor, 0.18),
      "--brand-banner-border": hexToRgba(selectedBrandBaseColor, 0.3),
      "--brand-banner-accent": selectedBrandBaseColor,
    } as React.CSSProperties;
  }, [selectedBrandBaseColor]);

  const suggestionBannerStyle = useMemo(() => {
    const fallback = "#F1E9FF";
    const baseColor = brandColors[selectedBrand.toLowerCase()] || fallback;
    return {
      "--suggestion-bg": hexToRgba(baseColor, 0.15),
      "--suggestion-border": hexToRgba(baseColor, 0),
      "--suggestion-accent": baseColor,
    } as React.CSSProperties;
  }, [activeTab, feedbackData, selectedBrand]);

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
