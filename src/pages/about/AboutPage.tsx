import "./AboutPage.scss";
import useRevealOnScroll from "./hooks/useRevealOnScroll";
import useTitleRevealOnScroll from "./hooks/useTitleRevealOnScroll";

const AboutPage = () => {
  useRevealOnScroll(".reveal");
  useTitleRevealOnScroll(".about-page");

  return (
    <section className="about-page">
      {/* HERO */}
      <div className="about-hero reveal">
        <h1 className="about-title">
          Construire une meilleure
          <br />
          expérience digitale,
          <br />
          <span className="gradient-text">ensemble.</span>
        </h1>
        <p className="about-subtitle">
          Usearly crée un lien direct entre les utilisateurs et les marques pour
          transformer chaque retour en opportunité d’amélioration.
        </p>
      </div>
      <div className="parallax-bg"></div>

      {/* SECTION - PROBLEME */}
      <div className="about-section reveal">
        <h2 className="section-title">Un besoin simple : mieux écouter.</h2>
        <p className="section-text">
          Les utilisateurs partagent leurs avis partout : réseaux sociaux,
          supports clients, emails, messages directs. Les marques reçoivent des
          milliers de signaux… mais n’ont pas d’espace unique pour comprendre,
          analyser et agir. Usearly centralise tout en un seul endroit, pensé
          pour la clarté et l’efficacité.
        </p>
      </div>

      {/* SECTION - SOLUTION */}
      <div className="about-section reveal">
        <h2 className="section-title">Notre solution</h2>
        <p className="section-text">
          Un espace unique pour comprendre, analyser et agir. Usearly permet de
          signaler un bug, proposer une amélioration, partager un coup de cœur,
          détecter automatiquement les doublons via l’IA, visualiser les
          tendances, collaborer, réagir, commenter, et transformer ces données
          en décisions concrètes.
        </p>
      </div>

      {/* SECTION - VISION */}
      <div className="about-section reveal">
        <h2 className="section-title">Notre vision</h2>
        <p className="section-text">
          Une expérience digitale plus humaine, plus fluide et plus
          intelligente. Nous croyons que les meilleures expériences se
          construisent en écoutant ceux qui les vivent chaque jour.
        </p>
      </div>

      {/* SECTION - VALEURS */}
      <div className="values-grid reveal">
        <div className="value-card">
          <h3>Transparence</h3>
          <p>Nous donnons aux utilisateurs une vraie voix.</p>
        </div>
        <div className="value-card">
          <h3>Innovation continue</h3>
          <p>Nous améliorons Usearly chaque semaine.</p>
        </div>
        <div className="value-card">
          <h3>Collaboration</h3>
          <p>L’innovation se construit ensemble : marques & utilisateurs.</p>
        </div>
        <div className="value-card">
          <h3>Bienveillance</h3>
          <p>Chaque retour est une opportunité, jamais un reproche.</p>
        </div>
      </div>

      {/* SECTION - EQUIPE */}
      <div className="about-section reveal">
        <h2 className="section-title">Qui sommes-nous ?</h2>
        <p className="section-text">
          Usearly est né d’une idée simple : mettre les utilisateurs au centre
          de chaque décision produit. Créé par{" "}
          <strong>Rooseveltson Cebeat</strong>, développeur full-stack passionné
          par l’expérience utilisateur, Usearly évolue constamment pour offrir
          l’outil que nous aurions tous aimé avoir il y a longtemps.
        </p>
      </div>

      {/* SECTION - AVENIR */}
      <div className="about-section reveal">
        <h2 className="section-title">Et demain ?</h2>
        <p className="section-text">
          Nous ne faisons que commencer. Bientôt : badges & niveaux, IA
          renforcée, détection contextuelle, leaderboard hebdomadaire,
          extensions plus puissantes, et un espace complet dédié aux marques.
        </p>
      </div>

      <div className="timeline-section reveal">
        <h2 className="section-title">L’évolution de Usearly</h2>

        <div className="timeline">
          <div className="timeline-item">
            <span className="dot"></span>
            <div>
              <h3>2024 — L’idée</h3>
              <p>
                Créer un espace centralisé où les utilisateurs peuvent être
                entendus.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <span className="dot"></span>
            <div>
              <h3>2024 — Première version</h3>
              <p>
                Signalements, suggestions, coups de cœur, réactions et
                commentaires.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <span className="dot"></span>
            <div>
              <h3>2025 — IA & extension navigateur</h3>
              <p>
                Détection automatique, doublons, analyse IA, menu flottant
                intelligent.
              </p>
            </div>
          </div>

          <div className="timeline-item">
            <span className="dot"></span>
            <div>
              <h3>2025 — Gamification</h3>
              <p>
                Points, badges, leaderboard hebdomadaire pour les utilisateurs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="team-section reveal">
        <h2 className="section-title">L’équipe Usearly</h2>

        <div className="team-grid">
          <div className="team-card">
            <img src="/assets/team/avatar1.svg" alt="Roosevelt" />
            <h3>Developpeur</h3>
            <p>Fondateur & Développeur Full-Stack & IA </p>
          </div>

          <div className="team-card">
            <img src="/assets/team/avatar2.svg" alt="Equipe" />
            <h3>Designer</h3>
            <p>Design, IA & Expérience utilisateur</p>
          </div>

          <div className="team-card">
            <img src="/assets/team/avatar2.svg" alt="Equipe" />
            <h3>Others</h3>
            <p>Design, IA & Expérience utilisateur</p>
          </div>
          <div className="team-card">
            <img src="/assets/team/avatar2.svg" alt="Equipe" />
            <h3>Others</h3>
            <p>Design, IA & Expérience utilisateur</p>
          </div>
        </div>
      </div>

      <div className="cta-section reveal">
        <h2>Rejoignez Usearly dès aujourd’hui</h2>
        <p>Construisons ensemble une meilleure expérience digitale.</p>

        <a href="/signup" className="cta-button">
          Commencer maintenant 🚀
        </a>
      </div>
    </section>
  );
};

export default AboutPage;
