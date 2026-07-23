import type React from "react";
import {Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./Views/Dashboard";
import Layout from "./layout";
import Welcome from "./Views/Welcome";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";
import Profile from "./Views/Profile";
import Searching from "./pages/queuePages/searching";
import Found from "./pages/queuePages/found";
import MathMatch from "./Views/MathsMatch";
import FinalResults from "./Views/FinalResults";
import type { PlayerFinalResults } from "./Models/FinalResultsModel";

const App: React.FC = () => {
    const navigate = useNavigate();
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

            <Route path= '/results' element= {<FinalResults onReturn={() => navigate('/dashboard')} onPlayAgain={() => navigate('/dashboard')}
                fetchResults={async (): Promise<PlayerFinalResults[]> => {
                    {/*REPLACE WITH REAL BACKEND CALL*/}
                    return [];
                }}/>
            }/>

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