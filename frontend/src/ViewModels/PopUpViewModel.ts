import { useNavigate } from "react-router-dom";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { useUser } from "src/context/User/hooks/useUser";

import { joinMatchQueue } from "../context/Socket/hooks/useMatchmakingSocket";
import MatchmakingUserDTO from "../dtos/matchmaking.dto";


export function useSelectTopic() {
    const navigation = useNavigate();
    const { socket } = useSocket();
    const { elo } = useUser();

    const selectTopic = async (selected_topic: string) => {

        if (!socket) throw new Error("500 Internal Server Error");

        const data = new MatchmakingUserDTO(elo, selected_topic)

        console.log(data)
        joinMatchQueue(socket, data)
        navigation('/match-searching');

    }
    return selectTopic;
}