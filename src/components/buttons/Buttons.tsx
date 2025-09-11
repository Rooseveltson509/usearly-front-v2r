import "./Buttons.scss"

function Buttons({title, onClick}: {title: string, onClick: () => void}) {
  return (
    <button className="btn-primary" onClick={onClick}>{title}</button>
  );
}

export default Buttons;