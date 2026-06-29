import type React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Views/Dashboard";
import Layout from "./layout";
import Welcome from "./Views/Welcome";
import SignIn from "./pages/SignIn";
import SignUp from "./Views/SignUp";
import Profile from "./pages/Profile";
import Searching from "./pages/queuePages/searching";
import Found from "./pages/queuePages/found";
import MathMatch from "./pages/MathMatch";
import ProgMatch from "./pages/ProgMatch";



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
            <Route path='/math-match' element={<MathMatch/>}/>
            <Route path='/prog-match' element={<ProgMatch language="javascript"/>}/>

            {/* Pages with sidebar inside the app */}
            <Route element={<Layout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/game-guide' />
                <Route path='/tournaments' />
                <Route path='/leaderboard' />
                <Route path='/badges' />
                <Route path='/friends' />
            </Route>
        </Routes>
    )
}


export default App;
