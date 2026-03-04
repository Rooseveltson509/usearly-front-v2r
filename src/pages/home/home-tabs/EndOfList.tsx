import React from "react";
import "./EndOfList.scss";

type Props = {
  endText?: string;
};

const EndOfList: React.FC<Props> = ({ endText = "Fin de la liste" }) => {
  return (
    <div className="end-of-list">
      <p className="end-text">{endText}</p>
    </div>
  );
};

export default EndOfList;
