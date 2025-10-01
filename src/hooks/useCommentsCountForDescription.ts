import { useEffect, useState } from "react";
import { getCommentsCountForDescription } from "@src/services/commentService";

export const useCommentsCountForDescription = (descriptionId: string) => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCount = async () => {
    try {
      setLoading(true);
      const res = await getCommentsCountForDescription(descriptionId);
      setCount(res.data.commentsCount ?? 0);
    } catch (err) {
      console.error(
        "Erreur lors de la récupération du nombre de commentaires :",
        err,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (descriptionId) {
      fetchCount();
    }
  }, [descriptionId]);

  return { count, loading, refresh: fetchCount };
};
