// src/services/api/categoryApi.js
import api from './api';

export const getCategories = async () => {
  try {
    const response = await api.get('/user/categories');
    
    
    return response.data;
  } catch (error) {
    console.error('❌ getCategories error:', error);
    throw error;
  }
};