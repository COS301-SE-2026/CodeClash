import React from'react';
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './amplify-config'
import './styles/global.css'
import { Popup } from './pages/Popup'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      {/* <Profile/> */}
      {/* <App/>  */}
      <Popup/>
    </AuthProvider>
  </React.StrictMode>,
)