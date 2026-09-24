import { Server, Socket } from "socket.io"
import { TournamentService } from "src/application/usecases/services/tournament/tournament.service"
import { PlayerDTO } from "src/entities/dtos/matches/match-component.dto";
import { MatchMode } from "src/entities/dtos/matches/match.dto";

export const joinTournament = async (io: Server, socket: Socket, tournament_id: string, player: PlayerDTO, tournament_service: TournamentService,) => {
    try {
        await tournament_service.joinTournament(tournament_id, player);
        socket.join(tournament_id);
        io.to(tournament_id).emit('player_joined', player);
    }
    catch (error) {
        socket.emit("join_tournament_failed", error);
    }
}

export const leaveTournament = async (io: Server, socket: Socket, tournament_id: string, player: PlayerDTO, tournament_service: TournamentService) => {
    try {
        await tournament_service.leaveTournament(tournament_id, player);

        socket.emit("left_tournament");
        io.to(tournament_id).emit("player_left", player);
    }
    catch (error) {
        socket.emit("leave_tournament_failed", error);
    }
}

export const hostTournament = async (io: Server, socket: Socket, start_date: Date, match_mode: MatchMode, host: PlayerDTO, tournament_service: TournamentService) => {
    try {
        const tournament = await tournament_service.hostTournament(start_date, match_mode, host);
        io.emit("tournament_created", tournament);
        return tournament;
    }
    catch (error) {
        socket.emit("host_tournament_failed", error);
    }
}

export const cancelTournament = async (io: Server, socket: Socket, tournament_id: string, tournament_service: TournamentService) => {
    try {
        await tournament_service.cancelTournament(tournament_id);
        io.to(tournament_id).emit("tournament_cancelled");
    }
    catch (error) {
        socket.emit("cancel_tournament_failed", error);
    }
}

export const getTournament = async (socket: Socket, tournament_id: string, tournament_service: TournamentService) => {
    try {
        return await tournament_service.getTournament(tournament_id);
    } catch (error) {
        socket.emit("get_tournament_failed", error);
    }
}

export const startTournament = async (io: Server, socket: Socket, tournament_id: string, league: string, tournament_service: TournamentService) => {
    try {
        const tournament = await tournament_service.getTournament(tournament_id);
        const match = await tournament_service.startTournament(tournament, league);

        io.to(tournament_id).emit("tournament_started", { match: match, tournament: tournament });
    } catch (error) {
        socket.emit("start_tournament_failed", error);
    }
}
