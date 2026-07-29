import { useCallback, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

import MatchmakingUserDTO from '../../../dtos/matchmaking.dto';

import { useSocket } from "./useSocket"


export const useMatchmakingSocket = () => {
    const { socket, isConnected, matched } = useSocket();
    const [gameMode, setGameMode] = useState('');
    const [pairId, setPairId] = useState('');


    const handleMatched = useCallback((mode: string, pair_id: string) => {
        setGameMode(mode);
        setPairId(pair_id);
    }, [])


    useEffect(() => {
        if (!socket) return;
        
      if (matched) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
            handleMatched(matched.game_mode, matched.pair_id)
        }
    }, [socket])


    return { isConnected, gameMode, pairId };
}

/// websocket functions for the app
export function joinMatchQueue(socket: Socket, data: MatchmakingUserDTO) {
    socket.emit("join_match_queue", data);
}

export function leaveMatchQueue(socket: Socket) {
    socket.emit("leave_match_queue");
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function matchAccepted(socket: Socket, data: {}) {
    socket.emit("match_accepted", data)
}

export function matchDeclined(socket: Socket, pair_id: string) {
    socket.emit("match_declined", pair_id);
}
