import { useEffect, useState } from "react";
import { getFilteredReportDescriptions } from "@src/services/feedbackService";

export const useFilteredDescriptions = (brand: string, category: string) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    getFilteredReportDescriptions(brand, category, page, limit)
      .then((res) => {
        setData(res.data);
        setTotal(res.total);
      })
      .finally(() => setLoading(false));
  }, [brand, category, page]);

  return { data, total, page, setPage, loading };
};
