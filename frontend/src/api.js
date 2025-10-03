import axios from 'axios';

// Create a new instance of axios with a base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// This is an Axios Interceptor. It's a powerful function that runs
// BEFORE any request is sent. Its job is to add the
// authentication token to the headers automatically.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin-token');
    if (token) {
      // The header name 'x-auth-token' MUST match what your
      // backend authMiddleware is expecting.
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;