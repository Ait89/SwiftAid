import { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    time: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Ambulance booked for ${formData.name}`);
    localStorage.setItem('booking', JSON.stringify(formData));
    setFormData({ name: '', contact: '', address: '', time: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Patient Name" value={formData.name} onChange={handleChange} required />
      <input type="text" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required />
      <input type="text" name="address" placeholder="Pickup Address" value={formData.address} onChange={handleChange} required />
      <input type="datetime-local" name="time" value={formData.time} onChange={handleChange} required />
      <button type="submit">Book Now</button>
    </form>
  );
}