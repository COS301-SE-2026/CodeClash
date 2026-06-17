// websocket client

//import { WebSocket } from "ws";

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
            console.log("SOCKET OPEN!!")
            set_connected(true);
        };

        // message event
        new_socket.onmessage = (event) => {
            console.log(event.data);
            set_messages((prev_messages) => [...prev_messages, event.data as string])  //store messages
        };

        new_socket.onclose = () => {
            console.log('Connection Closed');
        };

        return () => {

            if(new_socket.readyState !== WebSocket.CLOSED)
            new_socket.close();
        }
    },[]);


    const send_message = (message: string) => {
        console.log(message);

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
        else {
            console.log("TODO: implement error handling");
        }
    };

    return { messages, send_message , connected};
}

export default WebSocketService;