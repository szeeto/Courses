
import { Navigate } from 'react-router-dom'
import { getCookie } from '../utils/cookieUtils'

function ProtectedRoute({ children, isPublic = false, role }) {
  const token = getCookie('authToken') || localStorage.getItem('authToken')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const isLoggedIn = !!token && !!user

  // For public pages (like login/register), redirect if already logged in
  if (isPublic && isLoggedIn) {
    // Jika user login dan role admin, redirect ke admin panel
    if (user && user.role === 'admin') return <Navigate to="/adminPanel/profile" replace />
    return <Navigate to="/" replace />
  }

  // For protected pages, redirect if not logged in
  if (!isPublic && !isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // Jika role dibutuhkan, cek role user
  if (role && user && user.role !== role) {
    // Jika user bukan admin, redirect ke home
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
