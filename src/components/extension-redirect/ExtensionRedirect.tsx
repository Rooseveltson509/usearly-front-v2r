import React from "react";
import "./ExtensionRedirect.scss";
import chromeExtensionImg from "/assets/images/chromeExtensionImg.svg";

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
            <span className="extension-redirect-text-description-dispo">
              Disponible sur :
            </span>
          </p>
        </div>
        <div className="extension-redirect-text-button">
          <a
            href="https://chromewebstore.google.com/detail/geclfkocbehpdojggpaeeofgdiiajcii?utm_source=item-share-cb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="extension-redirect-button">
              <img
                src="https://www.google.com/chrome/static/images/chrome-logo.svg"
                alt=""
              />
              <p className="extension-redirect-button-text">Chrome Extension</p>
            </button>
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
