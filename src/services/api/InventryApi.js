
import api from './api';

export const createInventory = async (formData) => {
  try {
    console.log('API Request Data:', formData);
    const response = await api.post(`/user/inventory`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating inventory:', error);
    throw error.response?.data || error.message;
  }
};