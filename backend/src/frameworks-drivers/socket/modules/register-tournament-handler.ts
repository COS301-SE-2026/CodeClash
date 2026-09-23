import { Server, Socket } from "socket.io";
import { TournamentDeps } from "../dependencies";
import { registerHandler } from "../dispatch";
import { PlayerDTO } from "src/entities/dtos/components.dto";
import { joinTournament } from "src/interface-adapters/socket-handlers/tournament-handlers";

export function registerTournamentHandlers(io: Server, socket: Socket, deps: TournamentDeps) {
    registerHandler(socket, 'join_tournament', (socket, data: { tournament_id: string, player: PlayerDTO }) =>
        joinTournament(io, socket, data.tournament_id, deps.tournament_service, data.player));
}