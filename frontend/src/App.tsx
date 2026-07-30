import type React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/Auth/hooks/useAuth";
import Layout from "./layout";
import ProgMatch from "./pages/ProgMatch";
import Dashboard from "./Views/Dashboard";
import Leaderboard from "./Views/Leaderboard";
import MatchFound from "./Views/MatchFound";
import MatchSearching from "./Views/MatchSearching";
import MathMatch from "./Views/MathsMatch";
import Profile from "./Views/Profile";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";
import Welcome from "./Views/Welcome";

const App: React.FC = () => {

    const { user } = useAuth();

    const logged_in = user !== null

    const base_path = logged_in ? <Dashboard /> : <Welcome />

    if (!logged_in) {
        return (
            <Routes>
                <Route path='/' element={<Welcome />} />
                <Route path='/welcome' element={<Welcome />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route path='*' element={<Navigate to='/sign-in' replace />} />

            </Routes>
        )
    }

    return (
        <Routes>
            <Route path='/' element={base_path} />
            <Route path='/welcome' element={<Welcome />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/match-searching' element={<MatchSearching />} />
            <Route path='/match-found' element={<MatchFound />} />
            <Route path='/maths-match' element={<MathMatch />} />
            {/*<Route path='/leaderboard' element={<Leaderboard />} />*/}
            <Route path='/prog-match' element={<ProgMatch language="javascript" />} />

            {/* Pages with sidebar inside the app */}
            <Route element={<Layout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/game-guide' />
                <Route path='/tournaments' />
                <Route path='/leaderboard' element={<Leaderboard />} />
                <Route path='/badges' />
                <Route path='/friends' />
            </Route>
        </Routes>
    )
}

export default App;