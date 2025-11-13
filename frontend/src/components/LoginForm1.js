import React, { useState } from 'react';
import api from '../api'; // ✅ use centralized axios instance
import { GoogleLogin } from 'react-google-login';
import './LoginForm.css';

const LoginForm1 = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  // ✅ Handle text input change
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Handle regular login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData); // 👈 Uses backend service name (blood-backend)

      if (response.data.success) {
        alert('✅ Login successful!');
        localStorage.setItem('token', response.data.token);
        window.location.href = '/search'; // Redirect after login
      } else {
        alert(response.data.message || '❌ Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('❌ Login failed. Please try again.');
    }
  };

  // ✅ Handle Google login success
  const handleGoogleSuccess = async (response) => {
    const token = response.tokenId;
    try {
      const res = await api.post('/auth/google', { token });
      if (res.data.success) {
        alert('✅ Google login successful!');
        localStorage.setItem('token', res.data.token);
        window.location.href = '/search';
      } else {
        alert(res.data.message || '❌ Google login failed.');
      }
    } catch (error) {
      console.error('Error with Google login:', error);
      alert('❌ Google login failed. Please try again.');
    }
  };

  // ✅ Handle Google login failure
  const handleGoogleFailure = (response) => {
    console.error('Google login failed:', response);
    alert('❌ Google login failed.');
  };

  return (
    <form onSubmit={handleSubmit} className="login-form shadow p-4 rounded">
      <h2 className="text-danger text-center mb-4">Login</h2>

      <div className="mb-3">
        <label className="form-label">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="d-grid mb-3">
        <button type="submit" className="btn btn-danger fw-bold">
          Login
        </button>
      </div>

      <div className="text-center mt-3">
        <GoogleLogin
          clientId="REMOVED_SECRET"
          buttonText="Login with Google"
          onSuccess={handleGoogleSuccess}
          onFailure={handleGoogleFailure}
          cookiePolicy={'single_host_origin'}
        />
      </div>
    </form>
  );
};

export default LoginForm1;
