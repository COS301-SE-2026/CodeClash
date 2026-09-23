import { Server, Socket } from "socket.io";
import { TournamentDeps } from "../dependencies";
import { registerHandler } from "../dispatch";

export function registerTournamentHandlers(io: Server, socket: Socket, deps: TournamentDeps) {
    registerHandler(socket, 'join_tournament', (socket, data) => { });
}