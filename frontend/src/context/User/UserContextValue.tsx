import { createContext } from "react";

export interface UserContextValue {
    username: string,
    elo: number,
    avatar_url: string,
    error: string,
    token: string | undefined
}

export const UserContext = createContext<UserContextValue | null>(null);