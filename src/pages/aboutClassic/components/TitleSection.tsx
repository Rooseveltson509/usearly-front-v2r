import { useEffect, useRef, useState } from "react";

type TitleSectionProps = {
  phrase: string;
};

const TitleSection = ({ phrase }: TitleSectionProps) => {
  const [displayedText, setDisplayedText] = useState(phrase);
  const [phase, setPhase] = useState<"idle" | "deleting" | "typing">("idle");
  const [allowTyping, setAllowTyping] = useState(true);
  const firstRender = useRef(true);
  const previousPhrase = useRef(phrase);
  const typingSpeed = 45;
  const deletingSpeed = 28;
  const pauseBeforeTyping = 140;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setAllowTyping(!media.matches);

    updatePreference();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", updatePreference);
      return () => media.removeEventListener("change", updatePreference);
    }

    media.addListener(updatePreference);
    return () => media.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    if (!allowTyping) {
      setDisplayedText(phrase);
      setPhase("idle");
      previousPhrase.current = phrase;
      return;
    }

    if (firstRender.current) {
      firstRender.current = false;
      setDisplayedText(phrase);
      previousPhrase.current = phrase;
      return;
    }

    if (previousPhrase.current !== phrase) {
      previousPhrase.current = phrase;
      setPhase("deleting");
    }
  }, [allowTyping, phrase]);

  useEffect(() => {
    if (!allowTyping || phase === "idle") {
      return;
    }

    let timeoutId = 0;

    if (phase === "deleting") {
      if (displayedText.length === 0) {
        timeoutId = window.setTimeout(
          () => setPhase("typing"),
          pauseBeforeTyping,
        );
      } else {
        timeoutId = window.setTimeout(() => {
          setDisplayedText((current) => current.slice(0, -1));
        }, deletingSpeed);
      }
    }

    if (phase === "typing") {
      if (displayedText === phrase) {
        setPhase("idle");
      } else {
        timeoutId = window.setTimeout(() => {
          setDisplayedText(phrase.slice(0, displayedText.length + 1));
        }, typingSpeed);
      }
    }

    return () => window.clearTimeout(timeoutId);
  }, [
    allowTyping,
    deletingSpeed,
    displayedText,
    pauseBeforeTyping,
    phase,
    phrase,
    typingSpeed,
  ]);

  const isTyping = allowTyping && phase !== "idle";

  return (
    <div className="about-classic__title-wrapper">
      <h2 className="Raleway reveal-wall">
        Les utilisateurs méritent mieux que{" "}
        <span
          className={`about-classic__underline${isTyping ? " is-typing" : ""}`}
        >
          <span className="about-classic__underline-ghost">{phrase}</span>
          <span className="about-classic__underline-text">{displayedText}</span>
        </span>
      </h2>
    </div>
  );
};

export default TitleSection;
