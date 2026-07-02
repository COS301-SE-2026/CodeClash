import { createServer } from 'node:http';
import { Server } from 'socket.io'
import { validToken } from './services/auth.service';
import app from './app';

import dotnev from 'dotenv'
dotnev.config()

const options = {
    cors: {
        origin: [process.env.FRONTEND_URL!]
    },
}

const httpServer = createServer(app)     // can update to https

const io = new Server(httpServer, options);

// middleware -fires before the connection
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


io.on("connection", (socket) => {
    socket.on('join_match_queue', (data) => {
        //adds users to a room 
        socket.join(data.game_mode)
    })

    socket.on('leave_mach_queue', (data) => {

    })
})

httpServer.listen(3000, ()=>{
    console.log("Server listening")
});

export default httpServer