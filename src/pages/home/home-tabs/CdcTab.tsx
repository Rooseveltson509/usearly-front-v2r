import React, { useMemo, useEffect } from "react";
import HomeFiltersCdc from "../HomeFiltersCdc";
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
  setSelectedBrand: (b: string) => void;
  selectedCategory: string;
  brandBannerStyle: React.CSSProperties;
  setSelectedCategory: (c: string) => void;
  coupDeCoeurCategories: string[];
  coupDeCoeursForDisplay: any[];
  filteredByCategory: any[];
  totalCount: number;
  selectedSiteUrl?: string;
  setSelectedSiteUrl?: (url?: string) => void; // ✅ ajouté
  isLoading: boolean;
}

const CdcTab: React.FC<Props> = ({
  activeFilter,
  setActiveFilter,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  brandBannerStyle,
  coupDeCoeurCategories,
  coupDeCoeursForDisplay,
  filteredByCategory,
  totalCount,
  selectedSiteUrl,
  setSelectedSiteUrl,
  isLoading,
}) => {
  // ✅ Si aucun siteUrl défini mais des données arrivent, on prend celui du premier coup de cœur
  useEffect(() => {
    if (!selectedSiteUrl && coupDeCoeursForDisplay?.length > 0) {
      const first = coupDeCoeursForDisplay[0];
      if (first?.siteUrl) {
        setSelectedSiteUrl?.(first.siteUrl);
      }
    }
  }, [selectedSiteUrl, coupDeCoeursForDisplay, setSelectedSiteUrl]);

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
      className={`cdc-banner-container ${
        selectedBrand ? "banner-filtered" : `banner-${activeFilter}`
      }`}
      style={brandBannerStyle}
    >
      <div className="feedback-list-wrapper">
        {isLoading ? (
          <SqueletonAnime
            loaderRef={{ current: null }}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : (
          <div className="feedback-view-container">
            <div className="feedback-view-wrapper">
              <HomeFiltersCdc
                filter={activeFilter}
                setFilter={setActiveFilter}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                availableCategories={coupDeCoeurCategories}
                siteUrl={selectedSiteUrl}
                setSelectedSiteUrl={setSelectedSiteUrl} // ✅ ajouté
              />

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
                                Coup de Cœur
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
                                Coup de Cœur
                                {totalCount > 1 ? "s" : ""} sur{" "}
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
                  activeTab="coupdecoeur"
                  viewMode="flat"
                  currentState={{
                    data: coupDeCoeursForDisplay,
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
            </div>

            <aside className="right-panel">
              <FilterIllustration
                filter={activeFilter}
                selectedBrand={selectedBrand}
                siteUrl={selectedSiteUrl}
                selectedCategory={selectedCategory}
                onglet="coupdecoeur"
              />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default CdcTab;
