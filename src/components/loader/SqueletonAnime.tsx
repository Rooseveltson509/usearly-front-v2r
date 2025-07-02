import React from "react";
import "./SqueletonAnime.scss";

interface SqueletonAnimeProps {
    loaderRef: React.RefObject<HTMLDivElement | null>;
    loading: boolean;
    hasMore?: boolean;
    error?: string | null;
}

const SqueletonAnime: React.FC<SqueletonAnimeProps> = ({ loaderRef, loading, hasMore, error }) => {
    if (error) {
        return <div className="loader-block error">Erreur lors du chargement des signalements.</div>;
    }

    if (!loading && !hasMore) {
        return null;
    }

    return (
        <div className="loader-block" ref={loaderRef}>
            {loading && (
                <div className="skeleton-loader">
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                    <div className="skeleton-line" />
                </div>
            )}
        </div>
    );
};

export default SqueletonAnime;
