import type React from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./layout";
import Dashboard from "./Views/Dashboard";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";
import Profile from "./Views/Profile";
import MatchSearching from "./Views/MatchSearching";
import MatchFound from "./Views/MatchFound";
import MathMatch from "./Views/MathsMatch";
import ProgMatch from "./pages/ProgMatch";
import Welcome from "./Views/Welcome";

const App: React.FC = () => {
    return (
        <Routes>
            <Route path='/' element={<Welcome/>}/>
            <Route path='/welcome' element={<Welcome/>}/>
            <Route path='/sign-in' element={<SignIn/>}/>
            <Route path='/sign-up' element={<SignUp/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/match-searching' element={<MatchSearching/>}/>
            <Route path='/match-found' element={<MatchFound/>}/>
            <Route path='/maths-match' element={<MathMatch/>}/>
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