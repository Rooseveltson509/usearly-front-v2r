import React from "react";
import SqueletonAnime from "@src/components/loader/SqueletonAnime";
import FlatSubcategoryBlock from "../../confirm-reportlist/FlatSubcategoryBlock";

interface ChronoSectionProps {
  chronoData: { data?: any[]; loading: boolean };
  reportData: { loading: boolean };
  loaderRef: React.RefObject<HTMLDivElement | null>;
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
}) => {
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

  // ⚠️ Aucun signalement récent
  if (!chronoData.data || chronoData.data.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "#888" }}>
        Aucun signalement récent disponible.
      </div>
    );
  }

  // ✅ Contenu principal
  return (
    <div className="recent-reports-list">
      {chronoData.data.map((report: any, i: number) => (
        <div key={`${report.reportingId}-${i}`} className="recent-report-item">
          <div className="recent-report-date">
            🗓️{" "}
            {new Date(report.date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </div>

          <FlatSubcategoryBlock
            brand={report.marque}
            siteUrl={report.siteUrl || undefined}
            subcategory={report.subCategory.subCategory}
            descriptions={report.subCategory.descriptions || []}
            //brandLogoUrl={getBrandLogo(report.marque, report.siteUrl)}
            hideFooter={true}
          />
        </div>
      ))}
    </div>
  );
};

export default ChronoSection;
