import { motion, AnimatePresence } from "framer-motion";
import "./ConfirmActionModal.scss";

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmActionModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  danger = false,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="confirm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="confirm-modal"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <h3>{title}</h3>
            <p>{description}</p>

            <div className="actions">
              <button className="cancel" onClick={onCancel}>
                Annuler
              </button>
              <button
                className={danger ? "danger" : "confirm"}
                onClick={onConfirm}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmActionModal;
