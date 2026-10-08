import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchmaking } from 'src/context/Matchmaking/hooks/useMatchmaking';
import { useSocket } from 'src/context/Socket/hooks/useSocket';
import { useUser } from 'src/context/User/hooks/useUser';

import {
  formatMatchSearchTime,
  matchSearchingContent,
  type MatchSearchingPlayer,
} from 'src/Models/MatchSearchingModel';
import { useMatchStore } from 'src/stores/match-store';

export function MatchSearchingViewModelFunction() {
  const navigate = useNavigate();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const { elo, username } = useUser();

  const { matchmakingSocket } = useSocket()
  const { matched, reset } = useMatchmaking()

  useEffect(() => {
         if (timedOut) return;
         const intervalId = window.setInterval(() => {
           setElapsedSeconds((current) => current + 1);
         }, 1000);
 
         return () => {
           window.clearInterval(intervalId);
         };
       }, [timedOut]);
 
      // the server took them out of the queue after searching too long
      useEffect(() => {
         if (!matchmakingSocket) return;
         const unsub_timeout = matchmakingSocket.queueTimeout(() => setTimedOut(true));
         return () => { unsub_timeout(); };
       }, [matchmakingSocket]);
 
      const handleCancel = () => {
 
        if (!matchmakingSocket) throw new Error("500 Internal Server Error")
        void matchmakingSocket.leaveQueue().catch(() => { });   // the server doesn't acknowledge leaving, so don't let the emit time out as an error
        reset();
        useMatchStore.getState().reset();
        navigate('/dashboard');
      };

  const user: MatchSearchingPlayer = {
    username: username,
    elo: elo,
    side: 'left'
  }

  useEffect(() => {
    if (matched) {
      navigate('/match-found')
    }
  }, [matched])

  return {
    elapsedSeconds,
    formattedTime: formatMatchSearchTime(elapsedSeconds),
    content: matchSearchingContent,
    players: [user],
    handleCancel,
    timedOut,
  };
}

