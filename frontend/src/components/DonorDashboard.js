import React, { useState, useEffect } from 'react';
import api from '../api'; // ✅ use centralized axios instance
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Link } from 'react-router-dom';

const DonorDashboard = () => {
  const [donorData, setDonorData] = useState(null);
  const [location, setLocation] = useState({ lat: -3.745, lng: -38.523 });
  const [availability, setAvailability] = useState(true);

  // ✅ Fetch donor data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/donor', {
          headers: { Authorization: token },
        });
        setDonorData(response.data);
        setLocation({
          lat: response.data.location.coordinates[0],
          lng: response.data.location.coordinates[1],
        });
        setAvailability(response.data.availability);
      } catch (error) {
        console.error('Error fetching donor data:', error);
      }
    };
    fetchData();
  }, []);

  // ✅ Toggle availability
  const handleAvailabilityChange = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(
        '/api/donor/availability',
        { availability: !availability },
        { headers: { Authorization: token } }
      );
      setAvailability(response.data.availability);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  // ✅ Update donor profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updatedData = {
        ...donorData,
        location: { type: 'Point', coordinates: [location.lat, location.lng] },
      };
      const response = await api.put('/api/donor/profile', updatedData, {
        headers: { Authorization: token },
      });
      setDonorData(response.data);
      alert('✅ Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  // ✅ Handle map click (update location)
  const handleMapClick = (e) => {
    setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
  };

  return (
    <div>
      {donorData ? (
        <div>
          <h2>Donor Dashboard</h2>
          <p><strong>Name:</strong> {donorData.name}</p>
          <p><strong>Blood Group:</strong> {donorData.bloodGroup}</p>
          <p><strong>City:</strong> {donorData.city}</p>
          <p><strong>Contact Number:</strong> {donorData.contactNumber}</p>
          <p><strong>Donations:</strong> {donorData.donations}</p>
          <p>
            <strong>Upcoming Donation:</strong>{' '}
            {donorData.upcomingDonations
              ? new Date(donorData.upcomingDonations).toLocaleDateString()
              : 'None'}
          </p>

          <button onClick={handleAvailabilityChange}>
            {availability ? 'Set as Unavailable' : 'Set as Available'}
          </button>

          <Link to="/statistics" className="btn btn-primary m-2">
            Donor Statistics
          </Link>

          <form onSubmit={handleProfileUpdate}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={donorData.name}
                onChange={(e) =>
                  setDonorData({ ...donorData, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Email:</label>
              <input
                type="email"
                value={donorData.email}
                onChange={(e) =>
                  setDonorData({ ...donorData, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Blood Group:</label>
              <input
                type="text"
                value={donorData.bloodGroup}
                onChange={(e) =>
                  setDonorData({ ...donorData, bloodGroup: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Contact Number:</label>
              <input
                type="text"
                value={donorData.contactNumber}
                onChange={(e) =>
                  setDonorData({ ...donorData, contactNumber: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>City:</label>
              <input
                type="text"
                value={donorData.city}
                onChange={(e) =>
                  setDonorData({ ...donorData, city: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label>Location:</label>
              <LoadScript googleMapsApiKey="AIzaSyDYX1z_uYqxul9vFigEnOLB60Xbi0ergMI">
                <GoogleMap
                  mapContainerStyle={{ height: '400px', width: '550px' }}
                  center={location}
                  zoom={10}
                  onClick={handleMapClick}
                >
                  <Marker position={location} />
                </GoogleMap>
              </LoadScript>
            </div>

            <button type="submit">Update Profile</button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DonorDashboard;
