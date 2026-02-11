import { useState, useLayoutEffect, useRef } from "react";
import "./InputTextAccount.scss";

type InputTextAccountProps = {
  id: string;
  label: string;
  type?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function InputTextAccount({
  id,
  label,
  type = "text",
  value,
  onChange,
  disabled = false,
}: InputTextAccountProps) {
  const minWidth = 50;
  const maxWidth = 640;

  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>(minWidth);

  useLayoutEffect(() => {
    const mirror = mirrorRef.current;
    if (!mirror) return;

    mirror.textContent = (value || label || "") + "\u200B";
    const width = mirror.offsetWidth + 2;
    setWidth(Math.min(Math.max(width, minWidth), maxWidth));
  }, [value, label, minWidth, maxWidth]);

  return (
    <div className="input-text-account">
      <label htmlFor={id}>{label}</label>
      <div>
        <span ref={mirrorRef} className="mirror-text" />
        <input
          ref={inputRef}
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={label}
          style={{
            boxSizing: "content-box",
            width: type === "date" ? "100%" : width,
          }}
        />
      </div>
    </div>
  );
}

export default InputTextAccount;
