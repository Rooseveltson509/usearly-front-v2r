import React, { useState } from "react";
import UserStatsCard from "./UserStatsCard";
import ContributionsOverview from "./ContributionsOverview";
import FeedbackTabs, { type FeedbackType } from "./FeedbackTabs";
import FeedbackList from "./FeedbackList";
import UserSidebarStats from "./UserSidebarStats";
import "./UserProfilePage.scss";

const UserProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<FeedbackType>("report");

    return (
        <div className="user-profile-page">
            {/* Bandeau violet haut */}
            <div className="purple-banner">
                <div className="banner-content">
                    <ContributionsOverview />
                    <FeedbackTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
            </div>

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
