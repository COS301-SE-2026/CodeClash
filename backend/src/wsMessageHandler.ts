import WebSocket from "ws";
import UserDto from "./Matchmaking Service/matchmaking.dto";
import {dequeue, enqueue, math_queue_length, prog_queue_length} from "./Matchmaking Service/matchmaking.service"
import { removeConnection } from "./wsClients";

export const handleMessage = async(ws: WebSocket, data: string, client: UserDto) => {
    let message: any;

    try{
        message = JSON.parse(data);
    }
    catch{
        ws.send(JSON.stringify({type: 'ERROR', message: 'Invalid JSON Data'}));
        return;
    }

    if(message.type === "JOIN_QUEUE"){
        await enqueue(client, client.game_mode);
        if(client.game_mode === "math"){
            ws.send(JSON.stringify({type: "QUEUED", position: `${math_queue_length}`}))
        }
        else if(client.game_mode === "prog"){
            ws.send(JSON.stringify({type: "QUEUED", position: `${prog_queue_length}`}))
        }
    }
}