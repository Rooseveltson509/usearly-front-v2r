import { apiService } from "./apiService";

export const getAdminAiOverview = async (query?: string) => {
  const res = await apiService.get("/admin/ai/overview", {
    params: query ? { query } : undefined,
  });

  return res.data;
};
