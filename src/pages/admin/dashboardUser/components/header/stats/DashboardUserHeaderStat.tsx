import reportIcon from "/assets/icons/reportYellowIcon.svg";
import suggestIcon from "/assets/icons/suggest-icon.svg";
import likeIcon from "/assets/icons/cdc-icon.svg";

type DashboardUserHeaderStatProps = {
  count: number | string;
  type: "report" | "like" | "suggest";
};

const iconMap = {
  report: reportIcon,
  like: likeIcon,
  suggest: suggestIcon,
} as const;

const formatCount = (count: number | string) => {
  const value = typeof count === "number" ? count : Number(count);
  if (!Number.isFinite(value)) return String(count);

  if (value < 1_000) {
    return value.toString();
  }

  if (value < 1_000_000) {
    return `${Math.floor((value / 1_000) * 10) / 10}K`;
  }

  if (value < 1_000_000_000) {
    return `${Math.floor((value / 1_000_000) * 10) / 10}M`;
  }

  return `${Math.floor((value / 1_000_000_000) * 10) / 10}B`;
};

const DashboardUserHeaderStat = ({
  count,
  type,
}: DashboardUserHeaderStatProps) => {
  return (
    <div className="dashboard-user-header-stats">
      <h3 className="dashboard-user-header-stats-count">
        {formatCount(count)}
      </h3>
      <span className="dashboard-user-header-stats-icon">
        <img src={iconMap[type]} alt={type} />
      </span>
    </div>
  );
};

export default DashboardUserHeaderStat;
