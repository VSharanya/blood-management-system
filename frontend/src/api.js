import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // ✅ Host-level access for your browser
});

export default api;
