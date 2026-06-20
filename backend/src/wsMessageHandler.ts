import WebSocket from "ws";
import UserDto from "./Matchmaking Service/matchmaking.dto";
import {dequeue, enqueue} from "./Matchmaking Service/matchmaking.service"
import { removeConnection } from "./wsClients";

export const handleMessage = async(ws: WebSocket, data: string, client: UserDto) => {
    
}