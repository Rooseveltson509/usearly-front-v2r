import React from "react";
import "./UserImpact.scss";


const UserImpact: React.FC = () => {
  return (
    <div className="user-impact-card">
      <h2>
        <span className="emoji">🌍</span> Ton Usear Impact
      </h2>
      <div className="impact-stats">
        <div className="impact-item">
          <span className="emoji">📣</span>
          <span>
            <strong>6 marques</strong> aidées
          </span>
        </div>
        <div className="impact-item">
          <span className="emoji">🗨️</span>
          <span>
            <strong>12 utilisateurs</strong> ont réagi à tes signalements
          </span>
        </div>
        <div className="impact-item">
          <span className="emoji">✨</span>
          <span>
            <strong>24 votes</strong> générés par tes suggestions
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserImpact;
