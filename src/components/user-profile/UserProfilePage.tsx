import React, { useEffect, useRef, useState } from "react";
import UserStatsCard from "./UserStatsCard";
import ContributionsOverview from "./ContributionsOverview";
import FeedbackTabs, { type FeedbackType } from "./FeedbackTabs";
import "./UserProfilePage.scss";
import big from "/assets/images/big.svg";
import medium from "/assets/images/medium.svg";
import small from "/assets/images/small.svg";
import badge from "/assets/icons/Little-badge.svg";
import decoBanner from "/assets/images/bulle-deco-banner.svg";
import UserGroupedReportsList from "../profile/UserGroupedReportsList";
import UserFeedbackView from "../profile/UserFeedbackView";
// import UserImpact from "./UserImpact";
import UserVotesCard from "../profile/UserVotesCard";

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeedbackType>("report");
  const mountCount = useRef(0);

  useEffect(() => {
    mountCount.current += 1;
    console.log("UserProfilePage mounted:", mountCount.current);
  }, []);

  return (
    <div className="user-profile-page">
      {/* Bandeau du haut */}
      <div className="main-top-bar">
        <div className="banner-content">
          <ContributionsOverview activeTab={activeTab} />
          <FeedbackTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="left">
          <img className="chat" src={decoBanner} />
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

      {/* Contenu principal */}
      <main className="user-main-content">
        <aside className="left-panel">
          <UserStatsCard />
        </aside>
        <div className="feedback-list-wrapper">
          {activeTab === "report" ? (
            <UserGroupedReportsList />
          ) : (
            <UserFeedbackView activeTab={activeTab} />
          )}
        </div>

        <aside className="right-panel">
          <UserVotesCard />
          {/* <div className="separator"></div>
          <UserImpact /> */}
        </aside>
      </main>
    </div>
  );
};

export default UserProfilePage;
