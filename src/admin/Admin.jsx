import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminDashboard from './AdminDashboard';
import DashboardCharts from './DashboardCharts';

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Use AdminLayout to wrap all admin-related pages */}
      <Route path="/admin-dashboard" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="charts" element={<DashboardCharts />} />
        {/* Add more nested routes here if needed */}
      </Route>

      {/* Optional: Redirect legacy route */}
      <Route path="/admin" element={<Navigate to="/admin-dashboard" replace />} />
    </Routes>
  );
}
