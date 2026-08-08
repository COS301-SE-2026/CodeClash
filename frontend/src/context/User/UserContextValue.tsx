import { createContext } from "react";

export interface UserContextValue {
    username: string,
    elo: number,
    avatar: string,
    error: string,
    league: string,
    rank: number
}

export const UserContext = createContext<UserContextValue | null>(null);