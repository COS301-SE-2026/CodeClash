import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import { AchievementToastProvider } from './context/Achievement/AchievementToastContext'
import { AuthProvider } from './context/Auth/AuthContext'
import './amplify-config'
import './styles/global.css'
import { MatchmakingProvider } from './context/Socket/MatchmakingContext'
import { SocketProvider } from './context/Socket/SocketContext'
import { ThemeProvider } from './context/Shop/ThemeContext'
import { UserProvider } from './context/User/UserContext'
import { FriendsProvider } from './ViewModels/FriendsViewModel/FriendsContext'
import FriendInvitePopup from './Views/Friends/FriendInvitePopup'
import { InventoryProvider } from './context/Shop/InventoryContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>

  <AuthProvider>
    <SocketProvider>
      <InventoryProvider>
        <UserProvider>
          <MatchmakingProvider>
            <FriendsProvider>
              <BrowserRouter>
              <AchievementToastProvider>
              <ThemeProvider>
                <App />
                </ThemeProvider>
                <FriendInvitePopup/>
                </AchievementToastProvider>
              </BrowserRouter>
            </FriendsProvider>
          </MatchmakingProvider>
        </UserProvider>
      </InventoryProvider>
    </SocketProvider>
  </AuthProvider>

  //</React.StrictMode>
)