import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>🚑SWIFTAID</h1>
      <div>
        <Link to="/">Home</Link>
        <Link to="/book">Book Ambulance</Link>
        <Link to="/history">Booking History</Link>
      </div>
    </nav>
  );
}
