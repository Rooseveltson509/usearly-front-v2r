import React, { useEffect, useState } from "react";
import "./EndOfList.scss";

type Props = {
  endText?: string;
  actionLabel?: string;
  onScrollTop?: () => void;
};

const scrollToTop = () => {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const MOBILE_BREAKPOINT = 600;
const BOTTOM_THRESHOLD_PX = 8;

const shouldShowDesktopScrollTop = () => {
  if (typeof window === "undefined") return true;

  const isMobileViewport = window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT}px)`,
  ).matches;
  if (isMobileViewport) return true;

  const { scrollHeight } = document.documentElement;
  return (
    window.innerHeight + window.scrollY >= scrollHeight - BOTTOM_THRESHOLD_PX
  );
};

const EndOfList: React.FC<Props> = ({
  endText = "Fin de la liste 🎉",
  actionLabel = "↑",
  onScrollTop,
}) => {
  const isIconOnlyLabel = actionLabel.trim() === "↑";
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(
    shouldShowDesktopScrollTop,
  );
  const isHidden = isIconOnlyLabel && !isScrollTopVisible;
  const buttonClassName = [
    "end-scroll-top",
    isIconOnlyLabel ? "icon-only" : "",
    isHidden ? "is-hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mobileQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT}px)`,
    );
    const updateVisibility = () => {
      setIsScrollTopVisible(shouldShowDesktopScrollTop());
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", updateVisibility);
    } else {
      mobileQuery.addListener(updateVisibility);
    }

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      if (typeof mobileQuery.removeEventListener === "function") {
        mobileQuery.removeEventListener("change", updateVisibility);
      } else {
        mobileQuery.removeListener(updateVisibility);
      }
    };
  }, []);

  return (
    <div className="end-of-list">
      <p className="end-text">{endText}</p>
      <button
        type="button"
        className={buttonClassName}
        aria-label={isIconOnlyLabel ? "Remonter la liste" : undefined}
        aria-hidden={isHidden || undefined}
        title={isIconOnlyLabel ? "Remonter la liste" : undefined}
        tabIndex={isHidden ? -1 : undefined}
        onClick={onScrollTop ?? scrollToTop}
      >
        {actionLabel}
      </button>
    </div>
  );
};

export default EndOfList;
