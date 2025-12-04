import { useRef, useEffect, useState } from "react";
import "./FavoriteSection.scss";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type SlideType = "cdc" | "suggestion" | "report";

const TITLE_TEXT: Record<SlideType, string[]> = {
  cdc: ["Les coups de ❤️", "que vous avez le", "plus aimés !"],
  suggestion: ["Les suggestions", "qui vous font", "rêver ✨"],
  report: [
    "Les signalements",
    "qui ont le plus fait râler",
    "cette semaine 😅",
  ],
};

const BG_COLORS: Record<SlideType, string> = {
  cdc: "#D6CCFF",
  suggestion: "#DBF4C7",
  report: "#D7E9FF",
};

export default function FavoriteSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLImageElement[]>([]);
  const titleLinesRef = useRef<HTMLSpanElement[]>([]);
  const [activeType, setActiveType] = useState<SlideType>("cdc");
  const [ready, setReady] = useState(false);

  const imageList = [
    { src: "/assets/slides/cardCDC1.png", type: "cdc" as SlideType },
    { src: "/assets/slides/cardCDC2.png", type: "cdc" as SlideType },
    {
      src: "/assets/slides/cardSuggestion1.png",
      type: "suggestion" as SlideType,
    },
    {
      src: "/assets/slides/cardSuggestion2.png",
      type: "suggestion" as SlideType,
    },
    { src: "/assets/slides/cardSignal1.png", type: "report" as SlideType },
    { src: "/assets/slides/cardSignal2.png", type: "report" as SlideType },
  ];

  const cardTypes = imageList.map((i) => i.type);

  // -------------------------------
  // PRELOAD IMAGES
  // -------------------------------
  useEffect(() => {
    let loaded = 0;

    imageList.forEach((img) => {
      const im = new Image();
      im.decoding = "async";
      im.loading = "eager";
      im.src = img.src;

      im.onload = () => {
        loaded++;
        if (loaded === imageList.length) setReady(true);
      };
    });
  }, []);

  // --------------------------------
  // MAIN GSAP SCROLL ANIM
  // --------------------------------
  useEffect(() => {
    if (!ready) return;
    if (window.innerWidth < 900) return;
    if (!sectionRef.current) return;

    const contentEl = sectionRef.current.querySelector(
      ".favorite-content",
    ) as HTMLDivElement;

    cardsRef.current.forEach((card) => {
      card.style.willChange = "transform";
    });

    contentEl.style.willChange = "background-color";

    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=450%",
        scrub: 0.5,
        pin: true,
      },
    });

    const START_BELOW = window.innerHeight;

    // Initial position
    cardsRef.current.forEach((card, i) => {
      gsap.set(card, {
        y: i === 0 ? 0 : START_BELOW,
        zIndex: i + 1,
      });
    });

    // Animate card stack
    cardsRef.current.forEach((card, i) => {
      if (i > 0) {
        tl.to(card, { y: 0, duration: 1, ease: "none" });
      }

      // CHANGE TITLE + ANIMATE IT
      tl.add(() => {
        const newType = cardTypes[i];
        setActiveType(newType);

        animateTitleLines();
      }, "-=0.7");
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [ready]);

  // --------------------------------
  // TITLE ANIMATION
  // --------------------------------
  const animateTitleLines = () => {
    if (!titleLinesRef.current.length) return;

    gsap.killTweensOf(titleLinesRef.current);

    // Reset initial state
    titleLinesRef.current.forEach((line, index) => {
      gsap.set(line, {
        opacity: 0,
        y: index % 2 === 0 ? -20 : 20, // ligne pairs → top, impaires → bottom
      });
    });

    // Animate in stagger
    gsap.to(titleLinesRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: 0.12,
    });
  };

  return (
    <section className="favorite-section" ref={sectionRef}>
      <div
        className="favorite-content"
        style={{
          backgroundColor: BG_COLORS[activeType],
          opacity: ready ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {/* LEFT */}
        <div className="fav-left">
          <h2 className="fav-title">
            {TITLE_TEXT[activeType].map((line, index) => (
              <span
                key={index}
                className="title-line"
                ref={(el) => {
                  if (el) titleLinesRef.current[index] = el;
                }}
              >
                {line}
              </span>
            ))}
          </h2>

          <button className="fav-btn">Découvrir</button>
        </div>

        {/* RIGHT */}
        <div className="fav-right">
          {imageList.map((item, i) => (
            <img
              key={i}
              src={item.src}
              className="fav-card"
              loading="lazy"
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
