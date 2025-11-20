import "./ExtensionExampleImage.scss";
import ExtensionTabSignalement from "../../../../../../public/assets/images/extensionImageSignalement.svg";
import { LogoBig } from "@src/components/shared/DecorativeLogos";

const ExtensionExampleImage = () => {
  return (
    <div className="extension-example-image">
      <img
        src={ExtensionTabSignalement}
        alt="Extension Example"
        className="extension-image"
      />
      <LogoBig
        className="logo-big-landing-page"
        strokeColor="#4549ef29"
        size={1.7}
      />
    </div>
  );
};

export default ExtensionExampleImage;
