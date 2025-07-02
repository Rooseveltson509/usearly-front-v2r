import type { UserGroupedReportDescription, UserGroupedReport } from "@src/types/Reports";

interface GroupedBrandReports {
  marque: string;
  totalCount: number;
  lastDate: string;
  subCategories: {
    category: string;
    subCategory: string;
    count: number;
    descriptions: UserGroupedReportDescription[];
  }[];
}

export function groupReportsByBrand(
  reports: UserGroupedReport[]
): GroupedBrandReports[] {
  const map = new Map<string, GroupedBrandReports>();

  for (const report of reports) {
    if (!map.has(report.marque)) {
      map.set(report.marque, {
        marque: report.marque,
        totalCount: 0,
        lastDate: "1970-01-01",
        subCategories: [],
      });
    }
    const grouped = map.get(report.marque)!;

    grouped.totalCount += report.count;

    // Dernière date de signalement
    const latestDesc = report.descriptions.reduce((latest, desc) =>
      new Date(desc.createdAt) > new Date(latest.createdAt) ? desc : latest,
    report.descriptions[0]);
    if (latestDesc && new Date(latestDesc.createdAt) > new Date(grouped.lastDate)) {
      grouped.lastDate = latestDesc.createdAt;
    }

    // Ajouter la sous-catégorie
    grouped.subCategories.push({
      category: report.category,
      subCategory: report.subCategory,
      count: report.count,
      descriptions: report.descriptions,
    });
  }

  return Array.from(map.values());
}
