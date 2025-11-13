import React, { useState, useCallback, useMemo } from "react";
import "./Home.scss";
import { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import UserStatsCard from "@src/components/user-profile/UserStatsCard";
import PurpleBanner from "./components/purpleBanner/PurpleBanner";
import { useFeedbackData } from "./hooks/useFeedbackData";
import { useBrandColors } from "./hooks/useBrandColors";
import { useCategories } from "./hooks/useCategories";

import ReportTab from "./home-tabs/ReportTab";
import CdcTabEnhanced from "./home-tabs/CdcTabEnhanced";
import SuggestionTabEnhanced from "./home-tabs/SuggestionTabEnhanced";

function Home() {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState("chrono");
  const [suggestionSearch, setSuggestionSearch] = useState("");
  const [selectedSiteUrl, setSelectedSiteUrl] = useState<string | undefined>();

  // ✅ Gestion de la marque
  const handleSetBrand = useCallback((brand: string, siteUrl?: string) => {
    setSelectedBrand(brand);
    setSelectedSiteUrl(siteUrl);
  }, []);

  // ✅ Appel du hook au niveau du composant (conforme aux règles React)
  const {
    feedbackData,
    isLoading,
    isInitialLoading,
    displayedCount,
    suggestionsForDisplay,
    coupDeCoeursForDisplay,
    hasMore,
    loadMore,
  } = useFeedbackData(
    activeTab,
    activeFilter,
    selectedBrand,
    selectedCategory,
    suggestionSearch,
  );

  const { brandBannerStyle, suggestionBannerStyle } = useBrandColors(
    activeTab,
    selectedBrand,
    feedbackData,
    selectedSiteUrl,
  );

  const { suggestionCategories, coupDeCoeurCategories } = useCategories(
    activeTab,
    feedbackData,
    selectedBrand,
  );

  const handleSuggestionBrandChange = useCallback(
    (brand: string, siteUrl?: string) => {
      handleSetBrand(brand, siteUrl);
      setSelectedCategory("");
      setSelectedMainCategory("");
      setSuggestionSearch("");
      setActiveFilter(brand ? "brandSolo" : "allSuggest");
    },
    [handleSetBrand],
  );

  const totalCount = displayedCount;

  const filteredByCategory = useMemo(() => {
    if (!selectedCategory) return [];
    if (activeTab === "coupdecoeur") return coupDeCoeursForDisplay;
    if (activeTab === "suggestion") return suggestionsForDisplay;
    return [];
  }, [
    activeTab,
    selectedCategory,
    coupDeCoeursForDisplay,
    suggestionsForDisplay,
  ]);

  return (
    <div className="home-page">
      <PurpleBanner activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="user-main-content">
        <aside className="left-panel">
          <UserStatsCard />
        </aside>

        {activeTab === "report" && (
          <ReportTab
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedBrand={selectedBrand}
            setSelectedBrand={handleSetBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedMainCategory={selectedMainCategory}
            setSelectedMainCategory={setSelectedMainCategory}
            setSelectedSiteUrl={setSelectedSiteUrl}
            brandBannerStyle={brandBannerStyle}
            selectedSiteUrl={selectedSiteUrl}
            displayedCount={displayedCount}
          />
        )}

        {activeTab === "coupdecoeur" && (
          <CdcTabEnhanced
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedBrand={selectedBrand}
            setSelectedBrand={handleSetBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            brandBannerStyle={brandBannerStyle}
            coupDeCoeurCategories={coupDeCoeurCategories}
            coupDeCoeursForDisplay={coupDeCoeursForDisplay}
            totalCount={totalCount}
            filteredByCategory={filteredByCategory}
            selectedSiteUrl={selectedSiteUrl}
            setSelectedSiteUrl={setSelectedSiteUrl}
            isLoading={isLoading}
            isInitialLoading={isInitialLoading}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        )}

        {activeTab === "suggestion" && (
          <SuggestionTabEnhanced
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedBrand={selectedBrand}
            handleSuggestionBrandChange={handleSuggestionBrandChange}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            suggestionCategories={suggestionCategories}
            suggestionSearch={suggestionSearch}
            setSuggestionSearch={setSuggestionSearch}
            suggestionBannerStyle={suggestionBannerStyle}
            brandBannerStyle={brandBannerStyle}
            suggestionsForDisplay={suggestionsForDisplay}
            totalCount={totalCount}
            filteredByCategory={filteredByCategory}
            selectedSiteUrl={selectedSiteUrl}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}

export default Home;
