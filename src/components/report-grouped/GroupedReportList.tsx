import React, { useMemo } from "react";
import type { GroupedReport } from "@src/types/Reports";
import { useBrandLogos } from "@src/hooks/useBrandLogos";
import Avatar from "../shared/Avatar";

interface Props {
  grouped: Record<string, Record<string, GroupedReport[]>>;
  groupOpen: Record<string, boolean>;
  setGroupOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  renderCard: (item: any, index: number) => React.ReactNode;
}

const GroupedReportList: React.FC<Props> = ({
  grouped,
  groupOpen,
  setGroupOpen,
  renderCard,
}) => {
  // 🧠 1️⃣ Récupère toutes les marques + leurs éventuels siteUrl
  const brandEntries = useMemo(() => {
    const entries: { brand: string; siteUrl?: string }[] = [];
    for (const [brand, categories] of Object.entries(grouped)) {
      const firstCategoryArray = Object.values(categories)[0];
      const firstReport = firstCategoryArray?.[0];
      if (brand) {
        entries.push({
          brand,
          siteUrl: firstReport?.siteUrl || undefined,
        });
      }
    }
    return entries;
  }, [grouped]);

  // ⚡ 2️⃣ Charge tous les logos via le hook globalisé
  const brandLogos = useBrandLogos(brandEntries);

  // 🧩 3️⃣ Rendu
  return (
    <>
      {Object.entries(grouped).map(([brand, categories]) => (
        <div key={brand} className="brand-block">
          <div className="brand-header">
            <h2 className="brand-title">Tous les {brand}</h2>
          </div>

          <div className="category-list">
            {Object.entries(categories).map(([category, reports]) => {
              const catId = `${brand}_${category}`;
              const isOpen = groupOpen[catId];
              const logoUrl = brandLogos[brand];

              return (
                <div
                  key={catId}
                  className={`category-block ${isOpen ? "open" : ""}`}
                >
                  <div
                    className="category-header clickable"
                    onClick={() =>
                      setGroupOpen((prev) => ({
                        ...prev,
                        [catId]: !prev[catId],
                      }))
                    }
                  >
                    <div className="left">
                      <span className="chevron">{isOpen ? "▼" : "▶"}</span>
                      <span className="category-label">{category}</span>
                    </div>

                    <Avatar
                      avatar={logoUrl}
                      pseudo={brand}
                      type="brand"
                      wrapperClassName="brand-logo"
                    />
                  </div>

                  {isOpen && (
                    <div className="report-list">
                      {reports.map((item, index) => renderCard(item, index))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default GroupedReportList;
