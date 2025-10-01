import React from "react";
import { Link } from "react-router-dom";
import "./Footer.scss";

const Footer: React.FC = () => (
  <footer>
    <div style={{ marginBottom: "0.5rem" }}>
      <ul>
        <li>
          <Link to="/cgu" style={{ textDecoration: "none" }}>
            Conditions générales d'utilisation
          </Link>
        </li>
        <li>
          <Link to="/contact" style={{ textDecoration: "none" }}>
            Nous contacter
          </Link>
        </li>
        <li>© Usearly 2024</li>
      </ul>
    </div>
  </footer>
);

export default Footer;
