import { useNavigate } from "react-router-dom";
import { useMatchmaking } from "src/context/Matchmaking/hooks/useMatchmaking";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { useUser } from "src/context/User/hooks/useUser";
import type { MatchmakingUserDTO } from "src/dtos/matchmaking/matchmaking.dto";
import type { MatchMode } from "src/dtos/match/match.dto";

export function useSelectTopic() {
    const navigation = useNavigate();
    const { matchmakingSocket } = useSocket();
    const { elo } = useUser();
    const { gameType, reset } = useMatchmaking()

    const selectTopic = (selected_topic: MatchMode) => {
        if (!matchmakingSocket) throw new Error("500 Internal Server Error");

        const data: MatchmakingUserDTO = {
            elo: elo,
            match_mode: selected_topic,
            match_type: gameType!
        }

        matchmakingSocket.joinQueue(data);
        navigation('/match-searching');

    }

    const cancel = () => {
        if (!matchmakingSocket) throw new Error("500 Internal Server Error");

        matchmakingSocket.leaveQueue();
        reset();
    }
    return { selectTopic, cancel };
}