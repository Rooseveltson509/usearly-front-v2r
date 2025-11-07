import React, { useMemo } from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import FlatSubcategoryBlock from "../../confirm-reportlist/FlatSubcategoryBlock";
import {
  matchesExplodedReportSearch,
  normalizeSearchText,
} from "@src/utils/reportSearch";
import type { ExplodedGroupedReport } from "@src/types/Reports";

interface ChronoSectionProps {
  chronoData: { data?: any[]; loading: boolean };
  reportData: { loading: boolean };
  loaderRef: React.RefObject<HTMLDivElement | null>;
  searchTerm: string;
  onClearSearchTerm?: () => void;
}

/**
 * 🗓️ Section Chrono
 * Affiche les signalements récents (filtre "chrono")
 * - Gère le chargement
 * - Gère le cas vide
 * - Affiche les signalements avec date
 */
const ChronoSection: React.FC<ChronoSectionProps> = ({
  chronoData,
  reportData,
  loaderRef,
  searchTerm,
  onClearSearchTerm,
}) => {
  const normalizedSearchTerm = searchTerm
    ? normalizeSearchText(searchTerm)
    : "";

  const filteredReports = useMemo(() => {
    const source = (chronoData.data ?? []) as ExplodedGroupedReport[];
    if (!normalizedSearchTerm) return source;
    return source.filter((report) =>
      matchesExplodedReportSearch(report, normalizedSearchTerm),
    );
  }, [chronoData.data, normalizedSearchTerm]);

  const groupedByDate = useMemo(() => {
    if (!filteredReports.length) {
      return [];
    }

    const groups = new Map<string, any[]>();

    filteredReports.forEach((report: ExplodedGroupedReport) => {
      const key = report.date ?? "unknown";
      const existing = groups.get(key);

      if (existing) {
        existing.push(report);
      } else {
        groups.set(key, [report]);
      }
    });

    return Array.from(groups.entries());
  }, [filteredReports]);

  // 🕓 Chargement
  if (reportData.loading || chronoData.loading) {
    return (
      <SqueletonAnime
        loaderRef={loaderRef}
        loading={true}
        hasMore={false}
        error={null}
      />
    );
  }

  if (!chronoData.data || chronoData.data.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        Aucun signalement récent disponible.
      </div>
    );
  }

  if (filteredReports.length === 0 && normalizedSearchTerm) {
    return (
      <div className="no-search-results">
        <p>Aucun résultat pour "{searchTerm}"</p>
        {onClearSearchTerm && (
          <button
            type="button"
            onClick={onClearSearchTerm}
            className="clear-button"
          >
            Effacer
          </button>
        )}
      </div>
    );
  }

  // ✅ Contenu principal
  return (
    <div className="recent-reports-list">
      {groupedByDate.map(([dateKey, reports]) => {
        const formattedDate = (() => {
          if (!dateKey || dateKey === "unknown") {
            return "Date inconnue";
          }

          const parsedDate = new Date(dateKey);

          if (Number.isNaN(parsedDate.getTime())) {
            return "Date inconnue";
          }

          return parsedDate.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          });
        })();

        return (
          <div key={dateKey} className="recent-reports-group">
            <div className="recent-report-date">🗓️ {formattedDate}</div>

            <div className="recent-report-items">
              {reports.map((report: any, index: number) => (
                <FlatSubcategoryBlock
                  key={`${report.reportingId}-${index}`}
                  brand={report.marque}
                  siteUrl={report.siteUrl || undefined}
                  subcategory={report.subCategory.subCategory}
                  descriptions={report.subCategory.descriptions || []}
                  capture={report.capture || null}
                  //brandLogoUrl={getBrandLogo(report.marque, report.siteUrl)}
                  hideFooter={true}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChronoSection;
