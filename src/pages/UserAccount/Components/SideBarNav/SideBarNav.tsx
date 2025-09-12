import "./SideBarNav.scss";
import { NavLink } from "react-router-dom";

function SideBarNav() {
    return(
        <nav className="sidebar-nav">
            <h2>Mon Compte</h2>
            <div>
                <ul>
                    <li><NavLink to="/account" className={({ isActive }) => (isActive ? "active" : "")}>Mes informations</NavLink></li>
                    <li><NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>Préférences de communication</NavLink></li>
                    <li><NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>Mes devices</NavLink></li>
                    <li><NavLink to="/logout" className={({ isActive }) => (isActive ? "active" : "")}>Mes marques</NavLink></li>
                </ul>
                <ul>
                    <li><NavLink to="/help">FAQ</NavLink></li>
                    <li><NavLink to="/contact">Nous contacter</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

export default SideBarNav;