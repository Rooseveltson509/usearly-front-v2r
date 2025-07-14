/* import React from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import "./SimilarReportsList.scss";
import { ThumbsUp, MessageCircle, Share2 } from "lucide-react";

interface User {
  pseudo: string;
  avatar?: string;
}

interface SimilarReport {
  id: string;
  user: User;
  description: string;
  createdAt: string;
  emoji?: string;
  reactionsCount: number;
  commentsCount: number;
  reportsCount: number;
}

interface Props {
  reports: SimilarReport[];
  onReact?: (reportId: string) => void;
  onComment?: (reportId: string) => void;
}

const SimilarReportsList: React.FC<Props> = ({ reports, onReact, onComment }) => {
  return (
    <div className="similar-reports-list">
      {reports.map((report) => (
        <div key={report.id} className="similar-report-card">
          <div className="header">
            <div className="left">
              {report.emoji && <span className="emoji">{report.emoji}</span>}
              <img
                src={report.user.avatar || "/default-avatar.png"}
                alt={report.user.pseudo}
                className="avatar"
              />
              <span className="pseudo">{report.user.pseudo}</span>
              <span className="time">
                il y a {formatDistanceToNow(new Date(report.createdAt), { locale: fr })}
              </span>
            </div>
            <div className="right">
              <span className="status">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
                En cours de correction
              </span>
            </div>
          </div>

          <div className="description">{report.description}</div>

          <div className="counts-row">
            <div className="count-item">
              <ThumbsUp size={16} /> {report.reactionsCount}
            </div>
            <div className="count-item">
              <MessageCircle size={16} /> {report.commentsCount} commentaires
            </div>
            <div className="count-item">
              <Share2 size={16} /> {report.reportsCount} resignalements
            </div>
          </div>

          <div className="actions-row">
            <button onClick={() => onReact && onReact(report.id)}>
              <ThumbsUp size={16} /> Réagir
            </button>
            <button onClick={() => onComment && onComment(report.id)}>
              <MessageCircle size={16} /> Commenter
            </button>
            <button>
              <Share2 size={16} /> Partager
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimilarReportsList; */