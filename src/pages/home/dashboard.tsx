import { useEffect, useRef, useState, type CSSProperties } from "react";
import Header from "@src/components/dashboard/Header";
import ScoreIndicators from "@src/components/dashboard/ScoreIndicators";
import ProductCard from "@src/components/dashboard/ProductCard";
import PulseChart from "@src/components/dashboard/PulseChart";
import FeedbackSection from "@src/components/dashboard/FeedbackSection";
import EmotionalExperience from "@src/components/dashboard/EmotionalExperience";
import CriticalTickets from "@src/components/dashboard/CriticalTickets";
import SuggestionCard from "@src/components/dashboard/SuggestionCard";
import CrushesCard from "@src/components/dashboard/CrushesCard";
import ActionSection from "@src/components/dashboard/ActionSection";

const topEmotions = [
  { rank: 1, label: "Frustration" },
  { rank: 2, label: "Agacement" },
  { rank: 3, label: "Bien" },
];

const emotionCarousel = [...topEmotions, ...topEmotions];

const Index = () => {
  const [scrollDuration, setScrollDuration] = useState(12);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateDuration = () => {
      if (!containerRef.current || !trackRef.current) return;

      const trackWidth = trackRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth || 1;

      // Keep a consistent pixels-per-second speed, clamped to a minimum duration.
      const pxPerSecond = 220;
      const widthToScroll = Math.max(trackWidth, containerWidth);
      const duration = Math.max(widthToScroll / pxPerSecond, 10);

      setScrollDuration(Number(duration.toFixed(2)));
    };

    updateDuration();
    window.addEventListener("resize", updateDuration);
    return () => window.removeEventListener("resize", updateDuration);
  }, []);

  const emotionTrackStyle = {
    ["--emotion-scroll-duration"]: `${scrollDuration}s`,
  } as CSSProperties;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 px-8 py-6 space-y-10">
        {/* Score Indicators */}
        <ScoreIndicators />

        {/* Product Card + Pulse Chart */}
        <section className="flex gap-6">
          <ProductCard />
          <PulseChart />
        </section>

        {/* Feedback Section */}
        <section className="feedback-emotion-panel">
          <div className="feedback-emotion-panel__inner">
            <div className="feedback-emotion-panel__left">
              <FeedbackSection />
            </div>
            <div className="feedback-emotion-panel__right">
              <EmotionalExperience />
            </div>
          </div>
        </section>

        <section aria-label="Émotions dominantes">
          <div className="feedback-card__emotion-scale" ref={containerRef}>
            <div
              className="emotion-scale__track"
              ref={trackRef}
              style={emotionTrackStyle}
            >
              {emotionCarousel.map((emotion, index) => (
                <span
                  key={`${emotion.label}-${index}`}
                  className="emotion-scale__item"
                  aria-hidden={index >= topEmotions.length}
                >
                  <span className="emotion-scale__rank">{emotion.rank}</span>
                  <span className="emotion-scale__label">{emotion.label}</span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Action Section */}
        <ActionSection />

        {/* Critical Tickets + Priority */}
        <section>
          <CriticalTickets />
        </section>

        {/* Suggestions + Crushes */}
        <section className="flex gap-6">
          <SuggestionCard />
          <CrushesCard />
        </section>
      </main>

      {/* Footer */}
      <footer className="collab-banner">
        <div className="collab-banner__inner">
          <p className="collab-banner__text">Usearly x Lovable</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
