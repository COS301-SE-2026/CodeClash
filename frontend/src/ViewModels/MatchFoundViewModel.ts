import { useNavigate } from 'react-router-dom';
import {
  matchFoundContent,
  mockMatchFoundDetails,
  mockMatchFoundPlayers,
} from '../Models/MatchFoundModel';
import { useEffect, useState } from "react"
import { joinMatchQueue, useMatchmakingSocket ,matchAccepted, matchDeclined} from "src/context/Socket/hooks/useMatchmakingSocket";
import { useSocket } from "src/context/Socket/hooks/useSocket"
import MatchmakingUserDTO from "src/dtos/matchmaking.dto";
import { useUser } from "src/context/User/hooks/useUser";


export function MatchFoundViewModelFunction() {
  const nav = useNavigate();
  const { elo, league, username, avatar } = useUser();
  const { socket, matched } = useSocket()
  const { gameMode, pairId } = useMatchmakingSocket();
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [socketError, setSocketError] = useState('');

  const closeLoading = () => setLoading(false);
  const openLoading = () => setLoading(true);

  const decline = () => {
    if (socket) {
      matchDeclined(socket, pairId);
      setLoading(true);
    }
    else {
      setSocketError('Disconnected');
    }
  }

  const gameReady = (data: { game_id: number }) => {
    setLoading(false);

    nav(path, {
      replace: true,
      state: {
        id: data.game_id
      }
    });
  }

  // handler for user that declined the game
  const declineGame = () => {
    setLoading(false);
    nav('/dashboard')
  }

  // handler for user that was declined
  const gameDeclined = () => {
    setLoading(false);

    const data = new MatchmakingUserDTO(elo, gameMode);
    joinMatchQueue(socket!, data);
    nav('/searching')
  }

  const accept = () => {
    if (socket) {
      const new_path = "/".concat(gameMode).concat("-match")
      setPath(new_path);
      const data = {
        pair_id: pairId,
        game_mode: gameMode,
        league: league,
        username: username,
        avatar: avatar
      }

      matchAccepted(socket, data);
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

      socket.on("start_game", gameReady)


      return () => {
        socket.off("game_ready", gameReady);
        socket.off("decline_done", declineGame);
        socket.off("game_declined", gameDeclined);
        socket.off("start_game", gameReady)
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
    socketError,
    closeLoading,
    openLoading,
    matched
  };
}