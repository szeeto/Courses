import { Navigate } from 'react-router-dom'
import { getCookie } from '../utils/cookieUtils'

function ProtectedRoute({ children, isPublic = false }) {
  const token = getCookie('authToken') || localStorage.getItem('authToken')
  const isLoggedIn = !!token

  // For public pages (like login/register), redirect if already logged in
  if (isPublic && isLoggedIn) {
    return <Navigate to="/" replace />
  }

  // For protected pages, redirect if not logged in
  if (!isPublic && !isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
