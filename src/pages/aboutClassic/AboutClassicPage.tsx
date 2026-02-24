import { useEffect, useRef, useState } from "react";
import "./AboutClassicPage.scss";
import Hero from "./components/Hero";
import TitleSection from "./components/TitleSection";
import SplitSection from "./components/SplitSection";
import MarqueeBanner from "./components/MarqueeBanner";
import ManifestoSection from "./components/ManifestoSection";
import FooterWord from "./components/FooterWord";
import useScrollPhrase from "./hooks/useScrollPhrase";
import Footer from "@src/components/layout/Footer";

const PHRASES = ["des sondages", "des chatbots", "le silence"];
const SCROLL_STEP = 0.17;
const HEADER_HIDE_SCROLL_Y = 40;
const SCROLL_DIRECTION_THRESHOLD = 6;

const AboutClassicPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null!);
  const phraseIndex = useScrollPhrase(sectionRef, PHRASES.length, SCROLL_STEP);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const hiddenRef = useRef(false);
  const tickingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const headerElement = document.querySelector<HTMLElement>("header.header");
    if (!headerElement) {
      return;
    }

    headerElement.classList.toggle("is-hidden", isHeaderHidden);
  }, [isHeaderHidden]);

  useEffect(() => {
    const updateHeaderVisibility = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      const delta = currentScrollY - lastScrollYRef.current;

      let nextHiddenState = hiddenRef.current;

      if (currentScrollY <= HEADER_HIDE_SCROLL_Y) {
        nextHiddenState = false;
      } else if (delta > SCROLL_DIRECTION_THRESHOLD) {
        nextHiddenState = true;
      } else if (delta < -SCROLL_DIRECTION_THRESHOLD) {
        nextHiddenState = false;
      }

      if (nextHiddenState !== hiddenRef.current) {
        hiddenRef.current = nextHiddenState;
        setIsHeaderHidden(nextHiddenState);
      }

      lastScrollYRef.current = currentScrollY;
      tickingRef.current = false;
      rafIdRef.current = null;
    };

    const onScroll = () => {
      if (tickingRef.current) {
        return;
      }

      tickingRef.current = true;
      rafIdRef.current = window.requestAnimationFrame(updateHeaderVisibility);
    };

    lastScrollYRef.current = Math.max(window.scrollY, 0);
    hiddenRef.current = false;
    setIsHeaderHidden(false);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);

      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }

      const headerElement =
        document.querySelector<HTMLElement>("header.header");
      headerElement?.classList.remove("is-hidden");
    };
  }, []);

  return (
    <section className="about-classic">
      <Hero />
      <TitleSection phrase={PHRASES[phraseIndex]} />
      <SplitSection sectionRef={sectionRef} />
      <MarqueeBanner />
      <ManifestoSection />
      <FooterWord />
      <Footer />
    </section>
  );
};

export default AboutClassicPage;
