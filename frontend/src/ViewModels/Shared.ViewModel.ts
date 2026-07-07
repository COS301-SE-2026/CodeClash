import axios from "axios";
import { useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuth } from "src/context/AuthContext";

export const getUserToken = async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    return idToken || null;
}


export async function getUserElo(token: string | null): Promise<number | null> {
    if (!token) { throw new Error('Missing or Invalid Token') }

    try {
        const getElo = await axios.get('http://localhost:3000/api/elo/elo-get', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {

                if (res.status === 200) {
                    return res.data.rating
                }
                else {
                    console.error(`Error: ${res.status}`)
                    console.error(`${res.data}`);
                }
            })


        return getElo;
    }
    catch (error) {
        console.error(`Error getting user elo: ${error}`)
        return null;
    }


}

export function useUsername() {
    const { user } = useAuth();
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (user)
            setUsername(user.username);
    })

    return { username };
}


export function useUser() {
    const [username, setUsername] = useState('');
    const [elo, setElo] = useState(0);
    const [current_streak, setCurrentStreak] = useState(0);
    const [winning_streak, setWinning_streak] = useState(0);
    const [token, setToken] = useState<string | null>(null);
    const { user } = useAuth();



    useEffect(() => {
        getUserToken().then(t => setToken(t))

        if (user)
            setUsername(user.username);

        getUserInfo()


    }, [user])


    const getUserInfo = async () => {


        // axios.get('http://localhost:3000/api/eo/elo-get', {

        // })
    }



    return { username }
}