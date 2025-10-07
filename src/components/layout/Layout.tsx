import Footer from "./Footer";
import Header from "./Header";
import { type ReactNode, useEffect, useState } from "react";

// exported header height in pixels; will be calculated at runtime
export let headerheight = 0;

const Layout = ({ children }: { children: ReactNode }) => {
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
    };

    compute();

    window.addEventListener("resize", compute);

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
      <Header />
      <main
        style={{
          minHeight: "100vh",
          paddingTop: HeaderHeight,
          overflow: "auto",
        }}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
