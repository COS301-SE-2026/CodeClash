import { Server, Socket } from "socket.io";
import { MatchmakingDeps } from "../dependencies";
import { joinMatchQueue, leaveMatchQueue, matchAccepted, matchDeclined } from "src/interface-adapters/socket-handlers/matchmaking-handlers";
import { MatchDataDTO } from "src/entities/dtos/match-data.dto";
import { MatchMode } from "src/entities/database/questions.entities";

// don't need acknowledgments - don't go through registerHandler
export function registerMatchmakingHndlers(io: Server, socket: Socket, deps: MatchmakingDeps) {
    socket.on('join_match_queue', (data) => joinMatchQueue(io, socket, data, deps.matchmaking_service, deps.matched_users_service, deps.user_repo));
    socket.on('leave_match_queue', () => leaveMatchQueue(io, socket, deps.matchmaking_service));
    socket.on('match_accepted', (data: MatchDataDTO) => matchAccepted(io, socket, data, deps.matched_users_service, deps.match_start));
    socket.on('decline_match', (data: { group_id: string, match_mode: MatchMode }) => matchDeclined(io, data.group_id, data.match_mode, deps.matched_users_service, deps.matchmaking_service, deps.user_repo));
}