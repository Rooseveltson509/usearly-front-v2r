import { apiService } from "./apiService";

export type UserEmotionSummary = {
  emotionsCount: number;
  brandsCount: number;
  emotions: {
    emoji: string;
    count: number;
  }[];
};

export async function getUserEmotionSummary(
  type: "report" | "coupdecoeur",
): Promise<UserEmotionSummary> {
  const { data } = await apiService.get<UserEmotionSummary>(
    "/user/me/emotions-summary",
    {
      params: { type },
    },
  );

  return data;
}
