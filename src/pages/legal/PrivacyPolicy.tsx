import Footer from "@src/components/layout/Footer";
import "./LegalPages.scss";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="legal-container">
        <h1>Politique de confidentialité</h1>

        <p className="legal-updated">
          Dernière mise à jour : {new Date().getFullYear()}
        </p>

        <section>
          <h2>1. Présentation</h2>
          <p>
            Usearly est une extension navigateur permettant aux utilisateurs de
            signaler des bugs, partager des retours et suggérer des
            améliorations directement depuis les sites web qu’ils visitent.
          </p>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <p>Usearly ne vend aucune donnée personnelle.</p>

          <p>L’extension peut collecter :</p>

          <ul>
            <li>
              Les contenus de feedback soumis volontairement par l’utilisateur
            </li>
            <li>Les captures d’écran ajoutées volontairement</li>
            <li>
              Les enregistrements vocaux uniquement à des fins de transcription
              (si utilisés)
            </li>
            <li>L’URL du site sur lequel le feedback est envoyé</li>
          </ul>

          <p>
            Les enregistrements vocaux sont traités uniquement pour la
            transcription et ne sont pas conservés de manière permanente.
          </p>
        </section>

        <section>
          <h2>3. Permissions navigateur</h2>
          <p>
            Usearly demande uniquement les autorisations strictement nécessaires
            pour :
          </p>

          <ul>
            <li>Capturer une capture d’écran lorsque l’utilisateur l’initie</li>
            <li>Accéder à l’onglet actif pour contextualiser le feedback</li>
            <li>
              Utiliser le microphone uniquement si l’utilisateur active la
              dictée vocale
            </li>
            <li>Stocker les préférences utilisateur localement</li>
          </ul>
        </section>

        <section>
          <h2>4. Utilisation des données</h2>
          <p>Les données collectées sont utilisées uniquement pour :</p>

          <ul>
            <li>Améliorer les services</li>
            <li>Fournir des solutions aux problèmes signalés</li>
            <li>Optimiser l’expérience utilisateur</li>
          </ul>
        </section>

        <section>
          <h2>5. Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité adaptées afin de
            protéger les données des utilisateurs.
          </p>
        </section>

        <section>
          <h2>6. Contact</h2>
          <p>Pour toute question relative à la confidentialité :</p>
          <p className="legal-contact">📩 support@usearly.com</p>
        </section>
      </div>

      <Footer />
    </>
  );
}
