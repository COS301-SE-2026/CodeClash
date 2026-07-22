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
import type { QuestionDTO } from 'src/dtos/game-questionDTO';


export function MatchFoundViewModelFunction() {
  const nav = useNavigate();
  const { elo, league } = useUser();

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

  const gameReady = (data: QuestionDTO) => {
    
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
      const new_path ="/".concat(game_mode).concat("-match")
      setPath(new_path);
      const data = {
        pair_id: pair_id,
        game_mode: game_mode,
        league: league
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
    socket_error,
    closeLoading,
    openLoading
  };
}