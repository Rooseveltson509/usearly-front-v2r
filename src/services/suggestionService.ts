import { apiService } from "./apiService";
import type { Suggestion } from "@src/types/Reports";

const getAuthToken = () =>
  localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

/**
 * 🔥 Suggestions les plus populaires
 */
export const getPopularSuggestions = async (
  page = 1,
  limit = 10
): Promise<{
  totalSuggestions: number;
  currentPage: number;
  totalPages: number;
  suggestions: Suggestion[];
}> => {
  const { data } = await apiService.get(`/suggestions/popular`, {
    params: { page, limit },
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  return data;
};

/**
 * 🔥 Suggestions publiques
 */
export const getPublicSuggestions = async (page = 1, limit = 10) => {
  const { data } = await apiService.get(`/public/user/suggestions`, {
    params: { page, limit },
  });
  return data;
};

export const voteForSuggestion = async (id: string) => {
  const { data } = await apiService.post(
    `/suggestions/${id}/vote`,
    {},
    { headers: { Authorization: `Bearer ${getAuthToken()}` } }
  );
  return data;
};