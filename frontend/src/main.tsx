import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AuthProvider } from './context/Auth/AuthContext'
import './amplify-config'
import './styles/global.css'
import { SocketProvider } from './context/Socket/SocketContext'
import { UserProvider } from './context/User/UserContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>

  <AuthProvider>
    <SocketProvider>
      <UserProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserProvider>
    </SocketProvider>
  </AuthProvider>

  //</React.StrictMode>
)