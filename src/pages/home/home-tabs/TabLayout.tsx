import React from "react";
import FilterIllustration from "../home-illustration/FilterIllustration";

interface TabLayoutProps {
  /** Classe container : cdc-banner-container | suggestion-banner-container */
  containerClassName: string;
  /** Style : brandBannerStyle ou suggestionBannerStyle */
  bannerStyle: React.CSSProperties;

  /** Filtre actif (pour FilterIllustration) */
  activeFilter: string;
  /** onglet: "coupdecoeur" | "suggestion" */
  onglet: "coupdecoeur" | "suggestion";

  /** Marque / URL / Catégorie */
  selectedBrand?: string;
  selectedSiteUrl?: string;
  selectedCategory?: string;

  /** Affiche dans la colonne centre les filtres */
  renderFilters: () => React.ReactNode;

  /** Affiche la liste (FeedbackView ou skeleton de la liste) */
  renderContent: () => React.ReactNode;

  /** isLoading complet OU isInitialLoading */
  isLoading: boolean;
}

const TabLayout: React.FC<TabLayoutProps> = ({
  containerClassName,
  bannerStyle,
  activeFilter,
  onglet,
  selectedBrand,
  selectedSiteUrl,
  selectedCategory,
  renderFilters,
  renderContent,
}) => {
  return (
    <div
      className={`${containerClassName} ${
        selectedBrand ? "banner-filtered" : `banner-${activeFilter}`
      }`}
      style={bannerStyle}
    >
      {/* -----------------------------
          Colonne centrale
      --------------------------------*/}
      <div
        className={`feedback-list-wrapper ${selectedBrand ? "brand-selected" : ""}`}
      >
        {/* 🔥 Filtres TOUJOURS visibles (loading ou pas) */}
        {renderFilters()}

        <div
          className={`feedback-view-container ${selectedBrand ? "brand-selected" : ""}`}
        >
          {/* 🔥 Contenu (liste ou skeleton) */}
          {renderContent()}
        </div>
      </div>

      {/* -----------------------------
          Colonne droite — BANDEAU
      --------------------------------*/}
      <aside className="right-panel">
        <FilterIllustration
          filter={activeFilter}
          selectedBrand={selectedBrand}
          siteUrl={selectedSiteUrl}
          selectedCategory={selectedCategory}
          onglet={onglet}
        />
      </aside>
    </div>
  );
};

export default TabLayout;
