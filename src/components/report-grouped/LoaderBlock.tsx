import React from "react";
import "./LoaderBlock.scss";

interface Props {
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

const LoaderBlock = ({ loading, hasMore, error, loaderRef }: Props) => {
  return (
    <div ref={loaderRef} className="loader">
      {loading && (
        <div className="spinner">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span>Chargement en cours...</span>
        </div>
      )}
      {!hasMore && !loading && (
        <div className="end-message">Fin des résultats</div>
      )}
      {error && <div className="erreur">{error}</div>}
    </div>
  );
};

export default LoaderBlock;
