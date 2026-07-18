import type React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Views/Dashboard";
import Layout from "./layout";
import Welcome from "./Views/Welcome";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";
import Profile from "./Views/Profile";
import MatchSearching from "./Views/MatchSearching";
import MatchFound from "./Views/MatchFound";
import Searching from "./pages/queuePages/searching";
import Found from "./pages/queuePages/found";
import Match from "./Views/Match";

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
            <Route path='/match' element={<Match/>}/>
            {/* <Route path='/prog-match' element={<ProgMatch language="javascript"/>}/> */}

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
