import React, { useEffect, useState } from "react";
import {
    updateUserProfile,
    updatePassword,
    deleteUserProfile,
} from "@src/services/apiService";
import { useAuth } from "@src/services/AuthContext";
import "./UserAccount.scss";
import { showToast } from "@src/utils/toastUtils";
import { getFullAvatarUrl } from "@src/utils/avatarUtils";
import Avatar from "../shared/Avatar";
import { useNavigate } from "react-router-dom";

const UserAccount = () => {
    const { userProfile, fetchUserProfile, logout } = useAuth();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        userProfile?.avatar || null
    );
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    // et un effet :
    useEffect(() => {
        if (userProfile && !avatarFile) {
            setPseudo(userProfile.pseudo || "");
            setEmail(userProfile.email || "");
            setBirthdate(userProfile.born || "");
            setGender(userProfile.gender || "N/A");
            setAvatarPreview(getFullAvatarUrl(userProfile.avatar || null)); // ✅ seulement si pas de preview local
        }
    }, [userProfile, avatarFile]);


    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                console.log("Image preview loaded:", reader.result);
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleProfileUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("pseudo", pseudo);
            formData.append("born", birthdate);
            formData.append("gender", gender);
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

    return (
        <div className="user-account">
            <h1>Mes informations</h1>
            <div className="avatar-preview">
                {avatarPreview?.startsWith("data:") ? (
                    <img
                        src={avatarPreview}
                        alt="Preview"
                        className="preview-img"
                    />
                ) : (
                    <Avatar
                        avatar={avatarPreview}
                        pseudo={pseudo || userProfile?.pseudo || "?"}
                        className="large-avatar"
                    />
                )}
            </div>

            <input type="file" accept="image/*" onChange={handleAvatarChange} />

            <div className="form-group">
                <label>Pseudo :</label>
                <input value={pseudo} onChange={(e) => setPseudo(e.target.value)} />
            </div>

            <div className="form-group">
                <label>Email :</label>
                <input value={email} disabled />
            </div>

            <div className="form-group">
                <label>Date de naissance :</label>
                <input
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Genre :</label>
                <input value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>

            <button className="update-btn" onClick={handleProfileUpdate}>
                Mettre à jour
            </button>

            <h2>Changer le mot de passe</h2>

            <div className="form-group">
                <label>Ancien mot de passe :</label>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Nouveau mot de passe :</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Confirmer le mot de passe :</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </div>

            <button className="password-btn" onClick={handlePasswordUpdate}>
                Mettre à jour le mot de passe
            </button>

            <p className="delete-account" onClick={handleDeleteAccount}>
                Supprimer mon compte?
            </p>

            {message && <p className="feedback-message">{message}</p>}
        </div>
    );
};

export default UserAccount;
