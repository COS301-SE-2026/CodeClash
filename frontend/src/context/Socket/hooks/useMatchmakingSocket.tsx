import { useCallback, useEffect, useState } from "react";
import { useSocket } from "./useSocket"


export const useMatchmakingSocket = () => {
    const { socket, isConnected } = useSocket();
    const [game_mode, setGameMode] = useState('');
    const [pair_id, setPairId] = useState('');


    const handleMatched = useCallback((game_mode:string, pair_id:string) => {
        
            setGameMode(game_mode);
            setPairId(pair_id);
    
    }, [])


    useEffect(() => {

        if (!socket) return;


        socket.on("users_matched", (data) => {handleMatched(data)})
        
    }, [socket])


    return { isConnected, game_mode, pair_id };
}