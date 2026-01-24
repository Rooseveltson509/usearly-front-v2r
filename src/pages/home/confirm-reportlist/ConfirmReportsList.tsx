import React from "react";
import { useConfirmedFlatData } from "@src/hooks/useConfirmedFlatData";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import ReportListView from "../ReportListView";

const ConfirmedReportsList = ({
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
  const { data } = useConfirmedFlatData();

  const explodedData: ExplodedGroupedReport[] = data.flatMap((group) =>
    group.subCategories.map((subCategory) => ({
      id: group.id,
      reportingId: group.reportingId,
      category: group.category,
      marque: group.marque,
      siteUrl: group.siteUrl,
      hasBrandResponse: group.hasBrandResponse,
      totalCount: group.totalCount,
      reactions: group.reactions,
      subCategory, // 👈 nouvelle clé : l'unique sous-catégorie à afficher
      subCategories: [subCategory], // 👈 requis pour compatibilité avec GroupedReport
    })),
  );
  return (
    <ReportListView
      filter=""
      viewMode="confirmed"
      flatData={explodedData}
      expandedItems={expandedItems}
      handleToggle={handleToggle}
      chronoData={{}}
      popularData={{}}
      popularEngagementData={{}}
      rageData={{}}
      loadingChrono={false}
      loadingPopular={false}
      loadingPopularEngagement={false}
      loadingRage={false}
      searchTerm={searchTerm}
      onClearSearchTerm={onClearSearchTerm}
    />
  );
};

export default ConfirmedReportsList;
