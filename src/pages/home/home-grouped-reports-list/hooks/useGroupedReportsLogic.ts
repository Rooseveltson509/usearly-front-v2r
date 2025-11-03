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

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const getSearchableStrings = (report: any) => {
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
  setSelectedSiteUrl?: (val: string | undefined) => void,
  selectedSiteUrl?: string,
) {
  const [filter, setFilter] = useState<FilterType>("chrono");
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [loadingFiltered, setLoadingFiltered] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(totalityCount);
  /* const [currentSection, setCurrentSection] = useState<SectionKey>("loading"); */

  // === Hooks de données ===
  const confirmedData = useConfirmedFlatData();
  const rageData = usePaginatedGroupedReportsByRage(filter === "rage", 10);
  const hotData = usePaginatedGroupedReportsByHot(filter === "hot", 10);
  const popularEngagementData = usePaginatedGroupedReportsByPopularEngagement(
    filter === "popular",
    20,
  );
  const rawChronoData = usePaginatedGroupedReportsByDate(filter === "chrono");

  // ✅ Normalisation locale des données chrono
  const chronoData = useMemo(() => {
    if (!rawChronoData?.data) return rawChronoData;
    const normalized = rawChronoData.data.map((r: any) => ({
      ...r,
      siteUrl:
        r.siteUrl ||
        (r.domain
          ? `https://${r.domain}`
          : `https://${r.marque?.toLowerCase()}.com`),
    }));
    return { ...rawChronoData, data: normalized };
  }, [rawChronoData]);

  const flatData = useFetchGroupedReports(activeTab);

  // === Sélection du hook actif ===
  const reportData = useMemo(() => {
    switch (filter) {
      case "confirmed":
        return confirmedData;
      case "rage":
        return rageData;
      case "hot":
        return hotData;
      case "popular":
        return popularEngagementData;
      case "chrono":
        return chronoData;
      default:
        return flatData;
    }
  }, [
    filter,
    confirmedData,
    rageData,
    hotData,
    popularEngagementData,
    chronoData,
    flatData,
  ]);

  // === Détermination de la section courante ===
  const derivedSection = useMemo<SectionKey>(() => {
    if (initializing) return "loading";
    const hasBrand = Boolean(selectedBrand?.trim());
    const hasCategory = Boolean(selectedCategory?.trim());
    if (hasBrand || hasCategory) return "brandFiltered";
    switch (filter) {
      case "confirmed":
        return "confirmed";
      case "rage":
        return "rage";
      case "popular":
        return "popular";
      case "chrono":
        return "chrono";
      case "urgent":
        return "urgent";
      default:
        return "default";
    }
  }, [filter, initializing, selectedBrand, selectedCategory]);

  useEffect(() => {
    if (onSectionChange) onSectionChange(derivedSection);
  }, [derivedSection, onSectionChange]);

  // === Initialisation ===
  useEffect(() => {
    if (initializing) {
      setFilter("chrono");
      setInitializing(false);
    }
  }, [initializing]);

  // === Fetch filtré par marque ===
  useEffect(() => {
    const fetchFilteredReports = async () => {
      if (!selectedBrand) {
        setFilteredReports([]);
        return;
      }
      try {
        setLoadingFiltered(true);
        const { data } = await apiService.get("/reports", {
          params: { brand: selectedBrand, page: 1, limit: 10 },
        });
        setFilteredReports(data.data);
        setTotalCount(data.data.length);
      } catch (err) {
        console.error("Erreur fetch reports filtrés:", err);
        setFilteredReports([]);
      } finally {
        setLoadingFiltered(false);
      }
    };
    fetchFilteredReports();
  }, [selectedBrand]);

  useEffect(() => setSearchTerm(""), [selectedBrand]);

  // === Filtrage catégorie ===
  const filteredByCategory = useMemo(() => {
    if (selectedCategory) {
      return filteredReports.filter((r) => r.subCategory === selectedCategory);
    }
    return filteredReports;
  }, [filteredReports, selectedCategory]);

  // === Recherche texte ===
  const normalizedSearchTerm = useMemo(
    () => (searchTerm.trim() ? normalizeText(searchTerm) : ""),
    [searchTerm],
  );

  const reportsToDisplay = useMemo(() => {
    if (!normalizedSearchTerm) return filteredByCategory;
    return filteredByCategory.filter((r) => {
      const vals = getSearchableStrings(r);
      return vals.some((v) => normalizeText(v).includes(normalizedSearchTerm));
    });
  }, [filteredByCategory, normalizedSearchTerm]);

  // === ✅ Mise à jour automatique du siteUrl, sans écraser celui choisi manuellement ===
  // ✅ Mise à jour du siteUrl (ne remplace pas celui choisi manuellement)
  useEffect(() => {
    if (!setSelectedSiteUrl) return;

    // Rien de sélectionné → reset
    if (!selectedBrand && !selectedCategory) {
      setSelectedSiteUrl(undefined);
      return;
    }

    // Si déjà défini via FilterBar → ne rien faire
    if (selectedBrand && selectedSiteUrl) return;

    // Sinon, déduction automatique
    const firstValid = reportsToDisplay.find(
      (r) => typeof r.siteUrl === "string" && r.siteUrl.trim().length > 0,
    );
    if (firstValid?.siteUrl) {
      setSelectedSiteUrl(firstValid.siteUrl);
      console.log("🔁 SiteUrl auto-déduit:", firstValid.siteUrl);
    }
  }, [
    selectedBrand,
    selectedCategory,
    selectedSiteUrl,
    reportsToDisplay,
    setSelectedSiteUrl,
  ]);

  return {
    filter,
    setFilter,
    reportData,
    chronoData,
    popularEngagementData,
    filteredReports,
    loadingFiltered,
    totalCount,
    initializing,
    searchTerm,
    setSearchTerm,
    filteredByCategory,
    reportsToDisplay,
  };
}
