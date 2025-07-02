import GroupedReportList from "../report-grouped/GroupedReportList";
import FlatReportList from "../report-grouped/FlatReportList";
import ChronologicalReportList from "../report-grouped/ChronologicalReportList";
import FilteredReportList from "../report-grouped/feedback-list-header/FilteredReportList";
import { isToday, isYesterday, format } from "date-fns";
import { fr } from "date-fns/locale";
import type { ExplodedGroupedReport, GroupedReport, CoupDeCoeur, Suggestion } from "@src/types/Reports";
import type { JSX } from "react";
import {
  groupByBrandThenCategory,
  groupByBrand,
  explodeGroupedReports,
} from "@src/utils/feedbackListUtils";
import type { FeedbackType } from "../user-profile/FeedbackTabs";
import InteractiveFeedbackCard from "../user-profile/InteractiveFeedbackCard";

interface Props {
  activeTab: FeedbackType;
  viewMode: "grouped" | "flat" | "chrono" | "filtered";
  currentState: {
    data: any[];
    loading: boolean;
    hasMore: boolean;
    error: string | null;
  };
  openId: string | null;
  setOpenId: (id: string | null) => void;
  groupOpen: Record<string, boolean>;
  setGroupOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedBrand: string;
  selectedCategory: string;
  renderCard: (item: ExplodedGroupedReport) => JSX.Element;
}

const FeedbackView = ({
  activeTab,
  viewMode,
  currentState,
  groupOpen,
  setGroupOpen,
  selectedBrand,
  selectedCategory,
  renderCard,
}: Props) => {
  const exploded = (currentState.data as GroupedReport[]).flatMap((report) =>
    Array.isArray(report.subCategories)
      ? report.subCategories.map((subCategory) => ({
        ...report,
        subCategory,
      }))
      : []
  );
  console.log("FeedbackView data:", currentState.data);
  console.log("Loading:", currentState.loading);

  if (currentState.loading) {
    return null; // Le loader est géré par le parent (Home)
  }

  if (
    !currentState.loading &&
    currentState.data.length === 0 &&
    !currentState.error
  ) {
    return <div>Aucun contenu trouvé.</div>;
  }

  if (activeTab === "report") {
    if (viewMode === "grouped") {
      const groupedByBrand = groupByBrandThenCategory(
        groupByBrand(explodeGroupedReports(currentState.data))
      );
      return (
        <GroupedReportList
          grouped={groupedByBrand}
          groupOpen={groupOpen}
          setGroupOpen={setGroupOpen}
          renderCard={renderCard}
        />
      );
    }

    if (viewMode === "flat") {
      const groupedFlat = Object.entries(
        groupByBrand(explodeGroupedReports(currentState.data))
      );
      return (
        <div className="flat-report-list">
          <FlatReportList
            grouped={groupedFlat}
            groupOpen={groupOpen}
            setGroupOpen={setGroupOpen}
            renderCard={renderCard}
          />
        </div>
      );
    }

    if (viewMode === "chrono") {
      const chronoMapped = exploded
        .filter((item) => item.subCategory?.descriptions?.[0]?.createdAt)
        .sort((a, b) => {
          const aDate = new Date(a.subCategory.descriptions[0].createdAt).getTime();
          const bDate = new Date(b.subCategory.descriptions[0].createdAt).getTime();
          return bDate - aDate;
        });

      const groupedByDay = chronoMapped.reduce((acc, item) => {
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
      }, {} as Record<string, typeof chronoMapped>);

      return Object.entries(groupedByDay).length > 0 ? (
        <ChronologicalReportList
          groupedByDay={groupedByDay}
          renderCard={(item, index) => {
            const desc = item.subCategory.descriptions[0];
            const cardId = `${item.reportingId}_${desc?.id || index}`;
            return renderCard(item);
          }}
        />
      ) : (
        <div style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
          ❌ Aucune donnée avec createdAt valide
        </div>
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
  }

  // Coup de cœur & suggestions
  return (
    <>
      {(currentState.data as (CoupDeCoeur | Suggestion)[]).map((item, index) => (
        <InteractiveFeedbackCard
          key={item.id || `feedback-${index}`}
          item={item}
        />
      ))}
    </>
  );
};

export default FeedbackView;
