import { io, Socket } from 'socket.io-client'
import { fetchAuthSession } from 'aws-amplify/auth';
import MatchmakingUserDTO from '../dtos/matchmaking.dto';

const env = import.meta.env;
let socket: Promise<Socket> = createSocket();

export async function createSocket() {
    const session = await fetchAuthSession()
    const token = session.tokens?.accessToken

    const options = {
        auth: {
            token: token?.toString()
        }
    }

    console.log(token)
    const conn = io(env.VITE_WEBSOCKET_URL, options);

    conn.on("connect_error", (err)=>{
        console.error(`Error connecting to socket: ${err}`);
    })

    // starts chain to spin up a match
    conn.on("users_matched", (data) => {
        console.log("Users have been matched")
    })

    return conn;
}

/// websocket functions for the app
export async function joinMatchQueue(data: MatchmakingUserDTO) {
    const s = await socket;
    s.emit("join_match_queue", data)
}

export function submitQuestion() { }

export function finishGame() { }

export function quitGame() { }


