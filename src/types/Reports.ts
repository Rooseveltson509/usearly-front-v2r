import type { UserReaction } from "./reaction";
import type { TicketStatusKey } from "./ticketStatus";
import type { HasBrandResponse } from "./brandResponse";

export type FeedbackType = "report" | "coupdecoeur" | "suggestion";

export interface BrandWithSubCategories {
  marque: string;
  siteUrl?: string;
  subCategories: string[];
}

export interface ProfileChronoReport {
  reportingId: string;
  marque: string;
  siteUrl?: string | null;
  capture?: string | null;
  category: string;
  subCategory: string;
  count: number;
  descriptions: {
    id: string;
    description: string;
    emoji?: string | null;
    createdAt: string;
    reactions: { emoji: string; userId: string }[];
    author: {
      id: string;
      pseudo: string;
      avatar: string | null;
      email?: string;
    } | null;
  }[];
}

export interface GetConfirmedResponse {
  currentPage: number;
  total: number;
  data: ConfirmedSubcategoryReport[];
}

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

export interface ConfirmedSubcategoryReport {
  reportingId: string; // 👈 au lieu de number
  subCategory: string;
  count: number;
  status: TicketStatusKey;
  siteUrl: string | null;
  marque: string;
  category: string;
  hasBrandResponse: HasBrandResponse;
  capture: string | null;
  createdAt: string;
  descriptions: {
    id: string; // 👈 probablement UUID aussi, pas number
    description: string;
    emoji?: string;
    createdAt: string;
    author: {
      id: string;
      pseudo: string;
      avatar: string | null;
      email?: string;
    } | null;
  }[];
}

export type LikeFeedbackType = Exclude<FeedbackType, "report">;
// équivalent à "coupdecoeur" | "suggestion"

export interface MetaIA {
  highlightedWords?: string[];
  layoutType?: "single-line" | "two-bubble";
  axe?: "emoji" | "typography" | "illustration";
}

export interface CoupDeCoeur {
  id: string;
  marque: string;
  title?: string;
  punchline?: string;
  illustration?: string;
  descriptionId: string;
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
  meta?: MetaIA; // Ajout de la propriété meta optionnelle
}
export interface Suggestion {
  id: string;
  marque: string;
  title?: string;
  punchline?: string;
  illustration?: string;
  descriptionId: string;
  emplacement: string;
  emoji: string | null;
  description: string;
  siteUrl: string;
  votes?: number;
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
  duplicateCount?: number;
  meta?: MetaIA; // Ajout de la propriété meta optionnelle
}

export interface ApiDescription {
  description: string;
  emoji: string;
  createdAt: string;
  author: {
    id: string;
    pseudo: string;
    avatar: string | null;
    email?: string;
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
  reportingId: string;
  description: string;
  emoji: string;
  createdAt: string;
  author: {
    id: string;
    pseudo: string;
    avatar: string | null;
    email?: string;
  };
  capture: string | null;
  marque: string;
  brand?: string;
  reactions: { emoji: string; count: number; userIds: string[] }[];
}

export interface SimplifiedFeedbackDescription {
  id: string;
  description: string;
  emoji: string;
  createdAt: string;
  author: {
    id: string;
    pseudo: string;
    avatar: string | null;
    email?: string;
  };
  capture: string | null;
  reactions: {
    emoji: string;
    count: number;
    userIds: string[];
  }[];
}

export interface GroupedReport {
  id: string;
  reportingId: string;
  category: string;
  marque: string;
  hasBrandResponse?: HasBrandResponse;
  siteUrl?: string | null;
  capture?: string | null;
  totalCount: number;
  subCategories: {
    subCategory: string;
    status: TicketStatusKey;
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
export interface ExplodedGroupedReport extends GroupedReport {
  subCategory: {
    subCategory: string;
    status: TicketStatusKey;
    count: number;
    descriptions: FeedbackDescription[];
  };
  date?: string;
}
export interface PopularGroupedReport {
  reportingId: string;
  marque: string;
  siteUrl?: string | null;
  status: TicketStatusKey;
  category: string;
  subCategory: string;
  count: number;
  createdAt: string;
  descriptions: FeedbackDescription[];
}

export interface PopularReport {
  id: string; // id de la description
  reportingId: string;
  subCategory: string;
  description: string;
  siteUrl: string | null;
  marque: string;
  status: TicketStatusKey;
  category: string;
  capture: string | null;
  createdAt: string;
  author: {
    id: string;
    pseudo: string;
    avatar: string | null;
    email?: string;
  } | null;
  reactions: {
    emoji: string;
    count: number;
    userIds: string[];
  }[];
  comments: {
    id: string;
    content: string;
    createdAt: string;
    userId: string;
  }[];
  stats: {
    totalReactions: number;
    totalComments: number;
    totalInteractions: number;
  };
}

/* profile */

export interface UserGroupedReportResponse {
  currentPage: number;
  totalPages: number;
  totalReports: number;
  results: UserGroupedReport[];
}

export interface UserGroupedReport {
  reportingId: string;
  siteUrl: string;
  marque: string;
  hasBrandResponse: HasBrandResponse;
  reportIds: string[];
  status: TicketStatusKey;
  category: string;
  subCategory: string;
  count: number;
  descriptions: UserGroupedReportDescription[];
}

export interface UserGroupedReportDescription {
  id: string;
  description: string;
  emoji: string | null;
  createdAt: string;
  commentsCount?: number;
  author: {
    id: string;
    pseudo: string;
    avatar: string | null;
    email?: string;
  };
  capture: string | null;
  reactions: {
    emoji: string;
    count: number;
    userIds: string[];
  }[];
}

export interface PublicGroupedReport {
  id: string;
  reportingId: string;
  category: string;
  marque: string;
  siteUrl?: string | null; // ✅ accepte null aussi
  totalCount: number;
  subCategories: {
    subCategory: string;
    count: number;
    status: TicketStatusKey;
    descriptions: {
      id: string;
      description: string;
      emoji: string;
      createdAt: string;
      author?: {
        id: string;
        pseudo: string;
        avatar: string | null;
        email?: string;
      };
      capture: string | null;
      reactions: {
        emoji: string;
        count: number;
        userIds: string[];
      }[];
    }[];
  }[];
}

export type GetGroupedReportsByDateResponse = {
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
  data: Record<string, PublicGroupedReportFromAPI[]>;
};

export interface PublicGroupedReportFromAPI {
  reportingId: string;
  marque: string;
  category: string;
  status: TicketStatusKey;
  hasBrandResponse?: HasBrandResponse;
  subCategory: string;
  siteUrl?: string | null;
  capture: string | null;
  count: number;

  descriptions: FeedbackDescription[];
  date: string;
}

export type ReportDetailDescription = FeedbackDescription & {
  subCategory: string;
  reportId: string;
  siteUrl?: string | null;
  status: TicketStatusKey;
};

export interface UserReportGroupedByDate {
  reportingId: string;
  marque: string;
  siteUrl?: string | null;
  capture?: string | null;
  category: string;
  subCategory: string;
  status: TicketStatusKey;
  totalCount: number;
  descriptions: FeedbackDescription[];
}
