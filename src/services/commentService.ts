// services/commentService.ts
import { apiService } from "./apiService";

export const fetchComments = async (
  type: "report" | "suggestion" | "coupdecoeur",
  id: string
) => {
  const url =
    type === "report"
      ? `/descriptions/${id}/comments`
      : type === "suggestion"
      ? `/suggestions/${id}/comments`
      : `/coupdecoeurs/${id}/comments`;

  const response = await apiService.get(url);
  return response.data.comments;
};

export const sendComment = async (
  type: "report" | "suggestion" | "coupdecoeur",
  id: string,
  content: string
) => {
  const url =
    type === "report"
      ? `/descriptions/${id}/comments`
      : type === "suggestion"
      ? `/suggestions/${id}/comments`
      : `/coupdecoeurs/${id}/comments`;

  const response = await apiService.post(url, { content });
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await apiService.delete(`/comments/${commentId}`);
  return response.data;
};
