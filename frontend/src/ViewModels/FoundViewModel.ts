import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { joinMatchQueue, useMatchmakingSocket } from "src/context/Socket/hooks/useMatchmakingSocket";
import { useSocket } from "src/context/Socket/hooks/useSocket"
import { matchAccepted, matchDeclined } from "src/context/Socket/hooks/useMatchmakingSocket"
import type MatchmakingUserDTO from "src/dtos/matchmaking.dto";


export function useFound() {
    const { socket } = useSocket()
    const { game_mode, pair_id } = useMatchmakingSocket();
    const [path, setPath] = useState('');
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);

    const decline = () => {
        if (socket) {
            matchDeclined(socket, pair_id);
            setLoading(true);
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

        const data = new MatchmakingUserDTO()
        joinMatchQueue(socket,)
    }

    const accept = () => {
        if (socket) {
            setPath(game_mode.concat("-match"));
            matchAccepted(socket, pair_id);
            setLoading(true);
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

    return { decline, accept, loading }
}