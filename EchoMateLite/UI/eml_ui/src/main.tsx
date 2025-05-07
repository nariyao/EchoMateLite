import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.tsx'


// Set base URL from environment variable or fallback to production URL
axios.defaults.baseURL = import.meta.env.VITE_API_GATEWAY || "https://api.example.com"
axios.defaults.withCredentials = true
axios.defaults.headers.common['Content-Type'] = 'application/json'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
