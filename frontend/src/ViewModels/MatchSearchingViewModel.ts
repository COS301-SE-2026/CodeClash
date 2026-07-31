import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'src/context/User/hooks/useUser';

import {
  formatMatchSearchTime,
  matchSearchingContent,
  type MatchSearchingPlayer,
} from '../Models/MatchSearchingModel';
import { useMatchmaking } from 'src/context/Socket/hooks/useMatchmaking';
import { useSocket } from 'src/context/Socket/hooks/useSocket';

export function MatchSearchingViewModelFunction() {
  const navigate = useNavigate();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const { elo, username } = useUser();

  const { socket } = useSocket()
  const { leaveMatchQueue, matched } = useMatchmaking()

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleCancel = () => {

    if (!socket) throw new Error("500 Internal Server Error")

    leaveMatchQueue(socket)
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

