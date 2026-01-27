import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, role } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check for both 'ADMIN' (DB value) and 'ROLE_ADMIN' (Spring Security convention)
  if (requireAdmin && role !== 'ROLE_ADMIN' && role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return children
}
