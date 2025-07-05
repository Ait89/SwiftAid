import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaBars, FaChartBar, FaTachometerAlt } from 'react-icons/fa';
import './AdminDashboard.css';

export default function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-container">
      <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            <FaBars />
          </button>
        </div>
        <nav>
          <Link to="/admin-dashboard" className={location.pathname === '/admin-dashboard' ? 'active' : ''}>
            <FaTachometerAlt /> {!collapsed && 'Dashboard'}
          </Link>
          <Link to="/admin-dashboard/charts" className={location.pathname === '/admin-dashboard/charts' ? 'active' : ''}>
            <FaChartBar /> {!collapsed && 'Charts'}
          </Link>
        </nav>
      </aside>

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
