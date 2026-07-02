import { io, Socket } from 'socket.io-client'
import { fetchAuthSession } from 'aws-amplify/auth';
import MatchmakingUserDTO from '../dtos/matchmaking.dto';

const env = import.meta.env;
let socket: Socket | null = null;

export async function createSocket() {
    const session = await fetchAuthSession()
    const token = session.tokens?.accessToken

    const options = {
        auth: {
            token: token?.toString()
        }
    }

    socket = io(env.VITE_WEBSOCKET_URL, options)
    return socket
}
/// websocket handlers for server responses 

// starts chain to spin up a match
function handleMatched(socket: Socket) {
    socket.on("users_matched", (data) => {
        console.log("Users have been matched")
    })
}

// handles question submissions during a game
function handleSubmit() { }

// handles game finalisation and conclusion
function handleGameEnd() { }



/// websocket functions for the app
export function joinMatchQueue(data: MatchmakingUserDTO) {
    socket?.emit("join_match_queue", data)

    console.log("sent")
}

export function submitQuestion() { }

export function finishGame() { }

export function quitGame() { }


