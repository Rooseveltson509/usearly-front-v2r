import React from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import Avatar from "@src/components/shared/Avatar";
import { getBrandLogo } from "@src/utils/brandLogos";
import { capitalizeFirstLetter } from "@src/utils/stringUtils";
import ConfirmedReportsList from "../../confirm-reportlist/ConfirmReportsList";

interface ConfirmedSectionProps {
  selectedBrand?: string;
  selectedCategory?: string;
  selectedSiteUrl?: string;
  totalCount: number;
  filteredByCategory: any[];
  expandedItems: Record<string, boolean>;
  setExpandedItems: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  reportData: { data?: any; loading: boolean };
  loaderRef: React.RefObject<HTMLDivElement | null>; // ✅ ajouté ici
}

/**
 * 🟢 Section Confirmed
 * Représente le rendu du filtre "confirmed" (signalements confirmés)
 */
const ConfirmedSection: React.FC<ConfirmedSectionProps> = ({
  selectedBrand,
  selectedCategory,
  selectedSiteUrl,
  totalCount,
  filteredByCategory,
  expandedItems,
  setExpandedItems,
  searchTerm,
  setSearchTerm,
  reportData,
  loaderRef, // ✅ ajouté
}) => {
  // 🕓 État de chargement
  if (reportData.loading) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef} // ✅ obligatoire
        loading={true}
        hasMore={false}
        error={null}
      />
    );
  }

  // ⚠️ Aucun résultat
  if (!reportData.data || reportData.data.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        Aucun signalement confirmé pour le moment.
      </div>
    );
  }

  // ✅ Contenu principal
  return (
    <>
      {selectedBrand && (
        <div className="selected-brand-summary">
          <div className="selected-brand-summary__brand">
            <div className="selected-brand-summary__logo">
              <Avatar
                avatar={getBrandLogo(selectedBrand, selectedSiteUrl)}
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

      <ConfirmedReportsList
        expandedItems={expandedItems}
        handleToggle={(key: string) =>
          setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }))
        }
        searchTerm={searchTerm}
        onClearSearchTerm={() => setSearchTerm("")}
      />
    </>
  );
};

export default ConfirmedSection;
