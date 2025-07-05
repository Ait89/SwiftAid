import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  query,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const checkRoleAndListen = async () => {
      if (!user) return;
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (!docSnap.exists() || docSnap.data().role !== "admin") {
        navigate("/");
        return;
      }

      const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
      });

      const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(data);
      });

      return () => {
        unsubBookings();
        unsubUsers();
      };
    };

    checkRoleAndListen();
  }, [user]);

  const filteredBookings = bookings.filter(b => {
    const matchType = typeFilter ? b.type === typeFilter : true;
    const matchSearch = search
      ? b.name?.toLowerCase().includes(search.toLowerCase()) ||
        b.phone?.includes(search)
      : true;
    const matchStartDate = startDate ? new Date(b.date) >= new Date(startDate) : true;
    const matchEndDate = endDate ? new Date(b.date) <= new Date(endDate) : true;

    return matchType && matchSearch && matchStartDate && matchEndDate;
  });

  const startEditing = (booking) => {
    setEditingId(booking.id);
    setEditData(booking);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    try {
      await updateDoc(doc(db, "bookings", editingId), editData);
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await deleteDoc(doc(db, "bookings", id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Welcome, Admin 👩‍⚕️</h2>

      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{filteredBookings.length}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{filteredBookings.filter(b => b.type === 'BLS').length}</h3>
          <p>BLS Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{filteredBookings.filter(b => b.type === 'ALS').length}</h3>
          <p>ALS Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{filteredBookings.filter(b => b.type === 'ICU').length}</h3>
          <p>ICU Bookings</p>
        </div>
      </div>
       <div className="filters">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="BLS">BLS</option>
          <option value="ALS">ALS</option>
          <option value="ICU">ICU</option>
        </select>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
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
            {filteredBookings.slice(-5).reverse().map((b) => (
              <tr key={b.id}>
                {editingId === b.id ? (
                  <>
                    <td><input name="name" value={editData.name} onChange={handleEditChange} /></td>
                    <td><input name="phone" value={editData.phone} onChange={handleEditChange} /></td>
                    <td><input name="location" value={editData.location} onChange={handleEditChange} /></td>
                    <td><input name="date" value={editData.date} onChange={handleEditChange} /></td>
                    <td><input name="time" value={editData.time} onChange={handleEditChange} /></td>
                    <td>
                      <select name="type" value={editData.type} onChange={handleEditChange}>
                        <option value="BLS">BLS</option>
                        <option value="ALS">ALS</option>
                        <option value="ICU">ICU</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={saveEdit}>💾</button>
                      <button onClick={() => setEditingId(null)}>✖️</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{b.name}</td>
                    <td>{b.phone}</td>
                    <td>{b.location}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>{b.type}</td>
                    <td>
                      <button onClick={() => startEditing(b)}>✏️</button>
                      <button onClick={() => deleteBooking(b.id)}>🗑️</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
