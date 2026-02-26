import React, { useMemo, useEffect, useRef } from "react";
import HomeFiltersCdc from "../HomeFiltersCdc";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import Avatar from "@src/components/shared/Avatar";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import "./CdcTab.scss";
import TabLayout from "./TabLayout";

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
  setSelectedSiteUrl?: (url?: string) => void;
  isLoading: boolean;
  isInitialLoading?: boolean;
  hasMore?: boolean;
  loadMore?: () => void;
}

const CdcTabEnhanced: React.FC<Props> = ({
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
  isInitialLoading = false,
  hasMore = false,
  loadMore = () => {},
}) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  // -------------------------------
  // Auto-assign du siteUrl
  // -------------------------------
  useEffect(() => {
    if (!selectedSiteUrl && coupDeCoeursForDisplay?.length > 0) {
      const first = coupDeCoeursForDisplay[0];
      if (first?.siteUrl) setSelectedSiteUrl?.(first.siteUrl);
    }
  }, [selectedSiteUrl, coupDeCoeursForDisplay, setSelectedSiteUrl]);

  // -------------------------------
  // Logos dynamiques
  // -------------------------------
  const brandEntries = useMemo(
    () =>
      selectedBrand ? [{ brand: selectedBrand, siteUrl: selectedSiteUrl }] : [],
    [selectedBrand, selectedSiteUrl],
  );

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
      const l = brandLogos[k];
      if (l && l !== FALLBACK_BRAND_PLACEHOLDER) return l;
    }
    return null;
  }, [selectedBrand, selectedSiteUrl, brandLogos]);

  // -------------------------------
  // Infinite scroll (inchangé)
  // -------------------------------
  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { root: null, rootMargin: "300px", threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  const feedbackState = useMemo(
    () => ({
      data: coupDeCoeursForDisplay,
      loading: isLoading,
      hasMore,
      error: null,
    }),
    [coupDeCoeursForDisplay, isLoading, hasMore],
  );

  // ==========================================================
  //               UTILISATION DU LAYOUT FACTORISÉ
  // ==========================================================
  return (
    <TabLayout
      containerClassName="cdc-banner-container"
      bannerStyle={brandBannerStyle}
      activeFilter={activeFilter}
      onglet="coupdecoeur"
      selectedBrand={selectedBrand}
      selectedCategory={selectedCategory}
      selectedSiteUrl={selectedSiteUrl}
      isLoading={isInitialLoading} // important
      renderFilters={() => (
        <HomeFiltersCdc
          filter={activeFilter}
          setFilter={setActiveFilter}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          availableCategories={coupDeCoeurCategories}
          siteUrl={selectedSiteUrl}
          setSelectedSiteUrl={setSelectedSiteUrl}
        />
      )}
      renderContent={() =>
        isInitialLoading ? (
          <SqueletonAnime
            loaderRef={{ current: null }}
            loading={true}
            hasMore={false}
            error={null}
          />
        ) : (
          <>
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
              </div>
            )}

            <FeedbackView
              activeTab="coupdecoeur"
              viewMode="flat"
              currentState={feedbackState}
              openId={null}
              setOpenId={() => {}}
              groupOpen={{}}
              setGroupOpen={() => {}}
              selectedBrand={selectedBrand}
              selectedCategory={selectedCategory}
              selectedSiteUrl={selectedSiteUrl}
              renderCard={() => <></>}
            />

            {!isLoading && hasMore && (
              <div ref={observerRef} className="infinite-scroll-trigger" />
            )}

            {!hasMore && !isLoading && coupDeCoeursForDisplay.length > 0 && (
              <div className="end-of-list">
                <p className="end-text">Fin de la liste 🎉</p>
                <p>
                  <u>Remonter la liste</u>
                </p>
              </div>
            )}
          </>
        )
      }
    />
  );
};

export default CdcTabEnhanced;
