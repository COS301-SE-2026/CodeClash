import React, { useEffect, useState, type ReactNode } from "react";
import { UserContext } from "./UserContextValue";
import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuth } from "../Auth/hooks/useAuth";


const url = 'http://localhost3000/api/';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState('');
    const [elo, setElo] = useState(0);
    const [avatar_url, setAvatarUrl] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState<string | undefined>('');

    const getToken = async () => {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (idToken)
            setToken(idToken)
        else
            setError(`Error Getting User Token`);
    }

    const getElo = async (token: string | null) => {
        if (!token) {
            throw new Error('Missing or Invalid Token');
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

    const getUsername = () => {
        const { user } = useAuth();

        const username = user?.username;

        if (username && username.length > 0)
            setUsername(username);
        else setError(`Error Getting Username`)
    }

    

    useEffect(() => {

    })



    return (
        <UserContext.Provider
            value={{
                username,
                elo,
                avatar_url,
                error,
                token
            }}
        >

        </UserContext.Provider>
    )
}