import React, { useEffect, useState } from "react";
import type { GroupedReport } from "@src/types/Reports";
import { fetchValidBrandLogo } from "@src/utils/brandLogos"; // ⬅️ version dynamique

interface Props {
  grouped: Record<string, Record<string, GroupedReport[]>>;
  groupOpen: Record<string, boolean>;
  setGroupOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  renderCard: (item: any, index: number) => React.ReactNode;
}

const GroupedReportList = ({ grouped, groupOpen, setGroupOpen, renderCard }: Props) => {
  const [logos, setLogos] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadBrandLogos = async () => {
      const entries = await Promise.all(
        Object.keys(grouped).map(async (brand) => {
          const logoUrl = await fetchValidBrandLogo(brand);
          return [brand, logoUrl] as [string, string];
        })
      );
      setLogos(Object.fromEntries(entries));
    };
    loadBrandLogos();
  }, [grouped]);

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
                <div key={catId} className={`category-block ${isOpen ? "open" : ""}`}>
                  <div
                    className="category-header clickable"
                    onClick={() => setGroupOpen((prev) => ({ ...prev, [catId]: !prev[catId] }))}
                  >
                    <div className="left">
                      <span className="chevron">{isOpen ? "▼" : "▶"}</span>
                      <span className="category-label">{category}</span>
                    </div>
                    <img
                      src={logos[brand] || ""}
                      alt={brand}
                      className="brand-logo"
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
