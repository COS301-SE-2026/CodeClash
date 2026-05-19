import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import Searching from './pages/queuePages/searching' 
import Found from './pages/queuePages/found' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Found/>
    </BrowserRouter>
  </React.StrictMode>
)