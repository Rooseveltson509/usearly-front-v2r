import React from "react";
import InteractiveFeedbackCard from "@src/components/InteractiveFeedbackCard/InteractiveFeedbackCard";
import { getBrandLogo } from "@src/utils/brandLogos";
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
        {/*   {renderDeleteButton()} */}
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
        {/*  {renderDeleteButton()} */}
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
    const brand = reporting?.marque || "Marque inconnue";
    const siteUrl = reporting?.siteUrl || "";
    const brandLogoUrl = getBrandLogo(brand, siteUrl);

    const normalizedDescriptions = [
      {
        id: report.id,
        description: report.description,
        user: report.user || { pseudo: "Utilisateur inconnu" },
        createdAt: report.createdAt,
      },
    ];

    return (
      <div className="notif-card-container">
        {/* {renderDeleteButton()} */}
        <FlatSubcategoryBlock
          brand={brand}
          siteUrl={siteUrl}
          subcategory={report.subCategory}
          descriptions={normalizedDescriptions}
          brandLogoUrl={brandLogoUrl}
          capture={reporting?.capture}
          hideFooter
          forceOpenComments={false}
        />
      </div>
    );
  }

  return null;
};

export default NotificationCardRenderer;
