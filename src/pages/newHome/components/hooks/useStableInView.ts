import { useInView } from "framer-motion";
import { useState, useEffect, type RefObject } from "react";

export function useStableInView(ref: RefObject<HTMLElement | null>) {
  const rawInView = useInView(ref, {
    margin: "-150px 0px -150px 0px", // ← 150px = zone d'activation douce
  });

  const [stable, setStable] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStable(rawInView), 80);
    return () => clearTimeout(t);
  }, [rawInView]);

  return stable;
}
