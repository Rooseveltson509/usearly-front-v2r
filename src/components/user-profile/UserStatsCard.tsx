import { useUserStatsSummary } from "@src/hooks/useUserStatsSummary";
import badge from "/assets/icons/Little-badge.png";
import Uicon from "/assets/U-score-icon.svg";
import { useState } from "react";
import { getDisplayName } from "@src/utils/avatarUtils";
import "./UserStatsCard.scss";
import Avatar from "../shared/Avatar";
import { useAuth } from "@src/services/AuthContext";

const UserStatsCard = () => {
  const { userProfile } = useAuth();
  const { stats, loading } = useUserStatsSummary();
  const [showBadge, setShowBadge] = useState(false);

  if (!userProfile) return null;

  return (
    <div className="user-stats-card v2">
      <Avatar
        avatar={userProfile.avatar}
        pseudo={getDisplayName(userProfile.pseudo, userProfile.email)}
        className="avatar" // classe appliquée à l’image OU au fallback
        wrapperClassName="avatar-wrapper" // classe appliquée à la div parent
      />

      <h2 className="username">{userProfile.pseudo}</h2>
      <div className="user-level">Usear Niveau 1</div>

      <div className="feedback-stats">
        <div className="stat-item">
          <span className="value">
            {loading ? "..." : (stats?.totalReports ?? 0)}
          </span>
          <span className="label">Signalement</span>
        </div>
        <div className="stat-item large-item">
          <span className="value">
            {loading ? "..." : (stats?.totalCoupsDeCoeur ?? 0)}
          </span>
          <span className="label">Coup de cœur</span>
        </div>
        <div className="stat-item">
          <span className="value">
            {loading ? "..." : (stats?.totalSuggestions ?? 0)}
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
