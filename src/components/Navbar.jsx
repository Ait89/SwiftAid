import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "";
    return nameOrEmail.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        setDropdownOpen(false);
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <nav className="navbar">
      <h1>🚑SWIFTAID</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/book">Book Ambulance</Link>
        <Link to="/history">Booking History</Link>

        <div className="auth-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {user ? (
            <div className="user-initials">
              {getInitials(user.displayName || user.email)}
            </div>
          ) : (
            <img src="/user-icon.jpg" alt="user" className="user-icon" />
          )}

          {dropdownOpen && (
            <div className="auth-dropdown">
              {user ? (
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              ) : (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
