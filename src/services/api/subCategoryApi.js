// src/services/api/subCategoryApi.js
import api from './api';


export const getinventoryCategories = async () => {
  try {
    const response = await api.get('/user/inventory-categories');
    console.log("-------------------------/////////////////-", response.data);
    return response.data;
  } catch (error) {
    console.error('❌ getCategories error:', error.message);
    console.error('❌ Failed URL:', error.config?.baseURL, error.config?.url); // 👈 add this
    console.error('❌ Status:', error.response?.status); // 👈 add this
    throw error;
  }
}; 

// Get subcategories for a specific category (using the new endpoint)
export const getSubCategories = async (categoryId) => {
  try {
    console.log('Fetching subcategories for category:', categoryId);

    // Use the correct endpoint with categoryId in the path
    const response = await api.get(`/user/inventory-categories/${categoryId}/subcategories`);

    console.log('✅ SubCategory Response:', response.data);

    return response.data;
  } catch (error) {
    console.log(
      '❌ SubCategory Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// Get a single subcategory by ID
export const getSubCategoryById = async (subCategoryId) => {
  try {
    console.log('Fetching subcategory by ID:', subCategoryId);

    const response = await api.get(`/user/inventory-subcategories/${subCategoryId}`);

    console.log('✅ SubCategory Details:', response.data);

    return response.data;
  } catch (error) {
    console.log(
      '❌ Get SubCategory By ID Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// Create a new subcategory
export const createSubCategory = async (subCategoryData) => {
  try {
    console.log('Creating subcategory with data:', subCategoryData);

    const response = await api.post('/user/inventory-subcategories', subCategoryData);

    console.log('✅ SubCategory Created:', response.data);

    return response.data;
  } catch (error) {
    console.log(
      '❌ Create SubCategory Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// Update an existing subcategory
export const updateSubCategory = async (subCategoryId, subCategoryData) => {
  try {
    console.log(`Updating subcategory ${subCategoryId}:`, subCategoryData);

    const response = await api.put(`/user/inventory-subcategories/${subCategoryId}`, subCategoryData);

    console.log('✅ SubCategory Updated:', response.data);

    return response.data;
  } catch (error) {
    console.log(
      '❌ Update SubCategory Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// Delete a subcategory
export const deleteSubCategory = async (subCategoryId) => {
  try {
    console.log('Deleting subcategory:', subCategoryId);

    const response = await api.delete(`/user/inventory-subcategories/${subCategoryId}`);

    console.log('✅ SubCategory Deleted:', response.data);

    return response.data;
  } catch (error) {
    console.log(
      '❌ Delete SubCategory Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// Get subcategories with pagination
export const getSubCategoriesPaginated = async (categoryId, page = 1, limit = 10) => {
  try {
    console.log('Fetching paginated subcategories:', { categoryId, page, limit });

    const response = await api.get(`/user/inventory-categories/${categoryId}/subcategories`, {
      params: {
        page,
        limit,
      },
    });

    console.log('✅ Paginated SubCategory Response:', response.data);

    return response.data;
  } catch (error) {
    console.log(
      '❌ Paginated SubCategory Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// Search subcategories by name
export const searchSubCategories = async (categoryId, searchTerm) => {
  try {
    console.log('Searching subcategories:', { categoryId, searchTerm });

    const response = await api.get(`/user/inventory-categories/${categoryId}/subcategories/search`, {
      params: {
        search: searchTerm,
      },
    });

    console.log('✅ Search SubCategory Response:', response.data);

    return response.data;
  } catch (error) {
    console.log(
      '❌ Search SubCategory Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};

// Get subcategory count for a category
export const getSubCategoryCount = async (categoryId) => {
  try {
    console.log('Getting subcategory count for category:', categoryId);

    const response = await api.get(`/user/inventory-categories/${categoryId}/subcategories/count`);

    console.log('✅ SubCategory Count:', response.data);

    return response.data;
  } catch (error) {
    console.log(
      '❌ Get SubCategory Count Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};




export const getFormConfig = async (categoryId,subCategoryId ) => {
  try {
    console.log('Fetching subcategories for category:', categoryId);

    // Use the correct endpoint with categoryId in the path
    const response = await api.get(`/user/inventory-categories/${categoryId}/subcategories/${subCategoryId}/form-config
     `);

    console.log('✅ SubCategory Response:', response.data);

    return response.data;
  } catch (error) {
    console.log(
      '❌ SubCategory Error:',
      error.response?.data || error.message,
    );

    throw error;
  }
};