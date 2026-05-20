import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './amplify-config'
import './styles/global.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>
)