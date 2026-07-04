import { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { joinMatchQueue } from "../services/websocket.service";
import MatchmakingUserDTO from "../dtos/matchmaking.dto";
import { getUserToken } from "./Shared.ViewModel";
import { useSocket } from "src/context/SocketContext";



export function useSelectTopic() {
    const navigation = useNavigate();
    const [topic, setTopic] = useState('');
    const [elo, setElo] = useState(0);
    const [token, setToken] = useState<string | null>(null);
    const { socket } = useSocket();

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

        if (!socket) throw new Error("500 Internal Server Error");

        const data = new MatchmakingUserDTO(elo, selected_topic)

        joinMatchQueue(socket, data)
        navigation('/searching');

    }
    return selectTopic;
}