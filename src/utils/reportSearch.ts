import type { ExplodedGroupedReport, PopularReport } from "@src/types/Reports";

export const normalizeSearchText = (value?: string | null) =>
  (value ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

export const getExplodedReportSearchValues = (
  item: ExplodedGroupedReport,
): string[] => {
  const values: string[] = [];

  const subCategoryLabel =
    typeof item.subCategory?.subCategory === "string"
      ? item.subCategory.subCategory
      : undefined;

  if (typeof subCategoryLabel === "string" && subCategoryLabel.trim()) {
    values.push(subCategoryLabel);
  }

  if (typeof item.marque === "string") {
    values.push(item.marque);
  }

  if (typeof item.category === "string") {
    values.push(item.category);
  }

  (item.subCategory?.descriptions ?? []).forEach((description) => {
    if (typeof description.description === "string") {
      values.push(description.description);
    }

    const extraFields = description as {
      title?: string;
      text?: string;
    };

    if (typeof extraFields.title === "string") {
      values.push(extraFields.title);
    }

    if (typeof extraFields.text === "string") {
      values.push(extraFields.text);
    }
  });

  return values;
};

export const matchesExplodedReportSearch = (
  item: ExplodedGroupedReport,
  normalizedSearchTerm: string,
) => {
  if (!normalizedSearchTerm) return true;

  return getExplodedReportSearchValues(item).some((value) =>
    normalizeSearchText(value).includes(normalizedSearchTerm),
  );
};

export const getPopularReportSearchValues = (item: PopularReport): string[] => {
  const values: string[] = [];

  if (typeof item.marque === "string") {
    values.push(item.marque);
  }

  if (typeof item.category === "string") {
    values.push(item.category);
  }

  if (typeof item.subCategory === "string") {
    values.push(item.subCategory);
  }

  if (typeof item.description === "string") {
    values.push(item.description);
  }

  if (typeof item.user?.pseudo === "string") {
    values.push(item.user.pseudo);
  }

  return values;
};

export const matchesPopularReportSearch = (
  item: PopularReport,
  normalizedSearchTerm: string,
) => {
  if (!normalizedSearchTerm) return true;

  return getPopularReportSearchValues(item).some((value) =>
    normalizeSearchText(value).includes(normalizedSearchTerm),
  );
};
