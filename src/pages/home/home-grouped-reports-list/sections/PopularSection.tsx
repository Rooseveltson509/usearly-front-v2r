import React, { useMemo } from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import Avatar from "@src/components/shared/Avatar";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import PopularReportList from "../../popular/PopularReportList";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import {
  matchesPopularReportSearch,
  normalizeSearchText,
} from "@src/utils/reportSearch";
import type { PopularReport } from "@src/types/Reports";

interface PopularSectionProps {
  selectedBrand?: string;
  selectedCategory?: string;
  selectedSiteUrl?: string;
  totalCount: number;
  filteredByCategory: any[];
  expandedItems: Record<string, boolean>;
  setExpandedItems: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  reportData: { data?: any; loading: boolean };
  popularEngagementData: { data?: any; loading: boolean };
  loaderRef: React.RefObject<HTMLDivElement | null>;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

/**
 * 🌟 Section Popular — affiche les signalements populaires
 */
const PopularSection: React.FC<PopularSectionProps> = ({
  selectedBrand,
  selectedCategory,
  selectedSiteUrl,
  totalCount,
  filteredByCategory,
  expandedItems,
  setExpandedItems,
  reportData,
  popularEngagementData,
  loaderRef,
  searchTerm,
  setSearchTerm,
}) => {
  // ✅ Tous les hooks doivent être avant tout return
  const brandsToLoad = useMemo(() => {
    const list = new Map<string, string>();
    if (selectedBrand) list.set(selectedBrand, selectedSiteUrl ?? "");
    (popularEngagementData?.data || []).forEach((item: any) =>
      list.set(item.marque, item.siteUrl ?? ""),
    );
    return Array.from(list.entries()).map(([brand, siteUrl]) => ({
      brand,
      siteUrl,
    }));
  }, [selectedBrand, selectedSiteUrl, popularEngagementData]);

  const logos = useBrandLogos(brandsToLoad);
  // 📌 Ouvrir toutes les cartes populaires par défaut
  React.useEffect(() => {
    const data = reportData?.data;
    if (!data || data.length === 0) return;

    const initial: Record<string, boolean> = {};

    data.forEach((item: any) => {
      const key = `${item.reportingId}-${item.id}`;
      initial[key] = true; // 👈 Ouvert par défaut
    });

    setExpandedItems(initial);
  }, [reportData.data]);

  const normalizedSearchTerm = searchTerm
    ? normalizeSearchText(searchTerm)
    : "";

  const filteredPrimaryData = useMemo(() => {
    const source = (reportData.data ?? []) as PopularReport[];
    if (!normalizedSearchTerm) return source;
    return source.filter((item) =>
      matchesPopularReportSearch(item, normalizedSearchTerm),
    );
  }, [reportData.data, normalizedSearchTerm]);

  const filteredEngagementData = useMemo(() => {
    const source = (popularEngagementData.data ?? []) as PopularReport[];
    if (!normalizedSearchTerm) return source;
    return source.filter((item) =>
      matchesPopularReportSearch(item, normalizedSearchTerm),
    );
  }, [popularEngagementData.data, normalizedSearchTerm]);

  const hasAnyData =
    (reportData.data?.length ?? 0) > 0 ||
    (popularEngagementData.data?.length ?? 0) > 0;
  const hasSearchResults =
    filteredPrimaryData.length > 0 || filteredEngagementData.length > 0;
  console.log("POPULAR ITEM:", popularEngagementData?.data?.[0]);

  // 🕓 État chargement
  if (reportData.loading) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={true}
        hasMore={false}
        error={null}
      />
    );
  }

  // ⚠️ État vide
  if (!hasAnyData) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        Aucun signalement populaire pour le moment.
      </div>
    );
  }

  if (!hasSearchResults && normalizedSearchTerm) {
    return (
      <div className="no-search-results">
        <p>Aucun résultat pour "{searchTerm}"</p>
        <button
          type="button"
          onClick={() => setSearchTerm("")}
          className="clear-button"
        >
          Effacer
        </button>
      </div>
    );
  }

  // ✅ Contenu principal
  return (
    <>
      {/* 🔹 Liste principale des signalements */}
      {/*      <PopularReportList
        data={filteredPrimaryData}
        expandedItems={expandedItems}
        handleToggle={(key: string) =>
          setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
        }
        loading={reportData.loading}
      /> */}

      {/* 🔹 Résumé de la marque sélectionnée */}
      {selectedBrand && (
        <div className="selected-brand-summary">
          <div className="selected-brand-summary__brand">
            <div className="selected-brand-summary__logo">
              <Avatar
                avatar={logos[selectedBrand] || FALLBACK_BRAND_PLACEHOLDER}
                pseudo={selectedBrand}
                type="brand"
              />
            </div>
            <div className="selected-brand-summary__info-container">
              {selectedCategory ? (
                <>
                  <span className="count">{filteredByCategory.length}</span>
                  <span className="text">
                    Signalement
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
                    Signalement{totalCount > 1 ? "s" : ""} sur{" "}
                    {` ${capitalizeFirstLetter(selectedBrand)}`}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Deuxième liste (engagement populaire) */}
      <PopularReportList
        data={filteredEngagementData}
        expandedItems={expandedItems}
        handleToggle={(key: string) =>
          setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
        }
        loading={popularEngagementData.loading}
      />
    </>
  );
};

export default PopularSection;
