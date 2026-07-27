import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { useUser } from 'src/context/User/hooks/useUser';

import {
  formatMatchSearchTime,
  matchSearchingContent,
  type MatchSearchingPlayer,
} from '../Models/MatchSearchingModel';

export function MatchSearchingViewModelFunction() {
  const navigate = useNavigate();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const {elo, username} = useUser();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const user: MatchSearchingPlayer = {
    username: username,
    elo: elo,
    side: 'left'
  }

  return {
    elapsedSeconds,
    formattedTime: formatMatchSearchTime(elapsedSeconds),
    content: matchSearchingContent,
    players: [user],
    handleCancel,
  };
}

export function useSearch() {
  const { matched } = useSocket();

  return { matched };
}
