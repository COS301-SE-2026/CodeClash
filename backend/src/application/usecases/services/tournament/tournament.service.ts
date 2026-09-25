import { randomUUID } from "node:crypto";
import { ITournamentCache } from "src/application/interfaces/cache/ITournamentCache";
import { PlayerDTO } from "src/entities/dtos/matches/match-component.dto";
import { MatchMode, MatchStatus, MatchType } from "src/entities/dtos/matches/match.dto";
import { TournamentDTO } from "src/entities/dtos/tournaments/tournaments.dto";
import { TournamentEliminationService } from "./elimination.service";
import { MatchStart } from "../match/match-start.service";

export class TournamentService {
    constructor(
        private readonly tournament_cache: ITournamentCache,
        private readonly creation_service: MatchStart,
        private readonly elimination_service: TournamentEliminationService
    ) { }

    async joinTournament(tournament_id: string, player: PlayerDTO): Promise<TournamentDTO> {
        try {
            await this.tournament_cache.addPlayer(tournament_id, player);
            const tournament = await this.tournament_cache.getTournament(tournament_id);

            if (!tournament) throw new Error("Tournament not found");

            return tournament;
        }
        catch (error) {
            console.error("Tournament Service Join error: ", error);
            throw (`${error}`);
        }
    }

    async leaveTournament(tournament_id: string, player: PlayerDTO) {
        try {
            const tournament = await this.tournament_cache.getTournament(tournament_id);
            if (!tournament) throw new Error("Tournament not found");

            if (tournament?.status != MatchStatus.Waiting) throw new Error("Cannot leave tournament");

            await this.tournament_cache.removePlayer(tournament_id, player.id);
        }
        catch (error) {
            console.error("Tournament Service Join error: ", error);
            throw (`${error}`);
        }
    }

    async hostTournament(start_date: Date, match_mode: MatchMode, host: PlayerDTO) {
        const tournament_id = randomUUID();
        await this.tournament_cache.createTournament(tournament_id, start_date, match_mode, host);
        const tournament = await this.tournament_cache.getTournament(tournament_id);

        return tournament;
    }

    async cancelTournament(tournament_id: string) {
        const tournament = await this.tournament_cache.getTournament(tournament_id);
        if (!tournament) throw new Error("Tournament not found");

        if (tournament.status !== MatchStatus.Waiting) throw new Error("Cannot cancel tournament");
        await this.tournament_cache.deleteTournament(tournament_id);
    }

    async getTournament(tournament_id: string) {
        const tournament = await this.tournament_cache.getTournament(tournament_id);
        if (!tournament) throw new Error("Tournament not found");

        return tournament;
    }

    async startTournament(tournament: TournamentDTO, league: string) {
        if (tournament.status !== MatchStatus.Waiting) throw new Error("Tournament already started");
        if (tournament.players.length < 8) throw new Error("Not enough players");

        const match = await this.creation_service.execute(tournament.players, tournament.tournament_mode, league, MatchType.tournament);

        tournament.rounds = match.rounds;
        tournament.status = MatchStatus.In_progress;

        const players = tournament.players.map(p => ({ player_id: p.id, username: p.username! }));
        this.elimination_service.init(tournament.tournament_id, players);

        const round_1 = match.rounds[0];
        this.elimination_service.startRound(tournament.tournament_id, round_1!.round_number, round_1!.questions.map(q => q.id));

        return match;
    }


    async getTournamentsByStatus(status: MatchStatus) {
        return this.tournament_cache.getTournamentsByStatus(status);
    }
}