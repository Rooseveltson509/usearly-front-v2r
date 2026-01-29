import { useEffect, useState } from "react";
import { getConfirmedSubcategoryReports } from "@src/services/feedbackService";
import type {
  ConfirmedSubcategoryReport,
  FeedbackDescription,
  ExplodedGroupedReport,
} from "@src/types/Reports";
import { normalizeBrandResponse } from "@src/utils/brandResponse";

export const useConfirmedFlatData = () => {
  const [data, setData] = useState<ExplodedGroupedReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getConfirmedSubcategoryReports(1, 100); // page 1, 100 éléments

        const formatted: ExplodedGroupedReport[] = res.data.map(
          (item: ConfirmedSubcategoryReport) => {
            const descriptions: FeedbackDescription[] = item.descriptions.map(
              (desc: any, i) => {
                const normalized: FeedbackDescription = {
                  id: String(desc.id),
                  reportingId: String(item.reportingId),
                  description: desc.description,
                  emoji: desc.emoji ?? "",
                  createdAt: desc.createdAt,

                  // ✅ NORMALISATION UNIQUE
                  author: {
                    id: String(desc.user.id),
                    pseudo: desc.user.pseudo,
                    avatar: desc.user.avatar ?? null,
                    email: desc.user.email,
                  },

                  capture: i === 0 ? item.capture : null,
                  marque: item.marque,
                  reactions: [],
                };

                return normalized;
              },
            );

            const explodedItem: ExplodedGroupedReport = {
              id: String(item.reportingId), // 🔁 requis par GroupedReport
              reportingId: String(item.reportingId),
              category: item.category,
              marque: item.marque,
              siteUrl: item.siteUrl ?? undefined,
              totalCount: item.count,
              hasBrandResponse: normalizeBrandResponse(item.hasBrandResponse, {
                brand: item.marque,
                siteUrl: item.siteUrl ?? null,
              }),
              reactions: [],

              // ✅ pour compatibilité avec GroupedReport
              subCategories: [
                {
                  subCategory: item.subCategory,
                  count: item.count,
                  status: item.status,
                  descriptions,
                },
              ],

              // ✅ pour la vue flat (ajouté par ExplodedGroupedReport)
              subCategory: {
                subCategory: item.subCategory,
                count: item.count,
                status: item.status,
                descriptions,
              },
            };

            return explodedItem;
          },
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
