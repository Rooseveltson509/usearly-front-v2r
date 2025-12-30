import { useEffect, useState, type RefObject } from "react";

const useScrollPhrase = (
  sectionRef: RefObject<HTMLDivElement>,
  phrasesLength: number,
  scrollStep: number,
) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updatePhrase = () => {
      if (!sectionRef.current) {
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight || 0;
      const total = rect.height + viewHeight;
      const progressRaw = (viewHeight - rect.top) / total;
      const progress = Math.max(0, Math.min(progressRaw, 1));
      const totalSteps = Math.floor(1 / scrollStep);
      const stepIndex = Math.min(
        totalSteps - 1,
        Math.floor(progress / scrollStep),
      );
      const nextIndex = Math.min(stepIndex, phrasesLength - 1);

      setPhraseIndex((current) =>
        current !== nextIndex ? nextIndex : current,
      );
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updatePhrase);
      }
    };

    updatePhrase();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updatePhrase);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updatePhrase);
    };
  }, [phrasesLength, scrollStep, sectionRef]);

  return phraseIndex;
};

export default useScrollPhrase;
