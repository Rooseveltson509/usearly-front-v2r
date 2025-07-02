import { useEffect, useState } from "react";
import { getUserProfileGroupedReports } from "@src/services/feedbackService";
import type { UserGroupedReport } from "@src/types/Reports";

export const useFetchUserGroupedReports = () => {
    const [data, setData] = useState<UserGroupedReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false); // Pas de pagination dans cette version, peut rester false

    const loadMore = () => {
        // Pas de pagination pour le moment
    };

    useEffect(() => {
        setLoading(true);
        getUserProfileGroupedReports()
            .then((res) => {
                setData(res.results);
            })
            .finally(() => setLoading(false));
    }, []);

    return {
        data,
        loading,
        hasMore,
        loadMore,
    };
};
