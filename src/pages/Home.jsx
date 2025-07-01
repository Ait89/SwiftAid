import './Home.css';
import { Link } from 'react-router-dom';
import AmbulanceCards from '../components/AmbulanceCards';
import AboutSection from '../components/AboutSection'; // Add the about section

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero-section">
        <img
          src="/src/assets/operation.jpg"
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

      {/* About Section */}
      <AboutSection />
    </div>
  );
}
