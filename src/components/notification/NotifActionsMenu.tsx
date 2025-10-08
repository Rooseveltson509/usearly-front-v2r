import React, { useRef, useEffect } from "react";
import "./NotifActionsMenu.scss";

interface Props {
  onClose: () => void;
  onDelete: () => void;
}

const NotifActionsMenu: React.FC<Props> = ({ onClose, onDelete }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="notif-actions-menu" ref={ref}>
      <button
        className="notif-action delete"
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        <i className="fa fa-trash" /> Supprimer
      </button>
    </div>
  );
};

export default NotifActionsMenu;
