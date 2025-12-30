import { useEffect, useRef, useState } from "react";

const useRevealOnce = (threshold: number) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [threshold]);

  return { isVisible, ref };
};

export default useRevealOnce;
