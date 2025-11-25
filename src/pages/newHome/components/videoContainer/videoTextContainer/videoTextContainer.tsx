import "./videoTextContainer.scss";
import downloadApple from "/assets/images/appleDownload.svg";
import downloadGoogle from "/assets/images/googleDownload.svg";

const VideoTextContainer = () => {
  return (
    <div className="new-home-video-text-download-container">
      <div className="new-home-video-text-download-icon-container">
        <div className="new-home-video-text-download-icon">
          <img src={downloadApple} alt="icon apple download" />
        </div>
        <div className="new-home-video-text-download-icon">
          <img src={downloadGoogle} alt="icon google download" />
        </div>
      </div>
      <div className="new-home-video-text-download-text">
        <p>
          Téléchargez l'appli et contribuez à améliorer dès aujourd'hui !
          <br></br>
          Avec Usearly, vos idées et vos retours ont un vrai impact.
        </p>
      </div>
    </div>
  );
};

export default VideoTextContainer;
