import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { useAuth } from "./context/Auth/hooks/useAuth";
import Layout from "./layout";
import { useMatchStore } from "./stores/match-store";
import BrandStyleGuide from "./Views/BrandStyleGuide";
import Dashboard from "./Views/Dashboard/Dashboard";
import MatchFound from "./Views/Matchmaking/MatchFound";
import MathMatch from "./Views/Match/MathsMatch";
import MatchHistory from "./Views/Match/MatchHistory";
import ForgotPassword from "./Views/Auth/ForgotPassword";
import TermsAndConditions from "./Views/TermsAndConditions";
import FinalResults from "./Views/Match/FinalResults";
import Landing from "./Views/Landing";
import GameGuide from "./Views/GameGuide"
import HelpMenu from "./Views/HelpMenu";
import Leaderboard from "./Views/Match/Leaderboard/Leaderboard";
import MatchSearching from "./Views/Matchmaking/MatchSearching";
import SignIn from "./Views/Auth/SignIn";
import SignUp from "./Views/Auth/SignUp";

import Loading from "@/components/shared/Loading";
import Tournaments from "./Views/Tournaments/Tournaments";
import TournamentsWaiting from "./Views/Tournaments/TournamentsWaiting";
import Agent from "./Views/AIAgent";
import Shop from "./Views/Shop/Shop";
import Friends from "./Views/Friends/Friends";
import Achievements from "./Views/Achievements";
import { ProgMatch } from "./Views/Match/ProgMatch";
import SkillProgress from "./Views/SkillProgress";
import TournamentsMatchPage from "./Views/Tournaments/TournamentMatchPage";

const MATCH_END_GRACE_MS = 69 * 1000;
const MATCH_ROUTE = /^\/(math|programming)-match\//; // regex to enfource limitimng route logic

const matchClockRunning = (end_time: number) => Date.now() < end_time + MATCH_END_GRACE_MS;

function useMatchRedirect(pathname: string): string | null {
  const match_id = useMatchStore(state => state.match_id);
  const match_mode = useMatchStore(state => state.match_mode);
  const status = useMatchStore(state => state.status);
  const end_time = useMatchStore(state => state.end_time);
  const tournament_id = useMatchStore(state => state.tournament_id);
  
  const in_match = status === 'ready' && !!match_id && !tournament_id && end_time !== null && matchClockRunning(end_time);
  const match_path = `/${match_mode}-match/${match_id}`;
  
  if (in_match) return (pathname === match_path || pathname === `/results/${match_id}`) ? null : match_path;
  if (MATCH_ROUTE.test(pathname)) return '/dashboard';
  return null;
}

const App: React.FC = () => {

  const { user, isLoading } = useAuth();
  const { pathname } = useLocation();
  const match_redirect = useMatchRedirect(pathname);
  
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
                <Route path='/game-guide' element={<GameGuide />} />
                <Route path='*' element={<Navigate to='/sign-in' replace />} />
            </Routes>
        )
    }

  if (match_redirect) {
    return <Navigate to={match_redirect} replace />
  }

    return (
        <Routes>
            <Route path='/' element={<Navigate to='/dashboard' replace />} />

            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/match-searching' element={<MatchSearching />} />
            <Route path='/match-found' element={<MatchFound />} />
            <Route path='/math-match/:match_id' element={<MathMatch />} />
            <Route path='/tournament-match' element={<TournamentsMatchPage />} />
            <Route path='/programming-match/:match_id' element={<ProgMatch />} />
            <Route path='/results/:match_id' element={<FinalResults />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/terms' element={<TermsAndConditions />} />
            <Route path="/brand-style-guide" element={<BrandStyleGuide />} />
            <Route path="/agent" element={<Agent />} />
            <Route path='/game-guide' element={<GameGuide />} />
            <Route path='/tournaments/waiting/:tournament_id' element={<TournamentsWaiting />} />
            <Route path="/tournaments-match/:tournament_id" element={<TournamentsMatchPage />} />
            
            {/* Pages with sidebar inside the app */}
            <Route element={<Layout />}>
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/help-menu' element={<HelpMenu />} />
                <Route path='/tournaments' element={<Tournaments />} />

                <Route path='/leaderboard' element={<Leaderboard />} />
                <Route path='/achievements' element={<Achievements />} />
                <Route path='/friends' element={<Friends />} />
                <Route path='/match-history' element={<MatchHistory />} />
                <Route path='/stats' element={<SkillProgress />} />
                <Route path="/shop" element={<Shop />} />
            </Route>

            <Route path="*" element={<Navigate to='/dashboard' replace />} />
        </Routes>
    )
}

export default App;