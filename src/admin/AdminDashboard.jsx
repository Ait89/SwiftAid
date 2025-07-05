import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (!user || user.email !== "admin@swiftaid.com") {
      navigate("/");
    } else {
      fetchBookings();
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchBookings = async () => {
    const querySnapshot = await getDocs(collection(db, "bookings"));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBookings(data);
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const data = querySnapshot.docs.map(doc => doc.data());
    setUsers(data);
  };

  const deleteBooking = async (id) => {
    await deleteDoc(doc(db, "bookings", id));
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const startEditing = (booking) => {
    setEditingId(booking.id);
    setEditData(booking);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    await updateDoc(doc(db, "bookings", editingId), editData);
    setEditingId(null);
    fetchBookings();
  };

  return (
    <div className="admin-dashboard">
      <h2>Welcome, Admin 👩‍⚕️</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{bookings.filter(b => b.type === "ALS").length}</h3>
          <p>ALS Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{bookings.filter(b => b.type === "BLS").length}</h3>
          <p>BLS Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{bookings.filter(b => b.type === "ICU").length}</h3>
          <p>ICU Bookings</p>
        </div>
      </div>

      <div className="table-section">
        <h3>Recent Bookings</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.slice(-5).reverse().map((b, i) => (
              <tr key={b.id}>
                <td>
                  {editingId === b.id ? (
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                    />
                  ) : (
                    b.name
                  )}
                </td>
                <td>
                  {editingId === b.id ? (
                    <input
                      name="phone"
                      value={editData.phone || editData.contact}
                      onChange={handleEditChange}
                    />
                  ) : (
                    b.phone || b.contact
                  )}
                </td>
                <td>
                  {editingId === b.id ? (
                    <input
                      name="location"
                      value={editData.location || editData.address}
                      onChange={handleEditChange}
                    />
                  ) : (
                    b.location || b.address
                  )}
                </td>
                <td>
                  {editingId === b.id ? (
                    <input
                      name="date"
                      value={editData.date || b.time?.split("T")[0]}
                      onChange={handleEditChange}
                    />
                  ) : (
                    b.date || b.time?.split("T")[0]
                  )}
                </td>
                <td>
                  {editingId === b.id ? (
                    <input
                      name="time"
                      value={editData.time?.split("T")[1] || b.time}
                      onChange={handleEditChange}
                    />
                  ) : (
                    b.time?.split("T")[1] || b.time
                  )}
                </td>
                <td>
                  {editingId === b.id ? (
                    <select
                      name="type"
                      value={editData.type}
                      onChange={handleEditChange}
                    >
                      <option value="BLS">BLS</option>
                      <option value="ALS">ALS</option>
                      <option value="ICU">ICU</option>
                    </select>
                  ) : (
                    b.type
                  )}
                </td>
                <td>
                  {editingId === b.id ? (
                    <button onClick={saveEdit}>💾 Save</button>
                  ) : (
                    <>
                      <button onClick={() => startEditing(b)}>✏️ Edit</button>
                      <button onClick={() => deleteBooking(b.id)}>🗑️ Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
