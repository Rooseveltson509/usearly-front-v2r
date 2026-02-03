import React from "react";
import "./ProfileFeedbackSection.scss";

export type FeedbackType = "report" | "coupDeCoeur" | "suggestion";

interface ProfileFeedbackSectionProps {
  feedbackType: FeedbackType;

  /** Contenu principal (cartes, listes, feeds…) */
  children: React.ReactNode;

  /** Colonne droite (stats, marques, votes, impact…) */
  sideContent?: React.ReactNode;

  /** Filtres / contrôles (selects, tris…) */
  controls?: React.ReactNode;

  /** Titres éditoriaux (optionnels) */
  title?: string;
  subtitle?: string;
}

const ProfileFeedbackSection: React.FC<ProfileFeedbackSectionProps> = ({
  feedbackType,
  children,
  sideContent,
  controls,
  title,
  subtitle,
}) => {
  return (
    <section
      className={`profile-feedback-section profile-feedback-section--${feedbackType}`}
    >
      <div className="profile-feedback-content">
        {/* Titres (ILS RESTENT) */}
        {(title || subtitle) && (
          <div className="profile-feedback-header">
            {title && <h2 className="banner-title">{title}</h2>}
            {subtitle && <p className="banner-subtitle">{subtitle}</p>}
          </div>
        )}

        {controls && (
          <div className="profile-feedback-controls">{controls}</div>
        )}

        <div className="profile-feedback-grid">
          <div className="profile-feedback-main">{children}</div>

          {sideContent && (
            <aside className="profile-feedback-side">{sideContent}</aside>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfileFeedbackSection;
