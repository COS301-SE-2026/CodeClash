import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/Auth/hooks/useAuth";
import Layout from "./layout";
import BrandStyleGuide from "./Views/BrandStyleGuide";
import Dashboard from "./Views/Dashboard/Dashboard";
import MatchFound from "./Views/Matchmaking/MatchFound";
import MathMatch from "./Views/Match/MathsMatch";
import MatchHistory from "./Views/Match/MatchHistory";
import ForgotPassword from "./Views/ForgotPassword";
import TermsAndConditions from "./Views/TermsAndConditions";
import FinalResults from "./Views/Match/FinalResults";
import Landing from "./Views/Landing";
import GameGuide from "./Views/GameGuide"
import HelpMenu from "./Views/HelpMenu";
import Leaderboard from "./Views/Match/Leaderboard/Leaderboard";
import MatchSearching from "./Views/Matchmaking/MatchSearching";
import Profile from "./Views/Profile";
import SignIn from "./Views/SignIn";
import SignUp from "./Views/SignUp";

import Loading from "@/components/shared/Loading";
import Tournaments from "./Views/Tournaments";
import TournamentsWaiting from "./Views/TournamentsWaiting";
import Agent from "./Views/AIAgent";
import Shop from "./Views/Shop/Shop";
import Friends from "./Views/Friends/Friends";
import Achievements from "./Views/Achievements";
import Settings from "./Views/Settings";
import { ProgMatch } from "./Views/Match/ProgMatch";
import SkillProgress from "./Views/SkillProgress";

const App: React.FC = () => {

    const { user, isLoading } = useAuth();
    if (isLoading) {
        return <Loading isOpen={isLoading} />
    }
   
   
    const logged_in = user !== null

    if (!logged_in) {
        return (
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/sign-in' element={<SignIn />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='terms' element={<TermsAndConditions />} />
                <Route path='/brand-style-guide' element={<BrandStyleGuide />} />
                <Route path='/help-menu' element={<HelpMenu />} />
                <Route path='/game-guide' element={<GameGuide/>}/>
                <Route path='*' element={<Navigate to='/sign-in' replace />} />
            </Routes>
        )
    }

    return (
        <Routes>
            <Route path='/' element={<Navigate to='/dashboard' replace/>} />

            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/match-searching' element={<MatchSearching />} />
            <Route path='/match-found' element={<MatchFound />} />
            <Route path='/math-match/:match_id' element={<MathMatch />} />
            <Route path='/programming-match/:match_id' element={<ProgMatch />} />
            <Route path='/results/:match_id' element={<FinalResults />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/terms' element={<TermsAndConditions />} />
            <Route path="/brand-style-guide" element={<BrandStyleGuide />} />
            <Route path="/agent" element={<Agent />} />
            <Route path='/game-guide' element={<GameGuide />} />

            {/* Pages with sidebar inside the app */}
            <Route element={<Layout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/help-menu' element={<HelpMenu />} />
                <Route path='/tournaments' element={<Tournaments />} />
                <Route path='/tournaments/waiting' element={<TournamentsWaiting/>}/>
                <Route path='/leaderboard' element={<Leaderboard />} />
                <Route path='/achievements' element={<Achievements />} />
                <Route path='/friends' element={<Friends />} />
                <Route path='/match-history' element={<MatchHistory />} />
                <Route path='/stats' element={<SkillProgress />} />
                <Route path="/shop" element={<Shop />} />
                <Route path='/settings' element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to='/dashboard' replace/>}/>
        </Routes>
    )
}

export default App;