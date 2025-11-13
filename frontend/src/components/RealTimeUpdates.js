import React, { useState, useEffect } from 'react';
import api from '../api'; // ✅ centralized axios instance

const RealTimeUpdates = () => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to view updates.');
          return;
        }

        const response = await api.get('/api/updates', {
          headers: { Authorization: token },
        });
        setUpdates(response.data);
      } catch (error) {
        console.error('Error fetching updates:', error);
        alert('❌ Failed to fetch updates. Please try again later.');
      }
    };

    fetchUpdates();

    // ✅ Optional: Poll for new updates every 10 seconds
    const interval = setInterval(fetchUpdates, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-danger text-center mb-4">Real-Time Updates</h2>
      <ul className="list-group">
        {updates.length > 0 ? (
          updates.map((update, index) => (
            <li key={index} className="list-group-item">
              {update.message}
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted text-center">
            No updates available yet.
          </li>
        )}
      </ul>
    </div>
  );
};

export default RealTimeUpdates;
