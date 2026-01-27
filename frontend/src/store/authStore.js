import { create } from 'zustand'

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  role: null,

  setAuth: (userData, role) =>
    set({
      isAuthenticated: true,
      // If userData is a string (email), convert to object for backward compatibility
      // Otherwise, use the full user object
      user: typeof userData === 'string' ? { email: userData } : userData,
      role
    }),

  clearAuth: () =>
    set({
      isAuthenticated: false,
      user: null,
      role: null
    }),

  // Update user data (useful for profile updates)
  updateUser: (userData) =>
    set((state) => ({
      user: { ...state.user, ...userData }
    })),

  isAdmin: () => {
    const state = useAuthStore.getState()
    return state.role === 'ROLE_ADMIN' || state.role === 'ADMIN'
  },

  isCustomer: () => {
    const state = useAuthStore.getState()
    return state.role === 'ROLE_CUSTOMER' || state.role === 'CUSTOMER'
  }
}))

export default useAuthStore
