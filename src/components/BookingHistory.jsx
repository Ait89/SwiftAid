import React, { useEffect, useState } from 'react';
import './BookingHistory.css';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [user] = useAuthState(auth);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(results);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [user]);

  const deleteBooking = async (id) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const startEditing = (booking) => {
    setEditingId(booking.id);
    setEditData(booking);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    try {
      await updateDoc(doc(db, 'bookings', editingId), editData);
      setEditingId(null);
      const updated = bookings.map((b) =>
        b.id === editingId ? { ...editData, id: editingId } : b
      );
      setBookings(updated);
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  const extractTime = (timeValue) => {
    if (!timeValue) return '—';
    if (timeValue.includes('T')) return timeValue.split('T')[1]; // ISO string
    return timeValue; // Already plain time like "15:30"
  };

  const extractDate = (dateValue, timeValue) => {
    if (dateValue) return dateValue;
    if (timeValue && timeValue.includes('T')) return timeValue.split('T')[0];
    return '—';
  };

  return (
    <div className="history-page">
      <h2>Booking History</h2>

      {!user ? (
        <p>Please log in to view your bookings.</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="history-list">
          {bookings.map((booking) => (
            <div className="history-card" key={booking.id}>
              {editingId === booking.id ? (
                <>
                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                  />
                  <input
                    name="phone"
                    value={editData.phone || editData.contact}
                    onChange={handleEditChange}
                  />
                  <input
                    name="location"
                    value={editData.location || editData.address}
                    onChange={handleEditChange}
                  />
                  <input
                    name="date"
                    type="date"
                    value={extractDate(editData.date, editData.time)}
                    onChange={handleEditChange}
                  />
                  <input
                    name="time"
                    type="time"
                    value={extractTime(editData.time)}
                    onChange={handleEditChange}
                  />
                  <select
                    name="type"
                    value={editData.type || 'BLS'}
                    onChange={handleEditChange}
                  >
                    <option value="BLS">BLS</option>
                    <option value="ALS">ALS</option>
                    <option value="ICU">ICU</option>
                  </select>
                  <button onClick={saveEdit}>💾 Save</button>
                </>
              ) : (
                <>
                  <h3>{booking.name}</h3>
                  <p><strong>Phone:</strong> {booking.phone || booking.contact}</p>
                  <p><strong>Location:</strong> {booking.location || booking.address}</p>
                  <p><strong>Date:</strong> {extractDate(booking.date, booking.time)}</p>
                  <p><strong>Time:</strong> {extractTime(booking.time)}</p>
                  <p><strong>Type:</strong> {booking.type || 'BLS'}</p>
                  <button
                    className="delete-btn"
                    onClick={() => deleteBooking(booking.id)}
                  >
                    🗑️ Delete
                  </button>
                  <button onClick={() => startEditing(booking)}>✏️ Edit</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
