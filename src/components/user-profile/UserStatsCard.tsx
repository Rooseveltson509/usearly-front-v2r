import { useAuth } from "@src/services/AuthContext";
import "./UserStatsCard.scss";
import { useUserStatsSummary } from "@src/hooks/useUserStatsSummary";
import defaultAvatar from "../../assets/images/user.png";
import scoreIcon from "../../assets/images/testLogo.svg";
import badge from "../../assets/icons/Little-badge.png";
import Uicon from "/assets/U-score-icon.svg";
import { useState } from "react";

const getFullAvatarUrl = (path: string | null) => {
  if (!path) return "/default-avatar.png";
  return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

const UserStatsCard = () => {
  const { userProfile } = useAuth();
  const { stats, loading } = useUserStatsSummary();
  const [showBadge, setShowBadge] = useState(false);

  if (!userProfile) return null;

  return (
    <div className="user-stats-card v2">
      <div className="avatar-wrapper">
        <img
          className="avatar"
          src={
            userProfile.avatar
              ? getFullAvatarUrl(userProfile.avatar)
              : defaultAvatar
          }
          alt="Avatar utilisateur"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = defaultAvatar;
          }}
        />
      </div>

      <h2 className="username">{userProfile.pseudo}</h2>
      <div className="user-level">Usear Niveau 1</div>

      <div className="feedback-stats">
        <div className="stat-item">
          <span className="value">
            {loading ? "..." : stats?.totalReports ?? 0}
          </span>
          <span className="label">Signalement</span>
        </div>
        <div className="stat-item large-item">
          <span className="value">
            {loading ? "..." : stats?.totalCoupsDeCoeur ?? 0}
          </span>
          <span className="label">Coup de cœur</span>
        </div>
        <div className="stat-item">
          <span className="value">
            {loading ? "..." : stats?.totalSuggestions ?? 0}
          </span>
          <span className="label">Suggestion</span>
        </div>
      </div>

      <div className="power-section">
        <div>
          <span className="label">Usear Power</span>
          <span className="value">
            {loading ? "..." : stats?.usearPower}{" "}
            <img className="score-icon" src={Uicon} alt="scoreIcon" />
          </span>
        </div>
        <div className="badge">
          <button onClick={() => setShowBadge(!showBadge)}>
            {showBadge ? "Voir moins" : "Voir plus"}
          </button>

          {showBadge && <img src={badge} alt="Badge" />}
        </div>
      </div>
    </div>
  );
};

export default UserStatsCard;
