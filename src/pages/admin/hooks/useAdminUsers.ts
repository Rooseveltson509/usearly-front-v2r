import { getAdminUsers } from "@src/services/adminService";
import { useEffect, useState } from "react";

export function useAdminUsers(page: number) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    getAdminUsers(page).then((res) => {
      setData(res.users);
      setPagination(res.pagination);
      setLoading(false);
    });
  }, [page]);

  return { data, loading, pagination };
}
