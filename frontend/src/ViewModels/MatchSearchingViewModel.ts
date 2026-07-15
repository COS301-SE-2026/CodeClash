import { useCallback, useEffect, useState } from 'react';
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
    navigate('/dashboard');
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

  const [found, setFound] = useState(false);
  const { socket } = useSocket();

  const matched = useCallback((match: boolean) => {
    setFound(match);
  }, [setFound])

  const handleMatched = useCallback(() => {
    console.log("searching view model: users matched")
    matched(true)
  }, [matched]);

  useEffect(() => {
    if (socket) {

      socket.on("users_matched", () => handleMatched())

      return () => {
        socket.off("users_matched", () => handleMatched())
      }
    }
  }, [socket, handleMatched])


  return { matched, found };
}
