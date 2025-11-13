import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'
import { getCookie } from '../utils/cookieUtils'

function CustomLoginPage() {
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const token = getCookie('authToken') || localStorage.getItem('authToken')
    if (token) {
      navigate('/', { replace: true })
    }
  }, [navigate])

  return (
    <div className="page-root">
      <LoginForm />
    </div>
  )
}

export default CustomLoginPage
