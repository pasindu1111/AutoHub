import apiClient from './axiosConfig'

export const adminCarsApi = {
  getAllCars: async (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.make) params.append('make', filters.make)
    if (filters.model) params.append('model', filters.model)
    if (filters.year) params.append('year', filters.year)

    const response = await apiClient.get(`/admin/cars?${params.toString()}`)
    return response.data
  },

  getCarById: async (id) => {
    const response = await apiClient.get(`/admin/cars/${id}`)
    return response.data
  },

  createCar: async (formData) => {
    const response = await apiClient.post('/admin/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  updateCar: async (id, carData) => {
    const response = await apiClient.put(`/admin/cars/${id}`, carData)
    return response.data
  },

  deleteCar: async (id) => {
    const response = await apiClient.delete(`/admin/cars/${id}`)
    return response.data
  },

  restoreCar: async (id) => {
    const response = await apiClient.patch(`/admin/cars/${id}/restore`)
    return response.data
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/admin/cars/${id}/status`, { status })
    return response.data
  },

  addImages: async (id, formData) => {
    const response = await apiClient.post(`/admin/cars/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  },

  setPrimaryImage: async (carId, imageId) => {
    const response = await apiClient.patch(`/admin/cars/${carId}/images/${imageId}/primary`)
    return response.data
  },

  deleteImage: async (carId, imageId) => {
    const response = await apiClient.delete(`/admin/cars/${carId}/images/${imageId}`)
    return response.data
  }
}
