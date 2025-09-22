import InputText from "../../components/inputs/inputsGlobal/InputText";
import { checkMailExists } from "@src/services/apiService";
import UsearlyDraw from "../../components/background/Usearly";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import "./CheckUser.scss";
import Buttons from "@src/components/buttons/Buttons";

function CheckUser() {
    const Navigate = useNavigate();

    const [UserExists, setUserExists] = useState(false);
    const [error, setError] = useState("");
    const emailRef = useRef<HTMLInputElement | null>(null);

    async function CheckIfUserExist() {
    // read the input value from the forwarded ref
    const email = emailRef.current?.value?.trim() ?? "";
    console.log("CheckUser: email=", email);

        if (!email || !email.includes("@")) {
            setError("Veuillez entrer une adresse E-mail valide.");
            return;
        }

        // TODO: replace this mock check with a real API call to verify whether the user exists
        // For now we'll set UserExists to true when email contains 'exist', otherwise false
        const exists = await checkMailExists(email).then(res => res.exists).catch(err => {
            console.error("Erreur lors de la vérification de l'email :", err);
            setError("Erreur lors de la vérification de l'email.");
            return false;
        });
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
            <h2>Saisi une adresse E-mail pour nous rejoindre ou te connecter</h2>
            <div>
                <InputText ref={emailRef} id="email" label="Email*" type="email" required />
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