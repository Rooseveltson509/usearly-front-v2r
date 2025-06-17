import "./UserSidebarStats.scss";
import { useUserStatsSummary } from "@src/hooks/useUserStatsSummary";

const UserSidebarStats = () => {
  const { stats, loading } = useUserStatsSummary();

  const feedbacks =
    (stats?.totalReports || 0) +
    (stats?.totalSuggestions || 0) +
    (stats?.totalCoupsDeCoeur || 0);

  return (
    <div className="user-sidebar-stats">
      <div className="top-badge">
        <span className="emoji">🏆</span>
        <div className="top-text">
          <strong>Tu es dans le Top 5%</strong> des meilleurs Usears !
        </div>
      </div>

      <hr className="divider" />

      <h4>Mes contributions</h4>
      <ul className="contribution-list">
        <li>
          <span className="icon">📣</span>
          <span className="label">Feedbacks</span>
          <span className="value">{loading ? "…" : feedbacks}</span>
        </li>
        <li>
          <span className="icon">✨</span>
          <span className="label">Idées adoptées</span>
          <span className="value">{loading ? "…" : stats?.totalIdeasAdopted}</span>
        </li>
        <li>
          <span className="icon">💡</span>
          <span className="label">Solutions proposées</span>
          <span className="value">{loading ? "…" : stats?.totalSuggestions}</span>
        </li>
        <li>
          <span className="icon">🔍</span>
          <span className="label">Checks</span>
          <span className="value">{loading ? "…" : stats?.totalChecks}</span>
        </li>
        <li>
          <span className="icon">👥</span>
          <span className="label">Collaborations</span>
          <span className="value">{loading ? "…" : stats?.totalCollaborations}</span>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebarStats;