import { Routes, Route, useLocation } from 'react-router-dom'

import NavbarComponents from './components/NavbarComponents'
import FooterComponents from './components/FooterComponents'

import HomePage from './pages/HomePage'
import Kelas from './pages/KelasPage'
import SyaratKetenPage from './pages/SyaratKetenPage'
import FaqPage from './pages/FaqPage'
import TestimoniPage from './pages/TestimoniPage'
import LoginPage from './pages/LoginPage'
import CustomLoginPage from './pages/CustomLoginPage'
import RegisterPage from './pages/RegisterPage'
import AdminPage from './pages/AdminPage'
import UserSettings from './pages/UserSettings'

function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login' || location.pathname === '/login/custom' || location.pathname === '/register'
  const isAdminPage = location.pathname === '/admin'
  const isSettingsPage = location.pathname === '/settings'

  return (
    <div>
      {!isLoginPage && !isSettingsPage && !isAdminPage && <NavbarComponents />}
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/testimoni" element={<TestimoniPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/syaratketen" element={<SyaratKetenPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/custom" element={<CustomLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/settings" element={<UserSettings />} />
        </Routes>
      </div>
      {!isLoginPage && !isAdminPage && !isSettingsPage && <FooterComponents />}
    </div>
  )
}

export default App
