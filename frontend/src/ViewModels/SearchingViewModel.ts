import { useEffect, useState } from "react";
import { useSocket } from "src/context/SocketContext";

export function useSearch() {

    const [found, setFound] = useState(false);
    const { socket } = useSocket();

    useEffect(() => {
        console.log("use search")

        console.log("Socket: ", socket)
        if (socket) {

            socket.on("users_matched", () => {
                console.log("Users matched")
                handleMatched()
            })

            return () => {
                console.log("returning")
                socket.off("users_matched", () => handleMatched())
            }
        }
    }, [socket])

    const matched = (match: boolean) => {
        setFound(match);
    }

    const handleMatched = () => {
        console.log("Calling handleMatched")
        matched(true)
    };


    return { matched, found };
}