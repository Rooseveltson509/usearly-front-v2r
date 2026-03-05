import { useAuth } from "@src/services/AuthContext";
import { useUserStatsSummary } from "@src/hooks/useUserStatsSummary";
import Avatar from "@src/components/shared/Avatar";
import { getDisplayName } from "@src/utils/avatarUtils";
import { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import badge from "/assets/icons/Little-badge.svg";
import chatIcon from "/assets/images/chat-top-bar.svg";
// import {
//   LogoBig,
//   LogoMedium,
//   LogoSmall,
// } from "@src/components/shared/DecorativeLogos";
import { useCountUp } from "@src/components/profile/banner/user-emotion/useCountUp";
import "./UserProfileBanner.scss";
import UScoreIcon from "/assets/U-score-icon.svg";

type Props = {
  activeTab: FeedbackType;
  onTabChange: (tab: FeedbackType) => void;
};

export default function UserProfileBanner({ activeTab, onTabChange }: Props) {
  const { userProfile } = useAuth();
  const { stats, loading } = useUserStatsSummary();
  const reports = useCountUp(stats?.totalReports ?? 0, 1400);
  const hearts = useCountUp(stats?.totalCoupsDeCoeur ?? 0, 1400);
  const suggestions = useCountUp(stats?.totalSuggestions ?? 0, 1400);

  if (!userProfile) return null;

  return (
    <div className="user-profile-banner">
      {/* LEFT floating mascot */}
      <img src={chatIcon} alt="chat mascot" className="user-chat-decor" />
      {/* TOP LINE */}
      <div className="banner-container">
        <div className="banner-main">
          {/* LEFT — avatar + name */}
          <div className="user-info">
            <div className="avatar-wrapper-profile">
              <Avatar
                avatar={userProfile.avatar}
                pseudo={getDisplayName(userProfile.pseudo, userProfile.email)}
                sizeHW={120}
                className="user-avatar"
              />
            </div>

            <div className="identity">
              <div className="name">{userProfile.pseudo}</div>
              <div className="level">Usear Niveau 1</div>
            </div>
          </div>

          {/* CENTER — stats */}
          <div className="stats-block">
            <h2 className="user-impact-title">Mon impact user :</h2>
            <div className="stats-inline">
              <button
                className={`stat ${activeTab === "report" ? "active" : ""}`}
                onClick={() => onTabChange("report")}
              >
                <div className="stat-value">
                  {reports}
                  <img
                    src={reportYellowIcon}
                    alt="Signalements"
                    className={`stat-icon ${activeTab === "report" ? "pulse" : ""}`}
                  />
                </div>
                <span className="label">Signalements</span>
              </button>

              <button
                className={`stat ${activeTab === "coupdecoeur" ? "active" : ""}`}
                onClick={() => onTabChange("coupdecoeur")}
              >
                <div className="stat-value">
                  {hearts}
                  <img
                    src={likeRedIcon}
                    alt="Coups de cœur"
                    className={`stat-icon ${activeTab === "coupdecoeur" ? "pulse" : ""}`}
                  />
                </div>
                <span className="label">Coups de cœur</span>
              </button>

              <button
                className={`stat ${activeTab === "suggestion" ? "active" : ""}`}
                onClick={() => onTabChange("suggestion")}
              >
                <div className="stat-value">
                  {suggestions}
                  <img
                    src={suggestGreenIcon}
                    alt="Suggestions"
                    className={`stat-icon ${activeTab === "suggestion" ? "pulse" : ""}`}
                  />
                </div>
                <span className="label">Suggestions</span>
              </button>
            </div>
          </div>

          {/* RIGHT — power */}
          <div className="power">
            <span className="label">Usear Power</span>
            <span className="value">
              <div className="value-with-icon-container">
                {loading ? "..." : (stats?.usearPower ?? 0)}{" "}
                <span className="icon-container">
                  <img src={UScoreIcon} alt="" />
                </span>
              </div>
              <div className="right-badge">
                <img src={badge} alt="badge" className="logo logo-badge" />
              </div>
            </span>
          </div>
        </div>
      </div>
      {/* <div className="right">
        <div className="decorative-logos">
          <LogoBig />
          <LogoMedium />
          <LogoSmall />
        </div>
      </div> */}
    </div>
  );
}
