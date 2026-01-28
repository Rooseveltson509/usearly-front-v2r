import "./DashboardUserHeader.scss";
import { useEffect, useState } from "react";

import DashboardUserHeaderStat from "./stats/DashboardUserHeaderStat";
import { getAdminOverviewMetrics } from "@src/services/adminService";

const DashboardUserHeader = () => {
  const [usersCount, setUsersCount] = useState<number | string>(0);
  const [signalementCount, setSignalementCount] = useState<number | string>(0);
  const [likeCount, setLikeCount] = useState<number | string>(0);
  const [suggestionCount, setSuggestionCount] = useState<number | string>(0);
  const [usersDelta, setUsersDelta] = useState<number>(0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metrics = await getAdminOverviewMetrics();

        setUsersCount(metrics.users);
        setUsersDelta(metrics.usersDelta);
        setSignalementCount(metrics.reports);
        setLikeCount(metrics.coupsDeCoeur);
        setSuggestionCount(metrics.suggestions);
      } catch (error) {
        console.error("Erreur chargement métriques admin", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="dashboard-user-container">
      <div className="dashboard-user-header-global-stats">
        <div className="dashboard-user-header-global-stats-title-container">
          <h2 className="dashboard-user-header-global-stats-title">Usears</h2>
        </div>
        <div className="dashboard-user-header-global-stats-score-container">
          <h2 className="dashboard-user-header-score">
            {usersCount}
            {usersDelta !== 0 && (
              <>
                <span
                  className={
                    usersDelta > 0 ? "delta-positive" : "delta-negative"
                  }
                >
                  {usersDelta > 0 ? `+${usersDelta}` : usersDelta}
                </span>
                <span className="delta-label">7 derniers jours</span>
              </>
            )}
          </h2>
        </div>
      </div>

      <div className="dashboard-user-header-stats-container">
        <DashboardUserHeaderStat count={signalementCount} type="report" />
        <DashboardUserHeaderStat count={likeCount} type="like" />
        <DashboardUserHeaderStat count={suggestionCount} type="suggest" />
      </div>
    </div>
  );
};

export default DashboardUserHeader;
