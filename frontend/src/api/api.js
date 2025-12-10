// --- START OF FILE src/api/api.js ---
import axios from 'axios';

// Detect the environment variable based on the build tool (Vite vs CRA)
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
    // Check for Admin Token first
    const adminToken = sessionStorage.getItem('admin-token');
    // Check for Student Token second
    const studentToken = sessionStorage.getItem('student-token');

    // Use whichever token is available
    const token = adminToken || studentToken;

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