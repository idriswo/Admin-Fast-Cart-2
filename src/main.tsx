import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import './i18n'
import App from './App.tsx'
import { useThemeStore } from './store/theme'

// One subtle, classic animation used consistently across the whole app.
AOS.init({ duration: 500, easing: 'ease-out-cubic', once: true })

// Apply the persisted theme (dark/light) before first paint.
useThemeStore.getState().apply()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
