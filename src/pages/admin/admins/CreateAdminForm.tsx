import type { CreateAdminPayload } from "@src/services/adminService";
import { useState } from "react";

const CreateAdminForm = ({
  onSubmit,
}: {
  onSubmit: (payload: CreateAdminPayload) => void;
}) => {
  const [form, setForm] = useState<CreateAdminPayload>({
    pseudo: "",
    born: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form
      className="create-admin-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="form-field">
        <label>Pseudo</label>
        <input
          name="pseudo"
          value={form.pseudo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label>Date de naissance</label>
        <input
          type="date"
          name="born"
          value={form.born}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-field">
        <label>Mot de passe</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-btn">
        Créer l’admin
      </button>
    </form>
  );
};

export default CreateAdminForm;
