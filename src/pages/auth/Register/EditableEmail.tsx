import { useEffect, useRef, useState } from "react";

const ZWS = "\u200B";

export default function EditableEmail({
  email,
  setEmail,
}: {
  email: string;
  setEmail: (v: string) => void;
}) {
  const [editable, setEditable] = useState(false);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!editable) return;

    const el = spanRef.current;
    if (!el) return;

    if (!el.textContent) el.textContent = email || ZWS;

    el.focus();

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);

    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [editable]);

  const handleInput = (e: React.FormEvent<HTMLSpanElement>) => {
    const text =
      e.currentTarget.textContent?.replace(new RegExp(ZWS, "g"), "") || "";
    setEmail(text);
  };

  return (
    <p className="register-subtitle">
      Votre mail est bien{" "}
      <span
        ref={spanRef}
        contentEditable={editable}
        suppressContentEditableWarning={true}
        className={editable ? "editable" : ""}
        onInput={handleInput}
      >
        {!editable ? email : null}
      </span>{" "}
      ?{" "}
      <span className="modifyLink" onClick={() => setEditable(!editable)}>
        Modifier
      </span>
    </p>
  );
}
