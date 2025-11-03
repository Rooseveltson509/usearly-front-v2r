import React from "react";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import { usePaginatedGroupedReportsByHot } from "../hooks/usePaginatedGroupedReportsByHot";
import ReportListView from "../../ReportListView";

const HotReportsList = ({
  expandedItems,
  handleToggle,
  searchTerm,
  onClearSearchTerm,
}: {
  expandedItems: Record<string, boolean>;
  handleToggle: (key: string) => void;
  searchTerm?: string;
  onClearSearchTerm?: () => void;
}) => {
  const { data, loading } = usePaginatedGroupedReportsByHot(true);

  // On transforme les résultats du backend en ExplodedGroupedReport
  const explodedData: ExplodedGroupedReport[] = data.map((r) => ({
    id: String(r.reportingId),
    reportingId: String(r.reportingId),
    category: r.category,
    marque: r.marque,
    siteUrl: r.siteUrl ?? undefined,
    totalCount: r.count,
    reactions: [], // pas encore exploité pour "hot"
    subCategory: {
      subCategory: r.subCategory,
      count: r.count,
      descriptions: r.descriptions as any, // déjà uniques côté backend
    },
    subCategories: [], // vide → évite doublons
  }));

  return (
    <ReportListView
      filter="hot"
      viewMode="confirmed" // plat comme "rage"
      flatData={explodedData}
      chronoData={{}}
      popularData={{}}
      popularEngagementData={{}}
      rageData={{}}
      expandedItems={expandedItems}
      handleToggle={handleToggle}
      loadingChrono={false}
      loadingPopular={false}
      loadingPopularEngagement={false}
      loadingRage={loading}
      searchTerm={searchTerm}
      onClearSearchTerm={onClearSearchTerm}
    />
  );
};

export default HotReportsList;
