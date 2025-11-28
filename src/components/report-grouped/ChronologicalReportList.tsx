import { type JSX } from "react";
import "./ChronologicalReportList.scss";
import { CalendarDays } from "lucide-react";
import { formatFullDate } from "@src/utils/dateUtils";

interface Props<T> {
  groupedByDay: Record<string, T[]>;
  renderCard: (item: T, index: number) => JSX.Element;
}

function ChronologicalReportList<T>({ groupedByDay, renderCard }: Props<T>) {
  const entries = Object.entries(groupedByDay);

  // 🔥 Fonction utilitaire pour formater la date exactement comme ChronoSection
  const formatDate = (label: string): string => {
    if (!label || label === "unknown") return "Date inconnue";

    const parsed = new Date(label);

    if (Number.isNaN(parsed.getTime())) return "Date inconnue";

    return formatFullDate(parsed);
  };

  return (
    <div className="chronological-report-list">
      {entries.map(([label, items]) => {
        if (!Array.isArray(items) || items.length === 0) return null;

        return (
          <div key={label} className="date-group">
            <div className="date-header">
              <CalendarDays size={18} className="calendar-icon" />

              {/* 💥 ICI : même format que ChronoSection */}
              <h3 className="date-title">{formatDate(label)}</h3>
            </div>

            <div className="report-list">
              {items.map((item, i) => renderCard(item, i))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChronologicalReportList;
