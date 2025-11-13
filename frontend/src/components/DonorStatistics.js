import React, { useState, useEffect } from 'react';
import api from '../api'; // ✅ use centralized axios instance

const DonorStatistics = () => {
  const [donorData, setDonorData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/donor', {
          headers: { Authorization: token },
        });
        setDonorData(response.data);
      } catch (error) {
        console.error('Error fetching donor data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {donorData ? (
        <div>
          <h2>Donor Statistics</h2>
          <p>Number of Donations: {donorData.donations}</p>
          <p>
            Total Lives Impacted: {donorData.donations * 3}
          </p>
          {/* Assuming each donation impacts 3 lives */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DonorStatistics;
