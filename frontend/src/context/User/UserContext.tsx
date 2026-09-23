import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { robot_map } from "src/assets/Robots";
import { authGet } from "src/services/api.service";
import { useInventory } from "../Shop/InventoryContext";
import { useAuth } from "../Auth/hooks/useAuth";

import { UserContext } from "./UserContextValue";

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [elo, setElo] = useState(0);
    const [error, setError] = useState('');
    const [league, setLeague] = useState('');
    const { user, token } = useAuth();
    const [rank, setRank] = useState(0);
    const [current_streak, setCurrentStreak] = useState<number>(0);
    const [winning_streak, setWinningStreak] = useState<number>(0);

    const userId = user?.userId ?? ""
    const username = user?.username ?? '';

    const {equippedAvatarImage, equippedAvatarBodyType, equippedAccessoryImage} = useInventory();
    const avatar = equippedAvatarImage ?? '';
    const avatarBodyType = equippedAvatarBodyType;
    const accessoryImages = equippedAccessoryImage;

    const getElo = async () => {
        try {
            const data = await authGet<{ elo: number }>('user/elo', token!);
            setElo(data.elo);
        } catch (error) {
            setError(`Error Getting User Elo: ${error}`);  ///TODO: connect to notification system

        }
    }

    const getLeague = async () => {
        try {
            const data = await authGet<{ league: string }>('user/league', token!);
            setLeague(data.league);

        }
        catch (error) {
            setError(`Error Getting User League: ${error}`); ///TODO: connect to notification system
        }
    }


    const getRank = async () => {

        try {
            const data = await authGet<{ rank: number }>('user/rank', token!);
            setRank(data.rank);
        }
        catch (error) {
            setError(`Error Getting User Rank: ${error}`); ///TODO: connect to notification system
        }

    }

    const getCurrentStreak = async () => {
        try {
            const data = await authGet<{ current_streak: number }>('user/current_streak', token!);
            setCurrentStreak(data.current_streak);
        }
        catch (error) {
            console.error('getCurrentRank failed', error);
        }
    };

    const getWinningStreak = async () => {
        try {
            const data = await authGet<{ winning_streak: number }>('/user/winning_streak', token!);
            setWinningStreak(data.winning_streak);
        }
        catch (error) {
            console.error('getCurrentRank failed', error);
        }
    };

    const refresh = async () => {

        if (!token) return;
        
        await Promise.all([
            getElo(),
            getLeague(),
            getRank(),
            getCurrentStreak(),
            getWinningStreak()
        ])
    }


    useEffect(() => {

        if (!token) return;

        const load = async () => {
            await Promise.all([
                getLeague(),
                getElo(),
                getRank(),
                getCurrentStreak(), // copied from above
                getWinningStreak()
            ]);
        }

        void load();
    }, [token])


    const value = useMemo(() => ({
        username, elo, avatar, avatarBodyType, accessoryImages, error, league, userId, refresh, rank, current_streak, winning_streak
    }), [username, elo, avatar, avatarBodyType, accessoryImages, error, league, userId, rank, current_streak, winning_streak])

    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}