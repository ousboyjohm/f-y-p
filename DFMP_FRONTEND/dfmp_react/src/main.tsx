import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter >
  <StrictMode>
    <App />
  </StrictMode>,
  </BrowserRouter>
)


// This is the entry point of the app. When the app is run, this is one is displayed.
// This in turn dislpays the App.tsx component which it wraps in line 10 above.