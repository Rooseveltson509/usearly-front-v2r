import React from "react";
import HomeGroupedReportsList from "../HomeGroupedReportsList";
import FilterIllustration from "../home-illustration/FilterIllustration";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";

interface Props {
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  selectedBrand: string;
  setSelectedBrand: (b: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
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
  setSelectedSiteUrl,
  brandBannerStyle,
  displayedCount,
}) => {
  return (
    <div
      className={`report-banner-container ${
        selectedBrand || selectedCategory
          ? "banner-filtered"
          : `banner-${activeFilter}`
      }`}
      style={brandBannerStyle}
    >
      <div className="feedback-list-wrapper">
        <HomeGroupedReportsList
          activeTab={"report" as FeedbackType}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          viewMode={activeFilter === "confirmed" ? "confirmed" : "flat"}
          onViewModeChange={() => {}}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedSiteUrl={setSelectedSiteUrl}
          totalityCount={displayedCount}
        />
      </div>
      <aside className="right-panel">
        <FilterIllustration
          filter={activeFilter}
          selectedBrand={selectedBrand}
          siteUrl={undefined}
          selectedCategory={selectedCategory}
          onglet="signalement"
        />
      </aside>
    </div>
  );
};

export default ReportTab;
