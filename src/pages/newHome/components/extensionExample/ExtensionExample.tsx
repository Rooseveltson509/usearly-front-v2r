import "./extensionExample.scss";
import ExtensionExampleText from "./extensionExampleText/ExtensionExampleText";
import ExtensionExampleImage from "./extensionExampleImage/ExtensionExampleImage";

const ExtensionExample = () => {
  return (
    <div className="extension-example-container">
      <ExtensionExampleText />
      <ExtensionExampleImage />
    </div>
  );
};

export default ExtensionExample;
