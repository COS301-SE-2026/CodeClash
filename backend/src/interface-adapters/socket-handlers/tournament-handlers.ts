import { Server, Socket } from "socket.io"
import { TournamentService } from "src/application/usecases/services/tournament.service"
import { PlayerDTO } from "src/entities/dtos/components.dto";

export const joinTournament = async (io: Server, socket: Socket, tournament_id: string, tournament_service: TournamentService, player: PlayerDTO) => {

    try {
        await tournament_service.joinTournament(tournament_id, player);
    }
    catch (error) {
        socket.emit("join_tournament_failed", error);
        return;
    }

    socket.join(tournament_id);
    io.to(tournament_id).emit('player_joined', player);
}

export const leaveTournament = () => { }

export const hostTournament = () => { }

export const cancelTournament = () => { }
