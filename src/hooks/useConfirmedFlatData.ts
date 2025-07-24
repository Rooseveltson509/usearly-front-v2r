import { useEffect, useState } from "react";
import { getConfirmedSubcategoryReports } from "@src/services/feedbackService";
import type {
  ConfirmedSubcategoryReport,
  FeedbackDescription,
  ExplodedGroupedReport,
} from "@src/types/Reports";

export const useConfirmedFlatData = () => {
  const [data, setData] = useState<ExplodedGroupedReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getConfirmedSubcategoryReports(1, 100); // page 1, 100 éléments

        const formatted: ExplodedGroupedReport[] = res.data.map(
          (item: ConfirmedSubcategoryReport, index) => {
            const descriptions: FeedbackDescription[] = item.descriptions.map((desc, i) => ({
              id: String(desc.id),
              reportingId: String(item.reportingId),
              description: desc.description,
              emoji: desc.emoji ?? "",
              createdAt: desc.createdAt,
              user: {
                id: String(desc.user.id),
                pseudo: desc.user.pseudo,
                avatar: desc.user.avatar ?? null,
              },
              capture: i === 0 ? item.capture : null,
              marque: item.marque,
              reactions: [],
            }));

            const explodedItem: ExplodedGroupedReport = {
              id: String(item.reportingId), // 🔁 requis par GroupedReport
              reportingId: String(item.reportingId),
              category: item.category,
              marque: item.marque,
              siteUrl: item.siteUrl ?? undefined,
              totalCount: item.count,
              reactions: [],

              // ✅ pour compatibilité avec GroupedReport
              subCategories: [
                {
                  subCategory: item.subCategory,
                  count: item.count,
                  descriptions,
                },
              ],

              // ✅ pour la vue flat (ajouté par ExplodedGroupedReport)
              subCategory: {
                subCategory: item.subCategory,
                count: item.count,
                descriptions,
              },
            };


            return explodedItem;
          }
        );

        setData(formatted);
      } catch (err) {
        console.error("❌ useConfirmedFlatData failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { data, loading };
};
