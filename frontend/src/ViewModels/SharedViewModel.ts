import { fetchAuthSession } from "aws-amplify/auth";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "src/context/hooks/useAuth";

export const getUserToken = async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    return idToken || null;
}


export async function getUserElo(token: string | null): Promise<number> {
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
                    return 0
                }
            })


        return getElo;
    }
    catch (error) {
        console.error(`Error getting user elo: ${error}`)
        return -1;
    }


}

export function useUsername() {
    const { user } = useAuth();

    const username = user ? user.username : "";

    return username;
}


export function useUser() {
    const [elo, setElo] = useState<number | null>(0);
    // const [current_streak, setCurrentStreak] = useState(0);
    // const [winning_streak, setWinning_streak] = useState(0);
    const [token, setToken] = useState<string | null>(null);
    const username = useUsername();



    useEffect(() => {

        getUserToken().then(t => setToken(t))
        getUserElo(token).then(e=> setElo(e))


    }, [token])

    return { username, elo }
}