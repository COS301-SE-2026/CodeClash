// websocket client
import MatchmakingUserDTO from '../dtos/matchmaking.dto';
import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

function scheduleTokenRefresh(ws: WebSocket, expiry: number) {
    const refresh = expiry - 30000; // 30 second before expiry
    setTimeout(async () => {
        const session = await fetchAuthSession();
        const newToken = session.tokens;;

        ws.send(JSON.stringify({ type: 'token_refresh', token: newToken }));
    }, refresh);
}

const WebSocketService = () => {
    const [socket, set_socket] = useState<WebSocket | null>(null);
    const [messages, set_messages] = useState<string[]>([]);
    const [connected, set_connected] = useState(false);

    useEffect(() => {
        //create socket

        var new_socket: WebSocket;

        try {
            new_socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

            set_socket(new_socket!);

            //open the socket
            new_socket.onopen = () => {
                console.log("Connection established");
                set_connected(true);
            };

            // message event
            new_socket.onmessage = (event) => {

                dispatcher(event.data, new_socket);
                set_messages((prev_messages) => [...prev_messages, event.data as string])  //store messages
            };

            new_socket.onclose = () => {
                console.log('Connection Closed');
            };

        } catch (error) {
            console.error(`Failed to create websocket: ${error}`);
        }


    }, []);

    return { socket };
}



const dispatcher = (data: string, ws: WebSocket) => {
    var message;

    try {
        message = JSON.parse(data);
    }
    catch {
        return JSON.stringify({ type: 'ERROR', message: 'Error parsing data' })
    }


    const type = message.type;

    switch (type) {
        case 'ENQUEUE':
            const user = new MatchmakingUserDTO(message.id, message.elo, message.game_mode)
            ws.send(JSON.stringify({
                type: type,
                user: user
            }))
            break;
        case 'DEQUEUE':
            ws.send(JSON.stringify({
                type: type,
                id: message.id
            }))
            break;
        case 'AUTH_RESULT':
            if (message.result == 'success') {
                scheduleTokenRefresh(ws, message.expiry);
            }
            break;
        case 'TOKEN_REFRESHED':
            scheduleTokenRefresh(ws, message.expiry);
            break;
    }
}

export default WebSocketService;