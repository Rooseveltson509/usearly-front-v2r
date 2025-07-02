import { apiService } from "./apiService";
import type { CoupDeCoeur, GroupedReport, GroupedReportResponse, Suggestion, UserGroupedReportResponse, UserStatsSummary } from "@src/types/Reports";

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

export const getUserProfileGroupedReports = async (
  page = 1,
  limit = 10
): Promise<UserGroupedReportResponse> => {
  try {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    const { data } = await apiService.get<UserGroupedReportResponse>(
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
      error.response?.data?.message || "Erreur lors du chargement des signalements groupés (profil).";
    throw new Error(msg);
  }
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

export const getGroupedReportsPublic = async (page: number, limit: number) => {
  const response = await apiService.get(`/reportings/public-grouped-by-category`, {
    params: { page, limit },
  });
  return response.data;
};

export const getAllPublicGroupedReports = async (page = 1, limit = 10) => {
  try {
    const response = await apiService.get(`/reportings/public-grouped-by-category`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Erreur lors du chargement des signalements publics groupés :", error);
    throw error;
  }
};


export const getPublicCoupsDeCoeur = async (page: number, limit: number) => {
  const res = await apiService.get(`/public/user/coupsdecoeurs?page=${page}&limit=${limit}`);
  return res.data;
};

export const getPublicSuggestions = async (page: number, limit: number) => {
  const res = await apiService.get(`/public/user/suggestions?page=${page}&limit=${limit}`);
  return res.data;
};
export const getFilteredReportDescriptions = async (
  brand: string,
  category: string,
  page = 1,
  limit = 10
) => {
  const response = await apiService.get("/descriptions/filtery", {
    params: { brand, category, page, limit },
  });
  return response.data;
};

export const getGroupedReportsByDate = async (page = 1, limit = 15) => {
    const token = localStorage.getItem("accessToken"); // ou récupère via ton AuthContext
    const response = await apiService.get("/reportings/public-grouped-by-date", {
        params: { page, limit },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


export const getUserReportsGroupedByDate = async (page: number, limit: number) => {
    const res = await apiService.get(`/user/grouped-by-date?page=${page}&limit=${limit}`);
    return res.data;
};
