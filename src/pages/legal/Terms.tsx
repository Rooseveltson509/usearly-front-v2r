import Footer from "@src/components/layout/Footer";
import "./LegalPages.scss";

export default function Terms() {
  return (
    <>
      <div className="legal-container">
        <h1>Conditions générales d’utilisation</h1>

        <p className="legal-updated">
          Dernière mise à jour : {new Date().getFullYear()}
        </p>

        <section>
          <h2>1. Acceptation</h2>
          <p>
            En utilisant l’extension Usearly, vous acceptez les présentes
            conditions générales d’utilisation.
          </p>
        </section>

        <section>
          <h2>2. Responsabilités de l’utilisateur</h2>
          <ul>
            <li>
              Vous vous engagez à ne pas soumettre de contenu illégal, abusif,
              diffamatoire ou nuisible.
            </li>
            <li>
              Vous êtes responsable de l’exactitude des informations et des
              retours que vous soumettez.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. Limitation de responsabilité</h2>
          <p>
            Usearly est fourni « en l’état », sans garantie explicite ou
            implicite. Nous ne garantissons pas l’absence d’erreurs ou
            d’interruptions.
          </p>
        </section>

        <section>
          <h2>4. Modification des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout
            moment. Les modifications prennent effet dès leur publication.
          </p>
        </section>

        <section>
          <h2>5. Contact</h2>
          <p className="legal-contact">📩 support@usearly.com</p>
        </section>
      </div>

      <Footer />
    </>
  );
}
