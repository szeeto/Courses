import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'
import { getCookie } from '../utils/cookieUtils'

function RegisterPage() {
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
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
