import axios from 'axios';

// 1. Determine Base URL
// Checks Vite env, CRA env, or falls back to localhost
const BASE_URL = 
  import.meta.env.VITE_API_URL || 
  process.env.REACT_APP_API_URL || 
  'http://localhost:5000/api';

// 2. Create Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Request Interceptor
// Automatically attaches the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Check LocalStorage AND SessionStorage to ensure compatibility
    const adminToken = localStorage.getItem('admin-token') || sessionStorage.getItem('admin-token');
    const studentToken = localStorage.getItem('student-token') || sessionStorage.getItem('student-token');

    // Use Admin token if available, otherwise Student token
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

// 4. Response Interceptor (Optional but recommended)
// Handles global responses or errors (like 401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: You can trigger a logout here if needed
      console.warn("Unauthorized: Token may be invalid or expired.");
    }
    return Promise.reject(error);
  }
);

export default api;