import { useEffect, useState } from "react";

export const useCountUp = (end: number, duration = 1400) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame: number;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);

      // easing ultra smooth
      const eased = 1 - Math.pow(1 - progress, 4);

      const current = eased * end;

      setValue(current);

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [end, duration]);

  return Math.round(value);
};
