import { Server, Socket } from "socket.io"
import { TournamentService } from "src/application/usecases/services/tournament.service"
import { PlayerDTO } from "src/entities/dtos/components.dto";
import { MatchMode } from "src/entities/dtos/match/match.dto";

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

export const hostTournament = async (io: Server, socket: Socket, start_date: Date, match_mode: MatchMode, tournament_service: TournamentService) => {
    try {
        const tournament = await tournament_service.hostTournament(start_date, match_mode);
        io.emit("tournament_created", tournament);
    }
    catch (error) {
        socket.emit("host_tournament_failed", error);
    }
}

export const cancelTournament = async () => {

}
