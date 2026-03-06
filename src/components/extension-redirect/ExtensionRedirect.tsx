import "./ExtensionRedirect.scss";
import chromeExtensionImg from "/assets/images/chromeExtensionImg.svg";
import googleBadge from "/assets/badge-google.png";

const ExtensionRedirect = () => {
  return (
    <div className="extension-redirect-container">
      <div className="extension-redirect-text-container">
        <div className="extension-redirect-text-title">
          <h2>Installer l'extension Usearly</h2>
        </div>
        <div className="extension-redirect-text-description">
          <p>
            Contribuez à améliorer vos sites et applications préférés à partir
            de votre navigateur Web <br />
            <span className="extension-available">
              Disponible sur le Chrome Web Store
            </span>
          </p>
        </div>
        <div className="extension-redirect-text-button">
          <a
            href="https://chromewebstore.google.com/detail/geclfkocbehpdojggpaeeofgdiiajcii"
            target="_blank"
            rel="noopener noreferrer"
            className="chrome-store-link"
          >
            <img
              src={googleBadge}
              alt="Disponible sur le Chrome Web Store"
              className="chrome-store-badge"
            />
          </a>
        </div>
      </div>
      <div className="extension-redirect-image-container">
        <img src={chromeExtensionImg} alt="" />
      </div>
    </div>
  );
};

export default ExtensionRedirect;
