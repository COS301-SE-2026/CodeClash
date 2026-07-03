import { createServer } from 'node:http';
import { Server } from 'socket.io'
import { validToken } from './services/auth.service';
import app from './app';
import { matchmaking } from './services/matchmaking.service';
import MatchmakingUserDTO from './dtos/matchmaking.dto';

import dotnev from 'dotenv'
dotnev.config()

console.log("server.ts")
const options = {
    cors: {
        origin: [process.env.FRONTEND_URL!],
        credentials: true
    },
}

const httpServer = createServer(app)     // can update to https

const io = new Server(httpServer, options);


// middleware -fires before the connection
io.use(async (socket, next) => {
    console.log("io.use");
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

        console.log("matching user for a game")
        const user = new MatchmakingUserDTO(socket.data.user_id, data.elo, data.game_mode);
        var match = null;

        do {
            match = matchmaking(user);
        }
        while (match == null)

        match.then((result) => {
            const player_1 = result?.player_1_id.toString();
            const player_2 = result?.player_2_id.toString();

            io.to(player_1!).emit('matched');
            io.to(player_2!).emit('matched');

            const pair = {
                player_1: player_1,
                player_2: player_2
            }

            socket.emit('users_matched',pair);
        })


    })

    socket.on('leave_mach_queue', (data) => {

    })
})

httpServer.listen(3000, () => {
    console.log("Server listening")
});

export default httpServer