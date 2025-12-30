import Header from "./Header";
import { type ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// 🟪 IMPORT GSAP FIX
import { ScrollTrigger } from "gsap/ScrollTrigger";

export let headerheight = 0;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  // 🟣 heroMode automatique : actif UNIQUEMENT sur /home
  const heroMode = location.pathname === "/home";

  const [HeaderHeight, setHeaderHeight] = useState<number>(headerheight);

  useEffect(() => {
    const getHeader = () =>
      document.querySelector("header.header") as HTMLElement | null;

    const compute = () => {
      const element = getHeader();
      const newHeight = element
        ? Math.ceil(element.getBoundingClientRect().height)
        : 0;

      headerheight = newHeight;
      setHeaderHeight(newHeight);
      document.documentElement.style.setProperty(
        "--header-height",
        `${newHeight}px`,
      );

      /* 🔥 FIX DÉFINITIF POUR GSAP + ScrollTrigger */
      ScrollTrigger.refresh();
    };

    // première mesure
    compute();

    // écoute resize
    window.addEventListener("resize", compute);

    // écoute mutations du header
    const headerElement = getHeader();
    let mutationObserver: MutationObserver | null = null;

    if (headerElement && typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver(compute);
      mutationObserver.observe(headerElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener("resize", compute);
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const wallSelector = ".reveal-wall";
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

    const markWall = (element: HTMLElement) => {
      if (element.dataset.revealWall === "true") {
        if (
          element.dataset.revealVisible !== "true" &&
          isElementVisible(element)
        ) {
          markVisible(element);
        }
        return;
      }

      element.dataset.revealWall = "true";

      if (isElementVisible(element)) {
        markVisible(element);
        return;
      }

      observer.observe(element);
    };

    const scanWalls = (root: ParentNode) => {
      root.querySelectorAll(wallSelector).forEach((node) => {
        if (node instanceof HTMLElement) {
          markWall(node);
        }
      });
    };

    scanWalls(document);

    let rafId = 0;
    const revealPendingWalls = () => {
      rafId = 0;
      document
        .querySelectorAll(`${wallSelector}:not([data-reveal-visible="true"])`)
        .forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }

          if (isElementVisible(node)) {
            markVisible(node);
          }
        });
    };

    const onScroll = () => {
      if (rafId) {
        return;
      }

      rafId = window.requestAnimationFrame(revealPendingWalls);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          const target = mutation.target;
          if (!(target instanceof HTMLElement)) {
            return;
          }

          if (target.matches(wallSelector)) {
            markWall(target);
          }

          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }

          if (node.matches(wallSelector)) {
            markWall(node);
          }

          scanWalls(node);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      <Header heroMode={heroMode} />

      <main
        style={{
          minHeight: "100vh",
          paddingTop: heroMode ? 0 : HeaderHeight, // Hero = header collé
        }}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
