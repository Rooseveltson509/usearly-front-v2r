import React from "react";
import type { PopularReport, PopularGroupedReport } from "@src/types/Reports";
import PopularReportCard from "@src/components/report-grouped/reports-popular/PopularReportCard";

const PopularReportList = ({
  data,
  expandedItems,
  handleToggle,
  loading,
}: {
  data: PopularReport[];
  expandedItems: Record<string, boolean>;
  handleToggle: (key: string) => void;
  loading: boolean;
}) => {
  // ✅ On attend que le chargement soit terminé pour afficher le message vide
  if (!loading && (!data || data.length === 0)) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#888" }}>
        Aucun signalement populaire disponible.
      </div>
    );
  }

  return (
    <>
      {data.map((item) => {
        const key = `${item.reportingId}-${item.id}`;
        // 🔹 Normalisation en PopularGroupedReport
        const normalized: PopularGroupedReport = {
          reportingId: item.reportingId,
          marque: item.marque,
          siteUrl: item.siteUrl ?? undefined,
          category: item.category,
          subCategory: item.subCategory,
          count: 1,
          descriptions: [
            {
              id: item.id,
              description: item.description,
              emoji: item.reactions?.[0]?.emoji ?? "",
              createdAt: item.createdAt,
              author: item.author ?? {
                id: "0",
                pseudo: "Anonyme",
                avatar: null,
              },
              reportingId: item.reportingId,
              capture: item.capture,
              marque: item.marque,
              reactions: item.reactions,
            },
          ],
        };

        return (
          <PopularReportCard
            key={key}
            item={normalized}
            isOpen={!!expandedItems[key]}
            onToggle={() => handleToggle(key)}
            isHot={false}
          />
        );
      })}
    </>
  );
};

export default PopularReportList;
