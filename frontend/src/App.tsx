import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./context/Auth/hooks/useAuth";
import Layout from "./layout";
import BrandStyleGuide from "./Views/BrandStyleGuide";
import Dashboard from "./Views/Dashboard";
import MatchFound from "./Views/MatchFound";
import MathMatch from "./Views/MathsMatch";

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
import { ProgMatch } from "./Views/ProgMatch";

import Loading from "@/components/shared/Loading";
import Tournaments from "./Views/Tournaments";
import Agent from "./Views/AIAgent";
import Shop from "./Views/Shop";
import Friends from "./Views/Friends/Friends";
import Achievements from "./Views/Achievements";
import Settings from "./Views/Settings";

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
                <Route path='terms' element={<TermsAndConditions />} />
                <Route path='/brand-style-guide' element={<BrandStyleGuide />} />
                <Route path='/game-guide' element={<GameGuide />} />
                <Route path='/help-menu' element={<HelpMenu />} />
                <Route path='*' element={<Navigate to='/sign-in' replace />} />

            </Routes>
        )
    }

    return (
        <Routes>
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/match-searching' element={<MatchSearching />} />
            <Route path='/match-found' element={<MatchFound />} />
            <Route path='/math-match' element={<MathMatch />} />
            <Route path='/leaderboard' element={<Leaderboard />} />
            <Route path='/programming-match' element={<ProgMatch />} />
            <Route path='/results' element={<FinalResults />} />
            <Route path='/results' element={<FinalResults />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/terms' element={<TermsAndConditions />} />
            <Route path="/brand-style-guide" element={<BrandStyleGuide />} />
            <Route path="/agent" element={<Agent />} />
            <Route path='/game-guide' element={<GameGuide/>}/>


            {/* Pages with sidebar inside the app */}
            <Route element={<Layout />}>
                <Route path='/' element={base_path} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/help-menu' element={<HelpMenu />} />
                <Route path='/tournaments' element={<Tournaments />} />
                <Route path='/leaderboard' element={<Leaderboard />} />
                <Route path='/achievements' element={<Achievements />} />
                <Route path='/friends' element={<Friends />} />
                <Route path='/match-history' element={<MatchHistory />} />
                <Route path="/shop" element={<Shop />} />
                <Route path='/settings' element={<Settings />} />
            </Route>

            <Route path="*" element={<Navigate to='/dashboard' replace />} />
        </Routes>
    )
}

export default App;