import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "src/context/hooks/useSocket";

import MatchmakingUserDTO from "../dtos/matchmaking.dto";
import { joinMatchQueue } from "../services/websocket.service";

import { getUserToken, getUserElo } from "./SharedViewModel";


export function useSelectTopic() {
    const navigation = useNavigate();
    const [topic, setTopic] = useState('');
    const [elo, setElo] = useState<number>(0);
    const [token, setToken] = useState<string | null>(null);
    const { socket } = useSocket();

    useEffect(() => {
        getUserToken().then(t => setToken(t))
    }, [])

    useEffect(() => {
        if (!token) { return; }

        const getElo = async () => {
            const user_elo = await getUserElo(token);
            setElo(user_elo);
        }

        getElo();

    }, [token])

    const selectTopic = async (selected_topic: string) => {
        setTopic(selected_topic);

        if (!socket) throw new Error("500 Internal Server Error");

        const data = new MatchmakingUserDTO(elo, topic)

        joinMatchQueue(socket, data)
        navigation('/searching');

    }
    return selectTopic;
}