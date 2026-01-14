
import { Routes, Route, useLocation } from 'react-router-dom';
import './css/main.css';
import NavbarComponents from './components/NavbarComponents';
import FooterComponents from './components/FooterComponents';
import HomePage from './pages/HomePage';
import Kelas from './pages/KelasPage';
import SyaratKetenPage from './pages/SyaratKetenPage';
import FaqPage from './pages/FaqPage';
import TestimoniPage from './pages/TestimoniPage';
import UserLoginPage from './pages/UserLoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const location = useLocation()

  const hideNavAndFooter = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div>
      {!hideNavAndFooter && <NavbarComponents />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kelas" element={<Kelas />} />
        <Route path="/testimoni" element={<TestimoniPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/syaratketen" element={<SyaratKetenPage />} />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      {!hideNavAndFooter && <FooterComponents />}
    </div>
  )
}

export default App
