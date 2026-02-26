import { useEffect, useRef } from "react";
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
const HEADER_SHOW_SCROLL_Y = 40;

const AboutClassicPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null!);
  const phraseIndex = useScrollPhrase(sectionRef, PHRASES.length, SCROLL_STEP);

  useEffect(() => {
    document.body.classList.add("page-about-classic");
    const main = document.querySelector("main");
    main?.classList.add("main--about-classic");
    return () => {
      main?.classList.remove("main--about-classic");
      document.body.classList.remove("page-about-classic");
    };
  }, []);

  useEffect(() => {
    const headerElement = document.querySelector<HTMLElement>("header.header");
    if (!headerElement) {
      return;
    }

    const updateHeaderVisibility = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      const isHidden = currentScrollY > HEADER_SHOW_SCROLL_Y;
      headerElement.classList.toggle("is-hidden", isHidden);
    };

    window.addEventListener("scroll", updateHeaderVisibility, {
      passive: true,
    });
    window.addEventListener("resize", updateHeaderVisibility);
    updateHeaderVisibility();

    return () => {
      window.removeEventListener("scroll", updateHeaderVisibility);
      window.removeEventListener("resize", updateHeaderVisibility);
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
