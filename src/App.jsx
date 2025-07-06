import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import BookAmbulance from './pages/BookAmbulance';
import BookingHistory from './components/BookingHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './admin/AdminLogin';

// Admin Layout and Pages
import AdminLayout from './admin/AdminLayout'; // Sidebar layout
import AdminDashboard from './admin/AdminDashboard'; // Default admin page
import DashboardCharts from './admin/DashboardCharts'; // Charts page

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookAmbulance />} />
            <Route path="/history" element={<BookingHistory />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Admin Routes (Nested inside AdminLayout with Sidebar) */}
            <Route path="/admin-dashboard" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="charts" element={<DashboardCharts />} />
            </Route>

            {/* Optional Redirect */}
            <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
