import ChronologicalReportList from "@src/components/report-grouped/ChronologicalReportList";
import ChronoReportCard from "@src/components/report-grouped/report-by-date/ChronoReportCard";
import HomeBrandBlock from "@src/components/home-grouped-reports-list/HomeBrandBlock";
import PopularReportCard from "@src/components/report-grouped/reports-popular/PopularReportCard";
import type {
  ExplodedGroupedReport,
  PopularGroupedReport,
  PublicGroupedReport,
} from "@src/types/Reports";

interface Props {
  filter: string;
  viewMode: "flat" | "chrono";
  flatData: Array<ExplodedGroupedReport | PublicGroupedReport>;
  chronoData: Record<string, any[]>;
  popularData: Record<string, PopularGroupedReport[]>;
  popularEngagementData: Record<string, PopularGroupedReport[]>;
  rageData: Record<string, PopularGroupedReport[]>;
  expandedItems: Record<string, boolean>;
  handleToggle: (key: string) => void;
  loadingChrono: boolean;
  loadingPopular: boolean;
  loadingPopularEngagement: boolean;
  loadingRage: boolean;
}

const ReportListView: React.FC<Props> = ({
  filter,
  viewMode,
  flatData,
  chronoData,
  popularData,
  popularEngagementData,
  rageData,
  expandedItems,
  handleToggle,
  loadingChrono,
  loadingPopular,
  loadingPopularEngagement,
  loadingRage,
}) => {
  const isPopularFilter = ["hot", "popular", "rage", "urgent"].includes(filter);
  const isChronoFilter = filter === "chrono";

  if (isPopularFilter) {
    const { groupedByDay, isLoading } =
      filter === "popular"
        ? { groupedByDay: popularEngagementData, isLoading: loadingPopularEngagement }
        : filter === "rage"
        ? { groupedByDay: rageData, isLoading: loadingRage }
        : { groupedByDay: popularData, isLoading: loadingPopular };

    if (!isLoading && Object.keys(groupedByDay || {}).length === 0) {
      return (
        <div className="no-popular-results">
          <p>Aucun signalement ne correspond à ce filtre pour le moment.</p>
        </div>
      );
    }

    return (
      <ChronologicalReportList
        groupedByDay={groupedByDay}
        renderCard={(item) => {
          const key = `${item.reportingId}-${item.subCategory}`;
          return (
            <PopularReportCard
              key={key}
              item={item}
              isOpen={!!expandedItems[key]}
              onToggle={() => handleToggle(key)}
              isHot={filter === "hot"}
            />
          );
        }}
      />
    );
  }

  if (viewMode === "chrono" && (filter === "" || isChronoFilter)) {
    if (!loadingChrono && Object.keys(chronoData || {}).length === 0) {
      return (
        <div className="no-popular-results">
          <p>Aucun signalement récent disponible.</p>
        </div>
      );
    }

    return (
      <ChronologicalReportList
        groupedByDay={chronoData}
        renderCard={(item) => {
          const key = `${item.reportingId}-${item.subCategory.subCategory}`;
          return (
            <ChronoReportCard
              key={key}
              item={item}
              isOpen={!!expandedItems[key]}
              onToggle={() => handleToggle(key)}
            />
          );
        }}
      />
    );
  }

  // Flat view sans filtre
  if (flatData.length === 0) {
    return <p>Aucun report disponible.</p>;
  }

  const grouped = flatData.reduce<Record<string, typeof flatData>>((acc, report) => {
    if (!acc[report.marque]) acc[report.marque] = [];
    acc[report.marque].push(report);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(grouped).map(([brand, reports]) => (
        <HomeBrandBlock
          key={brand}
          brand={brand}
          siteUrl={reports[0]?.siteUrl || ""}
          reports={reports}
        />
      ))}
    </>
  );
};

export default ReportListView;