import { Server, Socket } from "socket.io";
import { TournamentDeps } from "../dependencies";
import { registerHandler } from "../dispatch";
import { PlayerDTO } from "src/entities/dtos/matches/match-component.dto";
import { cancelTournament, getTournament, hostTournament, joinTournament, leaveTournament, startTournament, identity, getStandings, completeRound, endTournament } from "src/interface-adapters/socket-handlers/tournament-handlers";
import { MatchMode } from "src/entities/dtos/matches/match.dto";


export function registerTournamentHandlers(io: Server, socket: Socket, deps: TournamentDeps) {
    registerHandler(socket, 'join_tournament', (socket, data: { tournament_id: string, player: PlayerDTO }) =>
        joinTournament(io, socket, data.tournament_id, data.player, deps.tournament_service));

    registerHandler(socket, "leave_tournament", (socket, data: { tournament_id: string, player: PlayerDTO }) =>
        leaveTournament(io, socket, data.tournament_id, data.player, deps.tournament_service));

    registerHandler(socket, "host_tournament", (socket, data: { match_mode: MatchMode, host: PlayerDTO, title: string, min_players: number }) =>
        hostTournament(io, socket, data.match_mode, data.host, data.title, data.min_players, deps.tournament_service));

    registerHandler(socket, "cancel_tournament", (socket, tournament_id: string) =>
        cancelTournament(io, socket, tournament_id, deps.tournament_service));

    registerHandler(socket, 'get_tournament', (socket, tournament_id: string) =>
        getTournament(socket, tournament_id, deps.tournament_service));

    registerHandler(socket, 'start_tournament', (socket, data: { tournament_id: string, league: string }) =>
        startTournament(io, socket, data.tournament_id, data.league, deps.tournament_service));

    registerHandler(socket, 'identity', (socket) => identity(socket));

    registerHandler(socket, 'get_standings', (socket, tournament_id: string) =>
        getStandings(tournament_id, deps.elimination_service));

    registerHandler(socket, 'complete_round', (socket, data: { tournament_id: string, match_id: string }) =>
        completeRound(io, socket, data.tournament_id, data.match_id, deps.elimination_service, deps.tournament_service));

    registerHandler(socket, 'end_tournament', (socket, data: { tournament_id: string, match_id: string }) =>
        endTournament(io, data.tournament_id, data.match_id, deps.tournament_service));

}