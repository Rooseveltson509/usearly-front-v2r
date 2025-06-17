import type { UserReaction } from "./reaction";

export interface User {
  id: string;
  pseudo: string;
  avatar: string;
  email?: string;
}
export interface Reaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface CoupDeCoeur {
  id: string;
  marque: string;
  emplacement: string;
  emoji: string;
  description: string;
  siteUrl: string;
  capture: string | null;
  createdAt: string;
  updatedAt: string;
  reactions: Reaction[];
  type: "coupdecoeur";
  author: {
    pseudo: string;
    email: string;
    avatar: string;
  };
}
export interface Suggestion {
  id: string;
  marque: string;
  emplacement: string;
  emoji: string | null;
  description: string;
  siteUrl: string;
  capture: string | null;
  createdAt: string;
  updatedAt: string;
  reactions: Reaction[];
  type: "suggestion";
  author: {
    pseudo: string;
    email: string;
    avatar: string;
  };
  isAdopted?: boolean;
}


export interface ApiDescription {
  description: string;
  emoji: string;
  createdAt: string;
  user: {
    id: string;
    pseudo: string;
    avatar: string | null;
  };
  capture: string | null;
}

export interface SubCategory {
  subCategory: string;
  count: number;
  descriptions: ApiDescription[];
}

export interface ApiReport {
  reportingId: string;
  category: string;
  marque: string;
  totalCount: number;
  subCategories: SubCategory[];
}

export interface ApiResponse {
  currentPage: number;
  totalPages: number;
  totalReports: number;
  results: ApiReport[];
}


export interface FeedbackDescription {
  id: string;
  description: string;
  emoji: string;
  createdAt: string;
  user: {
    id: string;
    pseudo: string;
    avatar: string | null;
  };
  capture: string | null;
}

export interface GroupedReport {
  id: string;
  reportingId: string;
  category: string;
  marque: string;
  totalCount: number;
  subCategories: {
    subCategory: string;
    count: number;
    descriptions: FeedbackDescription[];
  }[];
  reactions: UserReaction[]; 
}

export interface GroupedReportResponse {
  currentPage: number;
  totalPages: number;
  totalReports: number;
  results: GroupedReport[];
}

export interface MappedFeedbackDescription {
  author: string;
  text: string;
  emoji: string;
  avatar?: string;
}

export interface UserStatsSummary {
  totalReports: number;
  totalCoupsDeCoeur: number;
  totalSuggestions: number;
  totalIdeasAdopted: number;
  totalChecks: number;
  totalCollaborations: number;
  usearPower: number;
}
