/* import React, { type JSX } from "react";
import GroupedReportList from "../report-grouped/GroupedReportList";
import FlatReportList from "../report-grouped/FlatReportList";
import ChronologicalReportList from "../report-grouped/ChronologicalReportList";
import FilteredReportList from "../report-grouped/feedback-list-header/FilteredReportList";
import { format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";
import InteractiveFeedbackCard from "../user-profile/InteractiveFeedbackCard";
import ReportCard from "../user-profile/ReportCard";
import type { ExplodedGroupedReport } from "@src/types/Reports";

interface Props {
  activeTab: string;
  viewMode: "grouped" | "flat" | "chrono" | "filtered";
  currentState: {
    data: any[];
    loading: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
  };
  groupOpen: Record<string, boolean>;
  setGroupOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedBrand: string;
  selectedCategory: string;
  renderCard: (item: any) => JSX.Element;
  openId: string | null;
  setOpenId: (id: string | null) => void;
  explodedGroupedReports: ExplodedGroupedReport[];
}

const FeedbackContentRenderer = ({
  activeTab,
  viewMode,
  currentState,
  groupOpen,
  setGroupOpen,
  selectedBrand,
  selectedCategory,
  renderCard,
  openId,
  setOpenId,
}: Props) => {
  if (activeTab !== "report") {
    return (
      <>
        {currentState.data.map((item, index) => (
          <InteractiveFeedbackCard
            key={item.id || `feedback-${index}`}
            item={{ ...item, type: activeTab }}
          />
        ))}
      </>
    );
  }

  if (viewMode === "grouped") {
    const groupedByBrand = currentState.data.reduce((acc: Record<string, any[]>, item) => {
      const brand = item.marque || "Autre";
      if (!acc[brand]) acc[brand] = [];
      acc[brand].push(item);
      return acc;
    }, {});

    const groupedByBrandThenCategory = Object.entries(groupedByBrand).reduce(
      (acc: Record<string, Record<string, any[]>>, [brand, items]) => {
        acc[brand] = items.reduce((subAcc: Record<string, any[]>, item) => {
          const category = item.subCategory?.subCategory || "Autre";
          if (!subAcc[category]) subAcc[category] = [];
          subAcc[category].push(item);
          return subAcc;
        }, {});
        return acc;
      },
      {}
    );

    return (
      <GroupedReportList
        grouped={groupedByBrandThenCategory}
        groupOpen={groupOpen}
        setGroupOpen={setGroupOpen}
        renderCard={renderCard}
      />
    );
  }

  if (viewMode === "flat") {
    const groupedByBrand = currentState.data.reduce((acc: Record<string, any[]>, item) => {
      const brand = item.marque || "Autre";
      if (!acc[brand]) acc[brand] = [];
      acc[brand].push(item);
      return acc;
    }, {});

    return (
      <FlatReportList
        grouped={Object.entries(groupedByBrand)}
        groupOpen={groupOpen}
        setGroupOpen={setGroupOpen}
        renderCard={renderCard}
      />
    );
  }

  if (viewMode === "chrono") {
    const exploded = currentState.data;

    const chronoMapped = exploded
      .filter((item) => item.subCategory?.descriptions?.[0]?.createdAt)
      .sort((a, b) => {
        const aDate = new Date(a.subCategory.descriptions[0].createdAt).getTime();
        const bDate = new Date(b.subCategory.descriptions[0].createdAt).getTime();
        return bDate - aDate;
      });

    const groupedByDay = chronoMapped.reduce((acc: Record<string, any[]>, item) => {
      const desc = item.subCategory.descriptions[0];
      const date = new Date(desc.createdAt);
      if (isNaN(date.getTime())) return acc;

      const label = isToday(date)
        ? "Aujourd’hui"
        : isYesterday(date)
        ? "Hier"
        : format(date, "dd MMMM yyyy", { locale: fr });

      if (!acc[label]) acc[label] = [];
      acc[label].push(item);
      return acc;
    }, {});

    if (Object.keys(groupedByDay).length === 0) {
      return (
        <div style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
          ⚠️ Aucun élément à afficher (groupedByDay vide)
        </div>
      );
    }

    return (
      <ChronologicalReportList
        groupedByDay={groupedByDay}
        renderCard={(item, index) => {
          const desc = item.subCategory.descriptions[0];
          const cardId = `${item.reportingId}_${desc?.id || index}`;
          return (
            <ReportCard
              key={cardId}
              report={{ ...item, subCategories: [item.subCategory] }}
              isOpen={openId === cardId}
              onToggle={() => setOpenId(openId === cardId ? null : cardId)}
            />
          );
        }}
      />
    );
  }

  if (viewMode === "filtered") {
    return (
      <FilteredReportList
        brand={selectedBrand}
        category={selectedCategory}
        renderCard={renderCard}
      />
    );
  }

  return null;
};

export default FeedbackContentRenderer;
 */
