import Footer from "@src/components/layout/Footer";
import "./LegalPages.scss";

export default function Contact() {
  return (
    <>
      <div className="legal-container">
        <h1>Nous contacter</h1>

        <p>
          Une question, une suggestion ou un problème avec Usearly ? Notre
          équipe est à votre écoute.
        </p>

        <section>
          <h2>Formulaire de contact</h2>

          <form
            className="contact-form"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;

              const name = (form.elements.namedItem("name") as HTMLInputElement)
                .value;
              const email = (
                form.elements.namedItem("email") as HTMLInputElement
              ).value;
              const message = (
                form.elements.namedItem("message") as HTMLTextAreaElement
              ).value;

              window.location.href = `mailto:support@usearly.com?subject=Contact Usearly - ${name}&body=${encodeURIComponent(
                `Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
              )}`;
            }}
          >
            <input name="name" placeholder="Votre nom" required />
            <input
              name="email"
              type="email"
              placeholder="Votre email"
              required
            />
            <textarea
              name="message"
              placeholder="Votre message"
              rows={5}
              required
            />
            <button type="submit">Envoyer</button>
          </form>
        </section>

        <section>
          <h2>Contact direct</h2>
          <p className="legal-contact">📩 support@usearly.com</p>
          <p>Réponse sous 24 à 48 heures ouvrées.</p>
        </section>

        <section>
          <h2>Adresse</h2>
          <p>
            Usearly
            <br />
            France
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}
