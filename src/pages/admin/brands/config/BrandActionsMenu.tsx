import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit, Power, Key, Trash2 } from "lucide-react";
import type { AdminBrand } from "@src/services/adminService";
import "./BrandActionsMenu.scss";

interface Props {
  brand: AdminBrand;
  onEdit: (brand: AdminBrand) => void;
  onToggleStatus: (brand: AdminBrand) => void;
  onResetPassword: (brand: AdminBrand) => void;
  onDelete: (brand: AdminBrand) => void;
}

const BrandActionsMenu = ({
  brand,
  onEdit,
  onToggleStatus,
  onResetPassword,
  onDelete,
}: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // fermeture clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="brand-actions-menu" ref={ref}>
      <button className="kebab-btn" onClick={() => setOpen((v) => !v)}>
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="dropdown">
          <button onClick={() => onEdit(brand)}>
            <Edit size={16} /> Modifier
          </button>

          <button onClick={() => onToggleStatus(brand)}>
            <Power size={16} />
            {brand.isActive ? "Désactiver" : "Activer"}
          </button>

          <button onClick={() => onResetPassword(brand)}>
            <Key size={16} /> Reset mot de passe
          </button>

          <button className="danger" onClick={() => onDelete(brand)}>
            <Trash2 size={16} /> Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandActionsMenu;
