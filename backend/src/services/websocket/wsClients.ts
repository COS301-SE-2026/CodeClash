import WebSocket from "ws";
import MatchmakingUserDTO from "../../dtos/matchmaking.dto";

const clientList = new Map<MatchmakingUserDTO, WebSocket>();

export const registerConnection = (user : MatchmakingUserDTO, ws : WebSocket) =>
    clientList.set(user, ws);

export const removeConnection = (user : MatchmakingUserDTO) =>
    clientList.delete(user);

export const getConnection = (user : MatchmakingUserDTO) =>
    clientList.get(user);
 

export default clientList;