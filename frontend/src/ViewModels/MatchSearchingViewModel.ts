import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatchmaking } from 'src/context/Socket/hooks/useMatchmaking';
import { useSocket } from 'src/context/Socket/hooks/useSocket';
import { useUser } from 'src/context/User/hooks/useUser';

import {
  formatMatchSearchTime,
  matchSearchingContent,
  type MatchSearchingPlayer,
} from '../Models/MatchSearchingModel';

export function MatchSearchingViewModelFunction() {
  const navigate = useNavigate();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { elo, username } = useUser();

  const { matchmaking_socket } = useSocket()
  const { matched } = useMatchmaking()

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleCancel = () => {

    if (!matchmaking_socket) throw new Error("500 Internal Server Error")

    matchmaking_socket.leaveQueue();
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

