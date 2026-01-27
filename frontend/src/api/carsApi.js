import apiClient from './axiosConfig'

export const carsApi = {
  getPublicCars: async (filters = {}, pagination = {}) => {
    const params = new URLSearchParams()
    if (filters.make) params.append('make', filters.make)
    if (filters.model) params.append('model', filters.model)
    if (filters.year) params.append('year', filters.year)
    if (filters.transmission) params.append('transmission', filters.transmission)
    if (filters.fuelType) params.append('fuelType', filters.fuelType)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    
    // Pagination params
    if (pagination.page !== undefined) params.append('page', pagination.page)
    if (pagination.size !== undefined) params.append('size', pagination.size)
    if (pagination.sortBy) params.append('sortBy', pagination.sortBy)
    if (pagination.sortDir) params.append('sortDir', pagination.sortDir)

    const response = await apiClient.get(`/cars?${params.toString()}`)
    return response.data
  },

  getCarById: async (id) => {
    const response = await apiClient.get(`/cars/${id}`)
    return response.data
  }
}
