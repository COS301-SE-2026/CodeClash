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
    const [league, setLeague] = useState('');
    const { user, token} = useAuth();
 const [rank, setRank] = useState('');
  const userId = user?.userId ?? ""
    const username = user?.username ?? '';


    const getElo = async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            axios.get('/api/elo/elo-get', {
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
            axios.get('/api/user/avatar_id', {
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
            axios.get('/api/user/league', {
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


    const refresh = async () => {
        await Promise.all([
            getElo(),
            getAvatarUrl(),
            getLeague()
        ]);
    }

    const getRank = async () => {

        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            await axios.get('user/rank', {
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


    useEffect(() => {

        if (!token) return;

        const load = async () => {
            await Promise.all([
                getAvatarUrl(),
                getLeague(),
                getElo(),
                getRank()
            ]);
        }

        void load();
    }, [token])


    const value = useMemo(() => ({
        username, elo, avatar, error, league, userId, refresh, rank
    }), [username, elo, avatar, error, league, userId, rank])

    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}