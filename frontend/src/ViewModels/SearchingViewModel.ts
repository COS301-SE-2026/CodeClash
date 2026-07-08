import { useCallback, useEffect, useState } from "react";
import { useSocket } from "src/context/hooks/useSocket";

export function useSearch() {

    const [found, setFound] = useState(false);
    const { socket } = useSocket();

    const matched = useCallback((match: boolean) => {
        setFound(match);
    }, [setFound])

    const handleMatched = useCallback(() => {
        matched(true)
    }, [matched]);

    useEffect(() => {
        if (socket) {

            socket.on("users_matched", () => {
                handleMatched()
            })

            return () => {
                socket.off("users_matched", () => handleMatched())
            }
        }
    }, [socket, handleMatched])


    return { matched, found };
}