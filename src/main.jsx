/**
 * Layer:
 * Entrypoint
 *
 * Purpose:
 * Bootstraps the React SPA and mounts the App component onto the root DOM element.
 *
 * Uses:
 * - index.css (global style tokens)
 * - App.jsx (root element)
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
