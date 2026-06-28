import WebSocket from "ws";
import UserDto from "./dtos/matchmaking.dto";
import {dequeue, enqueue, math_queue_length, prog_queue_length} from "./services/matchmaking.service"
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

        if(client.game_mode === "math"){
            await enqueue(client, client.game_mode);
            ws.send(JSON.stringify({type: "QUEUED", position: `${math_queue_length}`}))
        }
        else if(client.game_mode === "prog"){
            await enqueue(client, client.game_mode);
            ws.send(JSON.stringify({type: "QUEUED", position: `${prog_queue_length}`}))
        }
        else{
            ws.send(JSON.stringify({type: "ERROR", message: 'User has invalid game_mode provided to it'}))
        }
    }
    else if(message.type === "LEAVE_QUEUE"){
        if(client.game_mode === "math"){
            await dequeue(client.id, client.game_mode);
            ws.send(JSON.stringify({type: "DEQUEUED"}));
        }
        else if(client.game_mode === "prog"){
            await dequeue(client.id, client.game_mode);
            ws.send(JSON.stringify({type: "DEQUEUED"}));
        }
        else{
            ws.send(JSON.stringify({type: "ERROR", message: 'User has invalid game_mode provided to it'}))
        }
    }
}

//below logic is just a shortform version of being able to disconnect a user's web socket connection that 
// can be included in server.ts (i'm lazy and this works) 
// - there is already the "connection" implementation in server.ts for a web socket connection 
// if you are wondering why there is no handleConnect function
export const handleDisconnect = async (user: UserDto) => {

    await dequeue(user.id, user.game_mode);
    removeConnection(user);


}