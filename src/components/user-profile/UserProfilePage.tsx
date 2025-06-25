import React, { useState } from "react";
import UserStatsCard from "./UserStatsCard";
import ContributionsOverview from "./ContributionsOverview";
import FeedbackTabs, { type FeedbackType } from "./FeedbackTabs";
import FeedbackList from "./FeedbackList";
import UserSidebarStats from "./UserSidebarStats";
import "./UserProfilePage.scss";
import big from "../../assets/images/big.svg";
import medium from "../../assets/images/medium.svg";
import small from "../../assets/images/small.svg";
import badge from "../../assets/icons/Little-badge.svg";

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");

  return (
    <div className="user-profile-page">
      {/* Bandeau du haut */}
      <div className="main-top-bar">
        <div className="banner-content">
          <ContributionsOverview activeTab={activeTab} />
          <FeedbackTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        {/* zone droite – pastilles statistiques*/}
        <div className="right">
          <div className="decorative-logos">
            <img src={big} alt="big" className="logo logo-big" />
            <img src={medium} alt="medium" className="logo logo-medium" />
            <img src={small} alt="small" className="logo logo-small" />
            <img src={badge} alt="badge" className="logo logo-badge" />
          </div>
        </div>
      </div>
      {/* <div className="banner-content">
        <ContributionsOverview activeTab={activeTab} />
        <FeedbackTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div> */}
      {/* Contenu principal */}
      <main className="user-main-content">
        <aside className="left-panel">
          <UserStatsCard />
        </aside>
        <div className="feedback-list-wrapper">
          <FeedbackList activeTab={activeTab} />
        </div>

        <aside className="right-panel">
          <UserSidebarStats />
        </aside>
      </main>
    </div>
  );
};

export default UserProfilePage;
