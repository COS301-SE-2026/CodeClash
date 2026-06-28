import WebSocket from "ws";
import UserDto from "./dtos/matchmaking.dto";
import { dequeue, enqueue, math_queue_length, prog_queue_length } from "./services/matchmaking.service"
import { removeConnection } from "./wsClients";


export const handleMessage = async (ws: WebSocket, data: string, client: UserDto) => {
    let message: any;

    try {
        message = JSON.parse(data);
    }
    catch {
        ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid JSON Data' }));
        return;
    }

    const type = message.type;

    switch (type) {
        case 'JOIN':
            await enqueue(client, client.game_mode);
            ws.send(JSON.stringify({ type: 'QUEUED' }))
            break;
        case 'LEAVE':
            await dequeue(client.id, client.game_mode);
            ws.send(JSON.stringify({ type: "DEQUEUED" }));
            break;
        default:
            ws.send(JSON.stringify({ type: "ERROR", message: 'Invalid Game Mode' }))
    }
}

export const handleDisconnect = async (ws: WebSocket, user: UserDto) => {
    await dequeue(user.id, user.game_mode);
    removeConnection(user);
    ws.send(JSON.stringify({ type: 'DEQUEUED' }));
}


export const handleError = async (ws: WebSocket, user: UserDto, err: Error) => {
    ws.send(JSON.stringify({ type: 'ERROR', message: err.message }))
}