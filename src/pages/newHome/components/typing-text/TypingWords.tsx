import { useState, useEffect } from "react";

interface TypingProps {
  words: string[];
}

export default function TypingFullWord({ words }: TypingProps) {
  const [index, setIndex] = useState(0); // mot actuel
  const [subIndex, setSubIndex] = useState(0); // lettre actuelle
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(180); // vitesse par défaut

  useEffect(() => {
    const current = words[index];

    // -----------------------
    // 🧘 PAUSE AVANT DELETE
    // -----------------------
    if (!isDeleting && subIndex === current.length) {
      const pauseBeforeDelete = setTimeout(() => {
        setIsDeleting(true);
        setSpeed(120); // delete lent
      }, 1500); // pause 1.5s avant d'effacer
      return () => clearTimeout(pauseBeforeDelete);
    }

    // -----------------------
    // 🧘 PAUSE AVANT TYPING NEXT WORD
    // -----------------------
    if (isDeleting && subIndex === 0) {
      const pauseBeforeNext = setTimeout(() => {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
        setSpeed(180); // typing très lent
      }, 600); // petite pause avant de commencer le mot suivant
      return () => clearTimeout(pauseBeforeNext);
    }

    // -----------------------
    // ⏱️ TICK
    // -----------------------
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, words, index]);

  return (
    <span className="typing-fullword">
      {words[index].substring(0, subIndex)}
      {/* <span className="cursor" /> */}
    </span>
  );
}
