import app from './app';
import express from 'express';
import {createServer, Server, IncomingMessage} from 'http';
import {WebSocket, WebSocketServer} from 'ws';
import {fetchAuthSession} from 'aws-amplify/auth'
import {authenticate} from './app'
import {registerConnection, removeConnection, getConnection} from './wsClients'
import UserDto from './Matchmaking Service/matchmaking.dto';

declare module 'http' {
    interface IncomingMessage{
        userDto?: UserDto //this lets us attach the user to the sent request
    }
}

const PORT = process.env.PORT || 3000;


export const WSServer = () => {

const server = createServer(app);

const wss = new WebSocketServer({noServer : true}) //makes websocket not create its own http server but just use server created above

//'upgrade' first, represents when the client initially wants to start a connection to the server, 
// sends an http request to the server with an upgrade header included in the request that informs the server
// that a websocket connection wants to be established, after a response and a completed handshake
// the initial http connection is "upgraded" to now be a websocket connection, below handles this process
server.on('upgrade', async(req: IncomingMessage, socket, head) => {
    
    try{

        const user = await authenticate(req, null, null) as UserDto

        if(!user){
            socket.write('HTTP/1.1 404 User Not Found\r\n\r\n');
            socket.destroy();
        }

        req.userDto = user

        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit('connection', ws, req)
        })

    }
    catch{
        socket.write('HTTP/1.1 401 Unauthorised\r\n\r\n');
        socket.destroy();
    }
})

//now the actual websocket connection must be created

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const user = req.userDto! //has to be guaranteed due to upgrade above which terminates the connection if user is not authenticated

    //below code logic to destroy any existing connections for this user for example, if there are duplicate tabs of the app under the same user

    const isExisting = getConnection(user)
    if(isExisting){
        isExisting.close(1000,'Replaced by new connection');
        removeConnection(user);
    }
    


})



}




// wss.on("connection", async (ws : WebSocket, req) =>{

//     try{
//         const url = new URL(req.url!, `http://${req.headers.host}`);
//         const token = url.searchParams.get("token");

//         if(!token){
//             ws.close(4000, "No token found");
//             return;
//         }

//         const userId = (await verifyToken(token)).userId;
//         const username = (await verifyToken(token)).username;
//     }
//     catch(err){
//         console.error('Error verifying JWT: ', err);
//     }



// }





// )
//}