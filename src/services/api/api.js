// src/services/api/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - Update this to match your setup
const BASE_URL = 'http://192.168.1.72:5002/api';
export const Image_BASE_URL = 'http://192.168.1.72:5002';

// Helper function to get full image URL
export const getImageUrl = (path) => {
  if (!path) return null;
  // If path already starts with http, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // If path starts with /uploads/, keep as is
  if (path.startsWith('/uploads/')) {
    return `${Image_BASE_URL}${path}`;
  }
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${Image_BASE_URL}/${cleanPath}`;
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor - Add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        // Navigate to login if needed
      } catch (clearError) {
        console.error('Error clearing token:', clearError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;