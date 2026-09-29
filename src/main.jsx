import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Analytics (GA4/Clarity) agora é inicializado pelo CookieConsent,
// somente após o consentimento do usuário (LGPD).

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
