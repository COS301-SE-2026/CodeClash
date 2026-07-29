import { type AuthUser } from "aws-amplify/auth";
import axios from "axios";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { robot_map } from "src/assets/Robots";

import { useAuth } from "../Auth/hooks/useAuth";

import { UserContext } from "./UserContextValue";



const url = import.meta.env.VITE_API_URL;


export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState('');
    const [elo, setElo] = useState(0);
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState('');
    const [league, setLeague] = useState('');
    const { user, token, isLoading } = useAuth();


    const getElo = async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }

        try {
            await axios.get(url.concat('elo/elo-get'), {
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
            await axios.get(url.concat('user/avatar_id'), {
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
            await axios.get(url.concat('user/league'), {
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

    const getUsername = (user: AuthUser | null) => {
        const username = user?.username;

        if (username && username.length > 0)
            setUsername(username);
        else setError(`Error Getting Username`)
    }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
        getElo();
        getAvatarUrl()
        getLeague();

        if (!isLoading) {
            getUsername(user);

        }
    }, [token, user])


    const value = useMemo(() => ({
        username, elo, avatar, error, league
    }), [username, elo, avatar, error, league])

    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}