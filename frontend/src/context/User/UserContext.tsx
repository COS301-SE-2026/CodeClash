import axios from "axios";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { robot_map } from "src/assets/Robots";

import { useAuth } from "../Auth/hooks/useAuth";
import { UserContext } from "./UserContextValue";



const url = import.meta.env.VITE_API_URL;

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [elo, setElo] = useState(0);
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState('');
    const [rank, setRank] = useState(0);
    const { user, token, isLoading } = useAuth();
 
    const userId = user?.userId ?? ""
    const username = user?.username ?? '';


    const getElo = async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            axios.get(url.concat('elo/elo-get'), {
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
            axios.get(url.concat('user/avatar_id'), {
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

    const getRank = async () => {

        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            await axios.get(url.concat('user/rank'), {
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
            console.error('getRank failed', error);
            setError(`Error Getting User Rank: ${error}`);
        }

    }

    const refresh = async () =>{
        await Promise.all([
            getElo(),
            getAvatarUrl(),
            getRank()
        ])
    }


    useEffect(() => {

        if (!token) return;

        const load = async () => {
            await Promise.all([
                getAvatarUrl(),
                getElo(),
                getRank(),
            ]);
        }

        void load();
    }, [token])


    const value = useMemo(() => ({
        username, elo, avatar, error, userId, refresh, rank
    }), [username, elo, avatar, error, userId, rank])

    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}