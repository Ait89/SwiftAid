import React from 'react';
import './AboutSection.css';

export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-card">
        <h2>About SWIFTAID</h2>
        <p>
          SWIFTAID is a fast and reliable online ambulance booking service committed to providing
          timely medical transport across Kolkata. We aim to reduce emergency response time by
          making ambulance access as easy as a click.
        </p>
      </div>
      <div className="about-card">
        <h2>Why Choose Us?</h2>
        <p>
          Our network of ambulances includes BLS, ALS, and ICU-equipped vehicles. We operate
          24x7 and ensure that each booking is tracked, monitored, and supported by experienced
          dispatch coordinators.
        </p>
      </div>
    </section>
  );
}
