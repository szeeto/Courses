import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css'
import './css/main.css'
import ScrollToTop from './components/scroolToTop.jsx'
import 'animate.css';

createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <StrictMode>
        <ScrollToTop />
        <App />
      </StrictMode>
    </BrowserRouter>
  </>
)
