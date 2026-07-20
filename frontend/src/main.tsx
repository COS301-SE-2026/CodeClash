import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './amplify-config'
import './styles/global.css'
import { BrowserRouter } from 'react-router-dom'
import Popup from './Views/Popup'
import Leaderboard from './Views/Leaderboard'
import Guidebook from './Views/Guidebook'
import Dashboard from './Views/Dashboard'
import Layout from './layout'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>

  <AuthProvider>
    <BrowserRouter>
    {/* <Layout/> */}
      <App />
      {/* <Leaderboard/> */}
      {/* <Guidebook/> */}
    </BrowserRouter>
  </AuthProvider>

  //</React.StrictMode>
)