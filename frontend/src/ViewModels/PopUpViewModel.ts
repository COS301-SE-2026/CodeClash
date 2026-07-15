import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "src/context/Socket/hooks/useSocket";

import MatchmakingUserDTO from "../dtos/matchmaking.dto";
import { joinMatchQueue } from "../context/Socket/hooks/useMatchmakingSocket";
import { useUser } from "src/context/User/hooks/useUser";


export function useSelectTopic() {
    const navigation = useNavigate();
    const [topic, setTopic] = useState('');
    const { socket } = useSocket();
    const { elo } = useUser();

    const selectTopic = async (selected_topic: string) => {
        setTopic(selected_topic);

        if (!socket) throw new Error("500 Internal Server Error");

        console.log("Topic: ", topic)
        const data = new MatchmakingUserDTO(elo, selected_topic)

        joinMatchQueue(socket, data)
        navigation('/searching');

    }
    return selectTopic;
}