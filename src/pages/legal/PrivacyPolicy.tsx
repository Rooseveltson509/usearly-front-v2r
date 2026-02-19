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
          <h2>1. Notre principe</h2>
          <p>
            Notre principe Usearly est conçu pour respecter votre vie privée.
            Nous ne collectons aucune donnée permettant d’identifier directement
            une personne, telle que : nom prénom adresse postale numéro de
            téléphone données bancaires
          </p>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <p>
            Usearly ne vend aucune donnée personnelle.{" "}
            <p>
              Lors de l’inscription et de l’utilisation de la plateforme, seules
              les informations suivantes sont demandées :
              <ul>
                <li>Un pseudonyme</li>
                <li>L’âge</li>
                <li>Le sexe</li>
                <li>
                  Les contributions publiées (signalements, suggestions, votes,
                  commentaires)
                </li>
                <li>
                  Aucune information civile ou administrative n’est requise.
                  <br />
                  <br />
                </li>
              </ul>
            </p>
          </p>

          <p>
            <strong>L’extension peut collecter :</strong>
          </p>

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
            <li>Afficher votre profil public sous pseudonyme</li>
            <li>Permettre l’interaction avec les marques</li>
            <li>Regrouper les signalements similaires</li>
            <li>Produire des statistiques globales anonymisées</li>
            <li>Améliorer les expériences proposées par les marques</li>
            <li>Fournir des solutions aux problèmes signalés</li>
            <li>Optimiser les services</li>
            Les analyses sont réalisées à partir de données agrégées.
          </ul>
        </section>

        <section>
          <h2>5. Aucune revente de données </h2>
          <p>
            Usearly ne vend, ne loue et ne cède aucune information à des tiers.
            Les marques partenaires ont uniquement accès aux contributions liées
            à leurs propres signalements, sous pseudonyme.
          </p>
        </section>
        <section>
          <h2>6. Données techniques</h2>
          <p>
            Afin d’assurer la sécurité et le bon fonctionnement de la
            plateforme, Usearly traite des données techniques strictement
            nécessaires, telles que :
            <ul>
              <li>l’adresse IP</li>
              <li>les journaux de connexion</li>
              <li>les informations liées au navigateur ou à l’appareil</li>
              <li>Produire des statistiques globales anonymisées</li>
              <strong>Ces données sont utilisées uniquement pour :</strong>
              <li>
                sécuriser le service prévenir les abus ou comportements
                frauduleux
              </li>
              <li>assurer la stabilité technique</li>
              Elles ne sont ni exploitées à des fins publicitaires, ni revendues
              à des tiers. Elles sont conservées pour une durée limitée et
              proportionnée aux exigences de sécurité.
            </ul>
          </p>
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
