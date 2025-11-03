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

// 🔧 Fonction utilitaire pour normaliser le domaine
function normalizeDomain(siteUrl?: string | null): string | undefined {
  if (!siteUrl) return undefined;
  return siteUrl
    .replace(/^https?:\/\//, "")
    .replace(/^www\d?\./, "")
    .split("/")[0]
    .trim()
    .toLowerCase();
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
      {reportsToDisplay.map((report, i) => {
        // Normalisation du siteUrl — fallback automatique si absent
        const normalizedDomain =
          normalizeDomain(report.siteUrl) ||
          `${report.marque?.toLowerCase().replace(/\s+/g, "")}.com`;
        const safeSiteUrl = `https://${normalizedDomain}`;

        return (
          <FlatSubcategoryBlock
            key={`${report.reportingId}-${report.subCategory}-${i}`}
            brand={report.marque}
            siteUrl={safeSiteUrl}
            subcategory={report.subCategory}
            descriptions={report.descriptions || []}
            capture={report.capture}
            hideFooter={true}
          />
        );
      })}
    </div>
  );
};

export default BrandFilteredSection;
