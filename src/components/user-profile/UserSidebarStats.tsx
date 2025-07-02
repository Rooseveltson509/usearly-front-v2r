import "./UserSidebarStats.scss";
import { useUserStatsSummary } from "@src/hooks/useUserStatsSummary";
import FeedIcon from "../../assets/icons/feedback.png";
import IdeeIcon from "../../assets/icons/idea.png";
import SolutionIcon from "../../assets/icons/solution.png";
import CheckIcon from "../../assets/icons/shake.png";

const UserSidebarStats = () => {
  const { stats, loading } = useUserStatsSummary();

  const feedbacks =
    (stats?.totalReports || 0) +
    (stats?.totalSuggestions || 0) +
    (stats?.totalCoupsDeCoeur || 0);

  return (
    <div className="user-sidebar-stats">
      <div className="top-badge">
        <span>
          🏆 <strong>Tu es dans le Top 5%</strong> des meilleurs Users !
        </span>
      </div>

      <hr className="hr-profile" />

      <h4>Mes contributions</h4>
      <ul className="contribution-list">
        <li>
          <img src={FeedIcon} alt="Feedbacks" />
          <span className="label">Feedbacks</span>
          <span className="value">{loading ? "…" : feedbacks}</span>
        </li>
        <li>
          <img src={IdeeIcon} alt="idées adoptées" />
          <span className="label">Idées adoptées</span>
          <span className="value">
            {loading ? "…" : stats?.totalIdeasAdopted}
          </span>
        </li>
        <li>
          <img src={SolutionIcon} alt="Solutions proposées" />
          <span className="label">Solutions proposées</span>
          <span className="value">
            {loading ? "…" : stats?.totalSuggestions}
          </span>
        </li>
        <li>
          <img src={CheckIcon} alt="checks" />
          <span className="label">Checks</span>
          <span className="value">{loading ? "…" : stats?.totalChecks}</span>
        </li>
      </ul>
    </div>
  );
};

export default UserSidebarStats;