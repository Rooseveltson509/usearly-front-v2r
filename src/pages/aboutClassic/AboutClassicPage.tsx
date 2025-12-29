import { useRef } from "react";
import "./AboutClassicPage.scss";
import Hero from "./components/Hero";
import TitleSection from "./components/TitleSection";
import SplitSection from "./components/SplitSection";
import MarqueeBanner from "./components/MarqueeBanner";
import ManifestoSection from "./components/ManifestoSection";
import FooterWord from "./components/FooterWord";
import useScrollPhrase from "./hooks/useScrollPhrase";

const PHRASES = ["des sondages", "des chatbots", "le silence"];
const SCROLL_STEP = 0.17;

const AboutClassicPage = () => {
  const sectionRef = useRef<HTMLDivElement>(null!);
  const phraseIndex = useScrollPhrase(sectionRef, PHRASES.length, SCROLL_STEP);

  return (
    <section className="about-classic">
      <Hero />
      <TitleSection phrase={PHRASES[phraseIndex]} />
      <SplitSection sectionRef={sectionRef} />
      <MarqueeBanner />
      <ManifestoSection />
      <FooterWord />
    </section>
  );
};

export default AboutClassicPage;
