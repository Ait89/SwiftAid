import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Navbar.css";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const userInitials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "";

  return (
    <nav className="navbar">
      <h1>🚑 SWIFTAID</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/book">Book Ambulance</Link>
        <Link to="/history">Booking History</Link>

        {/* 👤 Auth Icon Section */}
        <div className="avatar-container" onClick={toggleDropdown}>
          {!user ? (
            <img
              src="https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
              alt="user"
              className="avatar"
            />
          ) : (
            <div className="avatar-initials">
              {user.email === "admin@swiftaid.com" ? "🛠️" : userInitials}
            </div>
          )}
          {dropdownOpen && (
            <div className="dropdown-menu">
              {!user ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              ) : user.email === "admin@swiftaid.com" ? (
                <>
                  <Link to="/admin-dashboard">Dashboard</Link>
                  <button onClick={logout}>Logout</button>
                </>
              ) : (
                <button onClick={logout}>Logout</button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
