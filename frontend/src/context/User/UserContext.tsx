import React, { useEffect, useState, type ReactNode } from "react";
import { UserContext } from "./UserContextValue";
import axios from "axios";
import { fetchAuthSession, type AuthUser } from "aws-amplify/auth";
import { useAuth } from "../Auth/hooks/useAuth";
import { robot_map } from "src/assets/Robots";


const url = 'http://localhost:3000/api/';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState('');
    const [elo, setElo] = useState(0);
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState<string | undefined>('');
    const { user } = useAuth();

    const getToken = async () => {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (idToken)
            setToken(idToken)
        else
            setError(`Error Getting User Token`);
    }

    const getElo = async (token: string | undefined) => {
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
                    }
                    else {
                        setError(`Error: ${res.status} ${res.data}`);
                    }
                })
        } catch (error) {
            setError(`Error Getting User Elo: ${error}`);

        }
    }

    const getAvatarUrl = async (token: string | undefined) => {
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
                        const index = res.data;
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

    const getUsername = (user: AuthUser | null) => {

        const username = user?.username;

        if (username && username.length > 0)
            setUsername(username);
        else setError(`Error Getting Username`)
    }


    useEffect(() => {
        getToken();
    }, [token])

    useEffect(() => {
        getElo(token);
        getAvatarUrl(token)
        getUsername(user);
    }, [token,user])



    return (
        <UserContext.Provider
            value={{
                username,
                elo,
                avatar,
                error,
                token
            }}
        >
            {children}
        </UserContext.Provider>
    )
}