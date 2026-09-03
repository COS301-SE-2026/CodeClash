import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AuthProvider } from './context/Auth/AuthContext'
import './amplify-config'
import './styles/global.css'
import { SocketProvider } from './context/Socket/SocketContext'
import { UserProvider } from './context/User/UserContext'
import { MatchmakingProvider } from './context/Socket/MatchmakingContext'
import { FriendsProvider } from './ViewModels/FriendsViewModel/FriendsContext'
import FriendInvitePopup from './Views/Friends/FriendInvitePopup'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>

  <AuthProvider>
    <SocketProvider>
      <UserProvider>
        <MatchmakingProvider>
          <FriendsProvider>
            <BrowserRouter>
            <ThemeProvider>
              <App />
              </ThemeProvider>
              <FriendInvitePopup/>
            </BrowserRouter>
          </FriendsProvider>
        </MatchmakingProvider>
      </UserProvider>
    </SocketProvider>
  </AuthProvider>

  //</React.StrictMode>
)