import type React from "react";
import {Route, Routes} from "react-router-dom";
import Dashboard from "./Views/Dashboard";
import Layout from "./layout";
import Welcome from "./Views/Welcome";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";
import Profile from "./Views/Profile";
import Searching from "./Views/Searching";
import Found from "./pages/queuePages/found";
import Leaderboard from "./Views/Leaderboard";
import Guidebook from "./Views/GameGuide"
import MathMatch from "./Views/MathsMatch";
import FinalResults from "./Views/FinalResults";
import ForgotPassword from "./Views/ForgotPassword";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<Welcome/>}/>
            <Route path='/welcome' element={<Welcome/>}/>
            <Route path='/sign-in' element={<SignIn/>}/>
            <Route path='/sign-up' element={<SignUp/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/searching' element={<Searching/>}/>
            <Route path='/found' element={<Found/>}/>
            <Route path='/match' element={<MathMatch/>}/>
            {/* <Route path='/prog-match' element={<ProgMatch language="javascript"/>}/> */}

            <Route path= '/results' element= {<FinalResults/>}/>

            <Route path= '/forgot-password' element= {<ForgotPassword/>}/>

            {/* Pages with sidebar inside the app */}
            <Route element={<Layout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/game-guide' element={<Guidebook/>}/>
                <Route path='/tournaments' />
                <Route path='/leaderboard'/>
                <Route path='/badges' />
                <Route path='/friends' />
            </Route>
        </Routes>
    )
}

export default App;