import React, { useEffect, useState } from "react";
import "./UserVotesCard.scss";
import { getUserVotes } from "@src/services/suggestionService";
import { useNavigate } from "react-router-dom";

interface Suggestion {
  id: string;
  title: string;
  totalVotes: number;
  createdAt: string;
  emoji?: string;
  marque?: string;
  expiresInDays: number;
}

const UserVotesCard: React.FC = () => {
  const [votes, setVotes] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const data = await getUserVotes();
        setVotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Erreur getUserVotes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVotes();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (!votes.length) return null;

  return (
    <div className="user-votes-card">
      <h3 className="votes-title">✨ Mes votes en cours</h3>

      <div className="votes-list scrollable">
        {votes.map((s) => {
          const expiresLabel =
            s.expiresInDays <= 0 ? "J-0" : `J-${s.expiresInDays}`;

          return (
            <div key={s.id} className="vote-item">
              <p
                className="vote-title clickable"
                onClick={() => navigate(`/suggestions/${s.id}`)}
              >
                {s.title}
              </p>

              <div className="vote-meta">
                <span className="progress">{s.totalVotes ?? 0}/300</span>
                <span
                  className={`date ${s.expiresInDays <= 0 ? "expired" : ""}`}
                >
                  {expiresLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserVotesCard;
