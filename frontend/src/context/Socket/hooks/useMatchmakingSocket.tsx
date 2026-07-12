import { useCallback, useEffect, useState } from "react";
import { useSocket } from "./useSocket"
import MatchmakingUserDTO from '../../../dtos/matchmaking.dto';
import { Socket } from "socket.io-client";


export const useMatchmakingSocket = () => {
    const { socket, isConnected } = useSocket();
    const [game_mode, setGameMode] = useState('');
    const [pair_id, setPairId] = useState('');


    const handleMatched = useCallback((mode: string, pair_id: string) => {
        setGameMode(mode);
        setPairId(pair_id);

    }, [])


    useEffect(() => {

        if (!socket) return;

        socket.on("users_matched", (data) => { handleMatched(data.game_mode, data.pair_id) })

        return () => {
            socket.off("users_matched", (data) => { handleMatched(data.game_mode, data.pair_id) })

        }
    }, [socket])


    return { isConnected, game_mode, pair_id };
}

/// websocket functions for the app
export function joinMatchQueue(socket: Socket, data: MatchmakingUserDTO) {
    socket.emit("join_match_queue", data);
}

export function leaveMatchQueue(socket: Socket) {
    socket.emit("leave_match_queue");
}

export function matchAccepted(socket: Socket, pair_id: string) {
    socket.emit("match_accepted", pair_id)
}

export function matchDeclined(socket: Socket, pair_id: string) {
    socket.emit("match_declined", pair_id);
}
