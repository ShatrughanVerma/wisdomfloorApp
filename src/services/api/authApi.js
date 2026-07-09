// src/services/api/authApi.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export const loginUser = async (username, password) => {
  try {
    console.log('================ LOGIN API ================');

    const response = await api.post('/user/auth/login', {
      username,
      password,
    });

    console.log('✅ Login Response:', response.data);

    const { token, user } = response.data;

    // Store token
    if (token) {
      await AsyncStorage.setItem('token', token);
      console.log('✅ Token Stored');
    }

    // Store user details (Optional)
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('✅ User Stored');
    }

    return response.data;
  } catch (error) {
    console.log('❌ Login Error:', error?.response?.data || error.message);
    throw error;
  }
};

// Get Token
export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

// Get User
export const getUser = async () => {
  const user = await AsyncStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Logout
export const logoutUser = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};