import { useEffect, useState } from "react";

type UseIsAtBottomOptions = {
  thresholdPx?: number;
  anchorSelector?: string;
};

const DEFAULT_THRESHOLD_PX = 2;

const isScrollableElement = (element: HTMLElement) => {
  const styles = window.getComputedStyle(element);
  const overflowY = styles.overflowY;
  const canScrollY =
    overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";

  return canScrollY && element.scrollHeight > element.clientHeight + 1;
};

const isBottomReached = (element: HTMLElement, thresholdPx: number) =>
  element.scrollHeight - element.scrollTop - element.clientHeight <=
  thresholdPx;

const getScrollableAncestors = (anchorSelector: string) => {
  const anchor = document.querySelector<HTMLElement>(anchorSelector);
  if (!anchor) return [] as HTMLElement[];

  const ancestors: HTMLElement[] = [];
  let current: HTMLElement | null = anchor;

  while (current) {
    if (isScrollableElement(current)) {
      ancestors.push(current);
    }
    current = current.parentElement;
  }

  return ancestors;
};

const isPageScrollable = () => {
  const doc = document.documentElement;
  const body = document.body;
  const maxScrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);

  return maxScrollHeight > window.innerHeight + 1;
};

export function useIsAtBottom(
  options: number | UseIsAtBottomOptions = DEFAULT_THRESHOLD_PX,
) {
  const resolvedOptions =
    typeof options === "number"
      ? { thresholdPx: options, anchorSelector: undefined }
      : options;

  const thresholdPx = resolvedOptions.thresholdPx ?? DEFAULT_THRESHOLD_PX;
  const anchorSelector = resolvedOptions.anchorSelector;

  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      const doc = document.documentElement;
      const body = document.body;
      const pageScrollHeight = Math.max(doc.scrollHeight, body.scrollHeight);
      const pageAtBottom =
        isPageScrollable() &&
        window.scrollY + window.innerHeight >= pageScrollHeight - thresholdPx;

      if (!anchorSelector) {
        setAtBottom(pageAtBottom);
        return;
      }

      const hasAncestorAtBottom = getScrollableAncestors(anchorSelector).some(
        (ancestor) => isBottomReached(ancestor, thresholdPx),
      );

      setAtBottom(pageAtBottom || hasAncestorAtBottom);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("scroll", onScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("scroll", onScroll, true);
    };
  }, [anchorSelector, thresholdPx]);

  return atBottom;
}
