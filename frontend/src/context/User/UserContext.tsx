import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { robot_map } from "src/assets/Robots";
import { API } from "src/services/api.service";
import { useAuth } from "../Auth/hooks/useAuth";

import { UserContext } from "./UserContextValue";

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [elo, setElo] = useState(0);
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState('');
    const [league, setLeague] = useState('');
    const { user, token} = useAuth();
    const [rank, setRank] = useState(0);
    const [current_streak, setCurrentStreak] = useState<number>(0);
    const [winning_streak, setWinningStreak] = useState<number>(0);

    const userId = user?.userId ?? ""
    const username = user?.username ?? '';


    const getElo = async () => {

        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }


        try {

            API.get('elo/elo-get', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    if (res.status === 200) {

                        setElo(res.data.rating)
                        setError('');
                    }
                    else {
                        setError(`Error: ${res.status} ${res.data}`);
                    }
                })
        } catch (error) {
            setError(`Error Getting User Elo: ${error}`);

        }
    }

    const getAvatarUrl = async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            API.get('user/avatar_id', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    if (res.status === 200) {

                        const index = res.data.avatar_id;
                        setAvatar(robot_map[index]);
                    }
                    else {
                        setError(`Error: ${res.status} ${res.data}`);
                    }
                })
        }
        catch (error) {
            setError(`Error Getting User Avatar: ${error}`);
        }
    }


    const getLeague = async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            API.get('user/league', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    if (res.status === 200) {
                        setLeague(res.data.league);
                    }
                    else {
                        setError(`Error: ${res.status} ${res.data}`);
                    }
                })

        }
        catch (error) {
            setError(`Error Getting User League: ${error}`);
        }
    }


    const getRank = async () => {

        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            await API.get('user/rank', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {
                    if (res.status === 200) {
                        setRank(res.data.rank);
                    }
                    else {
                        setError(`Error: ${res.status} ${res.data}`)
                    }
                })
        }
        catch (error) {
            setError(`Error Getting User Rank: ${error}`);
        }

    }

    const getCurrentStreak =  async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }
        try{
            const res = await API.get('user/current_streak', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) setCurrentStreak(res.data.current_streak);
        }catch (error) {
            console.error('getCurrentRank failed', error);
        }
    };

    const getWinningStreak =  async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }
        try{
            const res = await API.get('user/winning_streak', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) setWinningStreak(res.data.winning_streak);
        }catch (error) {
            console.error('getCurrentRank failed', error);
        }
    };
    const refresh = async () =>{
        await Promise.all([
            getElo(),
            getAvatarUrl(),
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
                getAvatarUrl(),
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
        username, elo, avatar, error, league, userId, refresh, rank, current_streak, winning_streak
    }), [username, elo, avatar, error, league, userId, rank, current_streak, winning_streak])

    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}