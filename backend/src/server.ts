import { createServer } from 'node:http';
import { Server } from 'socket.io'
import { validToken } from './services/auth.service';
import app from './app';
import { dequeue, matchmaking } from './services/matchmaking.service';
import MatchmakingUserDTO from './dtos/matchmaking.dto';

import dotnev from 'dotenv'
dotnev.config()

const options = {
    cors: {
        origin: [process.env.FRONTEND_URL!],
        credentials: true
    },
}

const httpServer = createServer(app)     // can update to https
const io = new Server(httpServer, options);
const PAIRS = new Map<string, Map<string, boolean>>();

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
    socket.on('join_match_queue', async (data) => {
        //adds users to a room 
        await socket.join(socket.data.user_id)
        socket.data.game_mode = data.game_mode

        const user = new MatchmakingUserDTO(socket.data.user_id, data.elo, data.game_mode);
        let match = null;

        match = await matchmaking(user);

        if (!match)
            return;


        const player_1 = match.player_1_id.toString();
        const player_2 = match.player_2_id.toString();


        const pair_id = player_1.concat("-").concat(player_2);

        const pair = {
            player_1: player_1,
            player_2: player_2,
            pair_id: pair_id,
            game_mode: data.game_mode
        }


        PAIRS.set(pair_id, new Map([[player_1, false], [player_2, false]]));

        io.to(player_1!).emit('users_matched', pair);
        io.to(player_2!).emit('users_matched', pair);

    });

    socket.on('leave_match_queue', async () => {
        const remove = await dequeue(socket.data.user_id, socket.data.game_mode);

        if (remove) {
            io.to(socket.data.user_id).emit('user_dequeued');
        }
        else
            io.to(socket.data.user_id).emit('dequeue-failed');

    });

    socket.on('match_accepted', async (pair_id) => {
        PAIRS.get(pair_id)?.set(socket.data.user_id, true);

        const pair = PAIRS.get(pair_id);
        const bothAccepted = pair ? [...pair.values()].every(bool => bool) : false;

        if (bothAccepted) {
            // call the game service to create the game
            const keys = [...pair!.keys()];
        }
        else {
            // waiting for the other player to accept
        }

    });

    socket.on('match_declined', (pair_id) => {
        const pair = PAIRS.get(pair_id);
        const players = pair ? [...pair.keys()] : null; //get ids of paird players 

        PAIRS.delete(pair_id);

        if (players) {
            for (const player of players) {
                if (player === socket.data.user_id) {
                    io.to(player).emit("decline_done");
                }
                else {
                    io.to(player).emit("game_declined");
                }
            }
        }
    });

})

httpServer.listen(3000, () => {
    console.log("Server listening")
});

export default httpServer