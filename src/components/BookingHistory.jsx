import React, { useEffect, useState } from 'react';
import './BookingHistory.css';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBookings(parsed);
        }
      } catch (err) {
        console.error('Error parsing booking data:', err);
      }
    }
  }, []);

  const deleteBooking = (indexToDelete) => {
    const updatedBookings = bookings.filter((_, index) => index !== indexToDelete);
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  return (
    <div className="history-page">
      <h2>Booking History</h2>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="history-list">
          {bookings.map((booking, index) => (
            <div className="history-card" key={index}>
              <h3>{booking.name}</h3>
              <p><strong>Phone:</strong> {booking.phone}</p>
              <p><strong>Location:</strong> {booking.location}</p>
              <p><strong>Date:</strong> {booking.date}</p>
              <p><strong>Time:</strong> {booking.time}</p>
              <p><strong>Type:</strong> {booking.type}</p>
              <button
                className="delete-btn"
                onClick={() => deleteBooking(index)}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
