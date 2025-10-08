import React, { useState, useRef } from "react";
import Avatar from "../shared/Avatar";
import { useAuth } from "@src/services/AuthContext";
//import { searchUsersByPseudo } from "@src/services/userService";
//import { debounce } from "lodash";
import "./CommentForm.scss";
import { searchUsersByPseudo } from "@src/services/commentService";
import { debounce } from "@src/utils/debounce";
import MentionList from "../notification/MentionList";

interface Mention {
  id: string;
  pseudo: string;
  avatar?: string | null;
}

interface Props {
  avatarUrl: string;
  value: string;
  onSubmit: (text: string, mentions?: Mention[]) => void;
}

const CommentForm: React.FC<Props> = ({ avatarUrl, value, onSubmit }) => {
  const [text, setText] = useState(value);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [suggestions, setSuggestions] = useState<Mention[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { userProfile } = useAuth();

  // 🧠 Recherche d’utilisateurs (debounce pour les performances)
  const fetchUsers = debounce(async (term: string) => {
    if (term.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await searchUsersByPseudo(term);
      setSuggestions(res);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Erreur recherche utilisateurs :", err);
    }
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);

    // Détection du mot commençant par "@"
    const lastWord = val.split(/\s/).pop();
    if (lastWord?.startsWith("@")) {
      const term = lastWord.slice(1);
      setQuery(term);
      fetchUsers(term);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectUser = (user: Mention) => {
    if (!inputRef.current) return;

    const cursorPos = inputRef.current.selectionStart || text.length;
    const before = text.substring(0, cursorPos);
    const after = text.substring(cursorPos);

    // Remplace "@xxx" en cours par "@pseudo "
    const updatedText = before.replace(/@\w*$/, `@${user.pseudo} `) + after;

    setText(updatedText);
    setMentions((prev) =>
      prev.some((m) => m.id === user.id) ? prev : [...prev, user],
    );
    setShowSuggestions(false);

    // Focus sur l’input après sélection
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim(), mentions);
    setText("");
    setMentions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="comment-form-wrapper">
      <form onSubmit={handleSubmit} className="comment-form">
        <Avatar
          avatar={avatarUrl}
          type="user"
          pseudo={userProfile?.pseudo}
          className="comment-avatar"
          wrapperClassName="comment-avatar-wrapper"
        />

        <div className="comment-input-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Commenter…"
            value={text}
            onChange={handleChange}
            className="comment-input"
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <MentionList users={suggestions} onSelect={handleSelectUser} />
          )}
        </div>

        <button type="submit" className="comment-submit">
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
