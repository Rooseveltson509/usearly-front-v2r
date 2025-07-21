import { Image } from "lucide-react";
import type { UserGroupedReport } from "@src/types/Reports";
import ReportActionsBarWithReactions from "../shared/ReportActionsBarWithReactions";

interface Props {
    sub: UserGroupedReport;
    brand: string;
    userId: string;
    showComments: boolean;
    showReactions: boolean;
    toggleComments: () => void;
    toggleReactions: () => void;
    toggleSimilarReports: () => void;
    commentsCount: number;
    getFullAvatarUrl: (url: string | null | undefined) => string;
    modalImage: string | null;
    setModalImage: (image: string | null) => void;
}

const MainDescriptionSection: React.FC<Props> = ({
    sub,
    brand,
    userId,
    showComments,
    showReactions,
    toggleComments,
    toggleReactions,
    toggleSimilarReports,
    commentsCount,
    getFullAvatarUrl,
    modalImage,
    setModalImage,
}) => {
    const initialDescription = sub.descriptions[0];

    return (
        <>
            <div className="main-description">
                <p className="description-text">{initialDescription.description}</p>

                {initialDescription.capture && (
                    <>
                        <button
                            className="show-capture-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setModalImage(initialDescription.capture);
                            }}
                        >
                            <Image size={16} style={{ marginRight: 6 }} />
                            Voir la capture
                        </button>

                        {modalImage === initialDescription.capture && (
                            <div
                                className="capture-modal"
                                onClick={() => setModalImage(null)}
                            >
                                <img
                                    src={modalImage}
                                    alt="Capture"
                                    className="capture-modal-img"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            <ReportActionsBarWithReactions
                userId={userId}
                descriptionId={initialDescription.id}
                reportsCount={sub.count}
                commentsCount={commentsCount}
                onReactClick={toggleReactions}
                onCommentClick={toggleComments}
                onToggleSimilarReports={toggleSimilarReports}
            />
        </>
    );
};

export default MainDescriptionSection;
