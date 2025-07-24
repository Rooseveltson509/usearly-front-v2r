import { useEffect } from "react";

interface ScrollOptions {
  loaderRef: React.RefObject<HTMLDivElement | null>;
  filter: string;
  viewMode: "flat" | "chrono" | "confirmed";
  loadingFlat: boolean;
  loadingChrono: boolean;
  loadingPopular: boolean;
  loadingPopularEngagement: boolean;
  hasMoreFlat: boolean;
  hasMoreChrono: boolean;
  hasMorePopular: boolean;
  hasMorePopularEngagement: boolean;
  loadMoreFlat: () => void;
  loadMoreChrono: () => void;
  loadMorePopular: () => void;
  loadMorePopularEngagement: () => void;
}

export const useGroupedReportsScroll = ({
  loaderRef,
  filter,
  viewMode,
  loadingFlat,
  loadingChrono,
  loadingPopular,
  loadingPopularEngagement,
  hasMoreFlat,
  hasMoreChrono,
  hasMorePopular,
  hasMorePopularEngagement,
  loadMoreFlat,
  loadMoreChrono,
  loadMorePopular,
  loadMorePopularEngagement,
}: ScrollOptions) => {
  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;

      if (filter === "popular" && hasMorePopularEngagement && !loadingPopularEngagement) {
        loadMorePopularEngagement();
      } else if (filter !== "" && hasMorePopular && !loadingPopular) {
        loadMorePopular();
      } else if (viewMode === "chrono" && filter === "" && hasMoreChrono && !loadingChrono) {
        loadMoreChrono();
      } else if (viewMode === "flat" && filter === "" && hasMoreFlat && !loadingFlat) {
        loadMoreFlat();
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [
    loaderRef,
    filter,
    viewMode,
    hasMoreFlat,
    hasMoreChrono,
    hasMorePopular,
    hasMorePopularEngagement,
    loadingFlat,
    loadingChrono,
    loadingPopular,
    loadingPopularEngagement,
    loadMoreFlat,
    loadMoreChrono,
    loadMorePopular,
    loadMorePopularEngagement,
  ]);
};
