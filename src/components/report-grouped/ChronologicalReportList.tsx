import { type JSX } from "react";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import "./ChronologicalReportList.scss";
import { CalendarDays } from "lucide-react";

interface Props {
  groupedByDay: Record<string, ExplodedGroupedReport[]>;
  renderCard: (item: ExplodedGroupedReport, index: number) => JSX.Element;
}

const ChronologicalReportList: React.FC<Props> = ({ groupedByDay, renderCard }) => {
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
};

export default ChronologicalReportList;
