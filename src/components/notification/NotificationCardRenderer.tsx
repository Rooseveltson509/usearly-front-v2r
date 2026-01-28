import React from "react";
import InteractiveFeedbackCard from "@src/components/InteractiveFeedbackCard/InteractiveFeedbackCard";
import FlatSubcategoryBlock from "@src/pages/home/confirm-reportlist/FlatSubcategoryBlock";

interface Props {
  notif: any;
  isOpen?: boolean;
  onDelete?: (id: string) => void; // 🆕 ajout du handler
}

const NotificationCardRenderer: React.FC<Props> = ({ notif, isOpen }) => {
  const openProps = typeof isOpen === "boolean" ? { isOpen } : {};

  // 🟢 Suggestion
  if (notif.suggestion) {
    return (
      <div className="notif-card-container">
        <InteractiveFeedbackCard
          item={{ ...notif.suggestion, type: "suggestion" }}
          {...openProps}
          isOpen={isOpen ?? true}
          onToggle={() => {}}
        />
      </div>
    );
  }

  // 🟠 Coup de cœur
  if (notif.coupDeCoeur) {
    return (
      <div className="notif-card-container">
        <InteractiveFeedbackCard
          item={{ ...notif.coupDeCoeur, type: "coupdecoeur" }}
          {...openProps}
          isOpen={isOpen ?? true}
          onToggle={() => {}}
        />
      </div>
    );
  }

  // 🔵 Signalement
  if (notif.description && notif.description.reporting) {
    const report = notif.description;
    const reporting = report.reporting;

    const reportId = reporting.id; // ✅ ICI LA VRAIE CLÉ

    const brand = reporting?.marque || "Marque inconnue";
    const siteUrl = reporting?.siteUrl || "";

    const normalizedDescriptions = [
      {
        id: report.id,
        description: report.description,
        createdAt: report.createdAt,
        author: report.author, // ✅ CLÉ IMPORTANTE
        emoji: report.emoji,
        reactions: report.reactions ?? [],
      },
    ];

    return (
      <div className="notif-card-container">
        <FlatSubcategoryBlock
          brand={brand}
          siteUrl={siteUrl}
          subcategory={report.subCategory}
          descriptions={normalizedDescriptions}
          status={notif.status}
          reportId={reportId} // ✅ MAINTENANT VALIDE
          hasBrandResponse={notif.hasBrandResponse}
          capture={reporting?.capture}
          forceOpenComments={notif.hasBrandResponse}
          hideFooter={true}
        />
      </div>
    );
  }

  return null;
};

export default NotificationCardRenderer;
