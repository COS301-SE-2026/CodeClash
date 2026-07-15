import type React from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./layout";
import MathMatch from "./pages/MathMatch";
import ProgMatch from "./pages/ProgMatch";
import Found from "./Views/Found";
import Dashboard from "./Views/Dashboard";
import Profile from "./Views/Profile";
import Searching from "./Views/Searching";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";
import Profile from "./Views/Profile";
import MatchSearching from "./Views/MatchSearching";
import MatchFound from "./Views/MatchFound";
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
            <Route path='/match-searching' element={<MatchSearching/>}/>
            <Route path='/match-found' element={<MatchFound/>}/>
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
