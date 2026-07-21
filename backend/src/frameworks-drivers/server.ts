import { createServer } from 'node:http';
import { Server } from 'socket.io'
import { validToken } from '../interface-adapters/auth/auth.service';
import app from './app';
import dotnev from 'dotenv'
import { joinMatchQueue, leaveMatchQueue, matchAccepted, matchDeclined } from 'src/interface-adapters/socket-handlers/matchmaking.handler';
import { AppDataSource } from "./data-source"
import { User } from "../interface-adapters/repositories/db-entities/user.entities"

dotnev.config()


// Initialise DB
AppDataSource.initialize().then(async () => {

}).catch(error => console.log(error))


// create server instance
const httpServer = createServer(app)     // can update to https
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.FRONTEND_URL!],
        credentials: true
    },
}
);


// auth middleware 
io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error("Authenticaion error: No token provided"));

    const valid = await validToken(token)
    if (valid) {
        socket.data.user_id = valid.user_Id;
        next();
    }
    else next(new Error("Authentication error: Invalid token"));
})

// attach socket handlers
io.on("connection", (socket) => {

    // SOCKET HANDLERS MUST MOOVE TO interface-adapter/
    socket.on('join_match_queue', async (data) => await joinMatchQueue(io, socket, data));

    socket.on('leave_match_queue', async () => await leaveMatchQueue(io, socket));

    socket.on('match_accepted', async (pair_id) => await matchAccepted(socket, pair_id));

    socket.on('match_declined', (pair_id) => matchDeclined(io, socket, pair_id));
})

// start server
httpServer.listen(3000, () => {
    console.log("Server listening")
});



export default httpServer