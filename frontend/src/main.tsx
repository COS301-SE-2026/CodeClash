import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './amplify-config'
import './styles/global.css'
import { BrowserRouter } from 'react-router-dom'
import Popup from './pages/Popup'
import Profile from './pages/Profile'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>

  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>

  //</React.StrictMode>
)