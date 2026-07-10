import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './amplify-config'
import './styles/global.css'
import { BrowserRouter } from 'react-router-dom'
import Popup from './Views/Popup'
import Leaderboard from './Views/Leaderboard'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>

  <AuthProvider>
    <BrowserRouter>
      {/* <App /> */}
      <Leaderboard/>
    </BrowserRouter>
  </AuthProvider>

  //</React.StrictMode>
)