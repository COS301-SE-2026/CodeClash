import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom';
import { useMatchmaking } from "src/context/Matchmaking/hooks/useMatchmaking";
import { useSocket } from "src/context/Socket/hooks/useSocket"
import { useUser } from "src/context/User/hooks/useUser";
import type { MatchedUsersDTO } from "src/dtos/matchmaking/matched-user.dto";
import type { MatchmakingUserDTO, MatchAcceptedDTO } from "src/dtos/matchmaking/matchmaking.dto";

import {
  matchFoundContent,
  type MatchFoundDetail,
  type MatchFoundPlayer,
} from 'src/Models/MatchFoundModel';




export function useMatchFound() {
  const nav = useNavigate();
  const { league, username, avatar, elo } = useUser();
  const { matchmaking_socket } = useSocket()
  const { gameType, pairId, matchedUsers, match_mode } = useMatchmaking()
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [socketError, setSocketError] = useState('');
  const [players, setPlayers] = useState<MatchFoundPlayer[] | null>(null);
  const [matchDetails, setMatchDetails] = useState<MatchFoundDetail[] | null>(null);

  const closeLoading = () => setLoading(false);
  const openLoading = () => setLoading(true);

  const decline = () => {
    if (matchmaking_socket) {
      matchmaking_socket.declineMatch(pairId);
      setLoading(true);
    }
    else {
      setSocketError('Disconnected');
    }
  }

  const gameReady = (match_id: string) => {
    setLoading(false);

    nav(`${path}/${match_id}`);
  }

  // handler for user that declined the game
  // const declineGame = () => {
  //   setLoading(false);
  //   nav('/dashboard')
  // }

  // handler for user that was declined
  const gameDeclined = () => {
    setLoading(false);

    const data: MatchmakingUserDTO = {
      elo: elo,
      match_mode: match_mode!,
      match_type: gameType!
    };

    matchmaking_socket?.joinQueue(data);
    nav('/searching')
  }

  const accept = () => {
    if (matchmaking_socket && matchedUsers) {
      const new_path = "/".concat(matchedUsers.match_mode!).concat("-match")
      setPath(new_path);
      const data: MatchAcceptedDTO = {
        pair_id: pairId,
        match_mode: matchedUsers.match_mode!,
        league: league,
        username: username,
        avatar: avatar,
        match_type: gameType!
      }

      matchmaking_socket.acceptMatch(data);
      setLoading(true);
    }
    else {
      setSocketError('Disconnected');
    }
  }

  const set_players = (matched_users: MatchedUsersDTO) => {
    if (!matched_users?.players) return

    const players: MatchFoundPlayer[] = matched_users.players.map((player,idx)=>({
      id: player.id,
      elo: player.elo,
      side: idx === 0? 'left': 'right', //TOTO:   tournaments need a grid layout net sides
      username: player.username
    }));

    setPlayers(players)
  }

  const set_detais = () => {
    const type: MatchFoundDetail = {
      label: "Match Type",
      value: gameType!
    }

    const mode: MatchFoundDetail = {
      label: "Match Mode",
      value: matchedUsers!.match_mode!
    }

    setMatchDetails([type, mode])
  }

  useEffect(() => {

    if (matchedUsers) {
      set_players(matchedUsers);
      set_detais();
    }

    if (matchmaking_socket) {

      const unsub_ready = matchmaking_socket.matchReady(gameReady);
      const unsub_match_declined = matchmaking_socket.gameDeclined(gameDeclined);

      return () => {
        unsub_ready();
        unsub_match_declined();
      }
    }
  }, [matchmaking_socket, path, matchedUsers])

  return {
    content: matchFoundContent,
    players,
    matchDetails,
    decline,
    accept,
    loading,
    socketError,
    closeLoading,
    openLoading,
    matchedUsers
  };
}