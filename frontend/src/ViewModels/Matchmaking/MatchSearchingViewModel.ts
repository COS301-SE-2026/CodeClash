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
  const { elo, username } = useUser();

  const { matchmakingSocket } = useSocket()
  const { matched, reset } = useMatchmaking()

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleCancel = () => {

    if (!matchmakingSocket) throw new Error("500 Internal Server Error")
    matchmakingSocket.leaveQueue();
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
  };
}

