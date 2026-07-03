import { useEffect, useState } from "react";
import axios from 'axios'
import { fetchAuthSession } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { createSocket, joinMatchQueue } from "../services/websocket.service";
import MatchmakingUserDTO from "../dtos/matchmaking.dto";


const getUserToken = async () => {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    return idToken || null;
}

export function useSelectTopic() {
    const navigation = useNavigate();
    const [topic, setTopic] = useState('');
    const [elo, setElo] = useState(0);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        getUserToken().then(t => setToken(t))
    }, [])

    useEffect(() => {
        if (!token) { return; }

        try {

            axios.get('http://localhost:3000/api/elo/elo-get', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((res) => {

                    if (res.status === 200)
                        setElo(res.data.elo.rating)
                    else {
                        console.error(`Error: ${res.status}`)
                        console.error(`${res.data}`);
                    }
                })
        }
        catch {
            console.error('Error sending request')
        }
    }, [token])

    const selectTopic = async (selected_topic: string) => {
        setTopic(selected_topic);
        
        const data = new MatchmakingUserDTO(elo, selected_topic)

        joinMatchQueue(data)

        // navigation('/searching');

    }
    return selectTopic;
}