import InputText from "../../components/inputs/InputText";
import UsearlyDraw from "./Usearly";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "./CheckUser.scss";
import Buttons from "@src/components/buttons/Buttons";

function CheckUser() {
    const Navigate = useNavigate();

    const [UserExists, setUserExists] = useState(false);
    const [error, setError] = useState("");
    const emailRef = useRef<HTMLInputElement | null>(null);

    function CheckIfUserExist() {
    // read the input value from the forwarded ref
    const email = emailRef.current?.value?.trim() ?? "";
    console.log("CheckUser: email=", email);

        if (!email) {
            setError("Veuillez entrer une adresse E-mail valide.");
            return;
        }

        // TODO: replace this mock check with a real API call to verify whether the user exists
        // For now we'll set UserExists to true when email contains 'exist', otherwise false
        const exists = email.toLowerCase().includes("exist");
        setUserExists(exists);

        if (exists) {
            // pass the entered email via location state so the Login page can prefill it
            Navigate("/login", { state: { email } });
        } else {
            Navigate("/signup", { state: { email } });
        }
    }

  return (
    <div className="check-user-container">
        <div className="check-user-form">
            <h2>Saisi ton E-mail pour nous rejoindre ou te connecter</h2>
            <div>
                <InputText ref={emailRef} registerName={"email"} id="email" type="email" placeholder="Email*" required />
                { error && <p className="error-message">{error}</p> }
            </div>
            <div>
                <Buttons onClick={() => CheckIfUserExist()} title="Continuer" />
            </div>
        </div>
        <UsearlyDraw />
    </div>
  );
}

export default CheckUser;