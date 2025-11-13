import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import api from '../api'; // ✅ centralized axios instance
import './RegistrationForm.css';
import { useHistory } from 'react-router-dom';

const RegistrationForm = () => {
  const history = useHistory();
  const [role, setRole] = useState('Donor');
  const [location, setLocation] = useState({ lat: -3.745, lng: -38.523 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bloodGroup: '',
    contactNumber: '',
    city: '',
    age: '',
    height: '',
    weight: '',
    medicalHistory: ''
  });

  // ✅ Handle input and map changes
  const handleRoleChange = (e) => setRole(e.target.value);
  const handleMapClick = (e) =>
    setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        role,
        location: {
          type: 'Point',
          coordinates: [location.lat, location.lng],
        },
      };

      const response = await api.post('/auth/register', data); // ✅ Docker-safe call

      if (response.data.success) {
        alert('✅ Registration successful!');
        if (role === 'Donor') {
          history.push('/login');
        } else {
          history.push('/login1');
        }
      } else {
        alert(response.data.message || '❌ Registration failed.');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('❌ Failed to register. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="registration-form shadow p-4 rounded">
      <h2 className="text-center text-danger mb-4">User Registration</h2>

      {/* User Role */}
      <div className="mb-3">
        <label>User Role:</label>
        <select value={role} onChange={handleRoleChange} className="form-select">
          <option value="Donor">Donor</option>
          <option value="Recipient">Recipient</option>
        </select>
      </div>

      {/* Common Fields */}
      <div className="mb-3">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      {/* Donor-Specific Fields */}
      {role === 'Donor' && (
        <>
          <div className="mb-3">
            <label>Blood Group:</label>
            <input
              type="text"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Contact Number:</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Height (cm):</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Weight (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Medical History:</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
        </>
      )}

      {/* City */}
      <div className="mb-3">
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className="form-control"
        />
      </div>

      {/* Map Location */}
      <div className="mb-4">
        <label>Location:</label>
        <LoadScript googleMapsApiKey="AIzaSyDYX1z_uYqxul9vFigEnOLB60Xbi0ergMI">
          <GoogleMap
            mapContainerStyle={{ height: '400px', width: '100%' }}
            center={location}
            zoom={10}
            onClick={handleMapClick}
          >
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="d-grid">
        <button type="submit" className="btn btn-danger fw-bold">
          Register
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;
