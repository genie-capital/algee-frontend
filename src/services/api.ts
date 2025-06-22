import axios from 'axios';
import { API_BASE_URL } from '../config';
import { isTokenExpired, clearAuthSession, getCurrentToken } from '../utils/tokenUtils';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = getCurrentToken();
    if (token) {
      // Check if token is expired before making request
      if (isTokenExpired(token)) {
        console.log('Token expired before request, clearing session');
        clearAuthSession();
        // Redirect to login page
        window.location.href = '/';
        return Promise.reject(new Error('Token expired'));
      }
      
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
      const status = error.response.status;
      
      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - token is invalid, expired, or missing
          console.error('Authentication failed:', errorMessage);
          clearAuthSession();
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('login') && window.location.pathname !== '/') {
            window.location.href = '/';
          }
          break;
        case 403:
          // Forbidden - user doesn't have permission or account is inactive
          console.error('Access forbidden:', errorMessage);
          // For inactive account, clear session and redirect
          if (errorMessage.includes('deactivated') || errorMessage.includes('inactive')) {
            clearAuthSession();
            window.location.href = '/';
          }
          break;
        case 404:
          // Not found
          console.error('Resource not found:', errorMessage);
          break;
        case 422:
          // Validation error
          console.error('Validation error:', errorMessage);
          break;
        case 429:
          // Rate limiting
          console.error('Rate limit exceeded:', errorMessage);
          break;
        case 500:
          // Internal server error
          console.error('Server error:', errorMessage);
          break;
        default:
          console.error('API error:', errorMessage);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      // This could be a network error
      if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
        console.error('Network error - server may be down');
      }
    } else if (error.message === 'Token expired') {
      // Handle our custom token expiration error
      return Promise.reject(error);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;