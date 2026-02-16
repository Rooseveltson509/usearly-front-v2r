export type Sector =
  | "BANK"
  | "INS"
  | "ACC"
  | "B2B_SW"
  | "ECOM"
  | "LOG"
  | "MOB"
  | "HOSP"
  | "FOOD"
  | "RETAIL"
  | "SAAS"
  | "GAME"
  | "MEDIA"
  | "HEALTH"
  | "EDU"
  | "REAL"
  | "UTIL"
  | "TELCO"
  | "GOV"
  | "TRAVEL"
  | "SPORT"
  | "SOC"
  | "IOT"
  | "INDUS"
  | "EVENT";

export interface CreateBrandPayload {
  name: string;
  email: string;
  domain: string;
  offres?: "freemium" | "start" | "start pro" | "premium";
  sector?: Sector;
}
