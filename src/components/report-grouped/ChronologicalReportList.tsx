import { type JSX } from "react";
import "./ChronologicalReportList.scss";
import { CalendarDays } from "lucide-react";

interface Props<T> {
  groupedByDay: Record<string, T[]>;
  renderCard: (item: T, index: number) => JSX.Element;
}

function ChronologicalReportList<T>({ groupedByDay, renderCard }: Props<T>) {
  const entries = Object.entries(groupedByDay);

  return (
    <div className="chronological-report-list">
      {entries.map(([label, items]) => {
        if (!Array.isArray(items) || items.length === 0) return null;

        return (
          <div key={label} className="date-group">
            <div className="date-header">
              <CalendarDays size={18} className="calendar-icon" />
              <h3 className="date-title">{label}</h3>
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
