import React from "react";
import ShareModal from "../../../shared/share-modal/ShareModal";
import ShareCoupDeCoeurModal from "../../../shared/share-modal/ShareCoupDeCoeurModal";

type TypeKind = "coupdecoeur" | "suggestion";

interface Props {
  type: TypeKind;
  id: string;
  open: boolean;
  onClose: () => void;
}

export default function ShareModalSwitch({ type, id, open, onClose }: Props) {
  if (!open) return null;
  return type === "suggestion" ? (
    <ShareModal suggestionId={id} onClose={onClose} />
  ) : (
    <ShareCoupDeCoeurModal coupDeCoeurId={id} onClose={onClose} />
  );
}
