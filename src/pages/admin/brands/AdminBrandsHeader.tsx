import "./AdminBrandsHeader.scss";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onAddBrand: () => void;
}

const AdminBrandsHeader = ({ search, onSearchChange, onAddBrand }: Props) => {
  return (
    <div className="admin-brands-header">
      <div>
        <h1>Administration · Marques</h1>
        <p>Gérez les marques partenaires Usearly</p>
      </div>

      <div className="admin-brands-actions">
        <input
          type="text"
          placeholder="Rechercher une marque…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <button onClick={onAddBrand}>+ Ajouter</button>
      </div>
    </div>
  );
};

export default AdminBrandsHeader;
