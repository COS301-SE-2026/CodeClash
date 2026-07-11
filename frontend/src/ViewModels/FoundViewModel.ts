import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useMatchmakingSocket } from "src/context/Socket/hooks/useMatchmakingSocket";
import { useSocket } from "src/context/Socket/hooks/useSocket"
import { matchAccepted, matchDeclined } from "src/context/Socket/hooks/useMatchmakingSocket"


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

    const gameDecline = () => {
        setLoading(false);
        nav('/dashboard')
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

            socket.on("decline_done", gameDecline);


            return () => {
                socket.off("game_ready", gameReady);
                socket.off("decline_done", gameDecline);
            }
        }
    }, [socket])

    return { decline, accept, loading }
}