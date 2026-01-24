import { useState, useEffect, useMemo } from "react";
import { useFetchGroupedReports } from "@src/hooks/useFetchGroupedReports";
import { usePaginatedGroupedReportsByDate } from "@src/hooks/usePaginatedGroupedReportsByDate";
import { usePaginatedGroupedReportsByPopularEngagement } from "@src/hooks/usePaginatedGroupedReportsByPopularEngagement";
import { usePaginatedGroupedReportsByRage } from "@src/hooks/usePaginatedGroupedReportsByRage";
import { useConfirmedFlatData } from "@src/hooks/useConfirmedFlatData";
import { apiService } from "@src/services/apiService";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import { usePaginatedGroupedReportsByHot } from "./usePaginatedGroupedReportsByHot";

type SectionKey =
  | "loading"
  | "brandFiltered"
  | "confirmed"
  | "rage"
  | "popular"
  | "chrono"
  | "urgent"
  | "default";

type FilterType =
  | ""
  | "chrono"
  | "confirmed"
  | "rage"
  | "popular"
  | "urgent"
  | "hot"
  | "recent";

export const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const getSearchableStrings = (report: any) => {
  const values: string[] = [];

  if (report.subCategory) values.push(report.subCategory);
  if (report.category) values.push(report.category);

  if (Array.isArray(report.descriptions)) {
    report.descriptions.forEach((item: any) => {
      if (typeof item === "string") values.push(item);
      else if (item && typeof item === "object") {
        if (typeof item.description === "string") values.push(item.description);
        if (typeof item.title === "string") values.push(item.title);
        if (typeof item.text === "string") values.push(item.text);
      }
    });
  }

  return values;
};

/**
 * 🧠 useGroupedReportsLogic
 * Centralise la logique du composant HomeGroupedReportsList.
 * - Gestion du filtre actif (chrono, popular, rage, confirmed)
 * - Fetch des données et états de chargement
 * - Recherche, filtrage, comptage
 * - Gère le siteUrl sélectionné sans l’écraser s’il vient de FilterBar
 */
export function useGroupedReportsLogic(
  activeTab: FeedbackType,
  totalityCount: number,
  onSectionChange?: (section: SectionKey) => void,
  selectedBrand?: string,
  selectedCategory?: string,
) {
  const [filter, setFilter] = useState<FilterType>("chrono");
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [totalCount, setTotalCount] = useState(totalityCount);

  // ===============================
  // HOOKS BRUTS
  // ===============================
  const confirmedData = useConfirmedFlatData();
  const rageData = usePaginatedGroupedReportsByRage(filter === "rage", 10);
  const hotData = usePaginatedGroupedReportsByHot(filter === "hot", 10);
  const popularEngagementData = usePaginatedGroupedReportsByPopularEngagement(
    filter === "popular",
    20,
  );
  const rawChronoData = usePaginatedGroupedReportsByDate(filter === "chrono");
  const flatData = useFetchGroupedReports(activeTab);

  // ===============================
  // CHRONO (siteUrl + status)
  // ===============================

  const chronoData = useMemo(() => {
    if (!rawChronoData?.data) return rawChronoData;

    return {
      ...rawChronoData,
      data: rawChronoData.data.map((r: any) => ({
        ...r,
        siteUrl:
          r.siteUrl ||
          (r.domain
            ? `https://${r.domain}`
            : `https://${r.marque?.toLowerCase()}.com`),
      })),
    };
  }, [rawChronoData]);

  // ===============================
  // SOURCE ACTIVE
  // ===============================
  const reportData = useMemo(() => {
    const source =
      filter === "confirmed"
        ? confirmedData
        : filter === "rage"
          ? rageData
          : filter === "hot"
            ? hotData
            : filter === "popular"
              ? popularEngagementData
              : filter === "chrono"
                ? chronoData
                : flatData;

    return source;
  }, [
    filter,
    confirmedData,
    rageData,
    hotData,
    popularEngagementData,
    chronoData,
    flatData,
  ]);

  // ===============================
  // SECTION COURANTE
  // ===============================
  const derivedSection = useMemo<SectionKey>(() => {
    if (initializing) return "loading";
    if (selectedBrand || selectedCategory) return "brandFiltered";

    switch (filter) {
      case "confirmed":
      case "rage":
      case "popular":
      case "chrono":
      case "urgent":
        return filter;

      case "hot":
      case "recent":
        return "default";

      default:
        return "default";
    }
  }, [filter, initializing, selectedBrand, selectedCategory]);

  useEffect(() => {
    if (onSectionChange) onSectionChange(derivedSection);
  }, [derivedSection, onSectionChange]);

  useEffect(() => {
    if (initializing) {
      setFilter("chrono");
      setInitializing(false);
    }
  }, [initializing]);

  // ===============================
  // FETCH PAR MARQUE
  // ===============================
  useEffect(() => {
    if (!selectedBrand) {
      setFilteredReports([]);
      return;
    }

    (async () => {
      try {
        setLoadingFiltered(true);
        const { data } = await apiService.get("/reports", {
          params: { brand: selectedBrand, page: 1, limit: 20 },
        });
        setFilteredReports(data.data);
        setTotalCount(data.data.length);
      } catch {
        setFilteredReports([]);
      } finally {
        setLoadingFiltered(false);
      }
    })();
  }, [selectedBrand]);
  return {
    filter,
    setFilter,
    reportData: {
      ...reportData,
    },
    chronoData,
    popularEngagementData,
    filteredReports,
    loadingFiltered,
    totalCount,
    initializing,
  };

  /*   return {
    filter,
    setFilter,
    reportData,
    chronoData,
    popularEngagementData,
    filteredReports,
    loadingFiltered,
    totalCount,
    initializing,
  }; */
}
