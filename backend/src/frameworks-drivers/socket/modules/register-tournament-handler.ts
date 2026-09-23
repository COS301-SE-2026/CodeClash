import { Server, Socket } from "socket.io";
import { TournamentDeps } from "../dependencies";
import { registerHandler } from "../dispatch";
import { PlayerDTO } from "src/entities/dtos/components.dto";
import { hostTournament, joinTournament, leaveTournament } from "src/interface-adapters/socket-handlers/tournament-handlers";
import { MatchMode } from "src/entities/dtos/match/match.dto";

export function registerTournamentHandlers(io: Server, socket: Socket, deps: TournamentDeps) {
    registerHandler(socket, 'join_tournament', (socket, data: { tournament_id: string, player: PlayerDTO }) =>
        joinTournament(io, socket, data.tournament_id, data.player, deps.tournament_service));

    registerHandler(socket, "leave_tournament", (socket, data: { tournament_id: string, player: PlayerDTO }) =>
        leaveTournament(io, socket, data.tournament_id, data.player, deps.tournament_service));

    registerHandler(socket, "host_tournament", (socket, data: { start_date: Date, match_mode: MatchMode }) =>
        hostTournament(io, socket, data.start_date, data.match_mode, deps.tournament_service))
}