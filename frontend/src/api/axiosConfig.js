import axios from 'axios'
import { message } from 'antd'
import useAuthStore from '../store/authStore'

// Base URL configuration for easier updates
const BASE_URL = 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial for sending/receiving HttpOnly cookies
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor to handle 401 (Unauthorized) and 403 (Forbidden)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // ✅ CRITICAL FIX: Do NOT attempt refresh for login/register/refresh endpoints
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                           originalRequest.url?.includes('/auth/register') ||
                           originalRequest.url?.includes('/auth/refresh')

    // 1. Handle Token Refresh on 401 Unauthorized (but NOT for auth endpoints)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true

      try {
        // Attempt token refresh call to the backend
        await axios.post(`${BASE_URL}/auth/refresh`, {}, {
          withCredentials: true
        })
        
        // If refresh succeeds, retry the original request
        return apiClient(originalRequest)
      } catch (refreshError) {
        // If refresh fails, session is totally dead
        useAuthStore.getState().clearAuth()
        
        // Prevent redirect loop if already on login page
        if (!window.location.pathname.includes('/login')) {
          message.warning('Session expired. Please login again.')
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    // 2. Global Error Notifications
    if (error.response?.status === 403) {
      message.error('Access denied. You do not have permission for this action.')
    } else if (error.response?.status >= 500) {
      message.error('Server error. The AutoHub service is currently unavailable.')
    } else if (!error.response) {
      message.error('Network error. Is the backend server running at localhost:8080?')
    }
    // ✅ FIX: Don't show generic 401 error message for login endpoint (let the page handle it)
    else if (error.response?.status === 401 && !isAuthEndpoint) {
      // Only show session expired for non-auth endpoints
      if (!window.location.pathname.includes('/login')) {
        message.warning('Your session has expired. Please login again.')
      }
    }

    return Promise.reject(error)
  }
)

// Request interceptor to handle CSRF protection
apiClient.interceptors.request.use(
  (config) => {
    // Read XSRF-TOKEN from cookies if present (provided by Spring Security)
    const csrfToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]

    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken)
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient