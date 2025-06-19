import { type JSX } from "react";
import type { ExplodedGroupedReport } from "@src/types/Reports";

interface Props {
  groupedByDay: Record<string, ExplodedGroupedReport[]>;
  renderCard: (item: ExplodedGroupedReport, index: number) => JSX.Element;
}

const ChronologicalReportList = ({ groupedByDay, renderCard }: Props) => {
  const entries = Object.entries(groupedByDay);

  console.log("📦 Chronological entries:", entries);

  if (entries.length === 0) {
    return <div style={{ padding: "2rem", color: "red" }}>⚠️ Aucun élément à afficher (groupedByDay vide)</div>;
  }

  return (
    <>
      {entries.map(([label, items]) => (
        <div key={label} className="date-group">
          <h3 className="date-title">📅 {label}</h3>
          <div className="report-list">{items.map((item, i) => renderCard(item, i))}</div>
        </div>
      ))}
    </>
  );
};

export default ChronologicalReportList;
