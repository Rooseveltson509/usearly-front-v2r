import "./UserProfileBanner.scss";
import { useAuth } from "@src/services/AuthContext";
import { useUserStatsSummary } from "@src/hooks/useUserStatsSummary";
import Avatar from "@src/components/shared/Avatar";
import { getDisplayName } from "@src/utils/avatarUtils";
import { type FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import reportYellowIcon from "/assets/icons/reportYellowIcon.svg";
import likeRedIcon from "/assets/icons/heart-header.svg";
import suggestGreenIcon from "/assets/icons/suggest-header.svg";
import badge from "/assets/icons/Little-badge.svg";

type Props = {
  activeTab: FeedbackType;
  onTabChange: (tab: FeedbackType) => void;
};

export default function UserProfileBanner({ activeTab, onTabChange }: Props) {
  const { userProfile } = useAuth();
  const { stats, loading } = useUserStatsSummary();

  if (!userProfile) return null;

  return (
    <div className="user-profile-banner">
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
          <div className="stats-inline">
            <button
              className={`stat ${activeTab === "report" ? "active" : ""}`}
              onClick={() => onTabChange("report")}
            >
              <div className="stat-value">
                {loading ? "…" : (stats?.totalReports ?? 0)}
                <img src={reportYellowIcon} alt="Signalements" />
              </div>
              <span className="label">Signalements</span>
            </button>

            <button
              className={`stat ${activeTab === "coupdecoeur" ? "active" : ""}`}
              onClick={() => onTabChange("coupdecoeur")}
            >
              <div className="stat-value">
                {loading ? "…" : (stats?.totalCoupsDeCoeur ?? 0)}
                <img src={likeRedIcon} alt="Coups de cœur" />
              </div>
              <span className="label">Coups de cœur</span>
            </button>

            <button
              className={`stat ${activeTab === "suggestion" ? "active" : ""}`}
              onClick={() => onTabChange("suggestion")}
            >
              <div className="stat-value">
                {loading ? "…" : (stats?.totalSuggestions ?? 0)}
                <img src={suggestGreenIcon} alt="Suggestions" />
              </div>
              <span className="label">Suggestions</span>
            </button>
          </div>

          {/* RIGHT — power */}
          <div className="power">
            <span className="label">Usear Power</span>
            <span className="value">
              {loading ? "…" : stats?.usearPower}
              <div className="right-badge">
                <img src={badge} alt="badge" className="logo logo-badge" />
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
