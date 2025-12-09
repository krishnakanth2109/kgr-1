// --- START OF FILE api.js ---
import axios from 'axios';

// Detect the environment variable based on the build tool (Vite vs CRA)
// If you are using Vite, it uses import.meta.env.VITE_API_URL
// If using Create React App, it uses process.env.REACT_APP_API_URL
// Fallback to localhost if neither is found.
const BASE_URL = 
  import.meta.env.VITE_API_URL || 
  process.env.REACT_APP_API_URL || 
  'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Axios Interceptor: Adds the token to headers automatically if it exists
api.interceptors.request.use(
  (config) => {
    // Using sessionStorage as requested
    const token = sessionStorage.getItem('admin-token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;