// websocket client
import MatchmakingUserDTO from 'root/dtos/matchmaking.dto';
import { useEffect, useState } from "react";

const WebSocketService = () => {
    const [socket, set_socket] = useState<WebSocket | null>(null);
    const [messages, set_messages] = useState<string[]>([]);
    const [connected, set_connected] = useState(false);

    useEffect(() => {
        //create socket
        const new_socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
        set_socket(new_socket);

        //open the socket
        new_socket.onopen = () => {
            console.log("Connection established");
            set_connected(true);
        };

        // message event
        new_socket.onmessage = (event) => {
            console.log(event.data);
            dispatcher(event.data, new_socket);
            set_messages((prev_messages) => [...prev_messages, event.data as string])  //store messages
        };

        new_socket.onclose = () => {
            console.log('Connection Closed');
        };


        if (new_socket.readyState !== WebSocket.CLOSED)
            new_socket.close();

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
    }
}

export default WebSocketService;