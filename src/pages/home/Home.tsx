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

// 🖼️ Assets
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
    "confirmed", // 👉 affiché en premier
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

  useEffect(() => {
    if (activeTab === "report") {
      setActiveFilter("confirmed"); // 🔥 garde ton comportement existant
    } else if (activeTab === "coupdecoeur") {
      setActiveFilter("liked"); // 🥰 par défaut pour coup de cœur
    } else if (activeTab === "suggestion") {
      setActiveFilter("discussed"); // 💡 par défaut pour suggestions
    }
  }, [activeTab]);


  // ✅ Récupération des données pour coupdecoeur et suggestion
  useEffect(() => {
    const fetchData = async () => {
      if (activeTab === "coupdecoeur" || activeTab === "suggestion") {
        setIsLoading(true);
        try {
          const res =
            activeTab === "coupdecoeur"
              ? await getPublicCoupsDeCoeur(1, 50)
              : await getPublicSuggestions(1, 50);

          const dataToSet =
            activeTab === "coupdecoeur" ? res.coupdeCoeurs : res.suggestions;

          setFeedbackData(dataToSet || []);
        } catch (e) {
          console.error("Erreur fetch feedback:", e);
          setFeedbackData([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (activeTab !== "report") {
      fetchData();
    }
  }, [activeTab]);

  return (
    <div className="home-page">
      {/* Bandeau violet haut */}
      <div className="purple-banner">
        {/* zone gauche – mascotte */}
        <img src={chatIcon} alt="chatIcon" className="chat" />

        {/* message central */}
        <div className="text">
          <span>Likez, shakez, faites&nbsp;</span>
          <div className="text__decoration">
            <img src={bulleIcon} alt="bulleIcon" className="bulle" />
            <img src={emojiIcon} alt="emojiIcon" className="emoji" />
          </div>
          <span>les marques !</span>
        </div>

        {/* zone droite – pastilles statistiques */}
        <div className="right">
          <div className="decorative-logos">
            <img src={big} alt="big" className="logo logo-big" />
            <img src={medium} alt="medium" className="logo logo-medium" />
            <img src={small} alt="small" className="logo logo-small" />
          </div>
        </div>

        {/* Tabs (report, coupdecoeur, suggestion) */}
        <FeedbackTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

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
              <HomeGroupedReportsList
                activeTab={activeTab}
                activeFilter={activeFilter}
                viewMode={activeFilter === "confirmed" ? "confirmed" : "none" as any}
                onViewModeChange={setViewMode}
                setActiveFilter={setActiveFilter}
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
