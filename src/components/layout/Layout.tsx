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
