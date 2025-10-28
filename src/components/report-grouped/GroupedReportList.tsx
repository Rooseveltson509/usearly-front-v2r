import React, { useEffect, useState } from "react";
import type { GroupedReport } from "@src/types/Reports";
import { fetchValidBrandLogo } from "@src/utils/brandLogos"; // ⬅️ version dynamique
import { getBrandLogo } from "@src/utils/brandLogos";
import Avatar from "../shared/Avatar";

interface Props {
  grouped: Record<string, Record<string, GroupedReport[]>>;
  groupOpen: Record<string, boolean>;
  setGroupOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  renderCard: (item: any, index: number) => React.ReactNode;
}

const GroupedReportList = ({
  grouped,
  groupOpen,
  setGroupOpen,
  renderCard,
}: Props) => {
  const [logos, setLogos] = useState<Record<string, string>>({});

  useEffect(() => {
    const brands = Object.keys(grouped);
    const missing = brands.filter((brand) => !logos[brand]);
    if (missing.length === 0) {
      return;
    }

    let cancelled = false;

    const loadBrandLogos = async () => {
      const entries = await Promise.all(
        missing.map(async (brand) => {
          const firstCategoryArray = Object.values(grouped[brand])[0];
          const firstReport = firstCategoryArray?.[0];
          const siteUrl = firstReport?.siteUrl || undefined;

          const logoUrl = await fetchValidBrandLogo(brand, siteUrl);
          return [brand, logoUrl] as const;
        }),
      );

      if (!cancelled) {
        setLogos((prev) => {
          const next = { ...prev };
          entries.forEach(([brand, logo]) => {
            next[brand] = logo;
          });
          return next;
        });
      }
    };

    loadBrandLogos();

    return () => {
      cancelled = true;
    };
  }, [grouped, logos]);

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
                      avatar={getBrandLogo(brand)}
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
