import "./SearchBar.scss";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  placeholder = "Rechercher...",
}: SearchBarProps) => {
  const [isActive, setIsActive] = useState(() => Boolean(value));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previousValueRef = useRef(value);

  useEffect(() => {
    if (value !== previousValueRef.current) {
      previousValueRef.current = value;
      if (value) {
        setIsActive(true);
      }
    }
  }, [value]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isActive]);

  const hasValue = Boolean(value);
  const showClearIcon = isActive && hasValue;

  const handleIconClick = () => {
    if (showClearIcon) {
      onChange("");
      inputRef.current?.focus();
      return;
    }

    setIsActive((previous) => {
      const nextState = !previous;
      if (!previous) {
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
      return nextState;
    });
  };

  return (
    <div
      ref={containerRef}
      className={`search-bar ${isActive ? "active" : ""}`}
    >
      <span
        className={`icon ${isActive ? "active" : ""}`}
        onClick={handleIconClick}
      >
        {showClearIcon ? <X size={16} /> : <Search size={16} />}
      </span>
      <input
        ref={inputRef}
        className={`input ${isActive ? "active" : ""}`}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsActive(true)}
        onBlur={() => {
          if (!value) {
            setIsActive(false);
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
