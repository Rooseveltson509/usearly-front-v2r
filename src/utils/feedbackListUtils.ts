import { format, isToday, isYesterday } from "date-fns";
import { fr } from "date-fns/locale";
import type { GroupedReport, ExplodedGroupedReport } from "@src/types/Reports";

// 💥 Déstructure un GroupedReport en une liste à plat de chaque sous-catégorie
export function explodeGroupedReports(data: GroupedReport[]) {
  return data.flatMap((report) =>
    Array.isArray(report.subCategories)
      ? report.subCategories.map((subCategory) => ({
          ...report,
          subCategory,
        }))
      : [],
  );
}

// 🔁 Regroupe les rapports par marque
export function groupByBrand(
  reports: ReturnType<typeof explodeGroupedReports>,
) {
  return reports.reduce(
    (acc, item) => {
      const brand = item.marque || "Autre";
      if (!acc[brand]) acc[brand] = [];
      acc[brand].push(item);
      return acc;
    },
    {} as Record<string, typeof reports>,
  );
}

// 🧩 Regroupe les rapports par marque, puis par catégorie
export function groupByBrandThenCategory(
  groupedByBrand: Record<string, ReturnType<typeof explodeGroupedReports>>,
) {
  return Object.fromEntries(
    Object.entries(groupedByBrand).map(([brand, items]) => {
      const categories = items.reduce(
        (acc, item) => {
          const key = item.category || "Autre";
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        },
        {} as Record<string, typeof items>,
      );
      return [brand, categories];
    }),
  );
}

// 📅 Regroupe les rapports par date (Aujourd’hui, Hier, ou formaté)
export function groupByDate(reports: ExplodedGroupedReport[]) {
  return reports.reduce(
    (acc, item) => {
      const desc =
        item?.subCategory?.descriptions?.[0] ||
        item?.subCategories?.[0]?.descriptions?.[0];

      if (!desc?.createdAt) {
        console.warn("⚠️ Ignoré (pas de createdAt):", desc);
        return acc;
      }

      const date = new Date(desc.createdAt);
      if (isNaN(date.getTime())) return acc;

      const label = isToday(date)
        ? "Aujourd’hui"
        : isYesterday(date)
          ? "Hier"
          : format(date, "dd MMMM yyyy", { locale: fr });

      if (!acc[label]) acc[label] = [];
      acc[label].push(item);

      return acc;
    },
    {} as Record<string, ExplodedGroupedReport[]>,
  );
}
