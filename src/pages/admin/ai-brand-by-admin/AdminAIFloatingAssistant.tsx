import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAIFloatingAssistant.scss";

const QUICK_QUESTIONS = [
  "Vue globale des marques",
  "Quelles marques génèrent le plus de tickets ?",
  "Analyse par catégorie",
  "Focus sur une marque",
];

const AdminAIFloatingAssistant = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const askAI = (query: string) => {
    setOpen(false);
    navigate("/admin/ai/overview", {
      state: { query },
    });
  };

  return (
    <div className="admin-ai-floating">
      {open && (
        <div className="ai-panel">
          <div className="ai-header">
            <span>Assistant AI</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="ai-questions">
            {QUICK_QUESTIONS.map((q) => (
              <button key={q} onClick={() => askAI(q)}>
                {q}
              </button>
            ))}
          </div>

          <div className="ai-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pose une question… (ex: focus sur LBO)"
            />
            <button
              onClick={() => {
                if (!input.trim()) return;
                askAI(input);
                setInput("");
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        className="ai-fab"
        onClick={() => setOpen((v) => !v)}
        aria-label="Assistant AI"
      >
        ✨
      </button>
    </div>
  );
};

export default AdminAIFloatingAssistant;
