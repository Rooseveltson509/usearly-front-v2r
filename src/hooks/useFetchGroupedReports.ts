import { useEffect, useState, useCallback } from "react";
import type { FeedbackType } from "@src/components/user-profile/FeedbackTabs";
import { getAllPublicGroupedReports, getPublicCoupsDeCoeur, getPublicSuggestions } from "@src/services/feedbackService";
import type { PublicGroupedReport, CoupDeCoeur, Suggestion } from "@src/types/Reports";

export const useFetchGroupedReports = (activeTab: FeedbackType) => {
    const [data, setData] = useState<PublicGroupedReport[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === "report") {
                const res = await getAllPublicGroupedReports(page, 15);
                setData(prev => page === 1 ? res.results : [...prev, ...res.results]);
                setHasMore(page < res.totalPages);
            } else {
                const fetchFn = activeTab === "coupdecoeur" ? getPublicCoupsDeCoeur : getPublicSuggestions;
                const res = await fetchFn(page, 15);
                const items: (CoupDeCoeur | Suggestion)[] = activeTab === "coupdecoeur" ? res.coupDeCoeurs : res.suggestions;

                const transformed: PublicGroupedReport[] = items.map(item => ({
                    id: item.id,
                    reportingId: item.id,
                    category: "Autre",
                    marque: item.marque || "Inconnu",
                    totalCount: 1,
                    subCategories: [
                        {
                            subCategory: "Autre",
                            count: 1,
                            descriptions: [
                                {
                                    id: item.id,
                                    reportingId: item.id,
                                    description: item.description,
                                    emoji: item.emoji || "",
                                    createdAt: item.createdAt,
                                    user: item.author ? {
                                        id: "",
                                        pseudo: item.author.pseudo,
                                        avatar: item.author.avatar || null,
                                    } : undefined,
                                    capture: item.capture,
                                    reactions: item.reactions.map(r => ({
                                        emoji: r.emoji,
                                        count: r.count,
                                        userIds: r.userIds,
                                    })),
                                    marque: item.marque || "Inconnu",
                                }
                            ]
                        }
                    ]
                }));

                setData(prev => page === 1 ? transformed : [...prev, ...transformed]);
                setHasMore(items.length > 0);
            }
        } catch (error) {
            console.error("Erreur lors du chargement:", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, page]);

    // Reset complet et refetch immédiat sur changement de tab
    useEffect(() => {
        setData([]);
        setPage(1);
        setHasMore(true);
        setLoading(true); // ⚠️ pour afficher immédiatement le loader
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return { data, loading, hasMore, loadMore };
};
