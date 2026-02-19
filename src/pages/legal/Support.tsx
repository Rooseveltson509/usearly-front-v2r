import Footer from "@src/components/layout/Footer";
import "./LegalPages.scss";

export default function Support() {
  return (
    <>
      <div className="legal-container">
        <h1>Support</h1>

        <p>
          Besoin d’aide avec Usearly ? Nous sommes là pour vous accompagner.
        </p>

        <section>
          <h2>Problèmes fréquents</h2>
          <ul>
            <li>L’extension n’apparaît pas → Rafraîchissez la page.</li>
            <li>
              Le microphone ne fonctionne pas → Vérifiez les permissions du
              navigateur.
            </li>
            <li>
              Problème de capture d’écran → Assurez-vous que les autorisations
              sont activées.
            </li>
          </ul>
        </section>

        <section>
          <h2>Nous contacter</h2>
          <p>Pour toute question technique ou demande d’assistance :</p>

          <p className="legal-contact">📩 support@usearly.com</p>

          <p>Nous répondons généralement sous 24 à 48 heures.</p>
        </section>
      </div>

      <Footer />
    </>
  );
}
