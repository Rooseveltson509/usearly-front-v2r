import React, { useMemo, useEffect } from "react";
import HomeFiltersSuggestion from "../HomeFiltersSuggestion";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import Avatar from "@src/components/shared/Avatar";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import TabLayout from "./TabLayout";

interface Props {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  selectedBrand: string;
  handleSuggestionBrandChange: (b: string, siteUrl?: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  suggestionCategories: string[];
  suggestionSearch: string;
  setSuggestionSearch: (s: string) => void;
  suggestionBannerStyle: React.CSSProperties;
  brandBannerStyle: React.CSSProperties;
  suggestionsForDisplay: any[];
  selectedSiteUrl?: string;
  setSelectedSiteUrl?: (url?: string) => void;
  totalCount: number;
  filteredByCategory: any[];
  isLoading: boolean;
}

const SuggestionTabEnhanced: React.FC<Props> = ({
  activeFilter,
  setActiveFilter,
  selectedBrand,
  handleSuggestionBrandChange,
  selectedCategory,
  setSelectedCategory,
  suggestionCategories,
  suggestionSearch,
  setSuggestionSearch,
  suggestionBannerStyle,
  brandBannerStyle,
  suggestionsForDisplay,
  selectedSiteUrl,
  setSelectedSiteUrl,
  totalCount,
  filteredByCategory,
  isLoading,
}) => {
  // -----------------------------
  // Auto-assign du siteUrl
  // -----------------------------
  useEffect(() => {
    if (!selectedSiteUrl && suggestionsForDisplay?.length > 0) {
      const first = suggestionsForDisplay[0];
      if (first?.siteUrl) {
        setSelectedSiteUrl?.(first.siteUrl);
      }
    }
  }, [selectedSiteUrl, suggestionsForDisplay, setSelectedSiteUrl]);

  // -----------------------------
  // Logos dynamiques
  // -----------------------------
  const brandEntries = useMemo(() => {
    return selectedBrand
      ? [{ brand: selectedBrand, siteUrl: selectedSiteUrl }]
      : [];
  }, [selectedBrand, selectedSiteUrl]);

  const brandLogos = useBrandLogos(brandEntries);

  const resolvedLogo = useMemo(() => {
    if (!selectedBrand) return null;

    const brandKey = selectedBrand.toLowerCase().trim();
    const domain =
      selectedSiteUrl
        ?.replace(/^https?:\/\//, "")
        ?.replace(/^www\./, "")
        ?.split("/")[0]
        ?.toLowerCase() || "";

    const possibleKeys = [
      `${brandKey}|${domain}`,
      `${brandKey}|${brandKey}.com`,
      brandKey,
    ];

    for (const k of possibleKeys) {
      const logo = brandLogos[k];
      if (logo && logo !== FALLBACK_BRAND_PLACEHOLDER) return logo;
    }

    return null;
  }, [selectedBrand, selectedSiteUrl, brandLogos]);

  // ==========================================================
  //          UTILISATION DU LAYOUT FACTORISÉ
  // ==========================================================
  return (
    <TabLayout
      containerClassName="suggestion-banner-container"
      bannerStyle={selectedBrand ? suggestionBannerStyle : brandBannerStyle}
      activeFilter={activeFilter}
      onglet="suggestion"
      selectedBrand={selectedBrand}
      selectedCategory={selectedCategory}
      selectedSiteUrl={selectedSiteUrl}
      isLoading={isLoading}
      renderFilters={() => (
        <HomeFiltersSuggestion
          filter={activeFilter}
          setFilter={setActiveFilter}
          selectedBrand={selectedBrand}
          setSelectedBrand={handleSuggestionBrandChange}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={suggestionCategories}
          searchQuery={suggestionSearch}
          onSearchChange={setSuggestionSearch}
          siteUrl={selectedSiteUrl}
        />
      )}
      renderContent={() =>
        isLoading ? (
          <SqueletonAnime
            loaderRef={{ current: null }}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : (
          <>
            {/* Header */}
            {selectedBrand && (
              <div className="selected-brand-heading">
                <div className="selected-brand-summary">
                  <div className="selected-brand-summary__brand">
                    <div className="selected-brand-summary__logo">
                      <Avatar
                        avatar={resolvedLogo}
                        pseudo={selectedBrand}
                        type="brand"
                        preferBrandLogo={true}
                        siteUrl={selectedSiteUrl}
                      />
                    </div>

                    <div className="selected-brand-summary__info-container">
                      {selectedCategory ? (
                        <>
                          <span className="count">
                            {filteredByCategory.length}
                          </span>
                          <span className="text">
                            Suggestion
                            {filteredByCategory.length > 1 ? "s" : ""} lié
                            {filteredByCategory.length > 1 ? "s" : ""} à «{" "}
                            <b>{selectedCategory}</b> » sur{" "}
                            {` ${capitalizeFirstLetter(selectedBrand)}`}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="count">{totalCount}</span>
                          <span className="text">
                            suggestion{totalCount > 1 ? "s" : ""} sur{" "}
                            {` ${capitalizeFirstLetter(selectedBrand)}`}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Liste */}
            <FeedbackView
              activeTab="suggestion"
              viewMode="flat"
              currentState={{
                data: suggestionsForDisplay,
                loading: isLoading,
                hasMore: false,
                error: null,
              }}
              openId={null}
              setOpenId={() => {}}
              groupOpen={{}}
              setGroupOpen={() => {}}
              selectedBrand={selectedBrand}
              selectedCategory={selectedCategory}
              selectedSiteUrl={selectedSiteUrl}
              renderCard={() => <></>}
            />
          </>
        )
      }
    />
  );
};

export default SuggestionTabEnhanced;
