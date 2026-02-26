import React, { useCallback, useState } from "react";
import HomeGroupedReportsList from "../home-grouped-reports-list/HomeGroupedReportsList";
import FilterIllustration from "../home-illustration/FilterIllustration";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import SearchBar from "../components/searchBar/SearchBar";

interface Props {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  selectedBrand: string;
  setSelectedBrand: (b: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  selectedMainCategory: string;
  setSelectedMainCategory: (c: string) => void;
  selectedSiteUrl?: string;
  setSelectedSiteUrl: (url?: string) => void;
  brandBannerStyle: React.CSSProperties;
  displayedCount: number;
}

const ReportTab: React.FC<Props> = ({
  activeFilter,
  setActiveFilter,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedMainCategory,
  setSelectedMainCategory,
  setSelectedSiteUrl,
  selectedSiteUrl,
  brandBannerStyle,
  displayedCount,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchTermChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const bannerClassName = [
    "report-banner-container",
    selectedBrand || selectedCategory
      ? "banner-filtered"
      : `banner-${activeFilter}`,
    selectedBrand ? "brandSelected" : "",
    selectedMainCategory || selectedCategory ? "brandCategorySelected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={bannerClassName} style={brandBannerStyle}>
      <div className="feedback-list-wrapper">
        <HomeGroupedReportsList
          activeTab={"report" as FeedbackType}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          viewMode={
            activeFilter === "confirmed"
              ? "confirmed"
              : activeFilter === "chrono"
                ? "chrono"
                : "flat"
          }
          onViewModeChange={() => {}}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedMainCategory={selectedMainCategory}
          setSelectedMainCategory={setSelectedMainCategory}
          setSelectedSiteUrl={setSelectedSiteUrl}
          selectedSiteUrl={selectedSiteUrl}
          totalityCount={displayedCount}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
        />

        <div className="end-of-list">
          <p className="end-text">Fin de la liste 🎉</p>
          <p>
            <u>Remonter la liste</u>
          </p>
        </div>
      </div>
      <aside className="right-panel">
        <SearchBar
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder="Rechercher un signalement"
        />
        <FilterIllustration
          filter={activeFilter}
          selectedBrand={selectedBrand}
          siteUrl={selectedSiteUrl}
          selectedCategory={selectedCategory}
          onglet="report"
        />
      </aside>
    </div>
  );
};

export default ReportTab;
