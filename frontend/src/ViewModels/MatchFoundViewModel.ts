import { useNavigate } from 'react-router-dom';
import {
  matchFoundContent,
  mockMatchFoundDetails,
  mockMatchFoundPlayers,
} from '../Models/MatchFoundModel';
import { useEffect, useState } from "react"
import { joinMatchQueue, useMatchmakingSocket } from "src/context/Socket/hooks/useMatchmakingSocket";
import { useSocket } from "src/context/Socket/hooks/useSocket"
import { matchAccepted, matchDeclined } from "src/context/Socket/hooks/useMatchmakingSocket"
import MatchmakingUserDTO from "src/dtos/matchmaking.dto";
import { useUser } from "src/context/User/hooks/useUser";


export function MatchFoundViewModelFunction() {
  const nav = useNavigate();
  const { elo } = useUser();

  const { socket } = useSocket()
  const { game_mode, pair_id } = useMatchmakingSocket();
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket_error, setSocketError] = useState('');

  const closeLoading = () => setLoading(false);
  const openLoading = () => setLoading(true);

  const decline = () => {
    if (socket) {
      matchDeclined(socket, pair_id);
      setLoading(true);
    }
    else {
      setSocketError('Disconnected');
    }
  }

  const gameReady = () => {
    setLoading(false);
    nav(path);
  }

  // handler for user that declined the game
  const declineGame = () => {
    setLoading(false);
    nav('/dashboard')
  }

  // handler for user that was declined
  const gameDeclined = () => {
    setLoading(false);

    const data = new MatchmakingUserDTO(elo, game_mode);
    joinMatchQueue(socket!, data);
    nav('/searching')
  }

  const accept = () => {
    if (socket) {
      setPath(game_mode.concat("-match"));
      matchAccepted(socket, pair_id);
      setLoading(true);
    }
    else {
      setSocketError('Disconnected');
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on("game_ready", gameReady);

      socket.on("decline_done", declineGame);

      socket.on("game_declined", gameDeclined);


      return () => {
        socket.off("game_ready", gameReady);
        socket.off("decline_done", declineGame);
        socket.off("game_declined", gameDeclined);
      }
    }
  }, [socket, path])

  return {
    content: matchFoundContent,
    players: mockMatchFoundPlayers,
    details: mockMatchFoundDetails,
    decline,
    accept,
    loading,
    socket_error,
    closeLoading,
    openLoading
  };
}