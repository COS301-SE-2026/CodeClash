import { io } from 'socket.io-client'
import { fetchAuthSession } from 'aws-amplify/auth';
import MatchmakingUserDTO from '../dtos/matchmaking.dto';

const env = import.meta.env;
const session = await fetchAuthSession()
const token = session.tokens?.accessToken

const options = {
    withCredentials: true,
    auth: {
        token: token?.toString()
    }
}

const socket = io(env.VITE_WEBSOCKET_URL, options)
/// websocket handlers for server responses 

// starts chain to spin up a match
function handleMatched(){}

// handles question submissions during a game
function handleSubmit(){}

// handles game finalisation and conclusion
function handleGameEnd(){}



/// websocket functions for the app
export function joinMatchQueue(user: MatchmakingUserDTO){
    socket.emit("join_match_queue",JSON.stringify({
        data: user
    }))
}

export function submitQuestion(){}

export function finishGame(){}

export function quitGame(){}


