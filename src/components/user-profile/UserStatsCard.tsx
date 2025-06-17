import { useAuth } from "@src/services/AuthContext";
import "./UserStatsCard.scss";
import { useUserStatsSummary } from "@src/hooks/useUserStatsSummary";

const getFullAvatarUrl = (path: string | null) => {
  if (!path) return "/default-avatar.png";
  return `${import.meta.env.VITE_API_BASE_URL}/${path}`;
};

const UserStatsCard = () => {
  const { userProfile } = useAuth();
  const { stats, loading } = useUserStatsSummary();

  if (!userProfile) return null;

  return (
    <div className="user-stats-card v2">
      <div className="avatar-wrapper">
        <img
          className="avatar"
          src={getFullAvatarUrl(userProfile.avatar || null)}
          alt="Avatar utilisateur"
        />
      </div>

      <h2 className="username">{userProfile.pseudo}</h2>
      <div className="user-level">Usear Niveau 1</div>

      <div className="feedback-stats">
        <div className="stat-item">
          <span className="label">Signalement</span>
          <span className="value">{loading ? "..." : stats?.totalReports ?? 0}</span>
        </div>
        <div className="stat-item">
          <span className="label">Coup de cœur</span>
         <span className="value">{loading ? "..." : stats?.totalCoupsDeCoeur ?? 0}</span>
        </div>
        <div className="stat-item">
          <span className="label">Suggestion</span>
          <span className="value">{loading ? "..." : stats?.totalSuggestions ?? 0}</span>
        </div>
      </div>

      <div className="power-section">
        <span className="label">Usear Power</span>
        <span className="value">
          {loading ? "..." : stats?.usearPower} <span className="unit">U.</span>
        </span>
      </div>

      <button className="see-more-btn">Voir plus</button>
    </div>
  );
};

export default UserStatsCard;