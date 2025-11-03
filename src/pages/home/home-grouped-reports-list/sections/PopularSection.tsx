import React, { useMemo } from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import Avatar from "@src/components/shared/Avatar";
import { FALLBACK_BRAND_PLACEHOLDER } from "@src/utils/brandLogos";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import PopularReportList from "../../popular/PopularReportList";
import { useBrandLogos } from "@src/hooks/useBrandLogos";

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
  if (!reportData.data || (reportData.data ?? []).length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        Aucun signalement populaire pour le moment.
      </div>
    );
  }

  // ✅ Contenu principal
  return (
    <>
      {/* 🔹 Liste principale des signalements */}
      <PopularReportList
        data={reportData.data}
        expandedItems={expandedItems}
        handleToggle={(key: string) =>
          setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
        }
        loading={reportData.loading}
      />

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
        data={popularEngagementData.data}
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
