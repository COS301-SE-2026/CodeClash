import { createContext } from "react";

export interface UserContextValue {
    username: string,
    elo: number,
    avatar: string,
    error: string,
    league: string,
    userId: string,
    refresh: () => Promise<void>
    rank: number,
    current_streak: number,
    winning_streak: number
}

export const UserContext = createContext<UserContextValue | null>(null);