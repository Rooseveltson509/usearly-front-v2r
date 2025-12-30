import { SlidersHorizontal } from "lucide-react";

import "./FeedbackSection.scss";

const feedbacks = [
  {
    avatar: "/assets/images/profil/Alex.png",
    text: "Je suis saoulée. Je ne sais pas quoi faire. Je vais devoir aller ailleurs.",
  },
  {
    avatar: "/assets/images/profil/Greg.png",
    text: "Je suis saoulée. Je ne sais pas quoi faire. Je vais devoir aller ailleurs.",
  },
  {
    avatar: "/assets/images/profil/Zaia.png",
    text: "Je suis saoulée. Je ne sais pas quoi faire. Je vais devoir aller ailleurs.",
  },
  {
    avatar: "/assets/images/profil/Greg.png",
    text: "Je suis saoulée. Je ne sais pas quoi faire. Je vais devoir aller ailleurs.",
  },
];

const FeedbackSection = () => {
  return (
    <>
      <div className="feedback-card">
        <div className="feedback-card__overlay" />

        <div className="feedback-card__header">
          <div className="feedback-card__titles">
            <p className="feedback-card__eyebrow">Feedbacks & émotions</p>
            <h2 className="feedback-card__title">
              Ce que ressentent vos Usears
            </h2>
          </div>

          <button className="feedback-card__filter">
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
            Filtrer
          </button>
        </div>

        <div className="feedback-card__list">
          {feedbacks.map((feedback, index) => (
            <div key={index} className="feedback-card__item">
              <img
                src={feedback.avatar}
                alt="Profil"
                className="feedback-card__avatar"
              />
              <p className="feedback-card__text">“{feedback.text}”</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeedbackSection;
