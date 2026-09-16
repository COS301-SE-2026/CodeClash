import { Server } from "socket.io";
import { SocketDeps } from "./dependencies";
import { registerMatchHandlers } from "./modules/register-match-handlers";
import { registerMatchmakingHndlers } from "./modules/register-matchmaking-handlers";
import { registerFriendHandlers } from "./modules/register-friends-handler";


export function attachSocketModules(io: Server, deps: SocketDeps){
    io.on('connection', (socket)=>{
        socket.join(`user:${socket.data.user_id}`);

        registerMatchHandlers(io, socket,deps.match);
        registerMatchmakingHndlers(io,socket, deps.matchmaking);
        registerFriendHandlers(io,socket,deps.friends);

    })
}