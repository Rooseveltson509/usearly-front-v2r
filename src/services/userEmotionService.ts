import { apiService } from "./apiService";

export type UserEmotionSummary = {
  reportsCount: number;
  reactionsCount: number;
  brandsCount: number;
  brands: {
    id: string;
    name: string;
    domain: string;
    logo: string | null;
    count: number;
  }[];
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
