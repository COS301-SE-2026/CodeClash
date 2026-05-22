import React from 'react'
import ReactDOM from 'react-dom/client'
//import { RouterProvider } from 'react-router-dom'
//import { router } from './routes'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './amplify-config'
import './styles/global.css'
//import Searching from './pages/queuePages/searching'
//import Found from './pages/queuePages/found'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

    <AuthProvider>
      <BrowserRouter><App /></BrowserRouter>
    </AuthProvider>

  </React.StrictMode>
)