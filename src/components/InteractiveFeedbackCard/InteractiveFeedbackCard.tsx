import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import "./InteractiveFeedbackCard.scss";
import { useAuth } from "@src/services/AuthContext";
import { fetchValidBrandLogo } from "@src/utils/brandLogos";
import { apiService } from "@src/services/apiService";
import { showToast } from "@src/utils/toastUtils";
import starProgressBar from "/assets/icons/icon-progress-bar.svg";
import FeedbackLeft from "./FeedbackLeft";
import FeedbackRight from "./FeedbackRight";
import type { CoupDeCoeur, Suggestion } from "@src/types/Reports";

interface Props {
  item: (CoupDeCoeur | Suggestion) & { type: "suggestion" | "coupdecoeur" };
  isOpen: boolean;
  onToggle: (id: string) => void;
}

const InteractiveFeedbackCard: React.FC<Props> = ({
  item,
  isOpen,
  onToggle,
}) => {
  const { userProfile } = useAuth();
  const [votes, setVotes] = useState((item as Suggestion).votes || 0);
  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [, setLogos] = useState<Record<string, string>>({});
  const barRef = useRef<HTMLDivElement>(null);
  const [thumbLeft, setThumbLeft] = useState(0);
  const max = 300;
  const thumbSize = 24;
  const isExpired = expiresInDays !== null && expiresInDays <= 0;

  // --- progression
  useLayoutEffect(() => {
    const updateThumb = () => {
      if (barRef.current) {
        const barWidth = barRef.current.offsetWidth;
        const raw = (votes / max) * barWidth;
        const safe = Math.max(
          thumbSize / 2,
          Math.min(barWidth - thumbSize / 2, raw),
        );
        setThumbLeft(safe);
      }
    };
    updateThumb();
    window.addEventListener("resize", updateThumb);
    return () => window.removeEventListener("resize", updateThumb);
  }, [votes]);

  // --- votes
  useEffect(() => {
    if (item.type === "suggestion") {
      apiService
        .get(`/suggestions/${item.id}/votes`)
        .then((res) => {
          setVotes(res.data.votes);
          setExpiresInDays(res.data.expiresInDays);
        })
        .catch(() => {});
    }
  }, [item.id, item.type]);

  // --- logos
  useEffect(() => {
    const brandKey = item.marque?.trim();
    if (!brandKey) return;
    let isMounted = true;
    fetchValidBrandLogo(brandKey, item.siteUrl)
      .then((logoUrl) => {
        if (!isMounted) return;
        setLogos((prev) =>
          prev[brandKey] === logoUrl ? prev : { ...prev, [brandKey]: logoUrl },
        );
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [item.marque, item.siteUrl]);

  // --- lightbox cleanup
  useEffect(() => {
    return () => {
      if (selectedImage) {
        document.body.classList.remove("lightbox-open");
        document.body.style.overflow = "auto";
      }
    };
  }, [selectedImage]);

  const handleVoteClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const res = await apiService.post(`/suggestions/${item.id}/vote`);
      setVotes(res.data.votes);
      showToast("✅ Vote enregistré avec succès", "success");
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        "❌ Vous avez déjà voté pour cette suggestion";
      showToast(msg, "error");
    }
  };

  if (!userProfile?.id) return null;

  return (
    <div className={`feedback-card ${isOpen ? "open" : ""}`}>
      {/* === Bloc gauche === */}
      <FeedbackLeft item={item} />

      {/* === Bloc droit === */}
      <FeedbackRight
        item={item}
        onToggle={onToggle}
        userProfile={userProfile}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isExpired={isExpired}
        votes={votes}
        max={max}
        barRef={barRef}
        thumbLeft={thumbLeft}
        expiresInDays={expiresInDays}
        starProgressBar={starProgressBar}
        onVoteClick={handleVoteClick}
      />

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            alt="Zoom"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default InteractiveFeedbackCard;
