import React from 'react';
import { Link } from 'react-router-dom';
import './AmbulanceCards.css';
import { motion } from 'framer-motion';

export default function AmbulanceCards() {
  const ambulances = [
    {
      type: 'Basic Life Support (BLS)',
      description: 'Equipped with basic emergency medical equipment and used for non-critical patient transport.',
      icon: '🚑'
    },
    {
      type: 'Advanced Life Support (ALS)',
      description: 'Staffed with paramedics and advanced equipment like ECG, defibrillators, and medication.',
      icon: '💉'
    },
    {
      type: 'ICU Ambulance',
      description: 'Used for critically ill patients needing intensive care during transport with life-support systems.',
      icon: '🏥'
    }
  ];

  return (
    <div className="ambulance-cards">
      {ambulances.map((amb, index) => (
        <motion.div
          className="card"
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          <Link to="/book" className="card-link">
            <div className="icon">{amb.icon}</div>
            <h3>{amb.type}</h3>
            <p>{amb.description}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}