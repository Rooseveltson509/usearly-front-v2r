import React, { useMemo, useEffect } from "react";
import HomeFiltersSuggestion from "../HomeFiltersSuggestion";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import FilterIllustration from "../home-illustration/FilterIllustration";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import Avatar from "@src/components/shared/Avatar";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";

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
  brandBannerStyle: React.CSSProperties; // ✅ ajouté pour compatibilité avec Home
  suggestionsForDisplay: any[];
  selectedSiteUrl?: string;
  setSelectedSiteUrl?: (url?: string) => void;
  totalCount: number;
  filteredByCategory: any[];
  isLoading: boolean;
}

const SuggestionTab: React.FC<Props> = ({
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
  // 🧩 Si aucun siteUrl défini mais suggestions disponibles → on prend celui du premier
  useEffect(() => {
    if (!selectedSiteUrl && suggestionsForDisplay?.length > 0) {
      const first = suggestionsForDisplay[0];
      if (first?.siteUrl) {
        setSelectedSiteUrl?.(first.siteUrl);
      }
    }
  }, [selectedSiteUrl, suggestionsForDisplay, setSelectedSiteUrl]);

  // 🧠 Prépare la récupération dynamique du logo
  const brandEntries = useMemo(() => {
    return selectedBrand
      ? [{ brand: selectedBrand, siteUrl: selectedSiteUrl }]
      : [];
  }, [selectedBrand, selectedSiteUrl]);

  const brandLogos = useBrandLogos(brandEntries);

  // 🪶 Résout le logo dynamique
  const resolvedLogo = useMemo(() => {
    if (!selectedBrand) return null;

    const brandKey = selectedBrand.toLowerCase().trim();
    const domain =
      selectedSiteUrl
        ?.replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .split("/")[0]
        .toLowerCase() || "";

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

  return (
    <div
      className={`suggestion-banner-container ${
        selectedBrand ? "banner-filtered" : `banner-${activeFilter}`
      }`}
      style={selectedBrand ? suggestionBannerStyle : brandBannerStyle}
    >
      <div className="feedback-list-wrapper">
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

        {isLoading ? (
          <SqueletonAnime
            loaderRef={{ current: null }}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : (
          <div>
            <div className="selected-brand-heading">
              {selectedBrand && (
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
              )}
            </div>

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
          </div>
        )}
      </div>

      <aside className="right-panel">
        <FilterIllustration
          filter={activeFilter}
          selectedBrand={selectedBrand}
          siteUrl={selectedSiteUrl}
          selectedCategory={selectedCategory}
          onglet="suggestion"
        />
      </aside>
    </div>
  );
};

export default SuggestionTab;
