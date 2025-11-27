import { type Dispatch, type MouseEvent, type SetStateAction } from "react";
import "./CloseButtons.scss";

type CloseButtonProps = {
  closeFunction?: () => void;
  stateSetter?: Dispatch<SetStateAction<any>>;
  stateValue?: SetStateAction<any>;
};

const CloseButton = ({
  closeFunction,
  stateSetter,
  stateValue,
}: CloseButtonProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    closeFunction?.();

    if (stateSetter !== undefined && stateValue !== undefined) {
      stateSetter(stateValue);
    }
  };

  return (
    <button
      type="button"
      className="lightbox-close"
      aria-label="Fermer"
      onClick={handleClick}
    >
      ×
    </button>
  );
};

export default CloseButton;
