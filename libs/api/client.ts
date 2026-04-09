import axios, { AxiosInstance } from 'axios';

// Configuration - adjust based on your backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";
console.log('API Base URL:', API_BASE_URL);

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from storage or zustand
    try {
      // Import here to avoid circular dependency
      const { useAuthStore } = require('@/libs/stores/auth-store');
      const token = useAuthStore.getState()?.authToken;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // Fallback if store is not available
      console.debug('Could not get token from store');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      try {
        const { useAuthStore } = require('@/libs/stores/auth-store');
        useAuthStore.getState().clearAuth();
      } catch (e) {
        console.error('Could not clear auth', e);
      }
    }
    
    if (error.response?.status === 403) {
      // Handle forbidden
      console.error('Access forbidden');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
