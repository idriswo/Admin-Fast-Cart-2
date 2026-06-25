import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import App from './App.tsx'

// One subtle, classic animation used consistently across the whole app.
AOS.init({ duration: 500, easing: 'ease-out-cubic', once: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
