import { useEffect, useState } from "react";

const web_socket = (url: string) => {
    const [socket, set_socket] = useState<WebSocket | null>(null);
    const [messages, set_messages] = useState<string[]>([]);

    useEffect(() => {
        //create socket
        const new_socket = new WebSocket(url);
        set_socket(new_socket);

        //open the socket
        new_socket.onopen = () => {
            console.log("Connection established");

        };

        // message event
        new_socket.onmessage = (event) => {
            set_messages((prev_messages) => [...prev_messages, event.data as string])  //store messages
        };

        new_socket.onclose = () => {
            console.log('Connection Closed');
        };

        return () => {
            new_socket.close();
        }
    }, [url]);


    const send_message = (message: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        }
        else {
            console.log("TODO: implement error handling");
        }
    };

    return { messages, send_message };
}

export default web_socket;