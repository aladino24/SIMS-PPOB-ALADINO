import { NavLink } from "react-router-dom";
import logo from "../assets/Logo.png"

function Navbar() {
  return (
    <div className="navbar">

      <div className="logo-section">
        <img src={logo} alt="logo" className="logo-img" />
        <NavLink to="/dashboard" className="logo-link">
           <span className="logo-text">SIMS PPOB</span>
        </NavLink>
       
      </div>

      <div className="menu">
        <NavLink to="/topup" className="menu-link">
          Top Up
        </NavLink>

        <NavLink to="/transaction" className="menu-link">
          Transaction
        </NavLink>

        <NavLink to="/akun" className="menu-link">
          Akun
        </NavLink>
      </div>

    </div>
  );
}

export default Navbar;