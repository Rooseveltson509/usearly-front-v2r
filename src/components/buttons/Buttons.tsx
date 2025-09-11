import type { MouseEventHandler } from "react";
import "./Buttons.scss"

type ButtonProps = {
  title: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function Buttons({title, onClick, type = "button", disabled = false}: ButtonProps) {
  return (
    <button type={type} className="btn-primary" onClick={onClick} disabled={disabled}>{title}</button>
  );
}

export default Buttons;