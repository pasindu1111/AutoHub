import apiClient from './axiosConfig'

export const adminTestDriveApi = {
  getAllTestDrives: async () => {
    const response = await apiClient.get('/admin/test-drives')
    return response.data
  },

  updateStatus: async (id, status) => {
    const response = await apiClient.patch(`/admin/test-drives/${id}/status`, { status })
    return response.data
  }
}
