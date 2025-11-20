import type { MouseEventHandler, ReactNode } from "react";
import "./Buttons.scss";

type ButtonProps = {
  title: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  addClassName?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

function Buttons({
  title,
  onClick,
  type = "button",
  disabled = false,
  addClassName,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={"btn-primary" + (addClassName ? ` ${addClassName}` : "")}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="btn-primary__label">{title}</span>
    </button>
  );
}

export default Buttons;
