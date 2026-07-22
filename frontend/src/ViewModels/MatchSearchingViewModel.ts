import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from "src/context/Socket/hooks/useSocket";
import {
  formatMatchSearchTime,
  matchSearchingContent,
  mockMatchSearchingPlayer,
} from '../Models/MatchSearchingModel';

export function MatchSearchingViewModelFunction() {
  const navigate = useNavigate();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleCancel = () => {
    navigate('dashboard');
  };

  return {
    elapsedSeconds,
    formattedTime: formatMatchSearchTime(elapsedSeconds),
    content: matchSearchingContent,
    players: mockMatchSearchingPlayer,
    handleCancel,
  };
}

export function useSearch() {
  const { matched } = useSocket();

  return { matched };
}
