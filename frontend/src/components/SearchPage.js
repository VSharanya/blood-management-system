import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import api from '../api'; // ✅ centralized axios instance
import './SearchPage.css';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState({ lat: -3.745, lng: -38.523 });
  const [city, setCity] = useState('');
  const [useMap, setUseMap] = useState(false);
  const [donors, setDonors] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!bloodGroup || (!useMap && !city)) {
      alert('⚠️ Please provide both a blood group and a location (city or map).');
      return;
    }

    const params = {
      bloodGroup,
      ...(useMap ? { lat: location.lat, lng: location.lng } : { city }),
    };

    try {
      setLoading(true);

      // ✅ Use centralized API for Docker-safe calls
      const donorResponse = await api.get('/api/search/donors', { params });
      setDonors(donorResponse.data || []);

      const bloodBankResponse = await api.get('/api/search/bloodbanks', { params });
      setBloodBanks(bloodBankResponse.data || []);
    } catch (error) {
      console.error('Error fetching search results:', error);
      alert('❌ Failed to fetch results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (e) =>
    setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-danger">Search for Blood Donors and Blood Banks</h2>
        <Link to="/emergency" className="btn btn-danger">
          Emergency Request
        </Link>
      </div>

      {/* Search Inputs */}
      <div className="mb-3">
        <label className="form-label">Blood Group:</label>
        <input
          type="text"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value.toUpperCase())}
          className="form-control"
          placeholder="e.g. A+, B-, O+"
          required
        />
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          checked={useMap}
          onChange={(e) => setUseMap(e.target.checked)}
          className="form-check-input"
          id="useMap"
        />
        <label htmlFor="useMap" className="form-check-label">
          Use Map for Location
        </label>
      </div>

      {useMap ? (
        <div className="mb-3">
          <label className="form-label">Select Location:</label>
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
      ) : (
        <div className="mb-3">
          <label className="form-label">City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="form-control"
            placeholder="Enter your city"
            required
          />
        </div>
      )}

      <div className="d-grid mb-4">
        <button
          onClick={handleSearch}
          className="btn btn-danger fw-bold"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Donor Results */}
      <div>
        <h3 className="text-primary">Donors</h3>
        {donors.length === 0 ? (
          <p className="text-muted">No donors found.</p>
        ) : (
          <ul className="list-group mb-4">
            {donors.map((donor) => (
              <li
                key={donor._id}
                className="list-group-item shadow-sm mb-2 rounded"
              >
                <p><strong>Name:</strong> {donor.name.substring(0, 1)}****</p>
                <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
                <p>
                  <strong>Availability:</strong>{' '}
                  {donor.availability ? (
                    <span className="text-success">Available</span>
                  ) : (
                    <span className="text-danger">Unavailable</span>
                  )}
                </p>
                <p>
                  <strong>Contact:</strong>{' '}
                  <a href={`tel:${donor.contactNumber}`}>
                    {donor.contactNumber}
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${donor.email}`}>{donor.email}</a>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Blood Bank Results */}
      <div>
        <h3 className="text-primary">Blood Banks</h3>
        {bloodBanks.length === 0 ? (
          <p className="text-muted">No blood banks found.</p>
        ) : (
          <ul className="list-group">
            {bloodBanks.map((bank) => (
              <li
                key={bank._id}
                className="list-group-item shadow-sm mb-2 rounded"
              >
                <p><strong>Name:</strong> {bank.name}</p>
                <p>
                  <strong>Contact:</strong>{' '}
                  <a href={`tel:${bank.contactNumber}`}>
                    {bank.contactNumber}
                  </a>
                </p>
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${bank.email}`}>{bank.email}</a>
                </p>
                <p><strong>Address:</strong> {bank.address}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
