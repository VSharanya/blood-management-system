import React, { useState } from 'react';
import api from '../api'; // ✅ use centralized axios instance
import './FeedbackForm.css';

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to submit feedback.');
        return;
      }

      // ✅ Safely decode JWT (handles invalid tokens too)
      let userId = null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id;
      } catch (err) {
        console.error('Error decoding token:', err);
        alert('Invalid session. Please log in again.');
        return;
      }

      const response = await api.post(
        '/api/feedback',
        { userId, feedback, rating },
        { headers: { Authorization: token } } // ✅ include token in headers
      );

      alert(response.data.message || 'Feedback submitted successfully!');
      setFeedback('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('❌ Failed to submit feedback. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="feedback-form">
      <h2>Leave Feedback</h2>
      <div>
        <label>Feedback:</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Rating:</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          min="1"
          max="5"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default FeedbackForm;
