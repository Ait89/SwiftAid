import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>SWIFTAID</h3>
        <p>Providing 24/7 emergency ambulance service with just one click.</p>
        <p>📍 Kolkata, India | 📞 1800-112-911 | ✉️ support@swiftaid.in</p>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SWIFTAID. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
