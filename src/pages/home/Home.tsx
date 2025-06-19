import React, { useState } from "react";
import "./Home.scss";
import ContributionsOverview from "@src/components/user-profile/ContributionsOverview";
import FeedbackList from "@src/components/user-profile/FeedbackList";
import FeedbackTabs, { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import UserStatsCard from "@src/components/user-profile/UserStatsCard";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");

  return (
    <div className="home-page">
      {/* Bandeau violet haut */}
      <div className="purple-banner">
        <div className="banner-content">
          <ContributionsOverview activeTab={activeTab} />
          <FeedbackTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>

      {/* Contenu principal */}
      <main className="user-main-content">
        <aside className="left-panel">
          <UserStatsCard />
        </aside>

        <div className="feedback-list-wrapper">
          <FeedbackList activeTab={activeTab} isPublic={true} />
        </div>

      </main>
    </div>
  );
};

export default Home;
