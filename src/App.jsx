import { Routes, Route } from 'react-router-dom'

import NavbarComponents from './components/NavbarComponents'
import FooterComponents from './components/FooterComponents'

import HomePage from './pages/HomePage'
import Kelas from './pages/KelasPage'
import SyaratKetenPage from './pages/SyaratKetenPage'
import FaqPage from './pages/FaqPage'
import TestimoniPage from './pages/TestimoniPage'

function App() {
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
        </Routes>
      </div>
      <FooterComponents />
    </div>
  )
}

export default App
