import type {
  ExplodedGroupedReport,
  FeedbackDescription,
} from "@src/types/Reports";
import type { TicketStatusKey } from "@src/types/ticketStatus";

export const mapDescriptionToGroupedReport = (
  desc: FeedbackDescription,
  options?: { includeSubCategories?: boolean },
): ExplodedGroupedReport => {
  const reportingId = desc.id;
  const brand = desc.brand || "Autre";
  const category = "Non catégorisé";
  const subCategory = "Autre";

  const status: TicketStatusKey = "open"; // ✅ OBLIGATOIRE

  return {
    id: reportingId,
    reportingId,
    marque: brand,
    category,
    totalCount: 1,
    reactions: [],
    subCategory: {
      subCategory,
      status, // ✅ FIX
      count: 1,
      descriptions: [desc],
    },
    subCategories: options?.includeSubCategories
      ? [
          {
            subCategory,
            status, // ✅ FIX
            count: 1,
            descriptions: [desc],
          },
        ]
      : [],
  };
};
