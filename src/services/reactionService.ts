import { apiService } from "./apiService";

// Type pour les 3 cas possibles
type FeedbackType = "report" | "suggestion" | "coupdecoeur";

// ✅ Obtenir les réactions pour une description spécifique
export const fetchReactionsByDescription = async (
  descriptionId: string,
  type: FeedbackType
) => {
  const endpoint =
    type === "report"
      ? `/reports/descriptions/${descriptionId}/reactions`
      : `/reaction/${type}/${descriptionId}`;

  const response = await apiService.get(endpoint);
  return response.data.reactions;
};

// ✅ Envoyer une réaction sur une description spécifique
export const sendReactionByDescription = async (
  descriptionId: string,
  emoji: string,
  type: FeedbackType
) => {
  const endpoint =
    type === "report"
      ? `/reports/descriptions/${descriptionId}/reactions`
      : `/reaction/${type}/${descriptionId}`;

  const response = await apiService.post(endpoint, { emoji });
  return response.data; // contient { success, reactions }
};


export const fetchReactions = async (reportId: string) => {
  const response = await apiService.get(`/reports/${reportId}/reactions`);
  return response.data.reactions;
};

export const sendReaction = async (reportId: string, emoji: string) => {
  const response = await apiService.put(`/reports/${reportId}/reactions`, { emoji });
  return response.data; // contient { success, reactions, counts }
};

// ✅ Suggestion
export const fetchSuggestionReactions = async (suggestionId: string) => {
  const response = await apiService.get(`/suggestions/${suggestionId}/reactions`);
  return response.data.reactions;
};

export const sendSuggestionReaction = async (suggestionId: string, emoji: string) => {
  const response = await apiService.put(`/suggestions/${suggestionId}/reactions`, { emoji });
  return response.data;
};

// ✅ Coup de cœur
export const fetchCoupDeCoeurReactions = async (coupDeCoeurId: string) => {
  const response = await apiService.get(`/coupdecoeurs/${coupDeCoeurId}/reactions`);
  return response.data.reactions;
};

export const sendCoupDeCoeurReaction = async (coupDeCoeurId: string, emoji: string) => {
  const response = await apiService.put(`/coupdecoeurs/${coupDeCoeurId}/reactions`, { emoji });
  return response.data;
};

