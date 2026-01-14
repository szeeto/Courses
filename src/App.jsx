
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

  return (
    <div>
      <NavbarComponents />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/kelas" element={<Kelas />} />
          <Route path="/testimoni" element={<TestimoniPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/syaratketen" element={<SyaratKetenPage />} />
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
      <FooterComponents />
    </div>
  )
}

export default App
