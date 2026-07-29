import { useNavigate } from "react-router-dom";
import { useMatchmaking } from "src/context/Socket/hooks/useMatchmaking";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { useUser } from "src/context/User/hooks/useUser";
import type { GameMode, MatchmakingUserDTO } from "src/dtos/matchmaking.dto";



export function useSelectTopic() {
    const navigation = useNavigate();
    const { socket } = useSocket();
    const { elo, username } = useUser();
    const { joinMatchQueue, gameType, leaveMatchQueue } = useMatchmaking()

    const selectTopic = (selected_topic: GameMode) => {
        if (!socket) throw new Error("500 Internal Server Error");

        const data: MatchmakingUserDTO = {
            username:username,
            elo: elo,
            game_mode: selected_topic,
            game_type: gameType
        }

        joinMatchQueue(socket, data)
        navigation('/match-searching');

    }

    const cancel = () => {
        if (!socket) throw new Error("500 Internal Server Error");

        leaveMatchQueue(socket)
    }
    return { selectTopic, cancel };
}