import type React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/Auth/hooks/useAuth";
import Layout from "./layout";
import ProgMatch from "./pages/ProgMatch";
import BrandStyleGuide from "./Views/BrandStyleGuide";
import Dashboard from "./Views/Dashboard";
import MatchFound from "./Views/MatchFound";
import MathMatch from "./Views/MathsMatch";
import { ArmRaise } from "./animations/armRaise";
import { Yes } from "./animations/yes";
import MatchHistory from "./Views/MatchHistory";
import ForgotPassword from "./Views/ForgotPassword";
import TermsAndConditions from "./Views/TermsAndConditions";
import FinalResults from "./Views/FinalResults";
import Landing from "./Views/Landing";
import GameGuide from "./Views/GameGuide"
import HelpMenu from "./Views/HelpMenu";
import Leaderboard from "./Views/Leaderboard";
import MatchSearching from "./Views/MatchSearching";
import Profile from "./Views/Profile";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";
import Loading from "@/components/shared/Loading";


const App: React.FC = () => {

    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <Loading isOpen={isLoading} />
    }
   

    const logged_in = user !== null

    const base_path = logged_in ? <Dashboard /> : <Landing />

    if (!logged_in) {
        return (
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route path='terms' element={<TermsAndConditions/>}/>
                <Route path= '/brand-style-guide' element={<BrandStyleGuide/>}/>
                <Route path='/game-guide' element={<GameGuide/>}/> 
                <Route path= '/help-menu' element={<HelpMenu/>}/>
                <Route path='/dashboard' element={<Dashboard/>}/>
                <Route path='/profile' element={<Profile/>}/>
                <Route path='/leaderboard' element={<Leaderboard/>}/>
                <Route path='/final-results' element={<FinalResults/>}/>
                <Route path='match' element={<ProgMatch/>}/>
                <Route path='/animations' element={<ArmRaise/>}/> 

                <Route path='*' element={<Navigate to='/sign-in' replace />} />


                {/* Pages with sidebar inside the app */}
                <Route element={<Layout />}>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/game-guide' />
                    <Route path='/tournaments' />
                    <Route path='/leaderboard' />
                    <Route path='/badges'/>
                    <Route path='/friends' />
                </Route>
            </Routes>
        )
    }

    return (
        <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route path='/' element={base_path} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/match-searching' element={<MatchSearching />} />
            <Route path='/match-found' element={<MatchFound />} />
            <Route path='/maths-match' element={<MathMatch />} />
            {/*<Route path='/leaderboard' element={<Leaderboard />} />*/}
            <Route path='/prog-match' element={<ProgMatch language="javascript" />} />
            <Route path='/results' element={<FinalResults/>} />
            {/* <Route path='/prog-match' element={<ProgMatch language="javascript"/>}/> */}

            <Route path= '/results' element= {<FinalResults/>}/>

            <Route path= '/forgot-password' element= {<ForgotPassword/>}/>
            <Route path='/terms' element={<TermsAndConditions/>}/>
            <Route path="/brand-style-guide" element= {<BrandStyleGuide/>}/>

            {/* Pages with sidebar inside the app */}
            <Route element={<Layout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/game-guide' element={<GameGuide/>}/>
                <Route path='/tournaments' />
                <Route path='/leaderboard' element={<Leaderboard/>}/>
                <Route path='/badges' />
                <Route path='/friends' />
                <Route path='/match-history' element={<MatchHistory/>}/>
            </Route>
        </Routes>
    )
}

export default App;