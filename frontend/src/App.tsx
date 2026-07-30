import type React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./layout";
import Dashboard from "./Views/Dashboard";
import Welcome from "./Views/Welcome";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";
import Profile from "./Views/Profile";
import MatchSearching from "./Views/MatchSearching";
import MatchFound from "./Views/MatchFound";
import Leaderboard from "./Views/Leaderboard";
import Guidebook from "./Views/GameGuide"
import MathMatch from "./Views/MathsMatch";
import ProgMatch from "./pages/ProgMatch"; 
import { useAuth } from "./context/Auth/hooks/useAuth";
import Loading from "@/components/shared/Loading";
import FinalResults from "./Views/FinalResults";
import ForgotPassword from "./Views/ForgotPassword";

const App: React.FC = () => {

    const { user, isLoading } = useAuth();
    if(isLoading){
        return <Loading isOpen={isLoading} />
    }

    const logged_in = user !== null

    const base_path = logged_in ? <Dashboard /> : <Welcome />

    if (logged_in === false) {
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
            <Route path='/prog-match' element={<ProgMatch language="javascript" />} />
            {/* <Route path='/prog-match' element={<ProgMatch language="javascript"/>}/> */}

            <Route path= '/results' element= {<FinalResults/>}/>

            <Route path= '/forgot-password' element= {<ForgotPassword/>}/>

            {/* Pages with sidebar inside the app */}
            <Route element={<Layout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/game-guide' element={<Guidebook/>}/>
                <Route path='/tournaments' />
                <Route path='/leaderboard' element={<Leaderboard/>}/>
                <Route path='/badges' />
                <Route path='/friends' />
            </Route>
        </Routes>
    )
}

export default App;