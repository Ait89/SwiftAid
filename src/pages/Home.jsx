import './Home.css';
import { Link } from 'react-router-dom';
import AmbulanceCards from '../components/AmbulanceCards';
import AboutSection from '../components/AboutSection';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="home">
      <div className="hero-section">
        <img
          src="/operation.jpg"
          alt="Operation Theatre"
          className="hero-image"
        />
        <div className="hero-overlay">
          <div className="hero-text" style={{ marginBottom: '2rem' }}>
            <h2>Welcome to SWIFTAID</h2>
            <p>Your fast and reliable ambulance booking service.</p>
            <Link to="/book" className="book-btn">Book an Ambulance</Link>

            
          </div>
          <AmbulanceCards />
        </div>
      </div>

      <AboutSection />
    </div>
  );
}