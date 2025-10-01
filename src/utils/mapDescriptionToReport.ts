import type {
  ExplodedGroupedReport,
  FeedbackDescription,
} from "@src/types/Reports";

export const mapDescriptionToGroupedReport = (
  desc: FeedbackDescription,
  options?: { includeSubCategories?: boolean },
): ExplodedGroupedReport => {
  const reportingId = desc.id;
  const brand = desc.brand || "Autre";
  const category = "Non catégorisé";
  const subCategory = "Autre";

  return {
    id: reportingId,
    reportingId,
    marque: brand,
    category,
    totalCount: 1,
    reactions: [],
    subCategory: {
      subCategory,
      count: 1,
      descriptions: [desc],
    },
    subCategories: options?.includeSubCategories
      ? [
          {
            subCategory,
            count: 1,
            descriptions: [desc],
          },
        ]
      : [],
  };
};
