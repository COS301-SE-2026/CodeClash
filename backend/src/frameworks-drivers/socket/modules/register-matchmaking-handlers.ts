import { Server, Socket } from "socket.io";
import { MatchmakingDeps } from "../dependencies";
import { joinMatchQueue, leaveMatchQueue, matchAccepted, matchDeclined } from "src/interface-adapters/socket-handlers/matchmaking-handlers";

// don't need acknowledgments - don't go through registerHandler
export function registerMatchmakingHndlers(io: Server, socket: Socket, deps: MatchmakingDeps) {
    socket.on('join_match_queue', (data) => joinMatchQueue(io, socket, data, deps.matchmaking_service, deps.matched_users_service, deps.user_repo));
    socket.on('leave_match_queue', ()=> leaveMatchQueue(io,socket, deps.matchmaking_service));
    socket.on('match_accepted', (data)=> matchAccepted(io,socket, data, deps.match_service,deps.matched_users_service,deps.match_store));
    socket.on('match_declined', (pair_id: string)=> matchDeclined(io,socket, pair_id, deps.matched_users_service))
}