import { type JSX } from "react";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import "./ChronologicalReportList.scss";

interface Props {
  groupedByDay: Record<string, ExplodedGroupedReport[]>;
  renderCard: (item: ExplodedGroupedReport, index: number) => JSX.Element;
}

const ChronologicalReportList: React.FC<Props> = ({ groupedByDay, renderCard }) => {
  const entries = Object.entries(groupedByDay);

  if (entries.length === 0) {
    return (
      <div className="chrono-empty">
        ⚠️ Aucun élément à afficher
      </div>
    );
  }

  return (
    <div className="chronological-report-list">
      {entries.map(([label, items]) => {
        if (!Array.isArray(items) || items.length === 0) return null;

        return (
          <div key={label} className="date-group">
            <div className="date-header">
              <img src="/icons/calendar.svg" alt="Calendrier" className="calendar-icon" />
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
