import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useSocket } from "src/context/hooks/useSocket"
import { leaveMatchQueue, matchAccepted } from "src/services/websocket.service"


export function useFound() {
    const { socket, game_mode } = useSocket()
    const path = game_mode.concat("-match");
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);

    const decline = () => {
        if (socket)
            leaveMatchQueue(socket);
    }

    const gameReady = () => {
        setLoading(false);
        nav(path);
    }

    const accept = () => {
        console.log("Match accepted")
        if (socket) {
            matchAccepted(socket);
            setLoading(true);
        }
    }

    useEffect(() => {
        if (socket) {
            socket.on("game_ready", gameReady);


            return () => {
                socket.off("game_ready", gameReady)
            }
        }
    }, [socket])

    return { decline, accept, loading }
}