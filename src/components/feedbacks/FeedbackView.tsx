import GroupedReportList from "../report-grouped/GroupedReportList";
import FlatReportList from "../report-grouped/FlatReportList";
import ChronologicalReportList from "../report-grouped/ChronologicalReportList";
import FilteredReportList from "../report-grouped/feedback-list-header/FilteredReportList";
import SqueletonAnime from "../loader/SqueletonAnime";
import { isToday, isYesterday, format } from "date-fns";
import { fr } from "date-fns/locale";
import type {
  ExplodedGroupedReport,
  GroupedReport,
  CoupDeCoeur,
  Suggestion,
} from "@src/types/Reports";
import { useState, type JSX } from "react";
import {
  groupByBrandThenCategory,
  groupByBrand,
  explodeGroupedReports,
} from "@src/utils/feedbackListUtils";
import type { FeedbackType } from "../user-profile/FeedbackTabs";
import InteractiveFeedbackCard from "../InteractiveFeedbackCard/InteractiveFeedbackCard";
import "./FeedbackView.scss";

interface Props {
  activeTab: FeedbackType;
  viewMode: "grouped" | "flat" | "chrono" | "filtered";
  currentState: {
    data: any[];
    loading: boolean;
    hasMore: boolean;
    error: string | null;
    isInitialLoading?: boolean; // 👈 ajouté pour distinguer filtre/scroll
  };
  openId: string | null;
  setOpenId: (id: string | null) => void;
  groupOpen: Record<string, boolean>;
  setGroupOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  selectedBrand: string;
  selectedCategory: string;
  selectedSiteUrl?: string;
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
  const [openId, setOpenId] = useState<string | null>(null);

  const { data, loading, error, isInitialLoading } = currentState;

  const exploded = (data as GroupedReport[]).flatMap((report) =>
    Array.isArray(report.subCategories)
      ? report.subCategories.map((subCategory) => ({
          ...report,
          subCategory,
        }))
      : [],
  );

  // 🧠 Cas 1 : chargement initial (changement d’onglet ou filtre)
  if (isInitialLoading) {
    return (
      <div className="loading-more">
        <div className="spinner" />
        <p>
          Chargement des{" "}
          {activeTab === "coupdecoeur"
            ? "coups de cœur"
            : activeTab === "suggestion"
              ? "suggestions"
              : "contenus"}
          ...
        </p>
      </div>
    );
  }

  // 🧠 Cas 2 : aucune donnée
  const showEmptyState = !loading && data.length === 0 && !error;
  if (showEmptyState) {
    return <div className="no-content">Aucun contenu trouvé.</div>;
  }

  // 🧠 Cas 3 : Signalements
  if (activeTab === "report") {
    if (viewMode === "grouped") {
      const groupedByBrand = groupByBrandThenCategory(
        groupByBrand(explodeGroupedReports(data)),
      );
      return (
        <>
          <GroupedReportList
            grouped={groupedByBrand}
            groupOpen={groupOpen}
            setGroupOpen={setGroupOpen}
            renderCard={renderCard}
          />
          {loading && !isInitialLoading && (
            <div className="loading-more">
              <div className="spinner" />
              <p>Chargement de plus de signalements...</p>
            </div>
          )}
        </>
      );
    }

    if (viewMode === "flat") {
      const groupedFlat = Object.entries(
        groupByBrand(explodeGroupedReports(data)),
      );
      return (
        <>
          <FlatReportList
            grouped={groupedFlat}
            groupOpen={groupOpen}
            setGroupOpen={setGroupOpen}
            renderCard={renderCard}
          />
          {loading && !isInitialLoading && (
            <div className="loading-more">
              <div className="spinner" />
              <p>Chargement de plus de signalements...</p>
            </div>
          )}
        </>
      );
    }

    if (viewMode === "chrono") {
      const chronoMapped = exploded
        .filter((item) => item.subCategory?.descriptions?.[0]?.createdAt)
        .sort((a, b) => {
          const aDate = new Date(
            a.subCategory.descriptions[0].createdAt,
          ).getTime();
          const bDate = new Date(
            b.subCategory.descriptions[0].createdAt,
          ).getTime();
          return bDate - aDate;
        });

      const groupedByDay = chronoMapped.reduce(
        (acc, item) => {
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
        },
        {} as Record<string, typeof chronoMapped>,
      );

      return (
        <>
          <ChronologicalReportList
            groupedByDay={groupedByDay}
            renderCard={(item, index) => {
              const desc = item.subCategory.descriptions[0];
              const cardId = `${item.reportingId}_${desc?.id || index}`;
              return <div key={cardId}>{renderCard(item)}</div>;
            }}
          />
          {loading && !isInitialLoading && (
            <div className="loading-more">
              <div className="spinner" />
              <p>Chargement de plus de signalements...</p>
            </div>
          )}
        </>
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

  // ❤️ Coup de cœur & 💡 Suggestions
  return (
    <>
      {(data as (CoupDeCoeur | Suggestion)[]).map((item, index) => {
        const siteUrl =
          (item as any)?.siteUrl ??
          (item as any)?.brandUrl ??
          (item as any)?.site ??
          undefined;

        const safeItem = {
          ...item,
          siteUrl,
          marque: item.marque?.trim() ?? "",
        };

        return (
          <InteractiveFeedbackCard
            key={item.id || `feedback-${index}`}
            item={safeItem}
            isOpen={openId === item.id}
            onToggle={(id) => setOpenId((prev) => (prev === id ? null : id))}
          />
        );
      })}

      {/* 🌀 Loader scroll (en bas uniquement) */}
      {loading && !isInitialLoading && (
        <SqueletonAnime
          loaderRef={{ current: null }}
          loading={true}
          hasMore={false}
          error={null}
        />
      )}
    </>
  );
};

export default FeedbackView;
