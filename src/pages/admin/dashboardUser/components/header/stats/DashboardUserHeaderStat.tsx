import { useEffect, useState } from "react";

import reportIcon from "/assets/icons/reportYellowIcon.svg";
import suggestIcon from "/assets/icons/suggest-icon.svg";
import likeIcon from "/assets/icons/cdc-icon.svg";

type DashboardUserHeaderStatProps = {
  count: number | string;
  type: "report" | "like" | "suggest";
};

const DashboardUserHeaderStat = ({
  count,
  type,
}: DashboardUserHeaderStatProps) => {
  const [iconPath, setIconPath] = useState<string>("");

  const cap8K = (count: number | string) => {
    const valeur = typeof count === "number" ? count : Number(count);
    if (!Number.isFinite(valeur)) return String(count);
    return valeur >= 8000 ? "+8K" : valeur.toLocaleString("fr-FR");
  };

  useEffect(() => {
    setIconPath(() => {
      if (type === "report") {
        return reportIcon;
      } else if (type === "like") {
        return likeIcon;
      } else if (type === "suggest") {
        return suggestIcon;
      } else {
        return "";
      }
    });
  }, [type]);

  return (
    <div className="dashboard-user-header-stats">
      <h3 className="dashboard-user-header-stats-count">{cap8K(count)}</h3>
      <span className="dashboard-user-header-stats-icon">
        <img src={iconPath} alt="icone report" />
      </span>
    </div>
  );
};

export default DashboardUserHeaderStat;
