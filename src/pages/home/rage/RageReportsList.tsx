import React from "react";
import { usePaginatedGroupedReportsByRage } from "@src/hooks/usePaginatedGroupedReportsByRage";
import type { ExplodedGroupedReport } from "@src/types/Reports";
import ReportListView from "../ReportListView";
import { useBrandResponsesMap } from "@src/hooks/useBrandResponsesMap";

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
  const reportIds = React.useMemo(
    () => data.map((r) => String(r.reportingId)),
    [data],
  );
  const { brandResponsesMap /* loading: loadingBrandResponses */ } =
    useBrandResponsesMap(reportIds);

  // On transforme les résultats du backend en ExplodedGroupedReport
  const explodedData: ExplodedGroupedReport[] = data.map((r) => ({
    id: String(r.reportingId),
    reportingId: String(r.reportingId),
    category: r.category,
    marque: r.marque,
    siteUrl: r.siteUrl ?? undefined,
    totalCount: r.count,
    reactions: [],
    hasBrandResponse: Boolean(brandResponsesMap[String(r.reportingId)]),
    subCategory: {
      subCategory: r.subCategory,
      status: r.status,
      count: r.count,
      descriptions: r.descriptions as any,
    },
    subCategories: [
      {
        subCategory: r.subCategory,
        status: r.status,
        count: r.count,
        descriptions: r.descriptions as any,
      },
    ],
  }));

  console.log("🔥 RAGE brandResponsesMap", brandResponsesMap);

  console.log(
    "🔥 RAGE explodedData",
    explodedData.map((r) => ({
      id: r.reportingId,
      hasBrandResponse: r.hasBrandResponse,
    })),
  );

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
