import apiClient from './axiosConfig'

/**
 * Auth API service for handling all authentication-related requests.
 * Uses the apiClient instance which has baseURL: 'http://localhost:8080/api'
 */
export const authApi = {
  // 1. Authenticate user
  login: async (email, password) => {
    try {
      // apiClient already has /api, so this hits /api/auth/login
      const response = await apiClient.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      // Extracts the error message from Spring's response
      throw error.response?.data || error.message;
    }
  },

  // 2. Clear authentication cookies
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 3. Rotate access token
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    return response.data;
  },

  // 4. Register a new account
  register: async (fullName, email, password) => {
    try {
      const response = await apiClient.post('/auth/register', {
        fullName,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 5. Fetch authenticated user's profile
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // 6. Update user profile
  updateProfile: async (data) => {
    try {
      // data should contain { fullName: "..." }
      const response = await apiClient.patch('/users/profile', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
}