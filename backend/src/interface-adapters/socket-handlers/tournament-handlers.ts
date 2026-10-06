import { Server, Socket } from "socket.io"
import { TournamentEliminationService } from "src/application/usecases/services/tournament/elimination.service";
import { TournamentService } from "src/application/usecases/services/tournament/tournament.service"
import { PlayerDTO } from "src/entities/dtos/matches/match-component.dto";
import { MatchMode } from "src/entities/dtos/matches/match.dto";


export const identity = async (socket: Socket) => ({ user_id: socket.data.user_id });

const Player = (socket: Socket, player: PlayerDTO) => ({
    ...player,
    id: socket.data.user_id,
    username: socket.data.username
})

export const joinTournament = async (io: Server, socket: Socket, tournament_id: string, player: PlayerDTO, tournament_service: TournamentService,) => {
    try {
        const p = Player(socket, player);
        await tournament_service.joinTournament(tournament_id, p);
        await socket.join(tournament_id);
        io.emit('player_joined', { player: p, tournament_id });
    }
    catch (error) {
        socket.emit("join_tournament_failed", error);
    }
}

export const leaveTournament = async (io: Server, socket: Socket, tournament_id: string, player: PlayerDTO, tournament_service: TournamentService) => {
    try {
        const p = Player(socket, player);
        await tournament_service.leaveTournament(tournament_id, p);
        await socket.leave(tournament_id);
        io.emit("player_left", { player: p, tournament_id });
    }
    catch (error) {
        socket.emit("leave_tournament_failed", error);
    }
}

export const hostTournament = async (io: Server, socket: Socket, match_mode: MatchMode, host: PlayerDTO, title: string, min_players: number, tournament_service: TournamentService) => {
    try {

        const p = Player(socket, host);
        const tournament = await tournament_service.hostTournament(match_mode, p, title, min_players);

        await socket.join(tournament!.tournament_id);
        io.emit("tournament_created");
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
        io.emit('tournament_removed', { tournament_id });
    }
    catch (error) {
        socket.emit("cancel_tournament_failed", error);
    }
}

export const getTournament = async (socket: Socket, tournament_id: string, tournament_service: TournamentService) => {
    try {
        const tournament = await tournament_service.getTournament(tournament_id);

        if (tournament.players.some(p => p.id === socket.data.user_id)) {
            await socket.join(tournament_id);
        }
        return tournament;
    } catch (error) {
        socket.emit("get_tournament_failed", error);
    }
}

export const startTournament = async (io: Server, socket: Socket, tournament_id: string, league: string, tournament_service: TournamentService) => {
    try {
        console.log("starting tournament", tournament_id);

        const tournament = await tournament_service.getTournament(tournament_id);
        const match = await tournament_service.startTournament(tournament, league);
        const data = { match: match, tournament: tournament };


        io.emit('tournament_removed', { tournament_id });
        io.to(tournament_id).emit("tournament_started", data);
        return data;
    } catch (error) {
        console.error("start tournament failed", error);
        socket.emit("start_tournament_failed", error);
    }
}


export const getStandings = async (tournament_id: string, elimination_service: TournamentEliminationService) => {
    const tournament_standings = elimination_service.getStanding(tournament_id);
    return tournament_standings;
}

export const completeRound = async (io: Server, socket: Socket, tournament_id: string, match_id: string, elimination_service: TournamentEliminationService, tournament_service: TournamentService) => {


    const player = elimination_service.completeRound(tournament_id, socket.data.user_id);

    const tournament = elimination_service.getTournament(tournament_id);

    for (const p of tournament.players.values()) {
        if (p.elimination_round !== -1) {
            io.to(tournament_id).emit('player_eliminated', p);
        }
    }

    const alive = [...tournament.players.values()].filter(p => p.elimination_round === -1);

  //  console.log("living players", alive);

    if (alive.length === 1) {
        const results = await tournament_service.endTournament(tournament_id, match_id,);
     //   console.log("Tournament ended", results);
        io.to(tournament_id).emit('tournament_ended', results);
        return null
    }

    return player;
}