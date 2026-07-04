import axios from "axios";
import { useState, useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

export const getUserToken = async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    return idToken || null;
}

export async function getUsername(token: string | null) {
    if (!token) { throw new Error('Missing or Invalid Token') }
}

export async function getUserElo(token: string | null) {
    if (!token) { throw new Error('Missing or Invalid Token') }

    try {

        axios.get('http://localhost:3000/api/user/elo-get', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {

                if (res.status === 200)
                    return res.data.elo.rating
                else {
                    console.error(`Error: ${res.status}`)
                    console.error(`${res.data}`);
                    return null;
                }
            })
    }
    catch (error) {
        console.error(`Error getting user elo: ${error}`)
    }


}

export function useUser() {
    const [username, setUsername] = useState('');
    const [elo, setElo] = useState(0);
    const [current_streak, setCurrentStreak] = useState(0);
    const [winning_streak, setWinning_streak] = useState(0);
    const [token, setToken] = useState<string | null>(null);


    useEffect(() => {
        getUserToken().then(t => setToken(t))
    }, [])




    const getUserInfo = async () => {



        axios.get('http://localhost:3000/api/eo/elo-get', {

        })
    }
}