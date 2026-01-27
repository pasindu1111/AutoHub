import apiClient from './axiosConfig'

export const testDriveApi = {
  bookTestDrive: async (carId, appointmentDate) => {
    const response = await apiClient.post('/test-drives', {
      carId,
      appointmentDate
    })
    return response.data
  },

  getMyBookings: async () => {
    const response = await apiClient.get('/test-drives/my-bookings')
    return response.data
  },

  cancelBooking: async (id) => {
    const response = await apiClient.delete(`/test-drives/${id}`)
    return response.data
  }
}
