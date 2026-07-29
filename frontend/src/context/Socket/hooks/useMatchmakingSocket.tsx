import { useContext } from "react";
import { MatchmakingContext, type MatchmakingContextValue } from "../MatchmakingContextValue";



export const useMatchmaking = (): MatchmakingContextValue =>{
    const context = useContext(MatchmakingContext);

    if(!context) throw new Error("useMatchmaking must be used within a Matchmaking Provider")
        return context;
}