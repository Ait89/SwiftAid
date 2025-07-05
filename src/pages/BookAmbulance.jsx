import React, { useState } from 'react';
import './BookAmbulance.css';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function BookAmbulance() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    date: '',
    time: '',
    type: 'BLS'
  });

  const [user] = useAuthState(auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please login to book an ambulance.');
      return;
    }

    try {
      const bookingData = {
        ...formData,
        userId: user.uid,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      alert(`🚑 Ambulance booked successfully for ${formData.name}`);

      setFormData({
        name: '',
        phone: '',
        location: '',
        date: '',
        time: '',
        type: 'BLS'
      });
    } catch (error) {
      console.error('Error booking ambulance:', error);
      alert('Something went wrong while booking.');
    }
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
