import React from "react";
import "./sliderDots.scss";

export type SliderDotsProps = {
  count: number;
  current: number;
  onChange: (index: number) => void;
  orientation?: "horizontal" | "vertical";
  className?: string;
  getAriaLabel?: (i: number) => string;
};

export default function SliderDots({
  count,
  current,
  onChange,
  orientation = "horizontal",
  className = "",
  getAriaLabel = (i) => `Aller au slide ${i + 1}`,
}: SliderDotsProps) {
  const containerClass =
    (orientation === "vertical" ? "slider-dots-vertical" : "slider-dots") +
    (className ? ` ${className}` : "");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!count) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange((current + 1) % count);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange((current - 1 + count) % count);
    }
  };

  return (
    <div
      className={containerClass}
      role="tablist"
      aria-label="Pagination du slider"
      onKeyDown={handleKeyDown}
    >
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={`dot ${current === i ? "active" : ""}`}
          aria-label={getAriaLabel(i)}
          aria-selected={current === i}
          onClick={() => onChange(i)}
        />
      ))}
    </div>
  );
}
