import "./UserAccountInformations.scss";
import React, { useEffect, useState } from "react";
import {
  updateUserProfile,
  updatePassword,
  deleteUserProfile,
} from "@src/services/apiService";
import { useAuth } from "@src/services/AuthContext";
import "../UserAccount.scss";
import { showToast } from "@src/utils/toastUtils";
import { getFullAvatarUrl } from "@src/utils/avatarUtils";
import Avatar from "../../../components/shared/Avatar";
import { useNavigate } from "react-router-dom";
import InputText from "@src/components/inputs/inputsGlobal/InputText";
import PenModifyIcon from "@src/assets/images/pen-modify-circle.svg";
import InputTextAccount from "@src/components/inputs/inputsGlobal/InputTextAccount";
import SelectAccount from "@src/components/inputs/selectGlobal/SelectAccount";
import Buttons from "@src/components/buttons/Buttons";

/** Convertit une date string en valeur compatible <input type="date"> (YYYY-MM-DD). */
function toInputDate(src: string | null | undefined): string {
  if (!src) return "";
  // cas DD-MM-YYYY
  const fr = /^(\d{2})-(\d{2})-(\d{4})$/.exec(src);
  if (fr) return `${fr[3]}-${fr[2]}-${fr[1]}`;
  // cas YYYY-MM-DD ou YYYY/MM/DD (avec ou sans time à la fin)
  const isoSimple = /^(\d{4})[-/](\d{2})[-/](\d{2})/.exec(src);
  if (isoSimple) return `${isoSimple[1]}-${isoSimple[2]}-${isoSimple[3]}`;
  // fallback: tentative de parse native
  const d = new Date(src);
  if (!isNaN(d.valueOf())) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  return "";
}

/** Convertit la valeur de l’input (YYYY-MM-DD) vers DD-MM-YYYY pour l’API. */
function toFRDateForApi(inputVal: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(inputVal);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : inputVal || "";
}

function UserAccountInformations() {
  const { userProfile, fetchUserProfile, logout } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    userProfile?.avatar || null,
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState(""); // valeur POUR l’input: YYYY-MM-DD
  const [gender, setGender] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (userProfile && !avatarFile) {
      setPseudo(userProfile.pseudo || "");
      setEmail(userProfile.email || "");
      // on normalise ce qui vient du profil vers YYYY-MM-DD pour l’input
      setBirthdate(toInputDate(userProfile.born));
      setGender(userProfile.gender || "N/A");
      setAvatarPreview(getFullAvatarUrl(userProfile.avatar || null));
    }
  }, [userProfile, avatarFile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("pseudo", pseudo);
      // l’API attend DD-MM-YYYY : on convertit depuis la valeur input YYYY-MM-DD
      formData.append("born", toFRDateForApi(birthdate));
      // formData.append("gender", gender);
      if (avatarFile) formData.append("image", avatarFile);

      await updateUserProfile(formData);
      await fetchUserProfile();
      setMessage("Profil mis à jour avec succès.");
      showToast("✅ profile mise à jour avec succès !", "success");
      navigate("/profile");
    } catch (err: any) {
      showToast(err.message, "error");
      setMessage(err.message);
    }
  };

  const handlePasswordUpdate = async () => {
    try {
      await updatePassword({ oldPassword, newPassword, confirmPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Mot de passe mis à jour.");
      showToast("✅ Mot de passe mis à jour.", "success");
    } catch (err: any) {
      showToast(err.message, "error");
      setMessage(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
      try {
        await deleteUserProfile();
        logout();
        window.location.href = "/login";
      } catch (err: any) {
        setMessage(err.message);
      }
    }
  };

  function avatarImgClick() {
    const fileInput = document.getElementById("avatarImg");
    fileInput?.click();
  }

  return (
    <div>
      <div className="user-account">
        <h1>Mes informations</h1>

        <div className="avatar-preview">
          {avatarPreview?.startsWith("data:") ? (
            <>
              <h2>Photo actuelle</h2>
              <div>
                <img
                  src={avatarPreview}
                  alt="Preview"
                  className="preview-img"
                />
                <img
                  src={PenModifyIcon}
                  alt="Modifier"
                  onClick={avatarImgClick}
                  className="modify-icon with-img"
                />
              </div>
            </>
          ) : (
            <>
              <h2>Photo actuelle</h2>
              <div>
                <Avatar
                  avatar={avatarPreview}
                  pseudo={pseudo || userProfile?.pseudo || "?"}
                  className="large-avatar"
                />
                <img
                  src={PenModifyIcon}
                  alt="Modifier"
                  onClick={avatarImgClick}
                  className="modify-icon"
                />
              </div>
            </>
          )}
        </div>

        <input
          id="avatarImg"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />

        <div className="form-group">
          <InputTextAccount
            id="pseudo"
            label="Pseudo"
            type="text"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
        </div>

        <div className="form-group">
          <InputTextAccount
            id="email"
            label="Email"
            type="email"
            value={email}
            disabled={true}
          />
        </div>

        <div className="form-group">
          <InputTextAccount
            id="birthdate"
            label="Date de naissance"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <SelectAccount
            id="gender"
            title={gender || "N/A"}
            disabled={true}
            options={["Homme", "Femme", "Autre"]}
            onChange={(value) => setGender(value)}
          />
        </div>

        <div className="form-group submit-group">
          <Buttons title="Mettre à jour" onClick={handleProfileUpdate} />
        </div>
      </div>

      <div className="password-change">
        <h2>Changer le mot de passe</h2>

        <div className="form-group">
          <InputText
            id="oldPassword"
            label="Mot de passe actuel"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <InputText
            id="newPassword"
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <InputText
            id="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-group submit-group">
          <Buttons
            title="Mettre à jour le mot de passe"
            onClick={handlePasswordUpdate}
          />
        </div>
      </div>

      <p className="delete-account" onClick={handleDeleteAccount}>
        <u>Supprimer mon compte</u>
      </p>

      {message && <p className="feedback-message">{message}</p>}
    </div>
  );
}

export default UserAccountInformations;
