import React from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import Avatar from "@src/components/shared/Avatar";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import FlatSubcategoryBlock from "../../confirm-reportlist/FlatSubcategoryBlock";

interface BrandFilteredSectionProps {
  selectedBrand?: string;
  selectedCategory?: string;
  selectedSiteUrl?: string;
  totalCount: number;
  filteredByCategory: any[];
  loadingFiltered: boolean;
  reportsToDisplay: any[];
  getBrandLogo: (brand: string, siteUrl?: string) => string;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * 🏷️ Section BrandFiltered
 * Affiche les signalements d’une marque ou catégorie spécifique.
 * - Gère le chargement
 * - Gère les cas vides
 * - Affiche les signalements via FlatSubcategoryBlock
 */
const BrandFilteredSection: React.FC<BrandFilteredSectionProps> = ({
  selectedBrand,
  selectedCategory,
  selectedSiteUrl,
  totalCount,
  filteredByCategory,
  loadingFiltered,
  reportsToDisplay,
  /* getBrandLogo, */
  loaderRef,
}) => {
  // 🕓 Chargement
  if (loadingFiltered) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={true}
        hasMore={false}
        error={null}
      />
    );
  }

  // ⚠️ Aucun résultat
  if (!reportsToDisplay.length) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        Aucun signalement trouvé pour ces filtres...
      </div>
    );
  }

  function groupReportsBySubCategory(reports: any[]) {
    const map: Record<string, any> = {};

    for (const r of reports) {
      const sub = r.subCategory || "Autre";

      if (!map[sub]) {
        map[sub] = {
          brand: r.marque,
          siteUrl: r.siteUrl,
          subCategory: sub,
          capture: r.capture,
          descriptions: [],
        };
      }

      // ajoute toutes les descriptions (si déjà explodé)
      if (Array.isArray(r.descriptions)) {
        map[sub].descriptions.push(...r.descriptions);
      }
    }

    return Object.values(map);
  }

  const groupedReports = groupReportsBySubCategory(reportsToDisplay);

  // ✅ Contenu principal
  return (
    <div className="grouped-by-category">
      {selectedBrand && (
        <div className="selected-brand-summary">
          <div className="selected-brand-summary__brand">
            <div className="selected-brand-summary__logo">
              <Avatar
                avatar={null}
                pseudo={selectedBrand}
                type="brand"
                siteUrl={selectedSiteUrl} // ✅ domaine propre
                preferBrandLogo={true}
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

      {/* ✅ Boucle principale avec fallback siteUrl */}
      {groupedReports.map((group, i) => (
        <FlatSubcategoryBlock
          key={`${group.subCategory}-${i}`}
          brand={group.brand}
          siteUrl={group.siteUrl}
          subcategory={group.subCategory}
          descriptions={group.descriptions}
          capture={group.capture}
          hideFooter={true}
        />
      ))}
    </div>
  );
};

export default BrandFilteredSection;
