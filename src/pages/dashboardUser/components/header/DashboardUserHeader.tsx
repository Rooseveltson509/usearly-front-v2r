import "./DashboardUserHeader.scss";
import { useEffect, useState } from "react";

import DashboardUserHeaderStat from "./stats/DashboardUserHeaderStat";

const DashboardUserHeader = () => {
  const [signalementCount, setSignalementCount] = useState<number | string>(0);
  const [likeCount, setLikeCount] = useState<number | string>(0);
  const [suggestionCount, setSuggestionCount] = useState<number | string>(0);

  useEffect(() => {
    setSignalementCount(8123);
    setLikeCount(899);
    setSuggestionCount(567);
  }, []);

  return (
    <div className="dashboard-user-container">
      <div className="dashboard-user-header-global-stats">
        <div className="dashboard-user-header-global-stats-title-container">
          <h2 className="dashboard-user-header-global-stats-title">Usears</h2>
        </div>
        <div className="dashboard-user-header-global-stats-score-container">
          <h2 className="dashboard-user-header-score">
            3450 <span>+25</span>
          </h2>
        </div>
      </div>
      {/* composants */}
      <div className="dashboard-user-header-stats-container">
        <DashboardUserHeaderStat count={signalementCount} type="report" />
        <DashboardUserHeaderStat count={likeCount} type="like" />
        <DashboardUserHeaderStat count={suggestionCount} type="suggest" />
      </div>
    </div>
  );
};

export default DashboardUserHeader;
