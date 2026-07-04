import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "src/context/SocketContext";



export function useSearch() {
    const [found, setFound] = useState(false);
    const nav = useNavigate();
    const { socket } = useSocket();


    const matched = (match: boolean) => {
        setFound(match);

        if (match)
            nav('/found')

        else return found;
    }

    return matched;
}