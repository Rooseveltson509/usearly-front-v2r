import React from "react";
import "./ConfirmDialog.scss";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<Props> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="actions">
          <button className="cancel" onClick={onCancel}>
            Annuler
          </button>
          <button className="confirm" onClick={onConfirm}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
