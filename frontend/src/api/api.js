import axios from 'axios';

// 1. Determine Base URL
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
api.interceptors.request.use(
  (config) => {
    // A. Detect Route Type
    const isStudentRoute = window.location.pathname.startsWith('/student');
    
    // B. Retrieve Tokens
    const adminToken = localStorage.getItem('admin-token');
    const studentToken = sessionStorage.getItem('student-token');

    let tokenToUse = null;

    // C. Smart Token Selection
    if (isStudentRoute) {
        // If on student pages, ONLY use student token
        tokenToUse = studentToken;
    } else {
        // If on admin/other pages, use Admin token
        // Fallback to student token only if admin is missing (rare case)
        tokenToUse = adminToken || studentToken;
    }

    // D. Attach Token if it exists and is not literal "null" string
    if (tokenToUse && tokenToUse !== 'null' && tokenToUse !== 'undefined') {
      config.headers['x-auth-token'] = tokenToUse;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized: The server rejected the token.");
      // Optional: Redirect to login if needed
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;