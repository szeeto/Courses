
import { Routes, Route, useLocation } from 'react-router-dom';
import './css/main.css';
import NavbarComponents from './components/NavbarComponents';
import FooterComponents from './components/FooterComponents';
import HomePage from './pages/HomePage';
import Kelas from './pages/KelasPage';
import SyaratKetenPage from './pages/SyaratKetenPage';
import FaqPage from './pages/FaqPage';
import TestimoniPage from './pages/TestimoniPage';
import UserLoginPage from './pages/UserLoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfilePage from './pages/adminPanel/AdminProfilePage';
import UserSettings from './pages/UserSettings';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import UserRegisterForm from './components/UserRegisterForm';

function App() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  const isAdminPage = location.pathname === '/admin'
  const isSettingsPage = location.pathname === '/settings'
  const isAdminProfilePage = location.pathname === '/adminPanel/profile'

  return (
    <div>
      {!isLoginPage && !isSettingsPage && !isAdminPage && !isAdminProfilePage && <NavbarComponents />}
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/testimoni" element={<TestimoniPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/syaratketen" element={<SyaratKetenPage />} />
          <Route path="/login" element={<UserLoginPage />} />
          {/* Route admin hanya untuk admin */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/adminPanel/profile" element={
            <ProtectedRoute role="admin">
              <AdminProfilePage />
            </ProtectedRoute>
          } />
          {/* Route user hanya untuk user */}
          <Route path="/settings" element={
            <ProtectedRoute role="user">
              <UserSettings />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute role="user">
              <UserProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<UserRegisterForm />} />
        </Routes>
      </div>
      {!isLoginPage && !isAdminPage && !isSettingsPage && !isAdminProfilePage && <FooterComponents />}
    </div>
  )
}

export default App
