import { apiService } from "./apiService";
import type { CoupDeCoeur, GroupedReport, GroupedReportResponse, Suggestion, UserStatsSummary } from "@src/types/Reports";

const getAuthToken = () =>
  localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

/**
 * Signalements groupés de l'utilisateur
 */
export const getGroupedReportsByUser = async (
  page = 1,
  limit = 10
): Promise<GroupedReportResponse> => {
  try {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    const { data } = await apiService.get<GroupedReportResponse>(
      `/reportings/grouped-by-category?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return data;
  } catch (error: any) {
    const msg =
      error.response?.data?.message || "Erreur lors du chargement des signalements groupés.";
    throw new Error(msg);
  }
};
/**
 * Coups de cœur de l'utilisateur
 */
export const getUserCoupsDeCoeur = async (
  page = 1,
  limit = 10
): Promise<{
  totalCoupsdeCoeur: number;
  currentPage: number;
  totalPages: number;
  coupdeCoeurs: CoupDeCoeur[];
}> => {
  const token = getAuthToken();

  const { data } = await apiService.get(`/user/coupsdecoeur`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

/**
 * Suggestions de l'utilisateur
 */
export const getUserSuggestions = async (
  page = 1,
  limit = 10
): Promise<{
  totalSuggestions: number;
  currentPage: number;
  totalPages: number;
  suggestions: Suggestion[];
}> => {
  const token = getAuthToken();

  const { data } = await apiService.get(`/user/suggestions`, {
    params: { page, limit },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};


// Signalements de l'utilisateur
export const getUserReports = async (userId: string) => {
  const response = await apiService.get(`/user/reports?userId=${userId}`);
  return response.data.reports as GroupedReport[];
};

export const getUserStatsSummary = async (): Promise<UserStatsSummary> => {
  const res = await apiService.get("/user/stats-summary");
  return res.data;
};