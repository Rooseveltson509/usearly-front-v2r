import React, { useState, useCallback, useMemo } from "react";
import "./Home.scss";
import { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import UserStatsCard from "@src/components/user-profile/UserStatsCard";
import PurpleBanner from "./components/purpleBanner/PurpleBanner";
import { useFeedbackData } from "./hooks/useFeedbackData";
import { useBrandColors } from "./hooks/useBrandColors";
import { useCategories } from "./hooks/useCategories";

// Sous-onglets
import ReportTab from "./home-tabs/ReportTab";
import CdcTab from "./home-tabs/CdcTab";
import SuggestionTab from "./home-tabs/SuggestionTab";

function Home() {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState("confirmed");
  const [selectedSiteUrl, setSelectedSiteUrl] = useState<string | undefined>();
  const [suggestionSearch, setSuggestionSearch] = useState("");

  // 🎯 Hooks factorisés
  const {
    feedbackData,
    isLoading,
    displayedCount,
    suggestionsForDisplay,
    coupDeCoeursForDisplay,
  } = useFeedbackData(
    activeTab,
    activeFilter,
    selectedBrand,
    selectedCategory,
    suggestionSearch,
  );

  const { brandBannerStyle, suggestionBannerStyle, selectedBrandLogo } =
    useBrandColors(activeTab, selectedBrand, feedbackData, selectedSiteUrl);

  const { suggestionCategories, coupDeCoeurCategories } = useCategories(
    activeTab,
    feedbackData,
    selectedBrand,
  );

  // ✅ Handler suggestion (remis ici pour la logique simple)
  const handleSuggestionBrandChange = useCallback((brand: string) => {
    setSelectedBrand(brand);
    setSelectedCategory("");
    setSuggestionSearch("");
    setActiveFilter(brand ? "brandSolo" : "allSuggest");
  }, []);

  // nombre total affiché (sans distinction de catégorie)
  const totalCount = displayedCount;

  // liste “filtrée par catégorie” (uniquement quand une category est choisie)
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
            setSelectedBrand={setSelectedBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setSelectedSiteUrl={setSelectedSiteUrl}
            brandBannerStyle={brandBannerStyle}
            displayedCount={displayedCount}
          />
        )}

        {activeTab === "coupdecoeur" && (
          <CdcTab
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            brandBannerStyle={brandBannerStyle}
            coupDeCoeurCategories={coupDeCoeurCategories}
            coupDeCoeursForDisplay={coupDeCoeursForDisplay}
            totalCount={totalCount}
            filteredByCategory={filteredByCategory}
            selectedSiteUrl={selectedSiteUrl}
            isLoading={isLoading}
          />
        )}

        {activeTab === "suggestion" && (
          <SuggestionTab
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
            displayedCount={displayedCount}
            totalCount={totalCount}
            filteredByCategory={filteredByCategory}
            selectedSiteUrl={selectedSiteUrl}
            selectedBrandLogo={selectedBrandLogo}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}

export default Home;
