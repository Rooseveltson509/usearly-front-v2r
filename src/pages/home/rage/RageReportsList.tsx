import React from "react";
import { usePaginatedGroupedReportsByRage } from "@src/hooks/usePaginatedGroupedReportsByRage";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import ReportListView from "../ReportListView";

const RageReportsList = ({
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
  const { data, loading } = usePaginatedGroupedReportsByRage(true);

  // On transforme les résultats du backend en ExplodedGroupedReport
  const explodedData: ExplodedGroupedReport[] = data.map((r) => ({
    id: String(r.reportingId),
    reportingId: String(r.reportingId),
    category: r.category,
    marque: r.marque,
    siteUrl: r.siteUrl ?? undefined,
    totalCount: r.count,
    reactions: [], // pas encore dispo pour rage
    subCategory: {
      subCategory: r.subCategory,
      count: r.count,
      descriptions: r.descriptions as any, // déjà uniques côté backend
    },
    subCategories: [], // 👈 vide → évite les doublons
  }));

  return (
    <ReportListView
      filter="rage"
      viewMode="confirmed" // 👈 flat comme confirmed
      flatData={explodedData}
      chronoData={{}}
      popularData={{}}
      popularEngagementData={{}}
      rageData={{}} // pas utilisé ici
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

export default RageReportsList;
