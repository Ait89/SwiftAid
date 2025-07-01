import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import BookAmbulance from './pages/BookAmbulance';
import BookingHistory from './components/BookingHistory';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />

        <main style={{ minHeight: 'calc(100vh - 200px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookAmbulance />} />
          
            <Route path="/history" element={<BookingHistory />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
