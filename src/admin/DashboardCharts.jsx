import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import './DashboardCharts.css';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function DashboardCharts() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data());
      setBookings(data);
    });
    return () => unsub();
  }, []);

  // === Prepare data for Line Chart ===
  const bookingsPerDay = bookings.reduce((acc, curr) => {
    const date = curr.date || curr.time?.split('T')[0];
    if (!date) return acc;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const lineData = {
    labels: Object.keys(bookingsPerDay),
    datasets: [{
      label: 'Bookings Per Day',
      data: Object.values(bookingsPerDay),
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      tension: 0.4,
      fill: true
    }]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true
      }
    }
  };

  // === Prepare data for Pie Chart ===
  const typeCounts = bookings.reduce((acc, curr) => {
    const type = curr.type || 'BLS';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(typeCounts),
    datasets: [{
      label: 'Ambulance Type Distribution',
      data: Object.values(typeCounts),
      backgroundColor: ['#2196f3', '#ff9800', '#e91e63']
    }]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return (
    <div className="charts-container">
      <h2>Booking Analytics</h2>

      <div className="chart-box">
        <Line data={lineData} options={lineOptions} />
      </div>

      <div className="chart-box pie-chart">
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>
  );
}
