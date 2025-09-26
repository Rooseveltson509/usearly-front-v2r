import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // si tu utilises react-router
import { apiService } from "@src/services/apiService";
import "./PublicSuggestionPage.scss"; // optionnel pour le style
import PublicSuggestionCard from "./PublicSuggestionCard";

interface Suggestion {
  id: string;
  marque?: string;
  title?: string;
  description?: string;
  emoji?: string;
  siteUrl?: string;
  createdAt?: string;
  votes?: number;
  author?: {
    id: string;
    pseudo: string;
    avatar?: string;
  };
  duplicateCount?: number;
}

const PublicSuggestionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // récupère l'id de l'URL
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchSuggestion = async () => {
      try {
        const res = await apiService.get(`/share/${id}/public`);
        setSuggestion(res.data.suggestion);
      } catch (err) {
        console.error("❌ Erreur récupération suggestion publique:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, [id]);

  if (loading) {
    return <p className="public-loading">Chargement...</p>;
  }

  if (!suggestion) {
    return <p className="public-error">❌ Suggestion introuvable.</p>;
  }

  return (
    <div className="public-suggestion-page">
      <h1>Suggestion partagée</h1>
      <PublicSuggestionCard item={{ ...suggestion, type: "suggestion" }} />
      <div className="cta-login">
        <p>👉 Connectez-vous ou créez un compte pour interagir avec cette carte.</p>
        <a href="/login" className="btn-login">Se connecter</a>
        <a href="/register" className="btn-register">Créer un compte</a>
      </div>
    </div>
  );
};

export default PublicSuggestionPage;
