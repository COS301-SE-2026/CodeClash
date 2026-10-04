import { useEffect, useState, useMemo } from "react"
import { useNavigate } from 'react-router-dom';
import { useMatchmaking } from "src/context/Matchmaking/hooks/useMatchmaking";
import { useSocket } from "src/context/Socket/hooks/useSocket"
import { useUser } from "src/context/User/hooks/useUser";
import type { MatchedUsersDTO } from "src/dtos/matchmaking/matched-user.dto";
import type { MatchAcceptedDTO } from "src/dtos/matchmaking/matchmaking.dto";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { getEquippedFor } from "src/services/shop.service";

import {
  matchFoundContent,
  type MatchFoundDetail,
  type MatchFoundPlayer,
} from 'src/Models/MatchFoundModel';
import { matchStart } from "src/services/match.service";
import { useMatchStore } from "src/stores/match-store";


export function useMatchFound() {
  const nav = useNavigate();
  const { league, username, avatar } = useUser();
  const { matchmakingSocket, matchSocket } = useSocket()
  const { matchType, group_id, matchedUsers, matchMode, reset } = useMatchmaking()
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [socketError, setSocketError] = useState('');
  const [players, setPlayers] = useState<MatchFoundPlayer[] | null>(null);
  const [matchDetails, setMatchDetails] = useState<MatchFoundDetail[] | null>(null);
  const [matchDeclined, setMatchDeclined] = useState(false);
  const [leftPlayerAvatar, setPlayerLeftAvatar] = useState<string | null>(null);
  const [rightPlayerAvatar, setRightPlayerAvatar] = useState<string | null>(null);

  const {token} = useAuth();
  const tokenInv = token ?? "";

  const closeLoading = () => setLoading(false);
  const openLoading = () => setLoading(true);

  const decline = () => {
    if (matchmakingSocket) {
      const data = {
        group_id,
        match_mode: matchMode!
      };

      matchmakingSocket.declineMatch(data);
      setLoading(true);
      reset();
      useMatchStore.getState().reset();
      nav('/match-searching')
    }
    else {
      setSocketError('Disconnected');
    }
  }


  const gameDeclined = () => {
    setLoading(false);
    setMatchDeclined(true);
    reset();
    useMatchStore.getState().reset();
    nav('/match-searching');
  }

  const accept = () => {
    if (matchmakingSocket && matchedUsers) {

      const new_path = "/".concat(matchedUsers.match_mode!).concat("-match")
      setPath(new_path);

      const data: MatchAcceptedDTO = {
        group_id: group_id,
        match_mode: matchedUsers.match_mode!,
        league: league,
        username: username,
        avatar: avatar,
        match_type: matchType!
      }

      matchmakingSocket.acceptMatch(data);
      setLoading(true);
    }
    else {
      setSocketError('Disconnected');
    }
  }

  const set_players = (matched_users: MatchedUsersDTO) => {
    if (!matched_users?.players) return

    const players: MatchFoundPlayer[] = matched_users.players.map((player, idx) => ({
      id: player.id,
      elo: player.elo,
      side: idx === 0 ? 'left' : 'right', //TOTO:   tournaments need a grid layout net sides
      username: player.username
    }));

    setPlayers(players)
  }


  const left_player_id = useMemo(() => players?.find(p => p.side === 'left')?.id, [players]) ?? "";
  const right_player_id = useMemo(() => players?.find(p => p.side === 'right')?.id, [players]) ?? "";

  //the following was copied and pasted from Match View Model and was all hand written code that was copied and pasted
  // for the sake of time, none of this code in the following block was ai generated!

  useEffect(() => {
    if(!left_player_id || !tokenInv){
        return
    }

    let cancelled = false;

    getEquippedFor(left_player_id, tokenInv).then(({ avatarImage }) => {
        const avatarImg = avatarImage ?? "";
        const avatarCropStart = avatarImg.replace("/src/assets/Shop/Avatars/", "");
        const avatarCropEnd = avatarCropStart.replace(".png", "");
        const avatarImageCrop = avatarCropEnd ?? "";

        if(!cancelled){
            setPlayerLeftAvatar(avatarImageCrop)
        }
    }).catch((err) => {
        console.error('Failed to fetch left player avatar', err);
    });

    return () => { cancelled = true; };
  }, [left_player_id, tokenInv])
  

  
  useEffect(() => {
    if(!right_player_id || !tokenInv){
        return
    }

    let cancelled = false;

    getEquippedFor(right_player_id, tokenInv).then(({ avatarImage }) => {
        const avatarImg = avatarImage ?? "";
        const avatarCropStart = avatarImg.replace("/src/assets/Shop/Avatars/", "");
        const avatarCropEnd = avatarCropStart.replace(".png", "");
        const avatarImageCrop = avatarCropEnd ?? "";

        if(!cancelled){
            setRightPlayerAvatar(avatarImageCrop)
        }
    }).catch((err) => {
        console.error('Failed to fetch right player avatar', err);
    });

    return () => { cancelled = true; };
  }, [right_player_id, tokenInv])


  //////////////////////////////////////////////


  const set_detais = () => {
    const type: MatchFoundDetail = {
      label: "Match Type",
      value: matchType!
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

    if (matchmakingSocket && matchSocket) {

      const unsub_start = matchStart(matchSocket,path, nav);
      const unsub_match_declined = matchmakingSocket.gameDeclined(gameDeclined);
      const unsub_start_failed = matchSocket.startMatchError(()=>{console.error("Error starting match")})

      return () => {
        unsub_start();
        unsub_match_declined();
        unsub_start_failed();
      }
    }
  }, [matchmakingSocket, path, matchedUsers])

  return {
    content: matchFoundContent,
    players,
    leftPlayerAvatar,
    rightPlayerAvatar,
    matchDetails,
    decline,
    accept,
    loading,
    socketError,
    closeLoading,
    openLoading,
    matchedUsers,
    matchDeclined
  };
}