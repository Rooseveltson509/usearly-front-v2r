import { useRef, useEffect, useState } from "react";
import "./FavoriteSection.scss";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MobileCarousel from "./MobileCarousel";

gsap.registerPlugin(ScrollTrigger);

type SlideType = "cdc" | "suggestion" | "report";

const IMAGE_LIST: { src: string; type: SlideType }[] = [
  // { src: "/assets/slides/cardSignal1.png", type: "report" },
  { src: "/assets/slides/cardSignal1.svg", type: "report" },
  { src: "/assets/slides/cardSignal2.svg", type: "report" },
  { src: "/assets/slides/cardCDC1.svg", type: "cdc" },
  { src: "/assets/slides/cardCDC2.svg", type: "cdc" },
  { src: "/assets/slides/cardSuggestion1.svg", type: "suggestion" },
  { src: "/assets/slides/cardSuggestion2.svg", type: "suggestion" },
];

const CARDS_PER_GROUP = 2;
const MOBILE_SCROLL_STEPS = Math.ceil(IMAGE_LIST.length / CARDS_PER_GROUP);
const MOBILE_THEME_SWITCH_PROGRESS = 0.9;

const TITLE_TEXT: Record<SlideType, string[]> = {
  cdc: ["Les coups de ❤️", "que vous avez le", "plus aimés !"],
  suggestion: ["Les suggestions", "qui vous font", "rêver ✨"],
  report: [
    "Les signalements",
    "qui ont le plus",
    "fait râler cette",
    "semaine 😅",
  ],
};

const BG_COLORS: Record<SlideType, string> = {
  cdc: "#D6CCFF",
  suggestion: "#DBF4C7",
  report: "#D7E9FF",
};

