import { apiService } from "./apiService";

export const fetchReactions = async (reportId: string) => {
  const response = await apiService.get(`/reports/${reportId}/reactions`);
  return response.data.reactions;
};

export const sendReaction = async (reportId: string, emoji: string) => {
  const response = await apiService.put(`/reports/${reportId}/reactions`, { emoji });
  return response.data; // contient { success, reactions, counts }
};
