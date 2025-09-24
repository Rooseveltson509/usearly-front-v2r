import React, { useState, useEffect } from "react";
import "./Home.scss";
import FeedbackTabs, { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import UserStatsCard from "@src/components/user-profile/UserStatsCard";
import HomeGroupedReportsList from "./HomeGroupedReportsList";
import FeedbackView from "@src/components/feedbacks/FeedbackView";
import {
  getGroupedReportsByHot,
  getPublicCoupsDeCoeur,
  getPublicSuggestions,
} from "@src/services/feedbackService";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import { getCoupsDeCoeurByBrand, getSuggestionsByBrand } from "@src/services/coupDeCoeurService";
import { fetchFeedbackData } from "@src/services/feedbackFetcher";
import PurpleBanner from "./components/purpleBanner/PurpleBanner";

// 🖼️ Assets
import cdcImgSide from "/assets/filters-cdc/liked-cdc.png"
import bulleIcon from "/assets/images/bulle-top-bar.png";
import emojiIcon from "/assets/images/emoji-top-bar.png";
import chatIcon from "/assets/images/chat-top-bar.svg";
import big from "/assets/images/big.svg";
import medium from "/assets/images/medium.svg";
import small from "/assets/images/small.svg";

// 🧩 Composants spécifiques
import HomeFiltersCdc from "./HomeFiltersCdc";
import HomeFiltersSuggestion from "./HomeFiltersSuggestion";
import FilterIllustration from "./home-illustration/FilterIllustration";

function Home() {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const [feedbackData, setFeedbackData] = useState<(CoupDeCoeur | Suggestion)[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeFilter, setActiveFilter] = useState("confirmed");
  const [viewMode, setViewMode] = useState<"flat" | "chrono" | "confirmed">("confirmed");
  const [selectedSiteUrl, setSelectedSiteUrl] = useState<string | undefined>();

  const [availableFilters, setAvailableFilters] = useState<string[]>([
    "hot", // 👉 affiché en premier
    "chrono",
    "rage",
    "popular",
    "urgent",
  ]);

  // ✅ Vérifie si le filtre "hot" est dispo
  useEffect(() => {
    const checkHotFilter = async () => {
      try {
        const res = await getGroupedReportsByHot(1, 1, "hot");
        const hasHot = res && res.data && Object.keys(res.data).length > 0;
        if (hasHot && !availableFilters.includes("hot")) {
          setAvailableFilters((prev) => [...prev, "hot"]);
          setActiveFilter("hot");
        }
      } catch (e) {
        console.warn("Erreur vérif filtre hot:", e);
      }
    };

    checkHotFilter();
  }, []);

  // 🟢 Quand selectedBrand change → fetch par marque
  useEffect(() => {
    const fetchByBrand = async () => {
      if (!selectedBrand) return;

      setIsLoading(true);
      try {
        let res;
        if (activeTab === "coupdecoeur") {
          res = await getCoupsDeCoeurByBrand(selectedBrand, 1, 50);
        } else if (activeTab === "suggestion") {
          res = await getSuggestionsByBrand(selectedBrand, 1, 50);
        }
        const dataToSet =
          activeTab === "coupdecoeur" ? res?.coupdeCoeurs : res?.suggestions;
        setFeedbackData(dataToSet || []);
      } catch (e) {
        console.error("Erreur fetch par marque:", e);
        setFeedbackData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedBrand) {
      fetchByBrand();
    }
  }, [selectedBrand, activeTab]);



  // Quand l’onglet change → reset filtre par défaut et fetch (sauf si une marque est choisie)
  useEffect(() => {
    if (selectedBrand) return; // 🚨 Priorité à la recherche par marque

    let defaultFilter = "confirmed";
    if (activeTab === "coupdecoeur") defaultFilter = "all";
    if (activeTab === "suggestion") defaultFilter = "all";

    setActiveFilter(defaultFilter);

    if (activeTab !== "report") {
      setIsLoading(true);
      fetchFeedbackData(defaultFilter, activeTab)
        .then((res) => setFeedbackData(res.data))
        .catch(() => setFeedbackData([]))
        .finally(() => setIsLoading(false));
    }
  }, [activeTab, selectedBrand]); // ⚡️ dépend aussi de selectedBrand


  // Quand on change de filtre → fetch (sauf si une marque est choisie)
  useEffect(() => {
    if (selectedBrand) return; // 🚨 Priorité à la recherche par marque

    if (activeTab !== "report") {
      setIsLoading(true);
      fetchFeedbackData(activeFilter, activeTab)
        .then((res) => setFeedbackData(res.data))
        .catch(() => setFeedbackData([]))
        .finally(() => setIsLoading(false));
    }
  }, [activeFilter, activeTab, selectedBrand]); // ⚡️ idem ici


  return (
    <div className="home-page">
      {/* Bandeau violet haut */}
      <PurpleBanner activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenu principal */}
      <main className="user-main-content">
        <aside className="left-panel">
          <UserStatsCard />
        </aside>

        {/* === Onglet Signalements === */}
        {activeTab === "report" && (
          <div
            className={`report-banner-container ${selectedBrand || selectedCategory
              ? "banner-filtered"
              : `banner-${activeFilter}`
              }`}
          >
            <div className="feedback-list-wrapper">
              {/* @ts-ignore */}
              <HomeGroupedReportsList
                activeTab={activeTab}
                activeFilter={activeFilter}
                viewMode={activeFilter === "confirmed" ? "confirmed" : "none" as any}
                onViewModeChange={setViewMode}
                setActiveFilter={setActiveFilter}
                // Additional props that the component's Props type typically expects:
                filter={activeFilter}
                setFilter={setActiveFilter}
                setViewMode={setViewMode}
                isHotFilterAvailable={availableFilters.includes("hot")}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                setSelectedSiteUrl={setSelectedSiteUrl}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </div>

            <aside className="right-panel">
              <FilterIllustration
                filter={activeFilter}
                selectedBrand={selectedBrand}
                siteUrl={selectedSiteUrl}
                selectedCategory={selectedCategory}
              />
            </aside>
          </div>
        )}

        {/* === Onglet Coups de cœur === */}
        {activeTab === "coupdecoeur" && (
          <div
            className={`cdc-banner-container ${selectedBrand ? "banner-filtered" : `banner-${activeFilter}`
              }`}
          >
            <div className="feedback-list-wrapper">
              <HomeFiltersCdc
                filter={activeFilter}
                setFilter={setActiveFilter}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
              />
              <div className="cdc-content">
                <div>
                  {isLoading ? (
                    <SqueletonAnime
                      loaderRef={{ current: null }}
                      loading={true}
                      hasMore={false}
                      error={null}
                    />
                  ) : (
                    <FeedbackView
                      activeTab={activeTab}
                      viewMode="flat"
                      currentState={{
                        data: feedbackData,
                        loading: isLoading,
                        hasMore: false,
                        error: null,
                      }}
                      openId={null}
                      setOpenId={() => { }}
                      groupOpen={{}}
                      setGroupOpen={() => { }}
                      selectedBrand={selectedBrand}
                      selectedCategory=""
                      renderCard={() => <></>}
                    />
                  )}
                </div>
                <aside className="right-panel">
                  <img src={cdcImgSide} alt="igm" />
                </aside>
              </div>
            </div>

            <aside className="right-panel">
              <FilterIllustration filter={activeFilter} selectedBrand={selectedBrand} />
            </aside>
          </div>
        )}

        {/* === Onglet Suggestions === */}
        {activeTab === "suggestion" && (
          <div
            className={`suggestion-banner-container ${selectedBrand ? "banner-filtered" : `banner-${activeFilter}`
              }`}
          >
            <div className="feedback-list-wrapper">
              <HomeFiltersSuggestion
                filter={activeFilter}
                setFilter={setActiveFilter}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
              />

              {isLoading ? (
                <SqueletonAnime
                  loaderRef={{ current: null }}
                  loading={true}
                  hasMore={false}
                  error={null}
                />
              ) : (
                <FeedbackView
                  activeTab={activeTab}
                  viewMode="flat"
                  currentState={{
                    data: feedbackData,
                    loading: isLoading,
                    hasMore: false,
                    error: null,
                  }}
                  openId={null}
                  setOpenId={() => { }}
                  groupOpen={{}}
                  setGroupOpen={() => { }}
                  selectedBrand={selectedBrand}
                  selectedCategory=""
                  renderCard={() => <></>}
                />
              )}
            </div>

            <aside className="right-panel">
              <FilterIllustration filter={activeFilter} selectedBrand={selectedBrand} />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
