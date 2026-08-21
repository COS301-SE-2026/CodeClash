import { useEffect, useState } from "react"
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { useMatchmaking } from "src/context/Socket/hooks/useMatchmaking";
import { useUser } from "src/context/User/hooks/useUser";
import type { GameType } from "src/dtos/matchmaking.dto";

export function useDashboardViewModel() {
    const [isOpen, setIsOpen] = useState(false);
    const {setGameType} = useMatchmaking();
    const {username, elo, avatar, league, refresh} = useUser()
    const {isLoading} = useAuth()

    useEffect(()=>{
        refresh();
    },[isLoading])

    const openPopUp = (type: GameType) => {
        setGameType(type)
        setIsOpen(true);
    }
    const closePopUp = () => {
        setIsOpen(false);
        setGameType(null)
    }

    return { 
        isOpen, 
        openPopUp, 
        closePopUp,
        username,
        elo,
        avatar,
        league,
        isLoading
    };
}

