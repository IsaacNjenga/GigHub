import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import "../assets/css/navbarCss/navbar.css";
import gighub from "../assets/icons/gighub.png";
import OnlineIndicator from "./onlineIndicator";

function Navbar() {
  const { user, isOnline } = useContext(UserContext);
  return (
    <div className="navbar">
      <div className="navbar-left">
        <img src={gighub} alt="gighub_logo" className="logo" />
        <Link to="/" className="navbar-link">
          GigHub
        </Link>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/profile" className="navbar-link">
              {user.username.replace(/^./, user.username[0].toUpperCase())}{" "}
              {isOnline && <OnlineIndicator />}
            </Link>
            <Link to="/dashboard" className="navbar-link">
              Dashboard
            </Link>
            <Link to="/gigs" className="navbar-link">
              Gigs
            </Link>
            <Link to="/chats" className="navbar-link">
              Chats
            </Link>
            <Link to="/reviews" className="navbar-link">
              Reviews
            </Link>
            {user.role === "Admin" ? (
              <Link to="/reports" className="navbar-link">
                Reports
              </Link>
            ) : null}
            <Link to="/logout" className="navbar-link">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/register" className="navbar-link">
              Register
            </Link>
            <Link to="/login" className="navbar-link">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
