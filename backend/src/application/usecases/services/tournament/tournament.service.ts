import { randomUUID } from "node:crypto";
import { ITournamentCache } from "src/application/interfaces/cache/ITournamentCache";
import { PlayerDTO } from "src/entities/dtos/matches/match-component.dto";
import { MatchMode, MatchStatus, MatchType } from "src/entities/dtos/matches/match.dto";
import { TournamentDTO } from "src/entities/dtos/tournaments/tournaments.dto";
import { TournamentEliminationService } from "./elimination.service";
import { MatchStart } from "../match/match-start.service";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { HttpError } from "src/entities/errors/http-error";

export class TournamentService {
    constructor(
        private readonly tournament_cache: ITournamentCache,
        private readonly creation_service: MatchStart,
        private readonly elimination_service: TournamentEliminationService,
        private readonly user_repo: IUserRepository
    ) { }

    async joinTournament(tournament_id: string, player: PlayerDTO): Promise<TournamentDTO> {
            await this.tournament_cache.addPlayer(tournament_id, player);
            const tournament = await this.getTournament(tournament_id);
            return tournament;
    }

    async leaveTournament(tournament_id: string, player: PlayerDTO) {
            const tournament = await this.getTournament(tournament_id);
            if (tournament?.status != MatchStatus.Waiting) throw new HttpError(409, "Cannot leave tournament that has started");
            await this.tournament_cache.removePlayer(tournament_id, player.id);
    }

    async hostTournament(match_mode: MatchMode, host: PlayerDTO, title: string, min_players: number) {
        const tournament_id = randomUUID();
        await this.tournament_cache.createTournament(tournament_id, match_mode,host, title, min_players);
        const tournament = await this.tournament_cache.getTournament(tournament_id);

        return tournament;
    }

    async cancelTournament(tournament_id: string) {
        const tournament = await this.tournament_cache.getTournament(tournament_id);
        if (!tournament) throw new HttpError(404, "Tournament not found");

        if (tournament.status !== MatchStatus.Waiting) throw new HttpError(409, "Cannot cancel tournament");
        await this.tournament_cache.deleteTournament(tournament_id);
    }

    async getTournament(tournament_id: string) {
        const tournament = await this.tournament_cache.getTournament(tournament_id);
        if (!tournament) throw new HttpError(404, "Tournament not found");

        return tournament;
    }

    async startTournament(tournament: TournamentDTO, league: string) {

        if (tournament.status !== MatchStatus.Waiting) throw new HttpError(409, "Tournament already started");
        if (tournament.players.length < tournament.min_players) throw new HttpError(409, "Not enough players");

        const match = await this.creation_service.execute(tournament.players as PlayerDTO[], tournament.tournament_mode, league, MatchType.tournament, tournament.title);

        tournament.rounds = match.rounds;
        tournament.status = MatchStatus.In_progress;
        await this.tournament_cache.updateTournament(tournament);

        const usernames = tournament.players.map(p => ({ id: p.id, username: p.username! }));

        /// updates stored tournament state
        const init_players_map = this.elimination_service.init(match.match_id, usernames);
        const round_1 = match.rounds[0];

        this.elimination_service.startRound(match.match_id, round_1!.round_number, round_1!.questions.map(q => q.id));

        return {
            ...match,
            players: Array.from(init_players_map.values())

        };
    }


    async getTournamentsByStatus(status: MatchStatus) {
        return this.tournament_cache.getTournamentsByStatus(status);
    }

    async advancedRound(tournament_id: string){
        const tournament = await this.getTournament(tournament_id);

        const survirors = this.elimination_service.endRound(tournament_id);
        const current_idx = this.elimination_service.getCurrentRound(tournament_id);
        const next_idx = current_idx + 1;

        if(next_idx >= tournament.rounds.length || survirors.length <= 1){
            return {finished: true as const, standings: this.elimination_service.getStanding(tournament_id)};
        }

        const next_round = tournament.rounds[next_idx];
        this.elimination_service.startRound(tournament_id, next_round!.round_number, next_round!.questions.map(q=>q.id));
        return {finished: false as const, round: next_round, standings: this.elimination_service.getStanding(tournament_id)}
    }

}