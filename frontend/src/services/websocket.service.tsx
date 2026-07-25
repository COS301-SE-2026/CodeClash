import { fetchAuthSession } from 'aws-amplify/auth';
import { io, Socket } from 'socket.io-client'

import MatchmakingUserDTO from '../dtos/matchmaking.dto';

const env = import.meta.env;

export async function createSocket(): Promise<Socket> {
    const session = await fetchAuthSession({forceRefresh: true})
    const token = session.tokens?.idToken

    const options = {
        auth: {
            token: token?.toString()
        }
    }

    const conn = io(env.VITE_WEBSOCKET_URL, options);

    conn.on("connect_error", (err) => {
        console.error(`Error connecting to socket: ${err}`);
    })


    conn.on("match_error", () => {
        console.error("Error matching users");
    })


    return conn;
}

/// websocket functions for the app
export async function joinMatchQueue(socket: Socket, data: MatchmakingUserDTO) {
    socket.emit("join_match_queue", data)
}

