import { randomUUID } from "node:crypto";
import { ITournamentCache } from "src/application/interfaces/cache/ITournamentCache";
import { PlayerDTO } from "src/entities/dtos/matches/match-component.dto";
import { MatchMode, MatchStatus, MatchType } from "src/entities/dtos/matches/match.dto";
import { TournamentDTO } from "src/entities/dtos/tournaments/tournaments.dto";
import { TournamentEliminationService } from "./elimination.service";
import { MatchStart } from "../match/match-start.service";
import { MatchCompletionService } from "../match/match-completion.service";
import { MatchStore } from "../match/match-store.service";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { HttpError } from "src/entities/errors/http-error";

export class TournamentService {
    constructor(
        private readonly tournament_cache: ITournamentCache,
        private readonly creation_service: MatchStart,
        private readonly elimination_service: TournamentEliminationService,
        private readonly completion_service: MatchCompletionService,
        private readonly match_store: MatchStore
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
        await this.tournament_cache.createTournament(tournament_id, match_mode, host, title, min_players);
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
        const init_players_map = this.elimination_service.init(tournament.tournament_id, usernames);

        const tournament_state = this.elimination_service.getTournament(tournament.tournament_id);
        tournament_state.start = new Date();
        tournament_state.rounds = match.rounds;
        tournament_state.progress.clear();

        for (const p of tournament_state.players.values()) {
            if (p.elimination_round !== -1) continue;

            p.correct = 0;
            p.total_time = 0;
        }

        return {
            ...match,
            players: Array.from(init_players_map.values())

        };
    }

  async endTournament(tournament_id: string, match_id: string) {
      // based on new timing, once time ends, everyones time would run out at the same time, so it'll just grab the first match id and broadcast the results to the rest to avoid multiple calculations and function calls
    const state = this.elimination_service.getTournament(tournament_id);
    if (state.finished) throw new Error("Tournament already ended");
    state.finished = true;
    
    const standings = this.elimination_service.getStanding(tournament_id);
    const times = this.elimination_service.timeInTournament(tournament_id);
    const tournament = await this.getTournament(tournament_id);

    const ecs_id = this.match_store.getEcsId(match_id);
    const result = await this.completion_service.execute(ecs_id!, match_id, standings.map(p => p.id), MatchType.tournament, times);


        if (tournament) {
            tournament.status = MatchStatus.Completed;
            await this.tournament_cache.updateTournament(tournament);
        }

        this.elimination_service.clear(tournament_id);
        return result;

    }

    async getTournamentsByStatus(status: MatchStatus) {
        return this.tournament_cache.getTournamentsByStatus(status);
    }

}