import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NotificationProvider } from "./components/NotificationContext"
import AuthProvider from "./components/AuthProvider" 
import PropsProvider from './components/PropsProvider'
import { TooltipProvider } from './components/ui/tooltip.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PropsProvider>
        <NotificationProvider>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </NotificationProvider>
      </PropsProvider>
    </AuthProvider>
  </StrictMode>
)