export default function FavoriteSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLImageElement[]>([]);
  const titleLinesRef = useRef<HTMLSpanElement[]>([]);
  const activeMobileGroupRef = useRef(0);

  const [activeType, setActiveType] = useState<SlideType>(IMAGE_LIST[0].type);
  const [maxCardAspect, setMaxCardAspect] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [isColumnLayout, setIsColumnLayout] = useState(false);
  const [activeMobileGroup, setActiveMobileGroup] = useState(0);
  const [mobileSelectedCards, setMobileSelectedCards] = useState<number[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const isDualCardLayout = !isMobile;
  const isPairSelectionEnabled = isDualCardLayout;
  const getCardBaseZIndex = (cardIndex: number) => {
    const groupIndex = Math.floor(cardIndex / CARDS_PER_GROUP);
    const cardIndexInGroup = (cardIndex % CARDS_PER_GROUP) + 1;
    const zIndexInGroup = CARDS_PER_GROUP - cardIndexInGroup + 1;

    return groupIndex * CARDS_PER_GROUP + zIndexInGroup;
  };

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleMobileCardClick = (cardIndex: number) => {
    if (!isPairSelectionEnabled) return;
    if (Math.floor(cardIndex / CARDS_PER_GROUP) !== activeMobileGroup) return;

    setMobileSelectedCards((prev) => {
      const groupIndex = Math.floor(cardIndex / CARDS_PER_GROUP);
      const groupStart = groupIndex * CARDS_PER_GROUP;
      const groupEnd = groupStart + CARDS_PER_GROUP;
      const withoutCurrentGroup = prev.filter(
        (index) => index < groupStart || index >= groupEnd,
      );

      return [...withoutCurrentGroup, cardIndex];
    });
  };

  // -------------------------------
  // PRELOAD IMAGES
  // -------------------------------
  useEffect(() => {
    let loaded = 0;
    let maxAspect = 0;

    IMAGE_LIST.forEach((img) => {
      const im = new Image();
      im.decoding = "async";
      im.loading = "eager";
      im.src = img.src;

      im.onload = () => {
        const aspect = im.naturalHeight / im.naturalWidth;
        if (aspect > maxAspect) {
          maxAspect = aspect;
        }

        loaded++;
        if (loaded === IMAGE_LIST.length) {
          setMaxCardAspect(maxAspect || null);
          setReady(true);
        }
      };
    });
  }, []);

  useEffect(() => {
    setMobileSelectedCards([]);
  }, [activeMobileGroup, isPairSelectionEnabled]);

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const syncLayoutDirection = () => {
      const direction = window.getComputedStyle(containerEl).flexDirection;
      setIsColumnLayout(direction === "column");
    };

    syncLayoutDirection();

    window.addEventListener("resize", syncLayoutDirection);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(syncLayoutDirection);
      resizeObserver.observe(containerEl);
    }

    return () => {
      window.removeEventListener("resize", syncLayoutDirection);
      resizeObserver?.disconnect();
    };
  }, []);

  // --------------------------------
  // MAIN GSAP SCROLL ANIM
  // --------------------------------
  useEffect(() => {
    if (!ready) return;
    if (!sectionRef.current) return;
    if (isMobile) return;

    const contentEl = sectionRef.current.querySelector(
      ".favorite-content",
    ) as HTMLDivElement;

    cardsRef.current.forEach((card) => {
      card.style.willChange = "transform";
    });

    contentEl.style.willChange = "background-color";
    const scrollEnd = `+=${MOBILE_SCROLL_STEPS * 100}%`;

    const setMobileGroup = (groupIndex: number, shouldAnimateTitle = false) => {
      const safeIndex = Math.max(
        0,
        Math.min(MOBILE_SCROLL_STEPS - 1, groupIndex),
      );

      if (activeMobileGroupRef.current === safeIndex) return;

      activeMobileGroupRef.current = safeIndex;
      setActiveMobileGroup(safeIndex);
      setActiveType(IMAGE_LIST[safeIndex * CARDS_PER_GROUP].type);

      if (shouldAnimateTitle) {
        animateTitleLines();
      }
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: scrollEnd,
        scrub: 0.5,
        pin: true,
        onUpdate: (self) => {
          const timelinePosition = self.progress * MOBILE_SCROLL_STEPS;
          const nextStep = Math.min(
            MOBILE_SCROLL_STEPS - 1,
            Math.max(
              0,
              Math.floor(timelinePosition - MOBILE_THEME_SWITCH_PROGRESS),
            ),
          );

          setMobileGroup(nextStep, true);
        },
      },
    });

    const cardsContainerHeight = cardsContainerRef.current?.offsetHeight ?? 0;
    const START_BELOW = Math.max(window.innerHeight, cardsContainerHeight + 80);

    activeMobileGroupRef.current = 0;
    setActiveMobileGroup(0);
    setActiveType(IMAGE_LIST[0].type);

    // Initial position
    cardsRef.current.forEach((card, i) => {
      const isVisibleAtStart = i < CARDS_PER_GROUP;
      const cardIndexInGroup = (i % CARDS_PER_GROUP) + 1;
      const isFirstCardInGroup = cardIndexInGroup === 1;

      const yOffset = isFirstCardInGroup ? 50 : -50;
      const initialY = isVisibleAtStart ? yOffset : START_BELOW + yOffset;

      gsap.set(card, {
        y: initialY,
        x: 0,
        rotate: isFirstCardInGroup ? -5 : 0,
        scale: 1,
        zIndex: getCardBaseZIndex(i),
      });
    });

    tl.to({}, { duration: 1 });

    for (let groupIndex = 1; groupIndex < MOBILE_SCROLL_STEPS; groupIndex++) {
      const firstCard = cardsRef.current[groupIndex * CARDS_PER_GROUP];
      const secondCard = cardsRef.current[groupIndex * CARDS_PER_GROUP + 1];

      if (firstCard) {
        tl.to(firstCard, { y: 50, duration: 1, ease: "none" });
      }

      if (secondCard) {
        tl.to(secondCard, { y: -50, duration: 1, ease: "none" }, "<");
      }
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [ready, isColumnLayout, isMobile]);

  // --------------------------------
  // TITLE ANIMATION
  // --------------------------------
  const animateTitleLines = () => {
    const lines = titleLinesRef.current
      .map((mask) => mask.querySelector(".title-line") as HTMLElement)
      .filter(Boolean);

    if (!lines.length) return;

    gsap.killTweensOf(lines);

    // État initial : texte AU-DESSUS
    gsap.set(lines, {
      y: -36,
      opacity: 0,
    });

    // Animation : texte DESCEND
    gsap.to(lines, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: "cubic-bezier(0.22, 1, 0.36, 1)", // easing cinéma
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
        <div
          className={`fav-container${isColumnLayout ? " is-column" : ""}${
            isDualCardLayout && isColumnLayout ? " is-two-cards-mobile" : ""
          }`}
          ref={containerRef}
        >
          {/* LEFT */}
          <div className="fav-left">
            <h2 className="fav-title">
              {TITLE_TEXT[activeType].map((line, index) => (
                <span
                  key={index}
                  className="title-line-mask"
                  ref={(el) => {
                    if (el) titleLinesRef.current[index] = el;
                  }}
                >
                  <span className="title-line">{line}</span>
                </span>
              ))}
            </h2>
          </div>

          {/* RIGHT */}
          {isMobile ? (
            <MobileCarousel
              slides={IMAGE_LIST}
              onSlideChange={(type) => setActiveType(type)}
            />
          ) : (
            <div
              className="fav-right"
              ref={cardsContainerRef}
              style={
                maxCardAspect ? { aspectRatio: 1 / maxCardAspect } : undefined
              }
            >
              {IMAGE_LIST.map((item, i) => {
                const isActiveMobileCard =
                  isDualCardLayout &&
                  Math.floor(i / CARDS_PER_GROUP) === activeMobileGroup;
                const isMobileSelected =
                  isPairSelectionEnabled && mobileSelectedCards.includes(i);
                const isInteractiveCard =
                  isPairSelectionEnabled && isActiveMobileCard;
                const cardIndexInTheme = (i % CARDS_PER_GROUP) + 1;
                const cardZIndex = isMobileSelected
                  ? IMAGE_LIST.length * 2 + i + 1
                  : getCardBaseZIndex(i);
                const themeClass = `fav-card--theme-${item.type}`;
                const themeVariantClass = `fav-card--${item.type}-${cardIndexInTheme}`;

                const cardClassName = [
                  "fav-card",
                  themeClass,
                  themeVariantClass,
                  isInteractiveCard ? "is-mobile-active" : "",
                  isMobileSelected ? "is-mobile-selected" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <img
                    key={i}
                    src={item.src}
                    className={cardClassName}
                    data-card-position={cardIndexInTheme}
                    data-theme-type={item.type}
                    loading="lazy"
                    style={{ zIndex: cardZIndex }}
                    onClick={
                      isPairSelectionEnabled
                        ? () => handleMobileCardClick(i)
                        : undefined
                    }
                    ref={(el) => {
                      if (el) cardsRef.current[i] = el;
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="fav-btn-container">
          <button className="fav-btn">Découvrir</button>
        </div>
      </div>
    </section>
  );
}
