import React, { useState } from "react";
import { useConfirmedFlatData } from "@src/hooks/useConfirmedFlatData";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import ReportListView from "../ReportListView";

const ConfirmedReportsList = ({
  expandedItems,
  handleToggle,
}: {
  expandedItems: Record<string, boolean>;
  handleToggle: (key: string) => void;
}) => {
  const { data, loading } = useConfirmedFlatData();

  const explodedData: ExplodedGroupedReport[] = data.flatMap((group) =>
    group.subCategories.map((subCategory) => ({
      id: group.id,
      reportingId: group.reportingId,
      category: group.category,
      marque: group.marque,
      siteUrl: group.siteUrl,
      totalCount: group.totalCount,
      reactions: group.reactions,
      subCategory, // 👈 nouvelle clé : l'unique sous-catégorie à afficher
      subCategories: [subCategory], // 👈 requis pour compatibilité avec GroupedReport
    }))
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
    />
  );
};

export default ConfirmedReportsList;


