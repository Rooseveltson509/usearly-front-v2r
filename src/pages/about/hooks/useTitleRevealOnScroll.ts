import { useEffect } from "react";

export default function useTitleRevealOnScroll(containerSelector: string) {
  useEffect(() => {
    const container = document.querySelector(containerSelector);
    if (!container) {
      return;
    }

    const headingSelector = "h1, h2, h3, h4, h5, h6";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).dataset.revealVisible = "true";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    const markVisible = (element: HTMLElement) => {
      element.dataset.revealVisible = "true";
      observer.unobserve(element);
    };

    const isElementVisible = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return (
        rect.width > 0 &&
        rect.height > 0 &&
        rect.top < window.innerHeight * 0.9 &&
        rect.bottom > 0
      );
    };

    const markHeading = (element: HTMLElement) => {
      if (element.dataset.titleReveal === "true") {
        return;
      }

      if (element.classList.contains("reveal-wall")) {
        return;
      }

      element.dataset.titleReveal = "true";
      element.classList.add("title-slide-up");

      if (isElementVisible(element)) {
        markVisible(element);
        return;
      }

      observer.observe(element);
    };

    container.querySelectorAll(headingSelector).forEach((node) => {
      if (node instanceof HTMLElement) {
        markHeading(node);
      }
    });

    return () => observer.disconnect();
  }, [containerSelector]);
}
