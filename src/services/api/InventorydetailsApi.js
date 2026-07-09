import api from './api';

export const getInventories = async (
  categoryId,
  inventoryTypeId,
  page = 1,
  limit = 10,
) => {
  try {
    const response = await api.get('/user/inventory', {
      params: {
        category: categoryId,
        inventoryType: inventoryTypeId,
        page,
        limit,
      },
    });

    return response.data;
  } catch (error) {
    console.log('Get Inventory Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};



export const deleteInventory = async (inventoryId) => {
  try {
    const response = await api.delete(`/user/inventory/${inventoryId}`);
    return response.data;
  } catch (error) {
    console.log('Delete Inventory Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getInventryDetails = async (inventoryId ) => {
  try {

    // Use the correct endpoint with categoryId in the path
    const response = await api.get(`/user/inventory/${inventoryId }`);

    return response.data;
  } catch (error) {
    console.log(
      '❌ inventory  Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};