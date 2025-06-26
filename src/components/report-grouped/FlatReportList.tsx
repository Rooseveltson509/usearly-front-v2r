import React, { useEffect, useState, type JSX } from "react";
import type { GroupedReport } from "@src/types/Reports";
import { fetchValidBrandLogo } from "@src/utils/brandLogos";
import { parseISO, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./FlatReportList.scss";

interface Props {
  grouped: [string, GroupedReport[]][];
  groupOpen: Record<string, boolean>;
  setGroupOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  renderCard: (item: any, index: number) => JSX.Element;
}

// 🔹 Fonction pour récupérer la dernière date
const getLatestDateLabel = (reports: GroupedReport[]) => {
  const allDates = reports
    .flatMap(
      (r) =>
        r.subCategories?.flatMap(
          (sub) => sub.descriptions?.map((d) => d.createdAt) || []
        ) || []
    )
    .filter(Boolean)
    .map((date) => parseISO(date as string));

  if (allDates.length === 0) return null;
  const latest = allDates.reduce((a, b) => (a > b ? a : b));
  return formatDistanceToNow(latest, { locale: fr, addSuffix: true });
};

const FlatReportList = ({
  grouped,
  groupOpen,
  setGroupOpen,
  renderCard,
}: Props): JSX.Element => {
  const [logos, setLogos] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadAllLogos = async () => {
      const entries = await Promise.all(
        grouped.map(async ([brand]) => {
          const logoUrl = await fetchValidBrandLogo(brand);
          return [brand, logoUrl] as [string, string];
        })
      );
      setLogos(Object.fromEntries(entries));
    };
    loadAllLogos();
  }, [grouped]);

  return (
    <>
      {grouped.map(([brand, reports]) => {
        const isOpen = groupOpen[brand];
        const total = reports.length;
        const latestDate = getLatestDateLabel(reports);

        return (
          <div key={brand} className="report-group">
            <div
              className={`report-group-header ${isOpen ? "open" : ""}`}
              onClick={() =>
                setGroupOpen((prev) => ({ ...prev, [brand]: !prev[brand] }))
              }
            >
              <div className="report-main-info">
                <span className="report-count">{total}</span>
                <span className="report-label">
                  signalement{total > 1 ? "s" : ""} sur <strong>{brand}</strong>
                </span>
              </div>
              <div className="report-extra-info">
                {latestDate && (
                  <span className="report-date">{latestDate}</span>
                )}
                <img
                  className="brand-logo"
                  src={logos[brand] || ""}
                  alt={brand}
                />
              </div>
            </div>

            {isOpen && (
              <div className="report-list">{reports.map(renderCard)}</div>
            )}
          </div>
        );
      })}
    </>
  );
};

export default FlatReportList;

/* import React, { useEffect, useState, type JSX } from "react";
import type { GroupedReport } from "@src/types/Reports";
import { fetchValidBrandLogo } from "@src/utils/brandLogos";
import "./FlatReportList.scss";


interface Props {
    grouped: [string, GroupedReport[]][];
    groupOpen: Record<string, boolean>;
    setGroupOpen: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    renderCard: (item: any, index: number) => JSX.Element;
}

const FlatReportList = ({ grouped, groupOpen, setGroupOpen, renderCard }: Props): JSX.Element => {
    const [logos, setLogos] = useState<Record<string, string>>({});
    useEffect(() => {
        const loadAllLogos = async () => {
            const entries = await Promise.all(
                grouped.map(async ([brand]) => {
                    const logoUrl = await fetchValidBrandLogo(brand);
                    return [brand, logoUrl] as [string, string];
                })
            );
            setLogos(Object.fromEntries(entries));
        };
        loadAllLogos();
    }, [grouped]);


    return (
        <>
            {grouped.map(([brand, reports]) => {
                const isOpen = groupOpen[brand];
                const total = reports.length;

                return (
                    <div key={brand} className="category-block">
                        <div className={`category-wrapper ${isOpen ? "with-list" : ""}`}>
                            <div
                                className="category-header clickable"
                                onClick={() =>
                                    setGroupOpen((prev) => ({ ...prev, [brand]: !prev[brand] }))
                                }
                            >
                                <div className="left">
                                    <span className={`chevron ${isOpen ? "open" : ""}`}>
                                        ▶
                                    </span>
                                    <span className="category-title">
                                        {total} signalement{total > 1 ? "s" : ""} sur{" "}
                                        <strong>{brand}</strong>
                                    </span>
                                </div>
                                <img
                                    src={logos[brand] || ""}
                                    alt={brand}
                                    className="brand-logo"
                                />
                            </div>

                            {isOpen && (
                                <div className="report-list">{reports.map(renderCard)}</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default FlatReportList;
 */
