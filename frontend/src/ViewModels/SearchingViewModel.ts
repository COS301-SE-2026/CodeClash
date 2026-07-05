import { useEffect, useState } from "react";
import { useSocket } from "src/context/SocketContext";

export function useSearch() {

    const [found, setFound] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {

            socket.on("users_matched", () => {
                handleMatched()
            })

            return () => {
                socket.off("users_matched", () => handleMatched())
            }
        }
    }, [socket])

    const matched = (match: boolean) => {
        setFound(match);
    }

    const handleMatched = () => {
        matched(true)
    };


    return { matched, found };
}