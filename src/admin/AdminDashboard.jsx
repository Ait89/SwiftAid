
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [activeView, setActiveView] = useState("bookings");

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

    return matchType && matchSearch && matchStartDate;
  });

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this booking?");
    if (!confirm) return;
    await deleteDoc(doc(db, "bookings", id));
  };

  const handleEdit = (booking) => {
    setEditingId(booking.id);
    setEditForm({
      name: booking.name,
      phone: booking.phone,
      address: booking.address,
      date: booking.date,
      time: booking.time,
      type: booking.type
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id) => {
    await updateDoc(doc(db, "bookings", id), editForm);
    setEditingId(null);
  };

  return (
    <div className="admin-dashboard">
      <h2>Welcome, Admin 👩‍⚕️</h2>

      <div className="stats-grid">
        <div className="stat-card" onClick={() => setActiveView("bookings")}>
          <h3>{bookings.length}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card" onClick={() => setActiveView("users")}>
          <h3>{users.length}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card" onClick={() => setActiveView("BLS")}>
          <h3>BLS</h3>
          <p>{bookings.filter(b => b.type === 'BLS').length} Bookings</p>
        </div>
        <div className="stat-card" onClick={() => setActiveView("ALS")}>
          <h3>ALS</h3>
          <p>{bookings.filter(b => b.type === 'ALS').length} Bookings</p>
        </div>
        <div className="stat-card" onClick={() => setActiveView("ICU")}>
          <h3>ICU</h3>
          <p>{bookings.filter(b => b.type === 'ICU').length} Bookings</p>
        </div>
      </div>

      {activeView === "bookings" && (
        <>
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
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="table-section">
            <h3>Total Bookings</h3>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id}>
                      {editingId === b.id ? (
                        <>
                          <td><input name="name" value={editForm.name} onChange={handleEditChange} /></td>
                          <td><input name="phone" value={editForm.phone} onChange={handleEditChange} /></td>
                          <td><input name="address" value={editForm.address} onChange={handleEditChange} /></td>
                          <td><input name="date" type="date" value={editForm.date} onChange={handleEditChange} /></td>
                          <td><input name="time" value={editForm.time} onChange={handleEditChange} /></td>
                          <td>
                            <select name="type" value={editForm.type} onChange={handleEditChange}>
                              <option value="BLS">BLS</option>
                              <option value="ALS">ALS</option>
                              <option value="ICU">ICU</option>
                            </select>
                          </td>
                          <td>
                            <button className="action-btn save" onClick={() => handleEditSave(b.id)}>💾</button>
                            <button className="action-btn cancel" onClick={() => setEditingId(null)}>❌</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{b.name}</td>
                          <td>{b.phone}</td>
                          <td>{b.address}</td>
                          <td>{b.date}</td>
                          <td>{b.time}</td>
                          <td>{b.type}</td>
                          <td>
                            <button className="action-btn edit" onClick={() => handleEdit(b)}>✏️</button>
                            <button className="action-btn delete" onClick={() => handleDelete(b.id)}>🗑️</button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {["BLS", "ALS", "ICU"].includes(activeView) && (
        <div className="table-section">
          <h3>{activeView} Bookings</h3>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.filter(b => b.type === activeView).map(b => (
                  <tr key={b.id}>
                    <td>{b.name}</td>
                    <td>{b.phone}</td>
                    <td>{b.address}</td>
                    <td>{b.date}</td>
                    <td>{b.time}</td>
                    <td>{b.type}</td>
                    <td>
                      <button className="action-btn edit" onClick={() => handleEdit(b)}>✏️</button>
                      <button className="action-btn delete" onClick={() => handleDelete(b.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeView === "users" && (
        <div className="table-section">
          <h3>All Users</h3>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{u.address}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
