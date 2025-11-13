import React, { useMemo, useEffect, useRef } from "react";
import HomeFiltersCdc from "../HomeFiltersCdc";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import FilterIllustration from "../home-illustration/FilterIllustration";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import Avatar from "@src/components/shared/Avatar";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import "./CdcTab.scss";

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
  isInitialLoading = false,
  hasMore = false,
  loadMore = () => {},
}) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Auto-set siteUrl
  useEffect(() => {
    if (!selectedSiteUrl && coupDeCoeursForDisplay?.length > 0) {
      const first = coupDeCoeursForDisplay[0];
      if (first?.siteUrl) setSelectedSiteUrl?.(first.siteUrl);
    }
  }, [selectedSiteUrl, coupDeCoeursForDisplay, setSelectedSiteUrl]);

  // Logos dyn
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

  // Scroll infini stabilisé
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

  // --------------------------------------------------------------------------
  //  🔥 FIX : AFFICHER correctement la bannière + filtres même PENDANT le loading
  // --------------------------------------------------------------------------

  if (isInitialLoading) {
    return (
      <div
        className={`cdc-banner-container ${
          selectedBrand ? "banner-filtered" : `banner-${activeFilter}`
        }`}
        style={brandBannerStyle}
      >
        {/* Colonne centre */}
        <div className="feedback-list-wrapper">
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

          <div className="feedback-view-container">
            <SqueletonAnime
              loaderRef={{ current: null }}
              loading={true}
              hasMore={false}
              error={null}
            />
          </div>
        </div>

        {/* Colonne droite — la bannière DOIT être visible pendant le loading */}
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
    );
  }

  // --------------------------------------------------------------------------
  //  🔥 Version normale (pas loading)
  // --------------------------------------------------------------------------

  return (
    <div
      className={`cdc-banner-container ${
        selectedBrand ? "banner-filtered" : `banner-${activeFilter}`
      }`}
      style={brandBannerStyle}
    >
      <div className="feedback-list-wrapper">
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

        <div className="feedback-view-container">
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
            <p className="end-text">🎉 Fin de la liste</p>
          )}
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
  );
};

export default CdcTab;
