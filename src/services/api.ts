import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.message || 'An error occurred';
      
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear session and redirect to login
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('adminAuthenticated');
          sessionStorage.removeItem('userLoggedIn');
          window.location.href = '/';
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Access forbidden:', errorMessage);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', errorMessage);
          break;
        default:
          console.error('API error:', errorMessage);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;