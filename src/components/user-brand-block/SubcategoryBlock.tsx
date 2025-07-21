import { useState } from "react";
import { ChevronDown, ChevronUp, Image } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import ReportActionsBarWithReactions from "../shared/ReportActionsBarWithReactions";
import DescriptionCommentSection from "../report-desc-comment/DescriptionCommentSection";
import CommentSection from "../comments/CommentSection";
import { getCategoryIconPathFromSubcategory } from "@src/utils/IconsUtils";
import { getBrandLogo } from "@src/utils/brandLogos";
import type { UserGroupedReport, UserGroupedReportDescription } from "@src/types/Reports";
import SubcategoryHeader from "./SubcategoryHeader";
import MainDescriptionSection from "./MainDescriptionSection";

interface Props {
    sub: UserGroupedReport;
    brand: string;
    siteUrl: string;
    userProfileId?: string;
    getFullAvatarUrl: (url: string | null | undefined) => string;
    initialDescription: UserGroupedReportDescription;
    currentCount: number;
    expandedSub: string | null;
    setExpandedSub: React.Dispatch<React.SetStateAction<string | null>>;
    showComments: Record<string, boolean>;
    setShowComments: (val: Record<string, boolean>) => void;
    showReactions: Record<string, boolean>;
    setShowReactions: (val: Record<string, boolean>) => void;
    expandedOthers: Record<string, boolean>;
    setExpandedOthers: (val: Record<string, boolean>) => void;
    showAll: Record<string, boolean>;
    setShowAll: (val: Record<string, boolean>) => void;
    signalementFilters: Record<string, "pertinent" | "recents" | "anciens">;
    setSignalementFilters: (val: Record<string, "pertinent" | "recents" | "anciens">) => void;
    refreshCommentsKeys: Record<string, number>;
    setRefreshCommentsKeys: (val: Record<string, number>) => void;
    localCommentsCounts: Record<string, number>;
    setLocalCommentsCounts: (val: Record<string, number>) => void;
    modalImage: string | null;
    setModalImage: (val: string | null) => void;
}

const SubcategoryBlock: React.FC<Props> = ({
    sub,
    brand,
    siteUrl,
    userProfileId,
    getFullAvatarUrl,
    initialDescription,
    currentCount,
    expandedSub,
    setExpandedSub,
    showComments,
    setShowComments,
    showReactions,
    setShowReactions,
    expandedOthers,
    setExpandedOthers,
    showAll,
    setShowAll,
    signalementFilters,
    setSignalementFilters,
    refreshCommentsKeys,
    setRefreshCommentsKeys,
    localCommentsCounts,
    setLocalCommentsCounts,
    modalImage,
    setModalImage,
}) => {
    const isExpanded = expandedSub === sub.subCategory;

    return (
        <div className={`subcategory-block ${isExpanded ? "open" : ""}`}>
            <SubcategoryHeader
                sub={sub}
                brand={brand}
                siteUrl={siteUrl}
                expandedSub={expandedSub}
                getFullAvatarUrl={getFullAvatarUrl}
                onToggle={(subCategory) =>
                    setExpandedSub((prev) => (prev === subCategory ? null : subCategory))
                }
            />

            {isExpanded && (
                <MainDescriptionSection
                    sub={sub}
                    brand={brand}
                    userId={userProfileId || ""}
                    showComments={!!showComments[sub.subCategory]}
                    showReactions={!!showReactions[sub.subCategory]}
                    toggleComments={() => {
                        setShowComments({
                            ...showComments,
                            [sub.subCategory]: !showComments[sub.subCategory],
                        });

                    }}

                    toggleReactions={() =>
                        setShowReactions({
                            ...showReactions,
                            [sub.subCategory]: !showReactions[sub.subCategory],
                        })
                    }

                    toggleSimilarReports={() => {
                        setExpandedOthers({
                            ...expandedOthers,
                            [sub.subCategory]: !expandedOthers[sub.subCategory],
                        });
                        setShowComments({});
                    }}

                    commentsCount={localCommentsCounts[sub.subCategory] ?? 0}
                    getFullAvatarUrl={getFullAvatarUrl}
                    modalImage={modalImage}
                    setModalImage={setModalImage}
                />
            )}

        </div>
    );
};

export default SubcategoryBlock;
