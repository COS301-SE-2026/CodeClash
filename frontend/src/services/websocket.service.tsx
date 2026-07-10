import { fetchAuthSession } from 'aws-amplify/auth';
import { io, Socket } from 'socket.io-client'

import MatchmakingUserDTO from '../dtos/matchmaking.dto';

const env = import.meta.env;

export async function createSocket(): Promise<Socket> {
    const session = await fetchAuthSession({ forceRefresh: true })
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


    conn.on("back_to_dash", ()=>{
        
    })

    return conn;
}

/// websocket functions for the app
export function joinMatchQueue(socket: Socket, data: MatchmakingUserDTO) {
    socket.emit("join_match_queue", data);
}

export function leaveMatchQueue(socket: Socket) {
    socket.emit("leave_match_queue");
}

export function matchAccepted(socket: Socket, pair_id: string) {
    socket.emit("match_accepted", pair_id)
}

export function matchDeclined(socket: Socket, pair_id: string) {
    socket.emit("match_declined", pair_id);
}


