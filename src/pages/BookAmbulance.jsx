import React, { useState } from 'react';
import './BookAmbulance.css';

export default function BookAmbulance() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    date: '',
    time: '',
    type: 'BLS'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Fetch previous bookings (or empty array)
    const previousBookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Add current form data
    const updatedBookings = [...previousBookings, formData];

    // Store in localStorage
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));

    alert(`🚑 Ambulance booked successfully for ${formData.name}`);

    // Reset form
    setFormData({
      name: '',
      phone: '',
      location: '',
      date: '',
      time: '',
      type: 'BLS'
    });
  };

  const handleEmergency = () => {
    alert('🚨 Emergency request sent! Dispatching the nearest ambulance.');
  };

  return (
    <div className="booking-page">
      <h2>Book an Ambulance</h2>
      <form className="booking-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            placeholder="Patient Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone Number:
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Pickup Location:
          <input
            type="text"
            name="location"
            placeholder="Address or Landmark"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Time:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Ambulance Type:
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            <option value="BLS">Basic Life Support (BLS)</option>
            <option value="ALS">Advanced Life Support (ALS)</option>
            <option value="ICU">ICU Ambulance</option>
          </select>
        </label>

        <button type="submit">Confirm Booking</button>
      </form>

      <button className="emergency-btn" onClick={handleEmergency}>
        🚨 Emergency
      </button>
    </div>
  );
}
