// src/services/api/apiUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

// Get stored token
export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

// Set token
export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);
    console.log('Token stored successfully');
    return true;
  } catch (error) {
    console.error('Error storing token:', error);
    return false;
  }
};

// Remove token (logout)
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log('Token removed successfully');
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

// Check if authenticated
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  } catch (error) {
    return false;
  }
};

// API call wrapper with error handling
export const apiCall = async (method, url, data = null) => {
  try {
    const response = await api({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    // Format error for consistent handling
    const formattedError = {
      message: error.response?.data?.message || error.message || 'Something went wrong',
      status: error.response?.status,
      data: error.response?.data,
    };
    throw formattedError;
  }
};

// GET helper
export const get = (url) => apiCall('GET', url);

// POST helper
export const post = (url, data) => apiCall('POST', url, data);

// PUT helper
export const put = (url, data) => apiCall('PUT', url, data);

// DELETE helper
export const del = (url) => apiCall('DELETE', url);