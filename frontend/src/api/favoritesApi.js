import apiClient from './axiosConfig'

export const favoritesApi = {
  addFavorite: async (carId) => {
    const response = await apiClient.post(`/favorites/${carId}`)
    return response.data
  },

  removeFavorite: async (carId) => {
    const response = await apiClient.delete(`/favorites/${carId}`)
    return response.data
  },

  getMyFavorites: async () => {
    const response = await apiClient.get('/favorites')
    return response.data
  },

  getMyFavoritesWithDetails: async () => {
    const response = await apiClient.get('/favorites/with-details')
    return response.data
  }
}
