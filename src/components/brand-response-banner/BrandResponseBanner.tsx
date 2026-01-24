import React from "react";
import "./BrandResponseBanner.scss";
import { Check } from "lucide-react";

type Props = {
  message: string;
  createdAt?: string;
  brand: string;
};

const BrandResponseBanner: React.FC<Props> = ({
  message,
  brand,
  createdAt,
}) => {
  return (
    <div className="brand-response-banner">
      <div className="brand-response-header">
        <span className="brand-name">{brand}</span>
        <span className="badge">
          <Check size={12} /> Réponse officielle
        </span>

        {createdAt && (
          <span className="date">
            {new Date(createdAt).toLocaleDateString()}
          </span>
        )}
      </div>

      <p className="brand-response-message">{message}</p>
    </div>
  );
};

export default BrandResponseBanner;
