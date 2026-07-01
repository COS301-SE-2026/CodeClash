import WebSocket from "ws";
import UserDto from "../../frontend/src/dtos/matchmaking.dto";

const clientList = new Map<UserDto, WebSocket>();

export const registerConnection = (user : UserDto, ws : WebSocket) =>
    clientList.set(user, ws);

export const removeConnection = (user : UserDto) =>
    clientList.delete(user);

export const getConnection = (user : UserDto) =>
    clientList.get(user);
 

export default clientList;