import type { GroupedReport } from "@src/types/Reports";

interface FilterOptions {
  brand?: string;
  category?: string;
  status?: string;
  sortByDate?: "asc" | "desc";
}

export const flattenGroupedReports = (data: GroupedReport[]) => {
  return data.flatMap((group) => {
    const brand = group.marque;
    //const icon = group.icon || null;

    return group.subCategories.flatMap((subCat) => {
      return subCat.descriptions.map((desc) => ({
        ...desc,
        brand,
        subCategory: subCat.subCategory,
        //status: subCat.status || "Inconnu",
        createdAt: desc.createdAt,
        groupMeta: { brand },
      }));
    });
  });
};

export const filterAndSortDescriptions = (
  descriptions: ReturnType<typeof flattenGroupedReports>,
  filters: FilterOptions,
) => {
  let results = descriptions;

  if (filters.brand) {
    results = results.filter((d) => d.brand === filters.brand);
  }

  if (filters.category) {
    results = results.filter((d) => d.subCategory === filters.category);
  }

  /*   if (filters.status) {
    results = results.filter((d) => d.status === filters.status);
  } */

  if (filters.sortByDate) {
    results = [...results].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return filters.sortByDate === "desc" ? dateB - dateA : dateA - dateB;
    });
  }

  return results;
};
