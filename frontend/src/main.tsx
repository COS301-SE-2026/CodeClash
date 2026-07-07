import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'

import './amplify-config'
import './styles/global.css'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>

  <AuthProvider>
    <SocketProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </AuthProvider>

  //</React.StrictMode>
)