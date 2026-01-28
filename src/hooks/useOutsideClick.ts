import { type RefObject, useEffect } from "react";

const isEventInside = (event: MouseEvent, element?: HTMLElement | null) => {
  if (!element) return false;
  return element.contains(event.target as Node);
};

const useOutsideClick = (
  ref: RefObject<HTMLElement>,
  onOutsideClick: () => void,
  enabled = true,
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      if (isEventInside(event, ref.current)) return;
      onOutsideClick();
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [enabled, onOutsideClick, ref]);
};

export default useOutsideClick;
