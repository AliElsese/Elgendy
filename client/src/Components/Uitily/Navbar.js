import React from "react";
import "./Navbar.css";
import LogoutButton from "./LogoutButton";
import { HiMenuAlt3 } from "react-icons/hi";
import { Link } from "react-router-dom";

const Navbar = ({ isHome, isMenuActive, handleMenu }) => {
  return (
    <nav className={isHome === true ? "mainnav nav-trans" : "mainnav"}>
      <div className="container-fluid d-flex  justify-content-between align-items-center">
        <div>
          <Link to="/home" className="logo-brand">
            light group
          </Link>
          {isHome === true ? null : (
            <div className="icon">
              <HiMenuAlt3 onClick={handleMenu} />
            </div>
          )}
        </div>
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;
