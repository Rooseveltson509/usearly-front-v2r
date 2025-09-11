import type { MouseEventHandler } from "react";
import "./Buttons.scss"

type ButtonProps = {
  title: string;
  type?: "button" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

function Buttons({title, onClick, type = "button"}: ButtonProps) {
  return (
    <button type={type} className="btn-primary" onClick={onClick}>{title}</button>
  );
}

export default Buttons;