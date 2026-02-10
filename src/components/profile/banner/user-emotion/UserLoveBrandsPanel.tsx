import "./UserLoveBrandsPanel.scss";
import Avatar from "@src/components/shared/Avatar";

type BrandStat = {
  id: string;
  name: string;
  domain: string;
  logo: string | null;
  count: number;
};

interface Props {
  brands: BrandStat[];
}

export default function UserLoveBrandsPanel({ brands }: Props) {
  if (!brands || brands.length === 0) return null;

  return (
    <div className="love-brands-card">
      <h4 className="love-brands-title">Mes love brands</h4>

      <div className="love-brands-list">
        {brands.map((brand) => (
          <div key={brand.id} className="love-brand-tooltip">
            <Avatar
              avatar={brand.logo}
              pseudo={brand.name}
              type="brand"
              sizeHW={32}
              preferBrandLogo={false}
            />

            {/* TOOLTIP */}
            <div className="love-brand-tooltip-content">
              <strong>{brand.name}</strong>
              <span>{brand.domain}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
